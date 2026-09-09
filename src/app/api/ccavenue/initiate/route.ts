import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";
import { ccavenueEncrypt, buildCcavenuePayload } from "@/lib/ccavenue";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phone, city, timeframe } = await req.json();

    if (!fullName || !email || !phone || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Database Connection
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection failed");
    }

    // 2. Generate unique Order ID
    const orderId = `order_fs_${Date.now()}`;
    const envAmount = process.env.CCAVENUE_FRANCHISE_FEE_AMOUNT;
    const amount =
      envAmount && envAmount !== "1000000" && envAmount !== "1000000.00"
        ? envAmount
        : "1180000.00";
    const timelineLabel = timeframe === "immediate" ? "Immediate" : timeframe === "week" ? "Within a week" : "Within a month";

    // 3. Create a pending lead entry in MongoDB
    await db.collection("contactmessages").insertOne({
      fullName,
      email: email.trim().toLowerCase(),
      phone,
      state: "N/A",
      city,
      preferredInvestment: "N/A",
      preferredCity: city,
      company: "N/A",
      businessType: "N/A",
      hasProperty: "No",
      timeframe: timelineLabel,
      message: `[Flash Sale Franchise Lead]\nPreferred City: ${city}\nTimeline: ${timeframe}\nCoupon Code: ₹5,00,000 Franchise Fee Discount\nFinal Amount: ₹11,80,000 (inclusive of 18% GST)\nPayment Status: Pending\nOrder ID: ${orderId}`,
      order_id: orderId,
      ccavenue_order_id: orderId,
      hdfc_order_id: orderId,
      amountPaid: parseFloat(amount),
      paymentStatus: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 4. Resolve Base Application URL
    const origin = req.headers.get("origin") || req.headers.get("referer");
    let appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://theconnplex.com";
    if (origin) {
      try {
        const parsed = new URL(origin);
        appUrl = parsed.origin;
      } catch {}
    }

    // 5. Build CCAvenue Payload
    const merchantId = process.env.CCAVENUE_MERCHANT_ID || "4420231";
    const accessCode = process.env.CCAVENUE_ACCESS_CODE || "AVVV87NA96CM04VVMC";
    const workingKey = process.env.CCAVENUE_WORKING_KEY || "D2C68ED69DE261106CE808F2E14CE4B0";
    const actionUrl =
      process.env.CCAVENUE_TRANSACTION_URL ||
      "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

    const callbackUrl = `${appUrl}/api/ccavenue/callback`;

    const rawPayload = buildCcavenuePayload({
      merchant_id: merchantId,
      order_id: orderId,
      currency: "INR",
      amount: amount,
      redirect_url: callbackUrl,
      cancel_url: callbackUrl,
      language: "EN",
      billing_name: fullName,
      billing_address: city,
      billing_city: city,
      billing_state: "N/A",
      billing_zip: "400001",
      billing_country: "India",
      billing_tel: phone,
      billing_email: email.trim().toLowerCase(),
      merchant_param1: "Franchise Fee: Rs. 10 Lakh + 18% GST (Rs. 1.8 Lakh) = Rs. 11,80,000",
      merchant_param2: timeframe || "immediate",
      merchant_param3: "Flash Sale Franchise Fee - Rs. 11,80,000 (incl. 18% GST)",
    });

    // 6. Encrypt Payload
    const encRequest = ccavenueEncrypt(rawPayload, workingKey);

    return NextResponse.json({
      success: true,
      encRequest,
      accessCode,
      actionUrl,
      orderId,
    });
  } catch (error: any) {
    console.error("Error in CCAvenue initiate:", error);
    return NextResponse.json(
      {
        error: "Failed to initiate CCAvenue payment",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

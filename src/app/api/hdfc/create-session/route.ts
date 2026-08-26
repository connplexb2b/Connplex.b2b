import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const { fullName, phone, city, timeframe } = await req.json();

    if (!fullName || !phone || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Establish database connection
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection failed");
    }

    // 2. Generate a unique HDFC/Juspay Order ID
    const orderId = `order_fs_${Date.now()}`;

    // 3. Create a pending lead message in `contactmessages` collection
    const timelineLabel = timeframe === "immediate" ? "Immediate" : timeframe === "week" ? "Within a week" : "Within a month";
    await db.collection("contactmessages").insertOne({
      fullName,
      email: "inquiry@theconnplex.com",
      phone,
      state: "N/A",
      city,
      preferredInvestment: "N/A",
      preferredCity: city,
      company: "N/A",
      businessType: "N/A",
      hasProperty: "No",
      timeframe: timelineLabel,
      message: `[Flash Sale Franchise Lead]\nPreferred City: ${city}\nTimeline: ${timeframe}\nCoupon Code: 50% Off Franchise Fee\nPayment Status: Pending\nOrder ID: ${orderId}`,
      hdfc_order_id: orderId,
      amountPaid: 1250000,
      paymentStatus: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 4. Set up HDFC SmartGateway/Juspay session payload
    const merchantId = process.env.HDFC_MERCHANT_ID || "YOUR_MERCHANT_ID";
    const apiKey = process.env.HDFC_API_KEY || "YOUR_API_KEY";
    const clientId = process.env.HDFC_CLIENT_ID || "YOUR_CLIENT_ID";
    const baseUrl = process.env.HDFC_BASE_URL || "https://smartgateway.hdfc.bank.in/v4/session";

    const payload = {
      order_id: orderId,
      amount: "1250000.00",
      customer_id: phone,
      customer_phone: phone,
      customer_email: "inquiry@theconnplex.com",
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/flashsale/callback`,
      payment_page_client_id: clientId,
      action: "paymentPage"
    };

    const authHeader = `Basic ${Buffer.from(apiKey + ":").toString("base64")}`;

    // 5. Call HDFC session API
    const hdfcRes = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "x-merchantid": merchantId,
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const hdfcData = await hdfcRes.json();
    if (!hdfcRes.ok) {
      console.error("HDFC Session creation failed:", hdfcData);
      throw new Error(hdfcData.message || "Failed to create payment session with HDFC.");
    }

    const paymentWebUrl = hdfcData.payment_links?.web;
    if (!paymentWebUrl) {
      throw new Error("No web payment link returned from HDFC payment gateway.");
    }

    return NextResponse.json({
      success: true,
      paymentLink: paymentWebUrl,
      orderId: orderId,
    });

  } catch (error: any) {
    console.error("Error in HDFC create session:", error);
    return NextResponse.json({
      error: "Failed to initiate payment session",
      details: error.message || String(error),
    }, { status: 500 });
  }
}

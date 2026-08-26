import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection failed");
    }

    // 1. Call HDFC Order Status API
    const merchantId = process.env.HDFC_MERCHANT_ID || "YOUR_MERCHANT_ID";
    const apiKey = process.env.HDFC_API_KEY || "YOUR_API_KEY";
    
    // Determine Base URL for Status Check (e.g. https://smartgateway.hdfc.bank.in/orders/{order_id})
    const baseUrl = process.env.HDFC_STATUS_BASE_URL || "https://smartgateway.hdfc.bank.in/orders";
    const statusUrl = `${baseUrl}/${order_id}`;

    const authHeader = `Basic ${Buffer.from(apiKey + ":").toString("base64")}`;

    const hdfcRes = await fetch(statusUrl, {
      method: "GET",
      headers: {
        "x-merchantid": merchantId,
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
    });

    const hdfcData = await hdfcRes.json();
    if (!hdfcRes.ok) {
      console.error("HDFC order status fetch failed:", hdfcData);
      return NextResponse.json({
        success: false,
        message: hdfcData.message || "Failed to retrieve order status from HDFC."
      }, { status: 400 });
    }

    const orderStatus = hdfcData.status; // e.g. "CHARGED"
    const paymentId = hdfcData.id || "N/A";

    if (orderStatus === "CHARGED") {
      // Find the pending lead record
      const lead = await db.collection("contactmessages").findOne({ hdfc_order_id: order_id });
      if (!lead) {
        return NextResponse.json({ success: false, message: "Lead record not found in database." }, { status: 404 });
      }

      // Update lead message with status and payment ID
      const updatedMessage = lead.message
        .replace("Payment Status: Pending", "Payment Status: Paid") + 
        `\nHDFC Payment ID: ${paymentId}`;

      await db.collection("contactmessages").updateOne(
        { hdfc_order_id: order_id },
        {
          $set: {
            paymentStatus: "Paid",
            message: updatedMessage,
            hdfc_payment_id: paymentId,
            updatedAt: new Date()
          }
        }
      );

      // Trigger Webhook to external system
      try {
        const cleanedPhone = lead.phone ? lead.phone.toString().replace(/\D/g, "") : "";
        const formattedPhone = cleanedPhone.length === 10 ? `91${cleanedPhone}` : cleanedPhone;
        const webhookPayload = {
          user_phone: formattedPhone,
          event_key: "flashsale-lead",
          payload: {
            _id: lead._id.toString(),
            fullName: lead.fullName,
            email: lead.email,
            phone: lead.phone,
            city: lead.city,
            timeframe: lead.timeframe,
            hdfc_order_id: order_id,
            hdfc_payment_id: paymentId,
            amountPaid: lead.amountPaid,
            paymentStatus: "Paid",
            createdAt: lead.createdAt,
            updatedAt: new Date().toISOString(),
          }
        };

        const webhookRes = await fetch("https://api.bitamin.com/webhook/theconnplex/019dbfa5-ead7-761d-944d-9260ef66b5aa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
        });
        if (!webhookRes.ok) {
          console.error(`Webhook call failed in HDFC callback with status: ${webhookRes.status}`);
        }
      } catch (webhookError) {
        console.error("Error triggering webhook in HDFC callback:", webhookError);
      }

      return NextResponse.json({ success: true, message: "Payment successfully verified." });
    } else {
      // Update database status to Failed
      await db.collection("contactmessages").updateOne(
        { hdfc_order_id: order_id },
        {
          $set: {
            paymentStatus: "Failed",
            updatedAt: new Date()
          }
        }
      );

      return NextResponse.json({
        success: false,
        message: `Payment status is ${orderStatus}. Verification failed.`
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Error in HDFC payment verification:", error);
    return NextResponse.json({
      error: "Internal payment verification failed",
      details: error.message || String(error)
    }, { status: 500 });
  }
}

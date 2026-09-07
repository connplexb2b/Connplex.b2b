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

    const lead = await db.collection("contactmessages").findOne({
      $or: [
        { order_id: order_id },
        { ccavenue_order_id: order_id },
        { hdfc_order_id: order_id },
      ],
    });

    if (!lead) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    if (lead.paymentStatus === "Paid") {
      return NextResponse.json({
        success: true,
        status: "Paid",
        orderId: order_id,
        trackingId: lead.ccavenue_tracking_id || lead.hdfc_payment_id || null,
      });
    }

    return NextResponse.json({
      success: false,
      status: lead.paymentStatus || "Pending",
      message: `Payment status is ${lead.paymentStatus || "Pending"}`,
    });
  } catch (error: any) {
    console.error("Error verifying payment status:", error);
    return NextResponse.json(
      { error: "Internal verification error", details: error.message || String(error) },
      { status: 500 }
    );
  }
}

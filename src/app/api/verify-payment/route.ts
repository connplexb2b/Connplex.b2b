import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      guestName,
      guestEmail,
      guestPhone,
      amount,
      movie,
      location,
      date,
      time,
      seats
    } = await req.json();

    // Generate signature locally using Key Secret
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "YOUR_KEY_SECRET";
    const hmac = crypto.createHmac("sha256", key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
      // Connect to MongoDB
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error("Database connection failed");
      }

      // Insert guest and payment details into hnibookings collection
      const createdAt = new Date();
      const updatedAt = new Date();
      const insertResult = await db.collection("hnibookings").insertOne({
        guestName,
        guestEmail,
        guestPhone,
        movie: movie || "The Odyssey",
        location: location || "Connplex Luxuriance – Adani Shantigram, Ahmedabad",
        date: date || "18 July 2026",
        time: time || "7:55 PM",
        seats: seats || [],
        razorpay_order_id,
        razorpay_payment_id,
        amount: amount || 1000,
        status: "Paid",
        createdAt,
        updatedAt,
      });

      // Trigger Webhook
      try {
        const cleanedPhone = guestPhone ? guestPhone.toString().replace(/\D/g, "") : "";
        const formattedPhone = cleanedPhone.length === 10 ? `91${cleanedPhone}` : cleanedPhone;
        const webhookPayload = {
          user_phone: formattedPhone,
          event_key: "hni-event",
          payload: {
            _id: insertResult.insertedId.toString(),
            guestName,
            guestEmail,
            guestPhone,
            movie: movie || "The Odyssey",
            location: location || "Connplex Luxuriance – Adani Shantigram, Ahmedabad",
            date: date || "18 July 2026",
            time: time || "7:55 PM",
            seats: seats || [],
            razorpay_order_id,
            razorpay_payment_id,
            amount: amount || 1000,
            status: "Paid",
            createdAt: createdAt.toISOString(),
            updatedAt: updatedAt.toISOString(),
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
          console.error(`Webhook call failed with status: ${webhookRes.status}`);
        }
      } catch (webhookError) {
        console.error("Error triggering webhook:", webhookError);
      }

      return NextResponse.json({ status: "success", message: "Payment verified and booking saved successfully" });
    } else {
      // Tampered signature or invalid payment
      return NextResponse.json({ status: "failure", message: "Invalid signature verification" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}

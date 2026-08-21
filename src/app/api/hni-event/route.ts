import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_phone, event_key, payload } = body;

    if (!event_key || event_key !== "hni-event") {
      return NextResponse.json({ error: "Invalid event_key. Must be 'hni-event'." }, { status: 400 });
    }

    if (!payload) {
      return NextResponse.json({ error: "Missing payload data." }, { status: 400 });
    }

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection failed");
    }

    let docId;
    if (payload._id) {
      let cleanedId = payload._id.toString().replace(/\s*\(ObjectID\)\s*/gi, "").replace(/\.\.\./g, "").trim();
      if (cleanedId.length < 24) {
        cleanedId = cleanedId.padEnd(24, "0");
      }
      try {
        docId = new mongoose.Types.ObjectId(cleanedId);
      } catch (e) {
        docId = new mongoose.Types.ObjectId();
      }
    } else {
      docId = new mongoose.Types.ObjectId();
    }

    const bookingDoc = {
      _id: docId,
      user_phone: user_phone || "919561214185",
      event_key: event_key || "hni-event",
      payload: {
        _id: docId,
        guestName: payload.guestName || "John Doe",
        guestEmail: payload.guestEmail || "johndoe@example.com",
        guestPhone: payload.guestPhone || "9876543210",
        movie: payload.movie || "Toxic premier nights",
        location: payload.location || "Connplex Luxuriance – Adani Shantigram, Ahmedabad",
        date: payload.date || "18 July 2026",
        time: payload.time || "7:55 PM",
        seats: payload.seats || [],
        razorpay_order_id: payload.razorpay_order_id || "order_HniXYZ123",
        razorpay_payment_id: payload.razorpay_payment_id || "pay_HniABC456",
        amount: payload.amount || 1000,
        status: payload.status || "Paid",
        createdAt: payload.createdAt ? new Date(payload.createdAt) : new Date(),
        updatedAt: payload.updatedAt ? new Date(payload.updatedAt) : new Date(),
      }
    };

    // Upsert the document by its _id
    await db.collection("hnibookings").updateOne(
      { _id: bookingDoc._id },
      { $set: bookingDoc },
      { upsert: true }
    );

    // Trigger Webhook
    try {
      const getFormattedPhone = () => {
        let phone = bookingDoc.payload.guestPhone || bookingDoc.user_phone || "";
        const cleaned = phone.toString().replace(/\D/g, "");
        if (cleaned.length === 10) {
          return `91${cleaned}`;
        }
        return cleaned;
      };
      const formattedPhone = getFormattedPhone();

      const webhookPayload = {
        user_phone: formattedPhone,
        event_key: bookingDoc.event_key || "hni-event",
        payload: {
          _id: bookingDoc.payload._id.toString(),
          guestName: bookingDoc.payload.guestName,
          guestEmail: bookingDoc.payload.guestEmail,
          guestPhone: bookingDoc.payload.guestPhone,
          movie: bookingDoc.payload.movie,
          location: bookingDoc.payload.location,
          date: bookingDoc.payload.date,
          time: bookingDoc.payload.time,
          seats: bookingDoc.payload.seats,
          razorpay_order_id: bookingDoc.payload.razorpay_order_id,
          razorpay_payment_id: bookingDoc.payload.razorpay_payment_id,
          amount: bookingDoc.payload.amount,
          status: bookingDoc.payload.status,
          createdAt: bookingDoc.payload.createdAt.toISOString(),
          updatedAt: bookingDoc.payload.updatedAt.toISOString(),
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
        console.error(`Webhook call failed in hni-event route with status: ${webhookRes.status}`);
      }
    } catch (webhookError) {
      console.error("Error triggering webhook in hni-event route:", webhookError);
    }

    return NextResponse.json({
      status: "success",
      message: "HNI Event created/updated successfully",
      data: {
        ...bookingDoc,
        _id: bookingDoc._id.toString(),
        payload: {
          ...bookingDoc.payload,
          _id: bookingDoc.payload._id.toString()
        }
      }
    });
  } catch (error: any) {
    console.error("Error creating HNI event via API:", error);
    return NextResponse.json({ error: "Failed to create HNI event", details: error.message }, { status: 500 });
  }
}

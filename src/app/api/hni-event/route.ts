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
    };

    // Upsert the document by its _id
    await db.collection("hnibookings").updateOne(
      { _id: bookingDoc._id },
      { $set: bookingDoc },
      { upsert: true }
    );

    return NextResponse.json({
      status: "success",
      message: "HNI Event created/updated successfully",
      data: {
        ...bookingDoc,
        _id: bookingDoc._id.toString()
      }
    });
  } catch (error: any) {
    console.error("Error creating HNI event via API:", error);
    return NextResponse.json({ error: "Failed to create HNI event", details: error.message }, { status: 500 });
  }
}

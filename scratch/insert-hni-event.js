const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully.");

    const db = mongoose.connection.db;
    const collection = db.collection('hnibookings');

    const eventDoc = {
      _id: new mongoose.Types.ObjectId("64df32813e8b03d23433ea2b"),
      user_phone: "919561214185",
      event_key: "hni-event",
      payload: {
        _id: new mongoose.Types.ObjectId("64df32813e8b03d23433ea2b"),
        guestName: "John Doe",
        guestEmail: "johndoe@example.com",
        guestPhone: "9876543210",
        movie: "Toxic premier nights",
        location: "Connplex Luxuriance – Adani Shantigram, Ahmedabad",
        date: "18 July 2026",
        time: "7:55 PM",
        seats: ["Row A - Seat 5", "Row A - Seat 6"],
        razorpay_order_id: "order_HniXYZ123",
        razorpay_payment_id: "pay_HniABC456",
        amount: 1000,
        status: "Paid",
        createdAt: new Date("2026-08-21T08:06:00.000Z"),
        updatedAt: new Date("2026-08-21T08:06:00.000Z")
      }
    };

    // Clean up duplicate ID
    await collection.deleteOne({ _id: eventDoc._id });

    const result = await collection.insertOne(eventDoc);
    console.log("Document inserted with _id:", result.insertedId);
  } catch (err) {
    console.error("Error during insertion:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    const db = mongoose.connection.db;
    
    // Fetch all bookings where movie matches "Odyssey" (case insensitive) or is null
    const bookings = await db.collection('hnibookings').find({
      $or: [
        { movie: /Odyssey/i },
        { movie: null },
        { movie: { $exists: false } }
      ]
    }).toArray();
    
    // Fill in defaults for missing/null fields as specified in verify-payment route
    const mappedBookings = bookings.map(b => ({
      _id: b._id,
      guestName: b.guestName,
      guestEmail: b.guestEmail,
      guestPhone: b.guestPhone,
      movie: b.movie || "The Odyssey",
      location: b.location || "Connplex Luxuriance – Adani Shantigram, Ahmedabad",
      date: b.date || "18 July 2026",
      time: b.time || "7:55 PM",
      seats: b.seats || [],
      razorpay_order_id: b.razorpay_order_id,
      razorpay_payment_id: b.razorpay_payment_id,
      amount: b.amount || 1000,
      status: b.status || "Paid",
      createdAt: b.createdAt,
      updatedAt: b.updatedAt
    }));
    
    const outputPath = path.join(__dirname, 'odyssey_hni_bookings.json');
    fs.writeFileSync(outputPath, JSON.stringify(mappedBookings, null, 2), 'utf8');
    console.log(`Successfully exported ${mappedBookings.length} bookings to ${outputPath}`);
    console.log("BOOKINGS_DATA_START");
    console.log(JSON.stringify(mappedBookings, null, 2));
    console.log("BOOKINGS_DATA_END");
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();

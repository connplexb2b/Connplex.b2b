const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    const db = mongoose.connection.db;
    
    // Filter bookings where movie contains "Spider" (case insensitive)
    const bookings = await db.collection('hnibookings').find({ movie: /Spider/i }).toArray();
    
    const outputPath = path.join(__dirname, 'spiderman_hni_bookings.json');
    fs.writeFileSync(outputPath, JSON.stringify(bookings, null, 2), 'utf8');
    console.log(`Successfully exported ${bookings.length} bookings to ${outputPath}`);
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();

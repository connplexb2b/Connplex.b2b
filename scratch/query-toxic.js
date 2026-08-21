const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    const db = mongoose.connection.db;
    
    const bookings = await db.collection('hnibookings').find({
      movie: /toxic/i
    }).toArray();
    
    console.log("Found bookings matching 'toxic':", bookings.length);
    console.log(JSON.stringify(bookings, null, 2));
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();

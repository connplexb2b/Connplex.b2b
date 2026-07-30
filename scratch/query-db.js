const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    const db = mongoose.connection.db;
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    if (collections.some(c => c.name === 'hnibookings')) {
      const bookings = await db.collection('hnibookings').find({}).toArray();
      console.log(`Found ${bookings.length} bookings in hnibookings:`);
      bookings.forEach((b, idx) => {
        console.log(`Booking #${idx + 1}:`, {
          guestName: b.guestName,
          movie: b.movie,
          location: b.location,
          seats: b.seats,
          status: b.status,
          date: b.date,
          time: b.time
        });
      });
    } else {
      console.log("hnibookings collection does not exist.");
    }
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await mongoose.disconnect();
  }
}

run();

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    const db = mongoose.connection.db;
    
    // Group by movie and count
    const movieCounts = await db.collection('hnibookings').aggregate([
      { $group: { _id: "$movie", count: { $sum: 1 } } }
    ]).toArray();
    
    console.log("Movie counts in hnibookings:");
    console.log(JSON.stringify(movieCounts, null, 2));

    // Also get all distinct movies
    const distinctMovies = await db.collection('hnibookings').distinct('movie');
    console.log("Distinct movies:", distinctMovies);
    
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();

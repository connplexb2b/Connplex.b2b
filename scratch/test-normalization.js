const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully.");

    const db = mongoose.connection.db;
    const collection = db.collection('hnibookings');

    // Simulate query in proxy-layout route
    const query = {
      $or: [
        {
          location: "Connplex Luxuriance – Adani Shantigram, Ahmedabad",
          movie: "Toxic premier nights",
          status: "Paid",
          date: "18 July 2026",
          time: "7:55 PM"
        },
        {
          "payload.location": "Connplex Luxuriance – Adani Shantigram, Ahmedabad",
          "payload.movie": "Toxic premier nights",
          "payload.status": "Paid",
          "payload.date": "18 July 2026",
          "payload.time": "7:55 PM"
        }
      ]
    };

    console.log("Running query:", JSON.stringify(query, null, 2));
    const dbBookings = await collection.find(query).toArray();
    console.log("Found bookings:", dbBookings.length);

    let dbBookedSeats = new Set();
    dbBookings.forEach((b) => {
      const bookingData = b.payload ? b.payload : b;
      if (Array.isArray(bookingData.seats)) {
        bookingData.seats.forEach((seat) => {
          let normalizedSeat = seat.trim().toUpperCase();
          // Normalize formats like "Row A - Seat 5" to "A5"
          const match = normalizedSeat.match(/ROW\s+([A-Z])\s*-\s*SEAT\s+(\d+)/);
          if (match) {
            normalizedSeat = match[1] + match[2];
          }
          dbBookedSeats.add(normalizedSeat);
          console.log(`Original: "${seat}" -> Normalized: "${normalizedSeat}"`);
        });
      }
    });

    console.log("All normalized booked seats:", Array.from(dbBookedSeats));

    // Assert that A5 and A6 are booked
    const hasA5 = dbBookedSeats.has("A5");
    const hasA6 = dbBookedSeats.has("A6");

    if (hasA5 && hasA6) {
      console.log("SUCCESS: Seats A5 and A6 are successfully recognized as booked!");
    } else {
      console.error("FAILURE: Seats A5 and/or A6 were not recognized as booked.");
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();

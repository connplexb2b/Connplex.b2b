const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    const adminDb = mongoose.connection.db.admin();
    const dbs = await adminDb.listDatabases();
    console.log("Databases on cluster:");
    dbs.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
  } catch (e) {
    console.error("Error listing databases:", e.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();

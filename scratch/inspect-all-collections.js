const { MongoClient } = require('mongodb');

async function run() {
  const uri = "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db();
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log("Collections:");
    for (const coll of collections) {
      const count = await db.collection(coll.name).countDocuments();
      console.log(`- ${coll.name}: ${count} documents`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();

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
    collections.forEach(c => console.log(`- ${c.name}`));

    // Check if there is an investors collection
    for (const coll of collections) {
      if (coll.name.includes('investor') || coll.name.includes('policy')) {
        const count = await db.collection(coll.name).countDocuments();
        console.log(`\nCollection ${coll.name} has ${count} documents.`);
        const docs = await db.collection(coll.name).find().limit(10).toArray();
        console.log('Sample docs:', JSON.stringify(docs, null, 2));
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";
const PREFERENTIAL_ID = "6805e8297f482b5677025898";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully to MongoDB.");

    const db = mongoose.connection.db;
    const investorCol = db.collection('investors');

    const existing = await investorCol.findOne({ id: PREFERENTIAL_ID });
    if (!existing) {
      console.log("Inserting Preferential Issue into MongoDB investors collection...");
      await investorCol.insertOne({
        id: PREFERENTIAL_ID,
        title: "Preferential Issue",
        type: "Files",
        parent: "",
        files: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log("Inserted Preferential Issue into MongoDB.");
    } else {
      console.log("Preferential Issue already exists in MongoDB.");
    }

    // Update data/admin-investors.json
    const dbPath = path.join(__dirname, '../data/admin-investors.json');
    if (fs.existsSync(dbPath)) {
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      const alreadyInJson = dbData.some(e => e.title.toLowerCase().trim() === 'preferential issue');
      if (!alreadyInJson) {
        const grievanceIndex = dbData.findIndex(e => e.title.toLowerCase().trim() === 'investor grievances');
        const entry = {
          id: PREFERENTIAL_ID,
          title: "Preferential Issue",
          type: "Files",
          parent: "",
          files: [],
          updatedAt: new Date().toISOString()
        };
        if (grievanceIndex !== -1) {
          dbData.splice(grievanceIndex, 0, entry);
        } else {
          dbData.push(entry);
        }
        fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
        console.log("data/admin-investors.json updated with Preferential Issue.");
      } else {
        console.log("Preferential Issue already exists in admin-investors.json.");
      }
    }

  } catch (err) {
    console.error("Error in add-preferential-issue:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();

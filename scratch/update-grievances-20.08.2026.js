const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";
const INVESTOR_ID = "6805e8297f482b5677025897";

const CONTENT = "<p><strong>For any investor complaints/grievances, kindly contact us -</strong></p><p>CS Jaydeep Dahyabhai Prajapati,&nbsp;<br>Company Secretary &amp; Compliance Officer.</p><p><strong>Address:</strong> &nbsp;C-Block, 10 Floor, Krish Cubical, Govardhan Party Plot,<br>Avalon Hotel Road, Sindhu Bhavan Marg, Thaltej, Ahmedabad, Gujarat 380059</p><p><strong>Tel. No.:</strong> +91 07935289865/ 07935288291</p><p><strong>E-mail:</strong> cs@theconnplex.com, investor@theconnplex.com</p><p>&nbsp;</p><p><strong>Registrar &amp; Share Transfer Agent</strong></p><p><strong>ACCURATE SECURITIES AND REGISTRY PRIVATE LIMITED</strong><br><strong>Address:</strong> B1105 - 1108, K P Epitome, Nr. Makarba Lake, Nr. Siddhi Vinayak Towers,<br>Makarba, Ahmedabad - 380051.<br><strong>Tel. No.:</strong> +91-79-48000319<br><strong>Email:</strong> investor@accuratesecurities.com<br><strong>Website:</strong> www.accuratesecurities.com</p>";

async function run() {
  try {
    // 1. Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully to MongoDB.");

    const db = mongoose.connection.db;

    // 2. Update/insert the investor grievances document
    const investorCol = db.collection('investors');
    const investorDoc = await investorCol.findOne({ id: INVESTOR_ID });

    if (!investorDoc) {
      console.log(`Investor document with ID ${INVESTOR_ID} (Investor Grievances) not found. Inserting new document.`);
      await investorCol.insertOne({
        id: INVESTOR_ID,
        title: "investor Grievances",
        type: "Content",
        content: CONTENT,
        files: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      console.log(`Investor document with ID ${INVESTOR_ID} found. Updating content.`);
      await investorCol.updateOne(
        { id: INVESTOR_ID },
        { 
          $set: { 
            content: CONTENT,
            updatedAt: new Date() 
          } 
        }
      );
    }
    console.log("MongoDB investor document updated successfully.");

  } catch (err) {
    console.error("Error during run:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";
const BOARD_MEETING_ID = "6805e8297f482b5677025882";

const targetUploadDir = path.join(__dirname, "../public/uploads/investors", BOARD_MEETING_ID);
const directUploadDir = path.join(__dirname, "../public/uploads");

if (!fs.existsSync(targetUploadDir)) {
  fs.mkdirSync(targetUploadDir, { recursive: true });
}
if (!fs.existsSync(directUploadDir)) {
  fs.mkdirSync(directUploadDir, { recursive: true });
}

const filesToAdd = [
  {
    id: "b3010202-6000-4000-8000-000000000005",
    srcPath: "C:\\Users\\admin\\Downloads\\OUTCOME OF BOARD MEETING_30.10.2026.PDF",
    originalName: "OUTCOME OF BOARD MEETING_30.10.2026.pdf",
    altNames: ["OUTCOME OF BOARD MEETING_30.10.2026.PDF", "Outcome of Board Meeting_30.10.2026.pdf"],
    storedName: "b3010202-6000-4000-8000-000000000005.pdf",
    title: "OUTCOME OF BOARD MEETING_30.10.2026",
    mimeType: "application/pdf"
  },
  {
    id: "b3010202-6000-4000-8000-000000000006",
    srcPath: "C:\\Users\\admin\\Downloads\\Prior Intimation of Board Meeting_30.10.2026.pdf",
    altNames: ["PRIOR INTIMATION OF BOARD MEETING_30.10.2026.pdf", "Prior Intimation of Board Meeting_30.10.2026.PDF"],
    originalName: "Prior Intimation of Board Meeting_30.10.2026.pdf",
    storedName: "b3010202-6000-4000-8000-000000000006.pdf",
    title: "PRIOR INTIMATION OF BOARD MEETING_30.10.2026",
    mimeType: "application/pdf"
  }
];

async function run() {
  try {
    const fileEntries = [];

    // 1. Copy files to filesystem
    for (const f of filesToAdd) {
      if (!fs.existsSync(f.srcPath)) {
        throw new Error(`Source file does not exist: ${f.srcPath}`);
      }
      const buffer = fs.readFileSync(f.srcPath);
      const size = buffer.length;
      console.log(`Loaded ${f.srcPath} (${size} bytes)`);

      // Save to category uploads dir
      fs.writeFileSync(path.join(targetUploadDir, f.storedName), buffer);
      fs.writeFileSync(path.join(targetUploadDir, f.originalName), buffer);
      for (const alt of (f.altNames || [])) {
        fs.writeFileSync(path.join(targetUploadDir, alt), buffer);
      }

      // Save to direct uploads dir
      fs.writeFileSync(path.join(directUploadDir, f.storedName), buffer);
      fs.writeFileSync(path.join(directUploadDir, f.originalName), buffer);
      for (const alt of (f.altNames || [])) {
        fs.writeFileSync(path.join(directUploadDir, alt), buffer);
      }

      console.log(`Saved ${f.storedName} & aliases to disk.`);

      fileEntries.push({
        id: f.id,
        originalName: f.originalName,
        storedName: f.storedName,
        url: `/uploads/investors/${BOARD_MEETING_ID}/${f.storedName}`,
        mimeType: f.mimeType,
        size: size,
        title: f.title
      });
    }

    // 2. Connect to MongoDB
    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");
    const db = conn.connection.db;

    // 3. Store binary in investorfilecontents
    const fileContentCol = db.collection('investorfilecontents');
    for (const f of filesToAdd) {
      const buffer = fs.readFileSync(f.srcPath);
      const filenames = [
        f.storedName,
        f.originalName,
        f.title,
        ...(f.altNames || [])
      ];

      for (const fname of filenames) {
        const existing = await fileContentCol.findOne({ filename: fname });
        if (existing) {
          console.log(`Updating ${fname} in investorfilecontents...`);
          await fileContentCol.updateOne(
            { filename: fname },
            { $set: { data: buffer, mimeType: f.mimeType, updatedAt: new Date() } }
          );
        } else {
          console.log(`Inserting ${fname} into investorfilecontents...`);
          await fileContentCol.insertOne({
            filename: fname,
            data: buffer,
            mimeType: f.mimeType,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }

    // 4. Update MongoDB investors collection
    const investorCol = db.collection('investors');
    const existingBM = await investorCol.findOne({ id: BOARD_MEETING_ID });
    if (existingBM) {
      const existingFiles = (existingBM.files || []).filter(
        f => !filesToAdd.some(add =>
          add.id === f.id ||
          add.storedName === f.storedName ||
          add.originalName.toLowerCase() === (f.originalName || '').toLowerCase() ||
          add.title.toLowerCase() === (f.title || '').toLowerCase()
        )
      );

      // Append new files in the order: Outcome, then Prior Intimation
      const updatedFiles = [...existingFiles, ...fileEntries];

      await investorCol.updateOne(
        { id: BOARD_MEETING_ID },
        { $set: { files: updatedFiles, updatedAt: new Date() } }
      );
      console.log("Updated Board Meeting in MongoDB investors collection.");
    } else {
      console.warn("Board Meeting document not found in MongoDB!");
    }

    // 5. Update data/admin-investors.json
    const jsonPath = path.join(__dirname, '../data/admin-investors.json');
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const bmItem = data.find(e => e.id === BOARD_MEETING_ID || e.title.toLowerCase().trim() === 'board meeting');
      if (bmItem) {
        const filtered = (bmItem.files || []).filter(
          f => !filesToAdd.some(add =>
            add.id === f.id ||
            add.storedName === f.storedName ||
            add.originalName.toLowerCase() === (f.originalName || '').toLowerCase() ||
            add.title.toLowerCase() === (f.title || '').toLowerCase()
          )
        );
        bmItem.files = [...filtered, ...fileEntries];
        bmItem.updatedAt = new Date().toISOString();
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
        console.log("Updated data/admin-investors.json successfully.");
      } else {
        console.warn("Board Meeting entry not found in admin-investors.json");
      }
    }

  } catch (err) {
    console.error("Error during execution:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();

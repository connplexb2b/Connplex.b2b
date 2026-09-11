const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";
const INVESTOR_ID = "6805e8297f482b5677025882";

const targetDir = path.join(__dirname, "../public/uploads/investors", INVESTOR_ID);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const filesToProcess = [
  {
    id: "b1408202-6000-4000-8000-000000000001",
    srcPath: "C:\\Users\\admin\\Downloads\\Prior intimation of Board Meeting- 14.08.2026.pdf",
    originalName: "Prior intimation of Board Meeting_14.08.2026.pdf",
    storedName: "b1408202-6000-4000-8000-000000000001.pdf",
    title: "Prior intimation of Board Meeting_14.08.2026",
    mimeType: "application/pdf"
  },
  {
    id: "b1908202-6000-4000-8000-000000000002",
    srcPath: "C:\\Users\\admin\\Downloads\\Outcome of Board Meeting-19.08.2026.pdf",
    originalName: "Outcome of Board Meeting_19.08.2026.pdf",
    storedName: "b1908202-6000-4000-8000-000000000002.pdf",
    title: "Outcome of Board Meeting_19.08.2026",
    mimeType: "application/pdf"
  },
  {
    id: "b0709202-6000-4000-8000-000000000003",
    srcPath: "C:\\Users\\admin\\Downloads\\Prior Intimation of Board Meeting_07.09.2026.pdf",
    originalName: "Prior Intimation of Board Meeting_07.09.2026.pdf",
    storedName: "b0709202-6000-4000-8000-000000000003.pdf",
    title: "Prior Intimation of Board Meeting_07.09.2026",
    mimeType: "application/pdf"
  }
];

async function run() {
  try {
    const fileEntries = [];

    // 1. Copy files to public/uploads/investors/6805e8297f482b5677025882/
    for (const f of filesToProcess) {
      if (!fs.existsSync(f.srcPath)) {
        throw new Error(`Source file does not exist: ${f.srcPath}`);
      }
      const destPath = path.join(targetDir, f.storedName);
      fs.copyFileSync(f.srcPath, destPath);
      const stats = fs.statSync(destPath);
      console.log(`Copied ${f.srcPath} -> ${destPath} (${stats.size} bytes)`);

      fileEntries.push({
        id: f.id,
        originalName: f.originalName,
        storedName: f.storedName,
        url: `/uploads/investors/${INVESTOR_ID}/${f.storedName}`,
        mimeType: f.mimeType,
        size: stats.size,
        title: f.title
      });
    }

    // 2. Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully to MongoDB.");

    const db = mongoose.connection.db;

    // 3. Save binary file content to investorfilecontents collection
    const fileContentCol = db.collection('investorfilecontents');
    for (const f of filesToProcess) {
      const destPath = path.join(targetDir, f.storedName);
      const buffer = fs.readFileSync(destPath);
      const existing = await fileContentCol.findOne({ filename: f.storedName });
      if (existing) {
        console.log(`Updating ${f.storedName} in investorfilecontents...`);
        await fileContentCol.updateOne(
          { filename: f.storedName },
          { $set: { data: buffer, mimeType: f.mimeType, updatedAt: new Date() } }
        );
      } else {
        console.log(`Inserting ${f.storedName} into investorfilecontents...`);
        await fileContentCol.insertOne({
          filename: f.storedName,
          data: buffer,
          mimeType: f.mimeType,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // 4. Update MongoDB investors collection
    const investorCol = db.collection('investors');
    const existingInvestor = await investorCol.findOne({ id: INVESTOR_ID });

    if (!existingInvestor) {
      console.log(`Creating new Board Meeting investor document in MongoDB...`);
      await investorCol.insertOne({
        id: INVESTOR_ID,
        title: "Board Meeting",
        type: "Files",
        parent: "Announcements",
        files: fileEntries,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      console.log(`Updating existing Board Meeting document in MongoDB...`);
      // Filter out duplicates if any
      const existingFiles = (existingInvestor.files || []).filter(
        ef => !fileEntries.some(nf => nf.id === ef.id || nf.storedName === ef.storedName || nf.originalName === ef.originalName)
      );
      // Put the new file entries in requested sequence
      const newFileList = [...fileEntries, ...existingFiles];
      await investorCol.updateOne(
        { id: INVESTOR_ID },
        {
          $set: {
            title: "Board Meeting",
            type: "Files",
            parent: "Announcements",
            files: newFileList,
            updatedAt: new Date()
          }
        }
      );
    }
    console.log("MongoDB investors collection updated.");

    // 5. Update data/admin-investors.json
    const dbPath = path.join(__dirname, '../data/admin-investors.json');
    if (fs.existsSync(dbPath)) {
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      let localInvestor = dbData.find(e => e.id === INVESTOR_ID || e.title.toLowerCase() === 'board meeting');
      if (localInvestor) {
        localInvestor.id = INVESTOR_ID;
        localInvestor.title = "Board Meeting";
        localInvestor.type = "Files";
        localInvestor.parent = "Announcements";
        const existingFiles = (localInvestor.files || []).filter(
          ef => !fileEntries.some(nf => nf.id === ef.id || nf.storedName === ef.storedName || nf.originalName === ef.originalName)
        );
        localInvestor.files = [...fileEntries, ...existingFiles];
        localInvestor.updatedAt = new Date().toISOString();
      } else {
        dbData.unshift({
          id: INVESTOR_ID,
          title: "Board Meeting",
          type: "Files",
          parent: "Announcements",
          files: fileEntries,
          updatedAt: new Date().toISOString()
        });
      }
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
      console.log("data/admin-investors.json updated successfully.");
    }

  } catch (err) {
    console.error("Error running script:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();

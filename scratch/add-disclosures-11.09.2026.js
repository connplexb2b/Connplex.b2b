const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";

const BOARD_MEETING_ID = "6805e8297f482b5677025882";
const OTHER_ANNOUNCEMENT_ID = "4887120f-272d-4780-852b-9620e1f4e1ef";
const PREFERENTIAL_ID = "6805e8297f482b5677025898";

const filesToProcess = [
  // 1. Board Meeting
  {
    investorId: BOARD_MEETING_ID,
    id: "b1109202-6000-4000-8000-000000000004",
    srcPath: "C:\\Users\\admin\\Downloads\\1. Outcome of Board Meeting_11.09.2026.pdf",
    originalName: "Outcome of Board Meeting_11.09.2026.pdf",
    storedName: "b1109202-6000-4000-8000-000000000004.pdf",
    title: "Outcome of Board Meeting_11.09.2026",
    mimeType: "application/pdf"
  },
  // 2. Other Announcement
  {
    investorId: OTHER_ANNOUNCEMENT_ID,
    id: "d1109202-6000-4000-8000-000000000001",
    srcPath: "C:\\Users\\admin\\Downloads\\2. INTIMATION UNDER REGULATION 30.pdf",
    originalName: "Intimation under Regulation 30 of SEBI(LODR) - 11.09.2026.pdf",
    storedName: "d1109202-6000-4000-8000-000000000001.pdf",
    title: "Intimation under Regulation 30 of SEBI(LODR) - 11.09.2026",
    mimeType: "application/pdf"
  },
  // 3. Preferential Issue - Item 1
  {
    investorId: PREFERENTIAL_ID,
    id: "p1109202-6000-4000-8000-000000000001",
    srcPath: "C:\\Users\\admin\\Downloads\\3. Issuance of securities_11.09.2026.pdf",
    originalName: "Issuance of securities_11.09.2026.pdf",
    storedName: "p1109202-6000-4000-8000-000000000001.pdf",
    title: "Issuance of securities_11.09.2026",
    mimeType: "application/pdf",
    order: 1
  },
  // 3. Preferential Issue - Item 2
  {
    investorId: PREFERENTIAL_ID,
    id: "p1109202-6000-4000-8000-000000000002",
    srcPath: "C:\\Users\\admin\\Downloads\\4. NSE Pricing Certificate.pdf",
    originalName: "Pricing Certificate.pdf",
    storedName: "p1109202-6000-4000-8000-000000000002.pdf",
    title: "Pricing Certificate",
    mimeType: "application/pdf",
    order: 2
  },
  // 3. Preferential Issue - Item 3
  {
    investorId: PREFERENTIAL_ID,
    id: "p1109202-6000-4000-8000-000000000003",
    srcPath: "C:\\Users\\admin\\Downloads\\5. PCS Certificate- Compliance_SEBI ICDR.pdf",
    originalName: "PCS Certificate- Compliance of SEBI ICDR.pdf",
    storedName: "p1109202-6000-4000-8000-000000000003.pdf",
    title: "PCS Certificate- Compliance of SEBI ICDR",
    mimeType: "application/pdf",
    order: 3
  }
];

async function run() {
  try {
    const uploadBase = path.join(__dirname, "../public/uploads/investors");

    // 1. Ensure target dirs and copy files
    const fileEntries = [];
    for (const item of filesToProcess) {
      if (!fs.existsSync(item.srcPath)) {
        throw new Error(`Source file not found: ${item.srcPath}`);
      }
      const targetDir = path.join(uploadBase, item.investorId);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const destPath = path.join(targetDir, item.storedName);
      fs.copyFileSync(item.srcPath, destPath);
      const stats = fs.statSync(destPath);
      console.log(`Copied ${item.srcPath} -> ${destPath} (${stats.size} bytes)`);

      fileEntries.push({
        ...item,
        size: stats.size,
        url: `/uploads/investors/${item.investorId}/${item.storedName}`,
        destPath
      });
    }

    // 2. Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully to MongoDB.");

    const db = mongoose.connection.db;
    const fileContentCol = db.collection('investorfilecontents');
    const investorCol = db.collection('investors');

    // 3. Store raw binary in investorfilecontents
    for (const item of fileEntries) {
      const buffer = fs.readFileSync(item.destPath);
      const existing = await fileContentCol.findOne({ filename: item.storedName });
      if (existing) {
        console.log(`Updating ${item.storedName} in investorfilecontents...`);
        await fileContentCol.updateOne(
          { filename: item.storedName },
          { $set: { data: buffer, mimeType: item.mimeType, updatedAt: new Date() } }
        );
      } else {
        console.log(`Inserting ${item.storedName} into investorfilecontents...`);
        await fileContentCol.insertOne({
          filename: item.storedName,
          data: buffer,
          mimeType: item.mimeType,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // 4. Update Board Meeting in MongoDB
    const bmItem = fileEntries.find(f => f.investorId === BOARD_MEETING_ID);
    const bmFileObj = {
      id: bmItem.id,
      originalName: bmItem.originalName,
      storedName: bmItem.storedName,
      url: bmItem.url,
      mimeType: bmItem.mimeType,
      size: bmItem.size,
      title: bmItem.title
    };
    const existingBM = await investorCol.findOne({ id: BOARD_MEETING_ID });
    if (existingBM) {
      const filtered = (existingBM.files || []).filter(f => f.id !== bmItem.id && f.storedName !== bmItem.storedName && f.originalName !== bmItem.originalName);
      // Append to maintain chronological order
      const newFiles = [...filtered, bmFileObj];
      await investorCol.updateOne(
        { id: BOARD_MEETING_ID },
        { $set: { files: newFiles, updatedAt: new Date() } }
      );
      console.log("Updated Board Meeting in MongoDB.");
    }

    // 5. Update Other Announcement in MongoDB
    const oaItem = fileEntries.find(f => f.investorId === OTHER_ANNOUNCEMENT_ID);
    const oaFileObj = {
      id: oaItem.id,
      originalName: oaItem.originalName,
      storedName: oaItem.storedName,
      url: oaItem.url,
      mimeType: oaItem.mimeType,
      size: oaItem.size,
      title: oaItem.title
    };
    const existingOA = await investorCol.findOne({ id: OTHER_ANNOUNCEMENT_ID });
    if (existingOA) {
      const filtered = (existingOA.files || []).filter(f => f.id !== oaItem.id && f.storedName !== oaItem.storedName && f.originalName !== oaItem.originalName);
      // Prepend to put newest at top
      const newFiles = [oaFileObj, ...filtered];
      await investorCol.updateOne(
        { id: OTHER_ANNOUNCEMENT_ID },
        { $set: { files: newFiles, updatedAt: new Date() } }
      );
      console.log("Updated Other Announcement in MongoDB.");
    }

    // 6. Update Preferential Issue in MongoDB
    const prefItems = fileEntries.filter(f => f.investorId === PREFERENTIAL_ID).sort((a, b) => a.order - b.order);
    const prefFileObjs = prefItems.map(p => ({
      id: p.id,
      originalName: p.originalName,
      storedName: p.storedName,
      url: p.url,
      mimeType: p.mimeType,
      size: p.size,
      title: p.title
    }));
    const existingPref = await investorCol.findOne({ id: PREFERENTIAL_ID });
    if (existingPref) {
      const filtered = (existingPref.files || []).filter(f => !prefItems.some(p => p.id === f.id || p.storedName === f.storedName || p.originalName === f.originalName));
      const newFiles = [...prefFileObjs, ...filtered];
      await investorCol.updateOne(
        { id: PREFERENTIAL_ID },
        { $set: { files: newFiles, updatedAt: new Date() } }
      );
      console.log("Updated Preferential Issue in MongoDB.");
    } else {
      await investorCol.insertOne({
        id: PREFERENTIAL_ID,
        title: "Preferential Issue",
        type: "Files",
        parent: "",
        files: prefFileObjs,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log("Inserted Preferential Issue in MongoDB.");
    }

    // 7. Update data/admin-investors.json
    const dbPath = path.join(__dirname, '../data/admin-investors.json');
    if (fs.existsSync(dbPath)) {
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

      // Update Board Meeting
      const localBM = dbData.find(e => e.id === BOARD_MEETING_ID || e.title.toLowerCase() === 'board meeting');
      if (localBM) {
        const filtered = (localBM.files || []).filter(f => f.id !== bmItem.id && f.storedName !== bmItem.storedName && f.originalName !== bmItem.originalName);
        localBM.files = [...filtered, bmFileObj];
        localBM.updatedAt = new Date().toISOString();
      }

      // Update Other Announcement
      const localOA = dbData.find(e => e.id === OTHER_ANNOUNCEMENT_ID || e.title.toLowerCase() === 'other annoucment' || e.title.toLowerCase() === 'other announcement');
      if (localOA) {
        const filtered = (localOA.files || []).filter(f => f.id !== oaItem.id && f.storedName !== oaItem.storedName && f.originalName !== oaItem.originalName);
        localOA.files = [oaFileObj, ...filtered];
        localOA.updatedAt = new Date().toISOString();
      }

      // Update Preferential Issue
      let localPref = dbData.find(e => e.id === PREFERENTIAL_ID || e.title.toLowerCase().trim() === 'preferential issue');
      if (localPref) {
        const filtered = (localPref.files || []).filter(f => !prefItems.some(p => p.id === f.id || p.storedName === f.storedName || p.originalName === f.originalName));
        localPref.files = [...prefFileObjs, ...filtered];
        localPref.updatedAt = new Date().toISOString();
      } else {
        localPref = {
          id: PREFERENTIAL_ID,
          title: "Preferential Issue",
          type: "Files",
          parent: "",
          files: prefFileObjs,
          updatedAt: new Date().toISOString()
        };
        const grievanceIndex = dbData.findIndex(e => e.title.toLowerCase().trim() === 'investor grievances');
        if (grievanceIndex !== -1) {
          dbData.splice(grievanceIndex, 0, localPref);
        } else {
          dbData.push(localPref);
        }
      }

      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
      console.log("Updated data/admin-investors.json successfully.");
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();

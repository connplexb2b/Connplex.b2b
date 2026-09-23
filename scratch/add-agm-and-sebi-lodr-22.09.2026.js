const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";

const GENERAL_MEETING_ID = "6805e8297f482b5677025884";
const OTHER_ANNOUNCEMENT_ID = "4887120f-272d-4780-852b-9620e1f4e1ef";

const filesToProcess = [
  {
    investorId: GENERAL_MEETING_ID,
    id: "g2209202-6000-4000-8000-000000000001",
    srcPath: "C:\\Users\\admin\\Downloads\\Voting result and Scrutinizers report.pdf",
    originalName: "Voting result and Scrutinizers report.pdf",
    storedName: "g2209202-6000-4000-8000-000000000001.pdf",
    title: "Voting Result and Scrutinizers Report.",
    mimeType: "application/pdf"
  }
];

async function run() {
  try {
    const uploadBase = path.join(__dirname, "../public/uploads/investors");
    const directUploadsDir = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(directUploadsDir)) {
      fs.mkdirSync(directUploadsDir, { recursive: true });
    }

    const fileEntries = [];
    for (const item of filesToProcess) {
      if (!fs.existsSync(item.srcPath)) {
        throw new Error(`Source file not found: ${item.srcPath}`);
      }
      const targetDir = path.join(uploadBase, item.investorId);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const buffer = fs.readFileSync(item.srcPath);
      const stats = fs.statSync(item.srcPath);

      const destPath = path.join(targetDir, item.storedName);
      fs.writeFileSync(destPath, buffer);
      fs.writeFileSync(path.join(targetDir, item.originalName), buffer);

      fs.writeFileSync(path.join(directUploadsDir, item.storedName), buffer);
      fs.writeFileSync(path.join(directUploadsDir, item.originalName), buffer);

      console.log(`Copied ${item.srcPath} -> ${destPath} (${stats.size} bytes)`);

      fileEntries.push({
        ...item,
        size: stats.size,
        url: `/uploads/investors/${item.investorId}/${item.storedName}`,
        destPath
      });
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully to MongoDB.");

    const db = mongoose.connection.db;
    const fileContentCol = db.collection('investorfilecontents');
    const investorCol = db.collection('investors');

    for (const item of fileEntries) {
      const buffer = fs.readFileSync(item.destPath);
      const names = [item.storedName, item.originalName];
      for (const fname of names) {
        const existing = await fileContentCol.findOne({ filename: fname });
        if (existing) {
          console.log(`Updating ${fname} in investorfilecontents...`);
          await fileContentCol.updateOne(
            { filename: fname },
            { $set: { data: buffer, mimeType: item.mimeType, updatedAt: new Date() } }
          );
        } else {
          console.log(`Inserting ${fname} into investorfilecontents...`);
          await fileContentCol.insertOne({
            filename: fname,
            data: buffer,
            mimeType: item.mimeType,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }

    // Update General Meeting in MongoDB
    const gmItem = fileEntries.find(f => f.investorId === GENERAL_MEETING_ID);
    const gmFileObj = {
      id: gmItem.id,
      originalName: gmItem.originalName,
      storedName: gmItem.storedName,
      url: gmItem.url,
      mimeType: gmItem.mimeType,
      size: gmItem.size,
      title: gmItem.title
    };
    const existingGM = await investorCol.findOne({ id: GENERAL_MEETING_ID });
    if (existingGM) {
      const filtered = (existingGM.files || []).filter(
        f => f.id !== gmItem.id && f.storedName !== gmItem.storedName && f.originalName !== gmItem.originalName && f.title !== gmFileObj.title
      );
      const newFiles = [gmFileObj, ...filtered];
      await investorCol.updateOne(
        { id: GENERAL_MEETING_ID },
        { $set: { files: newFiles, updatedAt: new Date() } }
      );
      console.log("Updated General Meeting in MongoDB.");
    }

    // Update Other Announcement in MongoDB if present
    const oaItem = fileEntries.find(f => f.investorId === OTHER_ANNOUNCEMENT_ID);
    if (oaItem) {
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
        const filtered = (existingOA.files || []).filter(
          f => f.id !== oaItem.id && f.storedName !== oaItem.storedName && f.originalName !== oaItem.originalName && f.title !== oaFileObj.title
        );
        const newFiles = [oaFileObj, ...filtered];
        await investorCol.updateOne({ id: OTHER_ANNOUNCEMENT_ID }, { $set: { files: newFiles, updatedAt: new Date() } });
        console.log("Updated Other Announcement in MongoDB.");
      }
    }

    // Update data/admin-investors.json
    const dbPath = path.join(__dirname, '../data/admin-investors.json');
    if (fs.existsSync(dbPath)) {
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

      // Update General Meeting
      const localGM = dbData.find(e => e.id === GENERAL_MEETING_ID || e.title.toLowerCase().trim() === 'general meeting');
      if (localGM) {
        const filtered = (localGM.files || []).filter(
          f => f.id !== gmItem.id && f.storedName !== gmItem.storedName && f.originalName !== gmItem.originalName && f.title !== gmFileObj.title
        );
        localGM.files = [gmFileObj, ...filtered];
        localGM.updatedAt = new Date().toISOString();
      }

      // Update Other Announcement
      if (oaItem) {
        const localOA = dbData.find(
          e => e.id === OTHER_ANNOUNCEMENT_ID || 
               e.title.toLowerCase() === 'other annoucment' || 
               e.title.toLowerCase() === 'other announcement' ||
               e.title.toLowerCase() === 'other announcements'
        );
        if (localOA) {
          const filtered = (localOA.files || []).filter(
            f => f.id !== oaItem.id && f.storedName !== oaItem.storedName && f.originalName !== oaItem.originalName && f.title !== oaItem.title
          );
          localOA.files = [{
            id: oaItem.id,
            originalName: oaItem.originalName,
            storedName: oaItem.storedName,
            url: oaItem.url,
            mimeType: oaItem.mimeType,
            size: oaItem.size,
            title: oaItem.title
          }, ...filtered];
          localOA.updatedAt = new Date().toISOString();
        }
      }

      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
      console.log("Updated data/admin-investors.json successfully.");
    }

    console.log("ALL FILES AND DATABASE UPDATES COMPLETED SUCCESSFULLY!");
  } catch (err) {
    console.error("Error during execution:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();

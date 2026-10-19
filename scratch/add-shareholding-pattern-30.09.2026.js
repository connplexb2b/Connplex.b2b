const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";
const SHAREHOLDING_CATEGORY_ID = "6805e8297f482b56770258a3";

const SRC_PATH = "C:\\Users\\admin\\Downloads\\Shareholding Pattern_30.09.2026.pdf";
const FILE_ID = "s3009202-6000-4000-8000-000000000001";
const FILE_NAME = "Shareholding Pattern_30.09.2026.pdf";
const STORED_NAME = `${FILE_ID}.pdf`;
const RELATIVE_URL = `/uploads/investors/${SHAREHOLDING_CATEGORY_ID}/${STORED_NAME}`;
const MIME_TYPE = "application/pdf";
const TITLE = "Shareholding Pattern_30.09.2026.";

async function run() {
  try {
    // 1. Verify source PDF
    if (!fs.existsSync(SRC_PATH)) {
      throw new Error(`Source PDF file does not exist at: ${SRC_PATH}`);
    }
    const pdfBuffer = fs.readFileSync(SRC_PATH);
    const size = pdfBuffer.length;
    console.log(`Source PDF loaded from ${SRC_PATH}: ${size} bytes`);

    // 2. Copy to public/uploads/investors/{SHAREHOLDING_CATEGORY_ID}/
    const uploadDir = path.join(__dirname, "../public/uploads/investors", SHAREHOLDING_CATEGORY_ID);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const destPath = path.join(uploadDir, STORED_NAME);
    fs.writeFileSync(destPath, pdfBuffer);
    fs.writeFileSync(path.join(uploadDir, FILE_NAME), pdfBuffer);
    console.log(`Saved files to ${uploadDir}`);

    // Copy to direct public/uploads/ directory for fallback lookup
    const directUploadsDir = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(directUploadsDir)) {
      fs.mkdirSync(directUploadsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(directUploadsDir, STORED_NAME), pdfBuffer);
    fs.writeFileSync(path.join(directUploadsDir, FILE_NAME), pdfBuffer);
    console.log(`Saved files to ${directUploadsDir}`);

    // 3. Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully to MongoDB.");

    const db = mongoose.connection.db;

    // 4. Save binary file content to MongoDB (investorfilecontents collection)
    const fileContentCol = db.collection('investorfilecontents');
    const filenamesToStore = [
      STORED_NAME,
      FILE_NAME
    ];

    for (const fname of filenamesToStore) {
      const existingFileContent = await fileContentCol.findOne({ filename: fname });
      if (existingFileContent) {
        console.log(`Updating file content for ${fname} in MongoDB.`);
        await fileContentCol.updateOne(
          { filename: fname },
          { $set: { data: pdfBuffer, mimeType: MIME_TYPE, updatedAt: new Date() } }
        );
      } else {
        console.log(`Inserting new file content for ${fname} into MongoDB.`);
        await fileContentCol.insertOne({
          filename: fname,
          data: pdfBuffer,
          mimeType: MIME_TYPE,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // 5. Update the investor document in MongoDB (investors collection)
    const investorCol = db.collection('investors');
    const investorDoc = await investorCol.findOne({ id: SHAREHOLDING_CATEGORY_ID });

    const newFileEntry = {
      id: FILE_ID,
      originalName: FILE_NAME,
      storedName: STORED_NAME,
      url: RELATIVE_URL,
      mimeType: MIME_TYPE,
      size: size,
      title: TITLE
    };

    const olderFiles = [
      {
        id: "69e09312f784cad73d7132fb",
        originalName: "Shareholding Patterns - 31.03.2026.pdf",
        storedName: "1776325394551-381997228.pdf",
        url: "https://webadmin.theconnplex.com/api/file//1776325394551-381997228.pdf",
        mimeType: "application/pdf",
        size: 3190816,
        title: "Shareholding Patterns - 31.03.2026"
      },
      {
        id: "68ef3389fa40030d7538a39c",
        originalName: "Shareholding Patterns - 30.09.2025.pdf",
        storedName: "1760506761417-525539123.pdf",
        url: "https://webadmin.theconnplex.com/api/file//1760506761417-525539123.pdf",
        mimeType: "application/pdf",
        size: 2500000,
        title: "Shareholding Patterns - 30.09.2025"
      }
    ];

    if (!investorDoc) {
      console.log(`Investor document with ID ${SHAREHOLDING_CATEGORY_ID} (Shareholding Patterns) not found in DB. Inserting new.`);
      await investorCol.insertOne({
        id: SHAREHOLDING_CATEGORY_ID,
        title: "Shareholding Patterns",
        type: "Files",
        parent: "",
        files: [newFileEntry, ...olderFiles],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      console.log(`Investor document with ID ${SHAREHOLDING_CATEGORY_ID} found. Updating files.`);
      let updatedFiles = (investorDoc.files || []).filter(
        f => f.id !== FILE_ID && f.storedName !== STORED_NAME && f.title !== TITLE && f.originalName !== FILE_NAME
      );
      // Place at the very top (index 0)
      updatedFiles.unshift(newFileEntry);

      await investorCol.updateOne(
        { id: SHAREHOLDING_CATEGORY_ID },
        { 
          $set: { 
            files: updatedFiles,
            updatedAt: new Date() 
          } 
        }
      );
    }
    console.log("MongoDB investor document updated successfully.");

    // 6. Update local data/admin-investors.json
    const jsonPath = path.join(__dirname, '../data/admin-investors.json');
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      let shItem = data.find(e => e.id === SHAREHOLDING_CATEGORY_ID || e.title.toLowerCase().trim() === 'shareholding patterns' || e.title.toLowerCase().trim() === 'shareholding pattern');
      if (shItem) {
        let files = (shItem.files || []).filter(
          f => f.id !== FILE_ID && f.storedName !== STORED_NAME && f.title !== TITLE && f.originalName !== FILE_NAME
        );
        files.unshift(newFileEntry);
        shItem.files = files;
        shItem.updatedAt = new Date().toISOString();
      } else {
        shItem = {
          id: SHAREHOLDING_CATEGORY_ID,
          title: "Shareholding Patterns",
          type: "Files",
          parent: "",
          files: [newFileEntry, ...olderFiles],
          updatedAt: new Date().toISOString()
        };
        data.push(shItem);
      }
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
      console.log("Updated data/admin-investors.json successfully.");
    }

    console.log("All updates completed successfully!");
  } catch (err) {
    console.error("Error during execution:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();

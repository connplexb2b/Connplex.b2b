const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";
const INVESTOR_ID = "4887120f-272d-4780-852b-9620e1f4e1ef";

const FILE_ID = "7e8181d3-8e8c-4452-995e-3f24a4a7fcb1";
const FILE_NAME = "Intimation under Regulation 29 of SEBI(LODR) - 14.08.2026.pdf";
const STORED_NAME = `${FILE_ID}.pdf`;
const RELATIVE_URL = `/uploads/investors/${INVESTOR_ID}/${STORED_NAME}`;
const MIME_TYPE = "application/pdf";

async function run() {
  try {
    // 1. Read the PDF file to get the Buffer and its size
    const pdfPath = path.join(__dirname, "../public/uploads/investors", INVESTOR_ID, STORED_NAME);
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file does not exist at expected path: ${pdfPath}`);
    }
    const pdfBuffer = fs.readFileSync(pdfPath);
    const size = pdfBuffer.length;
    console.log(`PDF loaded. Size: ${size} bytes`);

    // 2. Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully to MongoDB.");

    const db = mongoose.connection.db;

    // 3. Save binary file content to MongoDB (investorfilecontents collection)
    // Check if it already exists
    const fileContentCol = db.collection('investorfilecontents');
    const existingFileContent = await fileContentCol.findOne({ filename: STORED_NAME });
    if (existingFileContent) {
      console.log(`File content for ${STORED_NAME} already exists in database. Updating it.`);
      await fileContentCol.updateOne(
        { filename: STORED_NAME },
        { $set: { data: pdfBuffer, mimeType: MIME_TYPE, updatedAt: new Date() } }
      );
    } else {
      console.log(`Inserting new file content for ${STORED_NAME} into database.`);
      await fileContentCol.insertOne({
        filename: STORED_NAME,
        data: pdfBuffer,
        mimeType: MIME_TYPE,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // 4. Update the investor document in MongoDB (investors collection)
    const investorCol = db.collection('investors');
    const investorDoc = await investorCol.findOne({ id: INVESTOR_ID });
    if (!investorDoc) {
      throw new Error(`Investor document with ID ${INVESTOR_ID} not found in database.`);
    }

    const fileEntry = {
      id: FILE_ID,
      originalName: FILE_NAME,
      storedName: STORED_NAME,
      url: RELATIVE_URL,
      mimeType: MIME_TYPE,
      size: size,
      title: "Intimation under Regulation 29 of SEBI(LODR) - 14.08.2026"
    };

    // Remove any existing entry with the same ID, or same storedName if any, to avoid duplicates
    let updatedFiles = (investorDoc.files || []).filter(f => f.id !== FILE_ID && f.storedName !== STORED_NAME);
    // Push the new entry to the front/beginning or end? Let's check existing array order.
    // The existing files array seems to be in order of insertion or descending by date, with the newest at the top?
    // Wait, let's look at admin-investors.json.
    // In admin-investors.json, the files array has:
    // 01.07.2026, 30.06.2026, 23.05.2026, 04.07.2026, 11.07.2026, 29.07.2026, 31.07.2026, 09.08.2026 (two), test-doc.pdf.
    // Wait, the newest files (e.g. 09.08.2026) are appended or prepended?
    // Let's see: originalName 01.07.2026 is first, test-doc is last.
    // Wait, let's prepend the new one or append it? In the UI, does it sort them?
    // Let's look at the UI code to see if it sorts or displays in order.
    // Let's first push to the files array.
    updatedFiles.unshift(fileEntry); // Prepend to show the latest first.

    await investorCol.updateOne(
      { id: INVESTOR_ID },
      { 
        $set: { 
          files: updatedFiles,
          updatedAt: new Date() 
        } 
      }
    );
    console.log("MongoDB investor document updated successfully.");

    // 5. Update local data/admin-investors.json file
    const dbPath = path.join(__dirname, '../data/admin-investors.json');
    if (fs.existsSync(dbPath)) {
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      const localInvestor = dbData.find(e => e.id === INVESTOR_ID);
      if (localInvestor) {
        let localFiles = (localInvestor.files || []).filter(f => f.id !== FILE_ID && f.storedName !== STORED_NAME);
        localFiles.unshift(fileEntry);
        localInvestor.files = localFiles;
        localInvestor.updatedAt = new Date().toISOString();
        fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
        console.log("Local admin-investors.json updated successfully.");
      } else {
        console.warn("Could not find investor in local JSON file.");
      }
    } else {
      console.warn("Local admin-investors.json file does not exist.");
    }

  } catch (err) {
    console.error("Error during run:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();

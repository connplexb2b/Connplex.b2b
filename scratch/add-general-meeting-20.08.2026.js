const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";
const INVESTOR_ID = "6805e8297f482b5677025884";

const FILE_ID = "da38e2d4-1b79-4cfc-b179-c8c362089df5";
const FILE_NAME = "Pre-dispatch Notice_Newspaper Advt..20082026.pdf";
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

    const fileEntry = {
      id: FILE_ID,
      originalName: FILE_NAME,
      storedName: STORED_NAME,
      url: RELATIVE_URL,
      mimeType: MIME_TYPE,
      size: size,
      title: "Pre-dispatch Notice_Newspaper Advt..20082026"
    };

    if (!investorDoc) {
      console.log(`Investor document with ID ${INVESTOR_ID} (General Meeting) not found. Inserting new document.`);
      await investorCol.insertOne({
        id: INVESTOR_ID,
        title: "General Meeting",
        type: "Files",
        parent: "Announcements",
        files: [fileEntry],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      console.log(`Investor document with ID ${INVESTOR_ID} found. Updating files.`);
      // Remove any existing entry with the same ID or storedName to avoid duplicates
      let updatedFiles = (investorDoc.files || []).filter(f => f.id !== FILE_ID && f.storedName !== STORED_NAME);
      updatedFiles.unshift(fileEntry);

      await investorCol.updateOne(
        { id: INVESTOR_ID },
        { 
          $set: { 
            files: updatedFiles,
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

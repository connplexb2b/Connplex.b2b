const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";
const PREFERENTIAL_CATEGORY_ID = "6805e8297f482b5677025898";

const SRC_PATH = "C:\\Users\\admin\\Downloads\\ALLOTMENT OF WARRANTS_30.10.2026.PDF";
const FILE_ID = "p3010202-6000-4000-8000-000000000001";
const FILE_NAME = "ALLOTMENT OF WARRANTS_30.10.2026.pdf";
const STORED_NAME = `${FILE_ID}.pdf`;
const RELATIVE_URL = `/uploads/investors/${PREFERENTIAL_CATEGORY_ID}/${STORED_NAME}`;
const MIME_TYPE = "application/pdf";
const TITLE = ".ALLOTMENT OF WARRANTS_30.10.2026";

async function run() {
  try {
    // 1. Verify source PDF
    if (!fs.existsSync(SRC_PATH)) {
      throw new Error(`Source PDF file does not exist at: ${SRC_PATH}`);
    }
    const pdfBuffer = fs.readFileSync(SRC_PATH);
    const size = pdfBuffer.length;
    console.log(`Source PDF loaded from ${SRC_PATH}: ${size} bytes`);

    // 2. Copy to public/uploads/investors/{PREFERENTIAL_CATEGORY_ID}/
    const uploadDir = path.join(__dirname, "../public/uploads/investors", PREFERENTIAL_CATEGORY_ID);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const destPath = path.join(uploadDir, STORED_NAME);
    fs.writeFileSync(destPath, pdfBuffer);
    fs.writeFileSync(path.join(uploadDir, FILE_NAME), pdfBuffer);
    fs.writeFileSync(path.join(uploadDir, "ALLOTMENT OF WARRANTS_30.10.2026.PDF"), pdfBuffer);
    fs.writeFileSync(path.join(uploadDir, ".ALLOTMENT OF WARRANTS_30.10.2026.pdf"), pdfBuffer);
    console.log(`Saved files to ${uploadDir}`);

    // Copy to direct public/uploads/ directory for fallback lookup
    const directUploadsDir = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(directUploadsDir)) {
      fs.mkdirSync(directUploadsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(directUploadsDir, STORED_NAME), pdfBuffer);
    fs.writeFileSync(path.join(directUploadsDir, FILE_NAME), pdfBuffer);
    fs.writeFileSync(path.join(directUploadsDir, "ALLOTMENT OF WARRANTS_30.10.2026.PDF"), pdfBuffer);
    fs.writeFileSync(path.join(directUploadsDir, ".ALLOTMENT OF WARRANTS_30.10.2026.pdf"), pdfBuffer);
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
      FILE_NAME,
      "ALLOTMENT OF WARRANTS_30.10.2026.PDF",
      ".ALLOTMENT OF WARRANTS_30.10.2026.pdf",
      ".ALLOTMENT OF WARRANTS_30.10.2026"
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
    const investorDoc = await investorCol.findOne({ id: PREFERENTIAL_CATEGORY_ID });

    const newFileEntry = {
      id: FILE_ID,
      originalName: FILE_NAME,
      storedName: STORED_NAME,
      url: RELATIVE_URL,
      mimeType: MIME_TYPE,
      size: size,
      title: TITLE
    };

    if (!investorDoc) {
      console.log(`Investor document with ID ${PREFERENTIAL_CATEGORY_ID} not found. Creating new.`);
      await investorCol.insertOne({
        id: PREFERENTIAL_CATEGORY_ID,
        title: "Preferential Issue",
        type: "Files",
        parent: "",
        files: [newFileEntry],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      console.log(`Investor document with ID ${PREFERENTIAL_CATEGORY_ID} found. Prepending new file.`);
      let existingFiles = (investorDoc.files || []).filter(
        f => f.id !== FILE_ID &&
             f.storedName !== STORED_NAME &&
             f.originalName !== FILE_NAME &&
             (f.title || '') !== TITLE &&
             (f.title || '').replace(/^\./, '') !== TITLE.replace(/^\./, '')
      );
      // Prepend to top
      existingFiles.unshift(newFileEntry);

      await investorCol.updateOne(
        { id: PREFERENTIAL_CATEGORY_ID },
        {
          $set: {
            files: existingFiles,
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
      const prefItem = data.find(e => e.id === PREFERENTIAL_CATEGORY_ID || e.title.toLowerCase().trim() === 'preferential issue');
      if (prefItem) {
        let files = (prefItem.files || []).filter(
          f => f.id !== FILE_ID &&
               f.storedName !== STORED_NAME &&
               f.originalName !== FILE_NAME &&
               (f.title || '') !== TITLE &&
               (f.title || '').replace(/^\./, '') !== TITLE.replace(/^\./, '')
        );
        // Prepend to top
        files.unshift(newFileEntry);
        prefItem.files = files;
        prefItem.updatedAt = new Date().toISOString();
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
        console.log("Updated data/admin-investors.json successfully.");
      } else {
        console.warn("Preferential Issue entry not found in admin-investors.json");
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

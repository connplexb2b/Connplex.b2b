const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";
const INVESTOR_ID = "6805e8297f482b5677025884";

const SRC_PATH = "C:\\Users\\admin\\Downloads\\Post-Dispatch EGM Notice_Newspaper Adv._17.09.2026.PDF";
const FILE_ID = "g1709202-6000-4000-8000-000000000001";
const FILE_NAME = "Post-Dispatch EGM Notice_Newspaper Adv._17.09.2026.pdf";
const STORED_NAME = `${FILE_ID}.pdf`;
const RELATIVE_URL = `/uploads/investors/${INVESTOR_ID}/${STORED_NAME}`;
const MIME_TYPE = "application/pdf";
const TITLE = "Post-Dispatch EGM Notice_Newspaper Adv._17.09.2026.";

async function run() {
  try {
    // 1. Verify source PDF
    if (!fs.existsSync(SRC_PATH)) {
      throw new Error(`Source PDF file does not exist at: ${SRC_PATH}`);
    }
    const pdfBuffer = fs.readFileSync(SRC_PATH);
    const size = pdfBuffer.length;
    console.log(`Source PDF loaded: ${size} bytes`);

    // 2. Copy to public/uploads/investors/{INVESTOR_ID}/
    const uploadDir = path.join(__dirname, "../public/uploads/investors", INVESTOR_ID);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const destPath = path.join(uploadDir, STORED_NAME);
    fs.writeFileSync(destPath, pdfBuffer);
    console.log(`Saved to ${destPath}`);

    // Copy with original names in investors dir as well
    fs.writeFileSync(path.join(uploadDir, FILE_NAME), pdfBuffer);
    fs.writeFileSync(path.join(uploadDir, "Post-Dispatch EGM Notice_Newspaper Adv._17.09.2026.PDF"), pdfBuffer);

    // Also copy to direct uploads directory for fallback lookup
    const directUploadsDir = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(directUploadsDir)) {
      fs.mkdirSync(directUploadsDir, { recursive: true });
    }
    const directDestPath = path.join(directUploadsDir, STORED_NAME);
    fs.writeFileSync(directDestPath, pdfBuffer);
    fs.writeFileSync(path.join(directUploadsDir, FILE_NAME), pdfBuffer);
    fs.writeFileSync(path.join(directUploadsDir, "Post-Dispatch EGM Notice_Newspaper Adv._17.09.2026.PDF"), pdfBuffer);
    console.log(`Saved to ${directDestPath}`);

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
      "Post-Dispatch EGM Notice_Newspaper Adv._17.09.2026.PDF"
    ];

    for (const fname of filenamesToStore) {
      const existingFileContent = await fileContentCol.findOne({ filename: fname });
      if (existingFileContent) {
        console.log(`File content for ${fname} already exists in database. Updating it.`);
        await fileContentCol.updateOne(
          { filename: fname },
          { $set: { data: pdfBuffer, mimeType: MIME_TYPE, updatedAt: new Date() } }
        );
      } else {
        console.log(`Inserting new file content for ${fname} into database.`);
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
    const investorDoc = await investorCol.findOne({ id: INVESTOR_ID });

    const fileEntry = {
      id: FILE_ID,
      originalName: FILE_NAME,
      storedName: STORED_NAME,
      url: RELATIVE_URL,
      mimeType: MIME_TYPE,
      size: size,
      title: TITLE
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
      let updatedFiles = (investorDoc.files || []).filter(
        f => f.id !== FILE_ID && f.storedName !== STORED_NAME && f.title !== TITLE && f.originalName !== FILE_NAME && f.originalName !== "Post-Dispatch EGM Notice_Newspaper Adv._17.09.2026.PDF"
      );
      // Place at the very top (index 0)
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

    // 6. Update local data/admin-investors.json
    const jsonPath = path.join(__dirname, '../data/admin-investors.json');
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const gmItem = data.find(e => e.id === INVESTOR_ID || e.title.toLowerCase().trim() === 'general meeting');
      if (gmItem) {
        let files = (gmItem.files || []).filter(
          f => f.id !== FILE_ID && f.storedName !== STORED_NAME && f.title !== TITLE && f.originalName !== FILE_NAME && f.originalName !== "Post-Dispatch EGM Notice_Newspaper Adv._17.09.2026.PDF"
        );
        // Place at the very top (index 0)
        files.unshift(fileEntry);
        gmItem.files = files;
        gmItem.updatedAt = new Date().toISOString();
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
        console.log("Updated data/admin-investors.json successfully.");
      } else {
        console.warn("General Meeting entry not found in admin-investors.json");
      }
    }

  } catch (err) {
    console.error("Error during execution:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();

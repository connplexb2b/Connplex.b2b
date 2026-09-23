const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";

const GENERAL_MEETING_ID = "6805e8297f482b5677025884";

const item = {
  investorId: GENERAL_MEETING_ID,
  id: "g2209202-6000-4000-8000-000000000001",
  srcPath: "C:\\Users\\admin\\Downloads\\Voting result and Scrutinizers report.pdf",
  originalName: "Voting result and Scrutinizers report.pdf",
  storedName: "g2209202-6000-4000-8000-000000000001.pdf",
  title: "Voting Result and Scrutinizers Report.",
  mimeType: "application/pdf"
};

async function run() {
  try {
    const uploadBase = path.join(__dirname, "../public/uploads/investors");
    const directUploadsDir = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(directUploadsDir)) {
      fs.mkdirSync(directUploadsDir, { recursive: true });
    }

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

    const fileEntry = {
      ...item,
      size: stats.size,
      url: `/uploads/investors/${item.investorId}/${item.storedName}`,
      destPath
    };

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully to MongoDB.");

    const db = mongoose.connection.db;
    const fileContentCol = db.collection('investorfilecontents');
    const investorCol = db.collection('investors');

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

    // Update General Meeting in MongoDB
    const gmFileObj = {
      id: fileEntry.id,
      originalName: fileEntry.originalName,
      storedName: fileEntry.storedName,
      url: fileEntry.url,
      mimeType: fileEntry.mimeType,
      size: fileEntry.size,
      title: fileEntry.title
    };

    const existingGM = await investorCol.findOne({ id: GENERAL_MEETING_ID });
    if (existingGM) {
      const filtered = (existingGM.files || []).filter(
        f => f.id !== gmFileObj.id && f.storedName !== gmFileObj.storedName && f.originalName !== gmFileObj.originalName && f.title !== gmFileObj.title
      );
      const newFiles = [gmFileObj, ...filtered];
      await investorCol.updateOne(
        { id: GENERAL_MEETING_ID 	�)�v��	�]���[\Έ�]њ[\�\]Y]��]�]J
HHB�
N�ۜ��K����\]Y�[�\�[YY][��[�[ۙ�����NB����\]H]K�YZ[�Z[��\�ܜ˚��ۂ��ۜ��]H]���[���\��[YK	ˋ��]K�YZ[�Z[��\�ܜ˚��ۉ�NY�
�˙^\���[���]
JH�ۜ��]HH��Ӌ�\��J�˜�XY�[T�[���]	�]�	�JN��ۜ���[�HH�]K��[�
HO�K�YOOH�S�T�S�QQUS���QK�]K����\��\�J
K��[J
HOOH	��[�\�[YY][���NY�
��[�JH�ۜ��[\�YH
��[�K��[\��JK��[\���O���YOOH�Q�[Sؚ��Y	�����ܙY�[YHOOH�Q�[Sؚ���ܙY�[YH	����ܚY�[�[�[YHOOH�Q�[Sؚ��ܚY�[�[�[YH	����]HOOH�Q�[Sؚ��]B�
N��[�K��[\�H��Q�[Sؚ�����[\�YN��[�K�\]Y]H�]�]J
K��T����[��
NB���˝ܚ]Q�[T�[���]��Ӌ���[��Y�J�]K�[�K	�]�	�N�ۜ��K����\]Y]K�YZ[�Z[��\�ܜ˚��ۈ�X��\�ٝ[K��NB���ۜ��K������S���T�S�SHS�UP�T�H�P��T�ѕSHTUQH�NH�]�
\��H�ۜ��K�\��܊�\��܈\�[��^X�][ێ��\��NH�[�[H]�Z][ۙ����K�\��ۛ�X�

N�ۜ��K����\��ۛ�X�Y���H[ۙ�����NB�B���[�
N�
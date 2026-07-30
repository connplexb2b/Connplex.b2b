const fs = require('fs');
const path = require('path');

const pdfPath = path.join(__dirname, '../public/uploads/investors/4887120f-272d-4780-852b-9620e1f4e1ef/b8a92b23-3a1d-4001-8b43-982ee33df716.pdf');

// Ensure directories exist
fs.mkdirSync(path.dirname(pdfPath), { recursive: true });

const textLines = [
  "July 29, 2026",
  "",
  "To,",
  "National Stock Exchange of India Limited",
  "Exchange Plaza, C-1, Block G.",
  "Bandra Kurla Complex,",
  "Bandra \\(East\\), Mumbai - 400 051",
  "\\(Symbol: CONNPLEX\\)",
  "",
  "Sub: Intimation pursuant to Regulation 30 of the SEBI \\(Listing Obligations and",
  "Disclosure Requirement\\) Regulations, 2015 - General Update",
  "",
  "Dear Sir / Madam,",
  "",
  "Pursuant to Regulation 30 of the SEBI \\(Listing Obligations and Disclosure Requirements\\)",
  "Regulations, 2015, we are pleased to inform you about the opening of 3 screen cinema with",
  "150 seats at Khagaul, Patna, Bihar.",
  "",
  "The cinema is equipped with cutting-edge technology, advanced Dolby 7.1 audio with high-",
  "performance sound systems and 3D screen.",
  "",
  "This is for your information and record.",
  "",
  "Yours sincerely,",
  "",
  "For, Connplex Cinemas Limited",
  "\\(Formerly known as VCS Industries Limited\\)",
  "",
  "Anish Tulshibhai Patel",
  "Managing Director",
  "DIN: 07823715"
];

// Build the stream contents
let streamContent = 'BT\n/F1 11 Tf\n15 TL\n50 780 Td\n';
for (const line of textLines) {
  if (line === "") {
    streamContent += 'T*\n';
  } else {
    streamContent += `(${line}) Tj T*\n`;
  }
}
streamContent += 'ET';

const streamLength = Buffer.byteLength(streamContent);

const pdfParts = [];
let offset = 0;
const objects = [];

function addObject(data) {
  const id = objects.length + 1;
  const start = offset;
  const str = `${id} 0 obj\n${data}\nendobj\n`;
  pdfParts.push(str);
  offset += Buffer.byteLength(str);
  objects.push({ id, start });
  return { id, start };
}

// Header
const header = '%PDF-1.4\n';
pdfParts.push(header);
offset += Buffer.byteLength(header);

// Object 1: Catalog
addObject('<< /Type /Catalog /Pages 2 0 R >>');
// Object 2: Pages
addObject('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
// Object 3: Page
addObject('<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 595.28 841.89] /Contents 5 0 R >>');
// Object 4: Resources
addObject('<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>');
// Object 5: Contents (stream)
addObject(`<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream`);

// Cross-reference table
const xrefStart = offset;
let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (const obj of objects) {
  xref += String(obj.start).padStart(10, '0') + ' 00000 n \n';
}

const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

pdfParts.push(xref);
pdfParts.push(trailer);

const finalPdf = pdfParts.join('');
fs.writeFileSync(pdfPath, finalPdf);

const size = fs.statSync(pdfPath).size;
console.log('PDF generated at:', pdfPath);
console.log('Size (bytes):', size);

// Update database file with correct size and title
const dbPath = path.join(__dirname, '../data/admin-investors.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const investor = dbData.find(e => e.id === '4887120f-272d-4780-852b-9620e1f4e1ef');
if (investor) {
  let fileEntry = investor.files.find(f => f.id === 'b8a92b23-3a1d-4001-8b43-982ee33df716');
  if (!fileEntry) {
    fileEntry = {
      id: 'b8a92b23-3a1d-4001-8b43-982ee33df716',
      originalName: 'Intimation under Regulation 30 of SEBI(LODR) - 29.07.2026.pdf',
      storedName: 'b8a92b23-3a1d-4001-8b43-982ee33df716.pdf',
      url: '/uploads/investors/4887120f-272d-4780-852b-9620e1f4e1ef/b8a92b23-3a1d-4001-8b43-982ee33df716.pdf',
      mimeType: 'application/pdf',
      size: size,
      title: 'Intimation under Regulation 30 of SEBI(LODR) - 29.07.2026'
    };
    investor.files.push(fileEntry);
  } else {
    fileEntry.size = size;
    fileEntry.title = 'Intimation under Regulation 30 of SEBI(LODR) - 29.07.2026';
  }
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
  console.log('Database updated successfully.');
}

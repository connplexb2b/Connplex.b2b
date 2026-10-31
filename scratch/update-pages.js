const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  path.join(__dirname, '../src/app/investor-section/page.tsx'),
  path.join(__dirname, '../src/app/investors/page.tsx')
];

for (const filePath of filesToUpdate) {
  let content = fs.readFileSync(filePath, 'utf8');
  const isCRLF = content.includes('\r\n');
  content = content.replace(/\r\n/g, '\n');

  // 1. Add warrant entry in prefPdfs
  const oldPrefPdfsTarget = `          const prefPdfs = [
            {
              _id: 'p1609202-6000-4000-8000-000000000001',`;

  const newPrefPdfsReplacement = `          const prefPdfs = [
            {
              _id: 'p3010202-6000-4000-8000-000000000001',
              title: '.ALLOTMENT OF WARRANTS_30.10.2026',
              originalname: 'ALLOTMENT OF WARRANTS_30.10.2026.pdf',
              fileName: '/uploads/investors/6805e8297f482b5677025898/p3010202-6000-4000-8000-000000000001.pdf',
              mimeType: 'application/pdf',
              size: 954059
            },
            {
              _id: 'p1609202-6000-4000-8000-000000000001',`;

  if (content.includes(oldPrefPdfsTarget)) {
    content = content.replace(oldPrefPdfsTarget, newPrefPdfsReplacement);
    console.log(`Updated prefPdfs in ${path.basename(filePath)}`);
  } else {
    console.warn(`Could not find oldPrefPdfsTarget in ${path.basename(filePath)}`);
  }

  // 2. Update prefPdfs deduplication check
  const oldExistsTarget = `(f.title && f.title === pp.title)
            );
            if (!exists) {
              data.investorsPdfs.push(pp);
            }
          });`;

  const newExistsReplacement = `(f.title && f.title === pp.title) ||
                (pp._id === 'p3010202-6000-4000-8000-000000000001' && (
                  (f.originalname && f.originalname.includes('30.10.2026')) ||
                  (f.title && f.title.includes('30.10.2026'))
                ))
            );
            if (!exists) {
              data.investorsPdfs.push(pp);
            }
          });`;

  if (content.includes(oldExistsTarget)) {
    content = content.replace(oldExistsTarget, newExistsReplacement);
    console.log(`Updated exists check in ${path.basename(filePath)}`);
  } else {
    console.warn(`Could not find oldExistsTarget in ${path.basename(filePath)}`);
  }

  if (isCRLF) {
    content = content.replace(/\n/g, '\r\n');
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

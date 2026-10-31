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

  // 1. Add boardPdfs entries
  const oldBoardPdfsTarget = `            {
              _id: 'b1109202-6000-4000-8000-000000000004',
              title: 'Outcome of Board Meeting_11.09.2026',
              originalname: 'Outcome of Board Meeting_11.09.2026.pdf',
              fileName: '/uploads/investors/6805e8297f482b5677025882/b1109202-6000-4000-8000-000000000004.pdf',
              mimeType: 'application/pdf',
              size: 742035
            }
          ];`;

  const newBoardPdfsReplacement = `            {
              _id: 'b1109202-6000-4000-8000-000000000004',
              title: 'Outcome of Board Meeting_11.09.2026',
              originalname: 'Outcome of Board Meeting_11.09.2026.pdf',
              fileName: '/uploads/investors/6805e8297f482b5677025882/b1109202-6000-4000-8000-000000000004.pdf',
              mimeType: 'application/pdf',
              size: 742035
            },
            {
              _id: 'b3010202-6000-4000-8000-000000000005',
              title: 'OUTCOME OF BOARD MEETING_30.10.2026',
              originalname: 'OUTCOME OF BOARD MEETING_30.10.2026.pdf',
              fileName: '/uploads/investors/6805e8297f482b5677025882/b3010202-6000-4000-8000-000000000005.pdf',
              mimeType: 'application/pdf',
              size: 954059
            },
            {
              _id: 'b3010202-6000-4000-8000-000000000006',
              title: 'PRIOR INTIMATION OF BOARD MEETING_30.10.2026',
              originalname: 'Prior Intimation of Board Meeting_30.10.2026.pdf',
              fileName: '/uploads/investors/6805e8297f482b5677025882/b3010202-6000-4000-8000-000000000006.pdf',
              mimeType: 'application/pdf',
              size: 630093
            }
          ];`;

  if (content.includes(oldBoardPdfsTarget)) {
    content = content.replace(oldBoardPdfsTarget, newBoardPdfsReplacement);
    console.log(`Updated boardPdfs in ${path.basename(filePath)}`);
  } else {
    console.warn(`Could not find oldBoardPdfsTarget in ${path.basename(filePath)}`);
  }

  // 2. Update seqOrder for board meeting
  const oldSeqOrderTarget = `          if (activeCategory.toLowerCase() === 'board meeting') {
            // Sequence requested:
            // 1. Prior intimation of Board Meeting_14.08.2026 (14/08/2026)
            // 2. Outcome of Board Meeting_19.08.2026 (19/08/2026)
            // 3. Prior Intimation of Board Meeting_07.09.2026 (07/09/2026)
            // 4. Outcome of Board Meeting_11.09.2026 (11/09/2026)
            const seqOrder = [
              '14.08.2026',
              '19.08.2026',
              '07.09.2026',
              '11.09.2026'
            ];
            const targetPdfs: any[] = [];
            const otherPdfs: any[] = [];

            seqOrder.forEach((dateKey) => {
              const found = data.investorsPdfs.find((f: any) =>
                (f.originalname || '').includes(dateKey) || (f.title || '').includes(dateKey)
              );
              if (
                found &&
                !targetPdfs.some(
                  (t: any) =>
                    (t._id && found._id && t._id === found._id) ||
                    (t.fileName && found.fileName && t.fileName === found.fileName) ||
                    (t.originalname && found.originalname && t.originalname.toLowerCase() === found.originalname.toLowerCase())
                )
              ) {
                targetPdfs.push(found);
              }
            });

            data.investorsPdfs.forEach((f: any) => {
              if (!targetPdfs.some((t: any) => t._id === f._id || t.fileName === f.fileName || t.originalname === f.originalname)) {
                otherPdfs.push(f);
              }
            });

            data.investorsPdfs = [...targetPdfs, ...otherPdfs];
          }`;

  const newSeqOrderReplacement = `          if (activeCategory.toLowerCase() === 'board meeting') {
            // Sequence:
            // 1. Prior intimation of Board Meeting_14.08.2026
            // 2. Outcome of Board Meeting_19.08.2026
            // 3. Prior Intimation of Board Meeting_07.09.2026
            // 4. Outcome of Board Meeting_11.09.2026
            // 5. OUTCOME OF BOARD MEETING_30.10.2026
            // 6. PRIOR INTIMATION OF BOARD MEETING_30.10.2026
            const seqOrder = [
              'Prior intimation of Board Meeting_14.08.2026',
              'Outcome of Board Meeting_19.08.2026',
              'Prior Intimation of Board Meeting_07.09.2026',
              'Outcome of Board Meeting_11.09.2026',
              'OUTCOME OF BOARD MEETING_30.10.2026',
              'PRIOR INTIMATION OF BOARD MEETING_30.10.2026'
            ];
            const targetPdfs: any[] = [];
            const otherPdfs: any[] = [];

            seqOrder.forEach((titleKey) => {
              const cleanKey = titleKey.replace(/\\.pdf$/i, '').trim().toLowerCase();
              const found = data.investorsPdfs.find((f: any) => {
                const normTitle = (f.title || '').replace(/\\.pdf$/i, '').trim().toLowerCase();
                const normName = (f.originalname || '').replace(/\\.pdf$/i, '').trim().toLowerCase();
                return normTitle === cleanKey || normName === cleanKey || normTitle.includes(cleanKey) || normName.includes(cleanKey);
              });
              if (
                found &&
                !targetPdfs.some(
                  (t: any) =>
                    (t._id && found._id && t._id === found._id) ||
                    (t.fileName && found.fileName && t.fileName === found.fileName) ||
                    (t.originalname && found.originalname && t.originalname.toLowerCase() === found.originalname.toLowerCase())
                )
              ) {
                targetPdfs.push(found);
              }
            });

            data.investorsPdfs.forEach((f: any) => {
              if (
                !targetPdfs.some(
                  (t: any) =>
                    (t._id && f._id && t._id === f._id) ||
                    (t.fileName && f.fileName && t.fileName === f.fileName) ||
                    (t.originalname && f.originalname && t.originalname.toLowerCase() === f.originalname.toLowerCase())
                )
              ) {
                otherPdfs.push(f);
              }
            });

            data.investorsPdfs = [...targetPdfs, ...otherPdfs];
          }`;

  if (content.includes(oldSeqOrderTarget)) {
    content = content.replace(oldSeqOrderTarget, newSeqOrderReplacement);
    console.log(`Updated seqOrder in ${path.basename(filePath)}`);
  } else {
    console.warn(`Could not find oldSeqOrderTarget in ${path.basename(filePath)}`);
  }

  if (isCRLF) {
    content = content.replace(/\n/g, '\r\n');
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

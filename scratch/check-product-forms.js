const fs = require('fs');
const path = require('path');

const files = [
  'src/app/contact/page.tsx',
  'src/app/franchise/page.tsx',
  'src/app/book-event/page.tsx',
  'src/app/career/page.tsx',
  'src/app/feedback/page.tsx',
  'src/app/connair/page.tsx',
  'src/app/connflix/page.tsx'
];

files.forEach(f => {
  const filePath = path.join(__dirname, '..', f);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const formMatches = content.match(/<form[\s\S]*?<\/form>/g);
    console.log(`=== File: ${f} ===`);
    console.log(`Number of forms: ${formMatches ? formMatches.length : 0}`);
    if (formMatches) {
      formMatches.forEach((form, idx) => {
        console.log(`Form ${idx+1} first 200 chars:`, form.substring(0, 300).replace(/\s+/g, ' '));
      });
    }
  } else {
    console.log(`File not found: ${f}`);
  }
});

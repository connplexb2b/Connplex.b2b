const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\admin\\.gemini\\antigravity\\brain\\23e3a89b-91e8-4f74-880a-d623fac5dbf3\\.system_generated\\steps\\1025\\content.md', 'utf8');

// Search for dt="something" or dt='something' or dt=something
const regexes = [
  /dt\s*=\s*['"]([^'"]+)['"]/gi,
  /pM\s*=\s*['"]([^'"]+)['"]/gi
];

regexes.forEach(regex => {
  let match;
  while ((match = regex.exec(content)) !== null) {
    console.log(`Matched: ${match[0]} (value: ${match[1]})`);
  }
});

// Also search for variables declared around index 697400
console.log("Snippet around 697000:");
console.log(content.slice(696800, 697400));

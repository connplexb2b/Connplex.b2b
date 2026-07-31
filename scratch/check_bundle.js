const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, '../temp_ticketing_bundle.js');
const content = fs.readFileSync(bundlePath, 'utf8');

const searchStr = "65bcde931e72aef23e6854ee";
if (content.includes(searchStr)) {
  console.log("Found cinemaId in bundle!");
  // Print 500 characters around it
  const idx = content.indexOf(searchStr);
  console.log(content.slice(idx - 100, idx + 400));
} else {
  console.log("NOT found in bundle!");
}

const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, '../temp_ticketing_bundle.js');
const content = fs.readFileSync(bundlePath, 'utf8');

// Let's search for "seatLayout" or look at the content around 2508000 to 2516000
const start = 2508000;
const end = 2516000;

console.log(`Length: ${content.length}`);
console.log(`Writing segment to scratch/segment.js...`);

fs.writeFileSync(path.join(__dirname, 'segment.js'), content.substring(start, end), 'utf8');
console.log("Done");

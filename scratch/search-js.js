const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, '../temp_ticketing_bundle.js');
const content = fs.readFileSync(bundlePath, 'utf8');

function findOccurrences(query) {
  let idx = 0;
  console.log(`\n=== Occurrences of "${query}": ===`);
  while ((idx = content.indexOf(query, idx)) !== -1) {
    const start = Math.max(0, idx - 150);
    const end = Math.min(content.length, idx + query.length + 150);
    console.log(`- Index ${idx}: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
    idx += query.length;
  }
}

findOccurrences("INIT_SEAT_BOOKING");
findOccurrences("ADD_SEATS");
findOccurrences("SET_SEATS");
findOccurrences("CANCEL_SEATS");

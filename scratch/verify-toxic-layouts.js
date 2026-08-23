const http = require('http');

const EXPECTED_SEATS = {
  "Connplex Luxuriance – Vaishnodevi, Ahmedabad": 18,
  "Connplex Luxuriance – Ahilyanagar": 20,
  "Connplex Luxuriance – Tribeca": 19,
  "Connplex Luxuriance – Adani Shantigram": 20,
  "Connplex Luxuriance – Mundhra": 12,
  "Connplex Luxuriance – Junagadh": 14,
  "Connplex Luxuriance – Mehsana": 20,
  "Connplex Luxuriance – Sangmner": 30,
  "Connplex Luxuriance – Gandhinagar": 22
};

function fetchGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data.substring(0, 100)}`));
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log("Checking Toxic HNI Seating Layouts...");
  console.log("--------------------------------------------------------------------------------");
  console.log(String("Location").padEnd(46) | "Expected" | "Actual" | "Status");
  console.log("--------------------------------------------------------------------------------");

  let allPassed = true;

  for (const [location, expected] of Object.entries(EXPECTED_SEATS)) {
    const url = `http://localhost:3000/api/proxy-layout?location=${encodeURIComponent(location)}&movie=${encodeURIComponent("Toxic Premier Nights")}&t=${Date.now()}`;
    
    try {
      const res = await fetchGet(url);
      if (!res || !res.layout) {
        console.log(`${location.padEnd(46)} | ${String(expected).padEnd(8)} | Error    | ❌ No layout returned`);
        allPassed = false;
        continue;
      }

      let availableCount = 0;
      let totalCount = 0;
      res.layout.forEach(row => {
        row.seats.forEach(seat => {
          if (!seat.isAisle) {
            totalCount++;
            if (!seat.isBooked) {
              availableCount++;
            }
          }
        });
      });

      const passed = (availableCount === expected);
      const statusSymbol = passed ? "✅ PASS" : "❌ FAIL";
      if (!passed) allPassed = false;

      console.log(
        `${location.padEnd(46)} | ` +
        `${String(expected).padEnd(8)} | ` +
        `${String(availableCount).padEnd(8)} | ` +
        `${statusSymbol}`
      );
    } catch (err) {
      console.log(`${location.padEnd(46)} | ${String(expected).padEnd(8)} | Error    | ❌ ${err.message}`);
      allPassed = false;
    }
  }

  console.log("--------------------------------------------------------------------------------");
  if (allPassed) {
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
    process.exit(0);
  } else {
    console.log("⚠️ SOME TESTS FAILED. Please check the counts above.");
    process.exit(1);
  }
}

run().catch(console.error);

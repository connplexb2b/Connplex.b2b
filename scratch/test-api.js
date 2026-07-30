const { NextRequest } = require('next/server');
// Wait, next/server is ESM or requires ts-node. 
// It's much simpler to run a local dev server, but we can write a test script that connects to the database
// and imports the helper functions isHniAllocationSeat and getPreconfiguredLayout to test their outputs directly.
// This doesn't need next/server or next context!

const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];

function isHniAllocationSeat(location, rowName, seatNumber) {
  const row = rowName.toUpperCase();
  if (location.includes("Adani")) {
    if (["C", "D", "E", "F", "G"].includes(row)) return true;
    if (row === "H" && seatNumber >= 1 && seatNumber <= 5) return true;
    return false;
  }
  if (location.includes("Parimal")) {
    return ["A", "B", "C", "D", "E", "F"].includes(row);
  }
  if (location.includes("Gandhinagar")) {
    return ["A", "B"].includes(row);
  }
  if (location.includes("Gota")) {
    return ["A", "B"].includes(row);
  }
  if (location.includes("Vadodara")) {
    return ["B", "C"].includes(row);
  }
  return false;
}

function getPreconfiguredLayout(location, dbBookedSeats) {
  const layout = [];
  if (location.includes("Adani")) {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (const r of rows) {
      const seats = [];
      for (let s = 1; s <= 9; s++) {
        if (s === 3 || s === 7) {
          seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        }
        const seatId = `${r}${s}`;
        const isHni = isHniAllocationSeat(location, r, s);
        let isBooked = false;
        if (!isHni) {
          isBooked = true;
        } else {
          isBooked = dbBookedSeats.has(seatId.toUpperCase());
        }
        seats.push({
          seatId,
          seatNumber: String(s),
          isBooked,
          isAisle: false
        });
      }
      layout.push({ rowName: r, seats });
    }
  } else if (location.includes("Parimal")) {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (const r of rows) {
      const seats = [];
      const seatCount = r === "F" ? 10 : 12;
      for (let s = 1; s <= seatCount; s++) {
        if (s === 4 || s === 9) {
          seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        }
        const seatId = `${r}${s}`;
        const isHni = isHniAllocationSeat(location, r, s);
        let isBooked = false;
        if (!isHni) {
          isBooked = true;
        } else {
          isBooked = dbBookedSeats.has(seatId.toUpperCase());
        }
        seats.push({
          seatId,
          seatNumber: String(s),
          isBooked,
          isAisle: false
        });
      }
      layout.push({ rowName: r, seats });
    }
  }
  return layout;
}

function test() {
  const dbBookedSeats = new Set(["F5", "F6", "H3"]);
  
  // Test Adani
  console.log("=== Testing Adani Layout ===");
  const adani = getPreconfiguredLayout("Connplex – Adani Shantigram, Ahmedabad", dbBookedSeats);
  let totalHni = 0;
  let totalBooked = 0;
  let totalSeats = 0;
  adani.forEach(row => {
    row.seats.forEach(s => {
      if (s.isAisle) return;
      totalSeats++;
      const isHni = isHniAllocationSeat("Connplex – Adani Shantigram, Ahmedabad", row.rowName, Number(s.seatNumber));
      if (isHni) totalHni++;
      if (s.isBooked) totalBooked++;
    });
  });
  console.log(`Total seats (excluding aisles): ${totalSeats}`);
  console.log(`HNI Allocation seats: ${totalHni} (expected 50)`);
  console.log(`Booked seats: ${totalBooked}`);

  // Test Parimal
  console.log("\n=== Testing Parimal Layout ===");
  const parimal = getPreconfiguredLayout("Connplex – Parimal Garden, Ahmedabad", dbBookedSeats);
  let totalHniP = 0;
  let totalBookedP = 0;
  let totalSeatsP = 0;
  parimal.forEach(row => {
    row.seats.forEach(s => {
      if (s.isAisle) return;
      totalSeatsP++;
      const isHni = isHniAllocationSeat("Connplex – Parimal Garden, Ahmedabad", row.rowName, Number(s.seatNumber));
      if (isHni) totalHniP++;
      if (s.isBooked) totalBookedP++;
    });
  });
  console.log(`Total seats (excluding aisles): ${totalSeatsP}`);
  console.log(`HNI Allocation seats: ${totalHniP} (expected 70)`);
  console.log(`Booked seats: ${totalBookedP}`);
}

test();

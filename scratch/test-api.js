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
    const rows = ["H", "G", "F", "E", "D", "C", "B", "A"];
    for (const r of rows) {
      const seats = [];
      if (r === "H") {
        for (let s = 1; s <= 5; s++) {
          const seatId = `${r}${s}`;
          const isBooked = dbBookedSeats.has(seatId.toUpperCase());
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 6; s <= 8; s++) {
          const seatId = `${r}${s}`;
          seats.push({ seatId, seatNumber: String(s), isBooked: true, isAisle: false });
        }
      } else if (["C", "D", "E", "F", "G"].includes(r)) {
        for (let s = 1; s <= 6; s++) {
          const seatId = `${r}${s}`;
          const isBooked = dbBookedSeats.has(seatId.toUpperCase());
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 7; s <= 9; s++) {
          const seatId = `${r}${s}`;
          const isBooked = dbBookedSeats.has(seatId.toUpperCase());
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else {
        for (let s = 1; s <= 5; s++) {
          const seatId = `${r}${s}`;
          seats.push({ seatId, seatNumber: String(s), isBooked: true, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 6; s <= 10; s++) {
          const seatId = `${r}${s}`;
          seats.push({ seatId, seatNumber: String(s), isBooked: true, isAisle: false });
        }
      }
      layout.push({ rowName: r, seats });
    }
  } else if (location.includes("Parimal")) {
    const rows = ["I", "H", "G", "F", "E", "D", "C", "B", "A"];
    for (const r of rows) {
      const seats = [];
      if (r === "I") {
        for (let s = 1; s <= 6; s++) {
          const seatId = `${r}${s}`;
          seats.push({ seatId, seatNumber: String(s), isBooked: true, isAisle: false });
        }
        for (let a = 0; a < 6; a++) {
          seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        }
        for (let s = 7; s <= 10; s++) {
          const seatId = `${r}${s}`;
          seats.push({ seatId, seatNumber: String(s), isBooked: true, isAisle: false });
        }
      } else if (r === "A") {
        for (let s = 1; s <= 7; s++) {
          const seatId = `${r}${s}`;
          const isBooked = dbBookedSeats.has(seatId.toUpperCase());
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 8; s <= 9; s++) {
          const seatId = `${r}${s}`;
          const isBooked = dbBookedSeats.has(seatId.toUpperCase());
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 10; s <= 14; s++) {
          const seatId = `${r}${s}`;
          const isBooked = dbBookedSeats.has(seatId.toUpperCase());
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else if (r === "D") {
        for (let s = 1; s <= 7; s++) {
          const seatId = `${r}${s}`;
          const isBooked = dbBookedSeats.has(seatId.toUpperCase());
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        for (let a = 0; a < 9; a++) {
          seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        }
      } else {
        for (let s = 1; s <= 7; s++) {
          const seatId = `${r}${s}`;
          const isHni = ["B", "C", "E", "F"].includes(r);
          let isBooked = false;
          if (!isHni) {
            isBooked = true;
          } else {
            isBooked = dbBookedSeats.has(seatId.toUpperCase());
          }
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        for (let a = 0; a < 4; a++) {
          seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        }
        for (let s = 8; s <= 12; s++) {
          const seatId = `${r}${s}`;
          const isHni = ["B", "C", "E", "F"].includes(r);
          let isBooked = false;
          if (!isHni) {
            isBooked = true;
          } else {
            isBooked = dbBookedSeats.has(seatId.toUpperCase());
          }
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      }
      layout.push({ rowName: r, seats });
    }
  } else if (location.includes("Gota")) {
    const rows = ["G", "F", "E", "D", "C", "B", "A"];
    for (const r of rows) {
      const seats = [];
      if (r === "G") {
        for (let s = 1; s <= 5; s++) {
          const seatId1 = `${r}${s}a`;
          const seatId2 = `${r}${s}b`;
          seats.push({ seatId: seatId1, seatNumber: String(s), isBooked: true, isAisle: false });
          seats.push({ seatId: seatId2, seatNumber: String(s), isBooked: true, isAisle: false });
          if (s < 5) {
            seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
          }
        }
      } else {
        for (let s = 1; s <= 9; s++) {
          const seatId = `${r}${s}`;
          const isHni = ["A", "B"].includes(r);
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
      }
      layout.push({ rowName: r, seats });
    }
  } else if (location.includes("Vadodara")) {
    const rows = ["I", "H", "G", "F", "E", "D", "C", "B", "A"];
    for (const r of rows) {
      const seats = [];
      const isHni = ["B", "C"].includes(r);

      if (r === "I") {
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 4; s <= 8; s++) {
          const seatId = `${r}${s}`;
          seats.push({ seatId, seatNumber: String(s), isBooked: true, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 9; s <= 12; s++) {
          const seatId = `${r}${s}`;
          seats.push({ seatId, seatNumber: String(s), isBooked: true, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
      } else if (r === "H") {
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 4; s <= 6; s++) {
          const seatId = `${r}${s}`;
          seats.push({ seatId, seatNumber: String(s), isBooked: true, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 7; s <= 9; s++) {
          const seatId = `${r}${s}`;
          seats.push({ seatId, seatNumber: String(s), isBooked: true, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
      } else if (["G", "F"].includes(r)) {
        {
          const seatId = `${r}3`;
          seats.push({ seatId, seatNumber: "3", isBooked: true, isAisle: false });
        }
        for (let s = 4; s <= 6; s++) {
          const seatId = `${r}${s}`;
          seats.push({ seatId, seatNumber: String(s), isBooked: true, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 7; s <= 9; s++) {
          const seatId = `${r}${s}`;
          seats.push({ seatId, seatNumber: String(s), isBooked: true, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
      } else if (["E", "D", "C", "B"].includes(r)) {
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 4; s <= 8; s++) {
          const seatId = `${r}${s}`;
          let isBooked = false;
          if (!isHni) {
            isBooked = true;
          } else {
            isBooked = dbBookedSeats.has(seatId.toUpperCase());
          }
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 9; s <= 14; s++) {
          const seatId = `${r}${s}`;
          let isBooked = false;
          if (!isHni) {
            isBooked = true;
          } else {
            isBooked = dbBookedSeats.has(seatId.toUpperCase());
          }
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else if (r === "A") {
        {
          const seatId = `${r}3`;
          seats.push({ seatId, seatNumber: "3", isBooked: true, isAisle: false });
        }
        for (let s = 4; s <= 8; s++) {
          const seatId = `${r}${s}`;
          seats.push({ seatId, seatNumber: String(s), isBooked: true, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 9; s <= 12; s++) {
          const seatId = `${r}${s}`;
          seats.push({ seatId, seatNumber: String(s), isBooked: true, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
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
  console.log(`HNI Allocation seats: ${totalHniP} (expected 69)`);
  console.log(`Booked seats: ${totalBookedP}`);

  // Test Gota
  console.log("\n=== Testing Gota Layout ===");
  const gota = getPreconfiguredLayout("Connplex – Gota, Ahmedabad", dbBookedSeats);
  let totalHniG = 0;
  let totalBookedG = 0;
  let totalSeatsG = 0;
  gota.forEach(row => {
    row.seats.forEach(s => {
      if (s.isAisle) return;
      totalSeatsG++;
      const isHni = isHniAllocationSeat("Connplex – Gota, Ahmedabad", row.rowName, Number(s.seatNumber));
      if (isHni) totalHniG++;
      if (s.isBooked) totalBookedG++;
    });
  });
  console.log(`Total seats (excluding aisles): ${totalSeatsG}`);
  console.log(`HNI Allocation seats: ${totalHniG} (expected 18)`);
  console.log(`Booked seats: ${totalBookedG}`);

  // Test Vadodara
  console.log("\n=== Testing Vadodara Layout ===");
  const vadodara = getPreconfiguredLayout("Connplex – Vadodara", dbBookedSeats);
  let totalHniV = 0;
  let totalBookedV = 0;
  let totalSeatsV = 0;
  vadodara.forEach(row => {
    row.seats.forEach(s => {
      if (s.isAisle) return;
      totalSeatsV++;
      const isHni = isHniAllocationSeat("Connplex – Vadodara", row.rowName, Number(s.seatNumber));
      if (isHni) totalHniV++;
      if (s.isBooked) totalBookedV++;
    });
  });
  console.log(`Total seats (excluding aisles): ${totalSeatsV}`);
  console.log(`HNI Allocation seats: ${totalHniV} (expected 22)`);
  console.log(`Booked seats: ${totalBookedV}`);
}

test();

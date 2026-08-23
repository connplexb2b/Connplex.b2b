import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

const BACKEND_MAP: Record<string, { cinemaId: string; movieId: string; regionId: string; targetTime: string }> = {
  "Connplex – Parimal Garden, Ahmedabad": {
    cinemaId: "65bcde931e72aef23e6854ee",
    movieId: "6a5ba6c9bb1d9a7721b13eca",
    regionId: "64da17939cdcb529a693aac2",
    targetTime: "9:00 PM"
  },
  "Connplex – Adani Shantigram, Ahmedabad": {
    cinemaId: "6a15837a2585fc9aa9c18b22",
    movieId: "6a5ba6c9bb1d9a7721b13eca",
    regionId: "64da17939cdcb529a693aac2",
    targetTime: "9:00 PM"
  },
  "Connplex – Gota, Ahmedabad": {
    cinemaId: "664746aabddbaefe64f57506",
    movieId: "6a5ba6c9bb1d9a7721b13eca",
    regionId: "64da17939cdcb529a693aac2",
    targetTime: "8:00 PM"
  },
  "Connplex – Gandhinagar": {
    cinemaId: "661667b087618af0798f1130",
    movieId: "6a5ba85abb1d9a7721caff44",
    regionId: "65c1e04065d1f285d0032933",
    targetTime: "8:00 PM"
  },
  "Connplex – Vadodara": {
    cinemaId: "67da83c720709248d1509053",
    movieId: "6a5ba985bb1d9a7721cccb0e",
    regionId: "67da8522ce556ac55f26e704",
    targetTime: "9:10 PM"
  }
};

function isHniAllocationSeat(location: string, rowName: string, seatNumber: number): boolean {
  const row = rowName.toUpperCase();
  if (location.includes("Adani")) {
    // Rows C–G & H (Seats 1–5)
    if (["C", "D", "E", "F", "G"].includes(row)) {
      return true;
    }
    if (row === "H" && seatNumber >= 1 && seatNumber <= 5) {
      return true;
    }
    return false;
  }
  if (location.includes("Parimal")) {
    // Rows A–F
    return ["A", "B", "C", "D", "E", "F"].includes(row);
  }
  if (location.includes("Gandhinagar")) {
    // Rows A & B (Couple Seats)
    return ["A", "B"].includes(row);
  }
  if (location.includes("Gota")) {
    // Rows A & B
    return ["A", "B"].includes(row);
  }
  if (location.includes("Vadodara")) {
    // Rows B & C
    return ["B", "C"].includes(row);
  }
  return false;
}

function getPreconfiguredLayout(location: string, dbBookedSeats: Set<string>): any[] {
  const layout: any[] = [];
  if (location.includes("Adani")) {
    // Rows A-H.
    // Row H: 5 seats (1-5), aisle, aisle, 3 seats (6-8)
    // Rows C-G: 6 seats (1-6), aisle, 3 seats (7-9)
    // Rows A-B: 5 seats (1-5), aisle, 5 seats (6-10)
    const rows = ["H", "G", "F", "E", "D", "C", "B", "A"];
    for (const r of rows) {
      const seats: any[] = [];
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
    // Rows A-I.
    // Row I: 6 seats, 6 aisles, 4 seats
    // Row H, G, F, E, C, B: 7 seats, 4 aisles, 5 seats
    // Row D: 7 seats, 9 aisles
    // Row A: 7 seats, 1 aisle, 2 seats (8-9), 1 aisle, 5 seats (10-14)
    const rows = ["I", "H", "G", "F", "E", "D", "C", "B", "A"];
    for (const r of rows) {
      const seats: any[] = [];
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
  } else if (location.includes("Gandhinagar")) {
    // Rows A-F.
    // Rows B-F: 2 empty aisles (columns 1, 2), then 8 seats (3-10).
    // Row A: 10 seats (1-10).
    // HNI seats: Rows A & B
    const rows = ["F", "E", "D", "C", "B", "A"];
    for (const r of rows) {
      const seats: any[] = [];
      if (r === "A") {
        for (let s = 1; s <= 10; s++) {
          const seatId = `${r}${s}`;
          const isBooked = dbBookedSeats.has(seatId.toUpperCase());
          seats.push({
            seatId,
            seatNumber: String(s),
            isBooked,
            isAisle: false
          });
        }
      } else {
        // Rows B-F
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 3; s <= 10; s++) {
          const seatId = `${r}${s}`;
          const isHni = ["B"].includes(r);
          let isBooked = false;
          if (!isHni) {
            isBooked = true; // Block public seats on HNI page
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
  } else if (location.includes("Gota")) {
    // Rows A-G.
    // Rows A-F: 9 seats (1-9)
    // Row G: 5 couple seats (1-5)
    // HNI seats: Rows A & B
    const rows = ["G", "F", "E", "D", "C", "B", "A"];
    for (const r of rows) {
      const seats: any[] = [];
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
            isBooked = true; // Block public seats on HNI page
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
    // Rows A-I.
    // Row I: aisle, seats 4-8, aisle, seats 9-12, 2 aisles
    // Row H: aisle, seats 4-6, 2 aisles, aisle, 2 aisles, seats 7-9, 1 aisle
    // Rows G, F: seat 3, seats 4-6, 2 aisles, aisle, 2 aisles, seats 7-9, 1 aisle
    // Rows E, D, C, B: aisle, seats 4-8, aisle, seats 9-14
    // Row A: seat 3, seats 4-8, aisle, seats 9-12, 2 aisles
    // HNI seats: Rows B & C
    const rows = ["I", "H", "G", "F", "E", "D", "C", "B", "A"];
    for (const r of rows) {
      const seats: any[] = [];
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
  } else {
    // Default fallback
    const rows = ["A", "B", "C", "D", "E", "F"];
    for (const r of rows) {
      const seats: any[] = [];
      for (let s = 1; s <= 10; s++) {
        if (s === 3 || s === 9) {
          seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        }
        const seatId = `${r}${s}`;
        const isBooked = dbBookedSeats.has(seatId.toUpperCase());
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

function isHniSeatForToxic(location: string, rowName: string, seatNumber: number): boolean {
  const locUpper = location.toUpperCase();
  const row = rowName.toUpperCase();
  const seat = seatNumber;

  if (locUpper.includes("VAISHNODEVI")) {
    return ["D", "E"].includes(row);
  }
  if (locUpper.includes("AHILYANAGAR")) {
    return ["A", "B"].includes(row);
  }
  if (locUpper.includes("TRIBECA")) {
    return ["D", "E"].includes(row);
  }
  if (locUpper.includes("ADANI")) {
    return ["E", "F"].includes(row);
  }
  if (locUpper.includes("MUNDHRA") || locUpper.includes("MUNDRA")) {
    return row === "D";
  }
  if (locUpper.includes("JUNAGADH")) {
    return ["F", "G"].includes(row);
  }
  if (locUpper.includes("MEHSANA") || locUpper.includes("MAHESANA")) {
    return ["E", "F"].includes(row);
  }
  if (locUpper.includes("SANGMNER") || locUpper.includes("SANGAMNER")) {
    return ["G", "H"].includes(row);
  }
  if (locUpper.includes("GANDHINAGAR")) {
    return ["E", "F"].includes(row);
  }
  return false;
}

function getHniEventLayout(location: string, movie: string, dbBookedSeats: Set<string>): any[] {
  const layout: any[] = [];
  const locUpper = location.toUpperCase();
  const isToxic = movie === "Toxic Premier Nights" || movie === "Toxic premier nights";

  if (locUpper.includes("VAISHNODEVI")) {
    // Custom Vaishnodevi layout matching the physical layout exactly:
    // Rows: A, B, C, D, E (RECLINER category)
    const rows = ["A", "B", "C", "D", "E"];
    for (const r of rows) {
      const seats: any[] = [];
      const category = "RECLINER";

      if (r === "A") {
        // Row A: Left 6, aisle, Right 5 (1-11)
        for (let s = 1; s <= 6; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 7; s <= 11; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else {
        // Rows B, C, D, E: Left 5, aisle, Right 4 (1-9)
        for (let s = 1; s <= 5; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 6; s <= 9; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      }

      layout.push({ rowName: r, category, seats });
    }

    return layout;
  }

  if (locUpper.includes("AHILYANAGAR")) {
    // Custom Ahilyanagar layout matching the physical layout exactly:
    // Rows: F, E, D, C, B, A (from top to bottom)
    // Category: COUPLE RECLINER for all rows
    const rows = ["F", "E", "D", "C", "B", "A"];
    for (const r of rows) {
      const seats: any[] = [];
      const category = "COUPLE RECLINER";

      // 5 couple seats per row: Left 2, Right 3 (seats 1-5, split into a/b)
      for (let s = 1; s <= 2; s++) {
        const seatId = `${r}${s}`;
        const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
        const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
        seats.push({ seatId: `${r}${s}a`, seatNumber: String(s), isBooked, isAisle: false });
        seats.push({ seatId: `${r}${s}b`, seatNumber: String(s), isBooked, isAisle: false });
      }
      seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
      for (let s = 3; s <= 5; s++) {
        const seatId = `${r}${s}`;
        const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
        const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
        seats.push({ seatId: `${r}${s}a`, seatNumber: String(s), isBooked, isAisle: false });
        seats.push({ seatId: `${r}${s}b`, seatNumber: String(s), isBooked, isAisle: false });
      }

      layout.push({ rowName: r, category, seats });
    }

    return layout;
  }

  if (locUpper.includes("ADANI")) {
    // Custom Adani Shantigram layout matching the physical layout exactly:
    // Rows: A, B, C, D, E, F (COUPLE LOUNGER category)
    const rows = ["A", "B", "C", "D", "E", "F"];
    for (const r of rows) {
      const seats: any[] = [];
      const category = "COUPLE LOUNGER";

      if (["A", "B"].includes(r)) {
        // Rows A, B: 6 couple seats with aisle (3 left, aisle, 3 right)
        for (let s = 1; s <= 3; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId: `${r}${s}a`, seatNumber: String(s), isBooked, isAisle: false });
          seats.push({ seatId: `${r}${s}b`, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 4; s <= 6; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId: `${r}${s}a`, seatNumber: String(s), isBooked, isAisle: false });
          seats.push({ seatId: `${r}${s}b`, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else {
        // Rows C, D, E, F: 5 couple seats with aisle (2 left, aisle, 3 right)
        for (let s = 1; s <= 2; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId: `${r}${s}a`, seatNumber: String(s), isBooked, isAisle: false });
          seats.push({ seatId: `${r}${s}b`, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 3; s <= 5; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId: `${r}${s}a`, seatNumber: String(s), isBooked, isAisle: false });
          seats.push({ seatId: `${r}${s}b`, seatNumber: String(s), isBooked, isAisle: false });
        }
      }

      layout.push({ rowName: r, category, seats });
    }

    return layout;
  }

  if (locUpper.includes("TRIBECA")) {
    // Custom Tribeca layout matching the physical layout exactly:
    // Rows: A, B, C, D, E (RECLINER category)
    const rows = ["A", "B", "C", "D", "E"];
    for (const r of rows) {
      const seats: any[] = [];
      const category = "RECLINER";

      if (r === "A") {
        // Row A: Left 5, aisle, Middle 2, aisle, Right 4 (1-11)
        for (let s = 1; s <= 5; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 6; s <= 7; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 8; s <= 11; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else if (["B", "C", "E"].includes(r)) {
        // Rows B, C, E: Left 6, aisle, Right 4 (1-10)
        for (let s = 1; s <= 6; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 7; s <= 10; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else if (r === "D") {
        // Row D: Left 6, aisle, Right 3 (1-9)
        for (let s = 1; s <= 6; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 7; s <= 9; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      }

      layout.push({ rowName: r, category, seats });
    }

    return layout;
  }

  if (locUpper.includes("GANDHINAGAR")) {
    // Custom Gandhinagar layout matching the physical layout exactly:
    // Rows: A, B, C, D, E, F (MILLER category)
    // Row G (COUPLE LOUNGER category)
    const rows = ["A", "B", "C", "D", "E", "F"];
    for (const r of rows) {
      const seats: any[] = [];
      const category = "MILLER";

      if (r === "A") {
        // Row A: 12 seats continuously (1-12)
        for (let s = 1; s <= 12; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else if (["B", "C", "D"].includes(r)) {
        // Rows B, C, D: 6 seats, aisle, 4 seats (1-10)
        for (let s = 1; s <= 6; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 7; s <= 10; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else {
        // Rows E, F: 6 seats, aisle, 5 seats (1-11)
        for (let s = 1; s <= 6; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 7; s <= 11; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      }
      layout.push({ rowName: r, category, seats });
    }

    // Add Couple Lounger Row G
    {
      const r = "G";
      const seats: any[] = [];
      for (let s = 1; s <= 3; s++) {
        seats.push({ seatId: `${r}${s}a`, seatNumber: String(s), isBooked: true, isAisle: false });
        seats.push({ seatId: `${r}${s}b`, seatNumber: String(s), isBooked: true, isAisle: false });
      }
      seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
      for (let s = 4; s <= 6; s++) {
        seats.push({ seatId: `${r}${s}a`, seatNumber: String(s), isBooked: true, isAisle: false });
        seats.push({ seatId: `${r}${s}b`, seatNumber: String(s), isBooked: true, isAisle: false });
      }
      layout.push({ rowName: "G", category: "COUPLE LOUNGER", seats });
    }

    return layout;
  }

  if (locUpper.includes("MEHSANA") || locUpper.includes("MAHESANA")) {
    // Custom Mehsana layout matching the physical layout exactly:
    // Sofa Slider Plus: Rows A, B, C, D
    // Miller: Rows E, F
    // Lounger: Row G
    const rows = ["A", "B", "C", "D", "E", "F", "G"];
    for (const r of rows) {
      const seats: any[] = [];
      const category = ["A", "B", "C", "D"].includes(r)
        ? "SOFA SLIDER PLUS"
        : ["E", "F"].includes(r)
        ? "MILLER"
        : "LOUNGER";

      if (r === "A") {
        // Row A: Left 6, seat 7 in middle, Right 6 (13 seats total)
        for (let s = 1; s <= 6; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        {
          const seatId = `${r}7`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, 7) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: "7", isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 8; s <= 13; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else if (["B", "C", "D", "F"].includes(r)) {
        // Rows B, C, D, F: Left 5, aisle, Right 6 (11 seats total)
        for (let s = 1; s <= 5; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 6; s <= 11; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else if (r === "E") {
        // Row E: Left 4, aisle, Right 5 (9 seats total)
        for (let s = 1; s <= 4; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 5; s <= 9; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else if (r === "G") {
        // Row G: Left 5, aisle, Right 5 (10 seats total)
        for (let s = 1; s <= 5; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 6; s <= 10; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      }

      layout.push({ rowName: r, category, seats });
    }

    return layout;
  }

  if (locUpper.includes("JUNAGADH")) {
    // Custom Junagadh layout matching the physical layout exactly:
    // Sofa Slider: Rows A, B, C, D, E, F, G
    // Lounger: Row H
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (const r of rows) {
      const seats: any[] = [];
      const category = r === "H" ? "LOUNGER" : "SOFA SLIDER";

      if (r === "A") {
        // Row A: Left 6, Right 1 (1-6, aisle, 7)
        for (let s = 1; s <= 6; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        {
          const seatId = `${r}7`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, 7) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: "7", isBooked, isAisle: false });
        }
      } else if (["B", "C", "D", "E", "F", "G"].includes(r)) {
        // Rows B-G: Left 4, aisle, Right 3 (1-7)
        for (let s = 1; s <= 4; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 5; s <= 7; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else if (r === "H") {
        // Row H: Left 3, aisle, Right 3 (1-6)
        for (let s = 1; s <= 3; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 4; s <= 6; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      }

      layout.push({ rowName: r, category, seats });
    }

    return layout;
  }

  if (locUpper.includes("MUNDHRA") || locUpper.includes("MUNDRA")) {
    // Custom Mundhra layout matching the physical layout exactly:
    // Rows: A, B, C, D (COUPLE LOUNGER category)
    const rows = ["A", "B", "C", "D"];
    for (const r of rows) {
      const seats: any[] = [];
      const category = "COUPLE LOUNGER";

      if (r === "A") {
        // Row A: 7 couple seats continuously (1-7)
        for (let s = 1; s <= 7; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId: `${r}${s}a`, seatNumber: String(s), isBooked, isAisle: false });
          seats.push({ seatId: `${r}${s}b`, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else {
        // Rows B, C, D: 6 couple seats with aisle (3 left, aisle, 3 right)
        for (let s = 1; s <= 3; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId: `${r}${s}a`, seatNumber: String(s), isBooked, isAisle: false });
          seats.push({ seatId: `${r}${s}b`, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 4; s <= 6; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId: `${r}${s}a`, seatNumber: String(s), isBooked, isAisle: false });
          seats.push({ seatId: `${r}${s}b`, seatNumber: String(s), isBooked, isAisle: false });
        }
      }

      layout.push({ rowName: r, category, seats });
    }

    return layout;
  }

  if (locUpper.includes("SANGMNER") || locUpper.includes("SANGAMNER")) {
    // Custom Sangamner layout matching the physical layout exactly:
    // Rows: A (RECLINER)
    // Rows: B, C, D, E, F, G, H (MILLER)
    // Row: I (LOUNGER)
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    for (const r of rows) {
      const seats: any[] = [];
      const category = r === "A"
        ? "RECLINER"
        : r === "I"
        ? "LOUNGER"
        : "MILLER";

      if (r === "A") {
        // Row A: Left 14, aisle, Right 2 (1-16)
        for (let s = 1; s <= 14; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 15; s <= 16; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else if (r === "I") {
        // Row I: Left 7, aisle, Right 6 (1-13)
        for (let s = 1; s <= 7; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 8; s <= 13; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else {
        // Rows B-H: Left 8, aisle, Right 7 (1-15)
        for (let s = 1; s <= 8; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 9; s <= 15; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      }

      layout.push({ rowName: r, category, seats });
    }

    return layout;
  }

  // Large screen locations:
  const isLarge = ["VAISHNODEVI", "RAJKOT", "VADODARA", "ADANI", "TRIBECA", "MPM MALL", "PRAHLADNAGAR", "JAGDALPUR"].some(name => locUpper.includes(name));
  
  // Medium screen locations:
  const isMedium = ["KANKARBAGH", "SIWAN", "BHAGALPUR", "MUZAFFARPUR", "SOLAPUR", "DARBHNGA", "DARBHANGA", "GANDHINAGAR", "BILASPUR", "SANGMNER", "SANGAMNER", "JUNAGADH", "MUNDHRA", "MUNDRA", "MEHSANA", "MAHESANA"].some(name => locUpper.includes(name));

  if (isLarge) {
    // 10 rows: J (top) to A (bottom) (Jagdalpur has 11 rows: K to A)
    const rows = locUpper.includes("JAGDALPUR")
      ? ["K", "J", "I", "H", "G", "F", "E", "D", "C", "B", "A"]
      : ["J", "I", "H", "G", "F", "E", "D", "C", "B", "A"];
    for (const r of rows) {
      const seats: any[] = [];
      const category = ["K", "J", "I", "H"].includes(r) ? "Premium Recliner" : ["G", "F", "E", "D"].includes(r) ? "Executive" : "Normal";

      if (["K", "J", "I", "H"].includes(r)) {
        // Recliners: 10 seats (1-3, aisle, 4-7, aisle, 8-10)
        for (let s = 1; s <= 3; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 4; s <= 7; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 8; s <= 10; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else {
        // Normal/Executive: 14 seats (1-4, aisle, 5-10, aisle, 11-14)
        for (let s = 1; s <= 4; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 5; s <= 10; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 11; s <= 14; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      }
      layout.push({ rowName: r, category, seats });
    }
  } else if (isMedium) {
    // 8 rows: H (top) to A (bottom)
    const rows = ["H", "G", "F", "E", "D", "C", "B", "A"];
    for (const r of rows) {
      const seats: any[] = [];
      const category = ["H", "G"].includes(r) ? "Premium Recliner" : ["F", "E", "D"].includes(r) ? "Executive" : "Normal";

      if (["H", "G"].includes(r)) {
        if (locUpper.includes("SANGMNER") || locUpper.includes("SANGAMNER")) {
          // Sangmner has 15 seats per row in H and G to get 30 seats total
          for (let s = 1; s <= 15; s++) {
            const seatId = `${r}${s}`;
            const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
            const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
            seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
          }
        } else {
          // Recliners: 8 seats (1-2, aisle, 3-6, aisle, 7-8)
          for (let s = 1; s <= 2; s++) {
            const seatId = `${r}${s}`;
            const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
            const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
            seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
          }
          seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
          for (let s = 3; s <= 6; s++) {
            const seatId = `${r}${s}`;
            const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
            const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
            seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
          }
          seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
          for (let s = 7; s <= 8; s++) {
            const seatId = `${r}${s}`;
            const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
            const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
            seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
          }
        }
      } else {
        // Normal/Executive: 12 seats (1-3, aisle, 4-9, aisle, 10-12)
        for (let s = 1; s <= 3; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 4; s <= 9; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 10; s <= 12; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      }
      layout.push({ rowName: r, category, seats });
    }
  } else {
    // Boutique layout (default fallback for remaining locations)
    // 6 rows: F (top) to A (bottom)
    const rows = ["F", "E", "D", "C", "B", "A"];
    for (const r of rows) {
      const seats: any[] = [];
      const category = ["F"].includes(r) ? "Premium Recliner" : ["E", "D", "C"].includes(r) ? "Executive" : "Normal";

      if (r === "F") {
        // Recliners: 6 seats (1-2, aisle, 3-4, aisle, 5-6)
        for (let s = 1; s <= 2; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 3; s <= 4; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 5; s <= 6; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      } else {
        // Normal/Executive: 10 seats (1-2, aisle, 3-8, aisle, 9-10)
        for (let s = 1; s <= 2; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 3; s <= 8; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
        seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        for (let s = 9; s <= 10; s++) {
          const seatId = `${r}${s}`;
          const isHni = isToxic ? isHniSeatForToxic(location, r, s) : true;
          const isBooked = isHni ? dbBookedSeats.has(seatId.toUpperCase()) : true;
          seats.push({ seatId, seatNumber: String(s), isBooked, isAisle: false });
        }
      }
      layout.push({ rowName: r, category, seats });
    }
  }
  return layout;
}

function getHniEventLayoutPlaceholder(location: string, dbBookedSeats: Set<string>): any[] {
  // placeholder since we renamed it
  return [];
}

// Re-evaluate entry in GET route to call getHniEventLayout with movie parameter:
const dummyPlaceholder = 0;


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");
    if (!location) {
      return NextResponse.json({ fallback: true });
    }

    const movie = searchParams.get("movie") || "Spider-Man";
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    // 1. Fetch bookings from MongoDB
    let dbBookedSeats = new Set<string>();
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (db) {
        const query: any = {
          $or: [
            {
              location: location,
              movie: movie,
              status: "Paid",
              ...(date ? { date } : {}),
              ...(time ? { time } : {})
            },
            {
              "payload.location": location,
              "payload.movie": movie,
              "payload.status": "Paid",
              ...(date ? { "payload.date": date } : {}),
              ...(time ? { "payload.time": time } : {})
            }
          ]
        };

        const dbBookings = await db.collection("hnibookings").find(query).toArray();
        dbBookings.forEach((b: any) => {
          const bookingData = b.payload ? b.payload : b;
          if (Array.isArray(bookingData.seats)) {
            bookingData.seats.forEach((seat: string) => {
              let normalizedSeat = seat.trim().toUpperCase();
              // Normalize formats like "Row A - Seat 5" to "A5"
              const match = normalizedSeat.match(/ROW\s+([A-Z])\s*-\s*SEAT\s+(\d+)/);
              if (match) {
                normalizedSeat = match[1] + match[2];
              }
              dbBookedSeats.add(normalizedSeat);
            });
          }
        });
      }
    } catch (dbErr) {
      console.error("Database fetch error in proxy-layout:", dbErr);
    }

    if (movie === "Toxic Premier Nights" || movie === "Toxic premier nights" || movie === "HNI Premiere Night" || movie === "Premier Night" || !BACKEND_MAP[location]) {
      // Return custom layout directly if location is unknown or if it's the new premier night event
      const layout = getHniEventLayout(location, movie, dbBookedSeats);
      return NextResponse.json({ fallback: false, layout });
    }

    const { cinemaId, movieId, regionId, targetTime } = BACKEND_MAP[location];
    const showDate = "2026-08-01"; // Saturday (1st Aug)

    const idValue = `${movieId}|${showDate}|${regionId}`;
    const payload = `id=${encodeURIComponent(idValue)}&timestamp=${Date.now()}`;

    // 2. Fetch show timings
    let showsData: any = null;
    try {
      const showsRes = await fetch("https://backend.theconnplex.com/api/movie-detils-with-shows", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Device-Type": "web",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        body: payload
      });

      if (showsRes.ok) {
        showsData = await showsRes.json();
      }
    } catch (e) {
      console.error("Failed to fetch show timings:", e);
    }

    if (!showsData || showsData.status !== 200 || !showsData.data) {
      // If backend API fails, use pre-configured layouts
      const layout = getPreconfiguredLayout(location, dbBookedSeats);
      return NextResponse.json({ fallback: false, layout });
    }

    const cinemas = showsData.data.cinemas || showsData.data || [];
    const cinema = cinemas.find((c: any) => (c._id || c.cId) === cinemaId);

    if (!cinema || !cinema.sessions || cinema.sessions.length === 0) {
      const layout = getPreconfiguredLayout(location, dbBookedSeats);
      return NextResponse.json({ fallback: false, layout });
    }

    // Find matching session
    let session = cinema.sessions.find((s: any) => {
      const showTime = new Date(s.sessionRealShow).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });
      return showTime.replace(/\s+/g, ' ').toLowerCase() === targetTime.toLowerCase();
    });

    if (!session) {
      session = cinema.sessions[0];
    }

    // 3. Fetch seat layout
    let layoutData: any = null;
    try {
      const layoutRes = await fetch(`https://backend.theconnplex.com/api/seat-layout/${cinemaId}/${session.sessionId}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "X-Device-Type": "web"
        }
      });

      if (layoutRes.ok) {
        layoutData = await layoutRes.json();
      }
    } catch (e) {
      console.error("Failed to fetch layout from backend:", e);
    }

    if (!layoutData || layoutData.status !== 200 || !layoutData.data) {
      const layout = getPreconfiguredLayout(location, dbBookedSeats);
      return NextResponse.json({ fallback: false, layout });
    }

    // Process layout data to simple format
    const categories = layoutData.data.data || layoutData.data || [];
    const category = categories[0];
    
    if (!category || !category.rowData) {
      const layout = getPreconfiguredLayout(location, dbBookedSeats);
      return NextResponse.json({ fallback: false, layout });
    }

    // Process layout while applying HNI restriction rules
    const layout = category.rowData.map((row: any) => {
      const rowName = row.strRowPhyID || row.strRowPhyId;
      return {
        rowName,
        seats: row.seatData.map((seat: any) => {
          const isAisle = !seat.Key;
          if (isAisle) {
            return {
              seatId: "",
              seatNumber: "",
              isBooked: false,
              isAisle: true
            };
          }
          const seatNumber = Number(seat.strSeatNumber);
          const seatId = `${rowName}${seat.strSeatNumber}`;
          
          const isHni = isHniAllocationSeat(location, rowName, seatNumber);
          let isBooked = false;
          if (!isHni) {
            // Force block all public seats on HNI
            isBooked = true;
          } else {
            // HNI seats are booked if booked on ticketing website or in local db
            isBooked = seat.strSeatStatus === "1" || dbBookedSeats.has(seatId.toUpperCase());
          }

          return {
            seatId,
            seatNumber: seat.strSeatNumber,
            isBooked,
            isAisle: false
          };
        })
      };
    });

    return NextResponse.json({ fallback: false, layout });
  } catch (error: any) {
    console.error("Layout proxy error:", error);
    return NextResponse.json({ fallback: true, error: error.message });
  }
}

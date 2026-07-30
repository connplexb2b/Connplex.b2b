import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";

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
    // Rows A-H, 9 seats per row.
    // HNI seats: Rows C-G & H (Seats 1-5)
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (const r of rows) {
      const seats: any[] = [];
      for (let s = 1; s <= 9; s++) {
        if (s === 3 || s === 7) {
          seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        }
        const seatId = `${r}${s}`;
        const isHni = isHniAllocationSeat(location, r, s);
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
      layout.push({ rowName: r, seats });
    }
  } else if (location.includes("Parimal")) {
    // Rows A-H. Rows A-E have 12 seats, F has 10 seats, G-H have 12 seats.
    // HNI seats: Rows A-F
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (const r of rows) {
      const seats: any[] = [];
      const seatCount = r === "F" ? 10 : 12;
      for (let s = 1; s <= seatCount; s++) {
        if (s === 4 || s === 9) {
          seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        }
        const seatId = `${r}${s}`;
        const isHni = isHniAllocationSeat(location, r, s);
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
      layout.push({ rowName: r, seats });
    }
  } else if (location.includes("Gandhinagar")) {
    // Rows A-H, 10 seats. HNI seats: Rows A & B
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (const r of rows) {
      const seats: any[] = [];
      for (let s = 1; s <= 10; s++) {
        if (s === 3 || s === 8) {
          seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        }
        const seatId = `${r}${s}`;
        const isHni = isHniAllocationSeat(location, r, s);
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
      layout.push({ rowName: r, seats });
    }
  } else if (location.includes("Gota")) {
    // Rows A-H, 10 seats. HNI seats: Rows A & B
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (const r of rows) {
      const seats: any[] = [];
      for (let s = 1; s <= 10; s++) {
        if (s === 3 || s === 8) {
          seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        }
        const seatId = `${r}${s}`;
        const isHni = isHniAllocationSeat(location, r, s);
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
      layout.push({ rowName: r, seats });
    }
  } else if (location.includes("Vadodara")) {
    // Rows A-H, 10 seats. HNI seats: Rows B & C
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (const r of rows) {
      const seats: any[] = [];
      for (let s = 1; s <= 10; s++) {
        if (s === 3 || s === 8) {
          seats.push({ seatId: "", seatNumber: "", isBooked: false, isAisle: true });
        }
        const seatId = `${r}${s}`;
        const isHni = isHniAllocationSeat(location, r, s);
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");
    if (!location) {
      return NextResponse.json({ fallback: true });
    }

    // 1. Fetch bookings from MongoDB
    let dbBookedSeats = new Set<string>();
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (db) {
        const dbBookings = await db.collection("hnibookings").find({
          location: location,
          movie: "Spider-Man",
          status: "Paid"
        }).toArray();
        dbBookings.forEach((b: any) => {
          if (Array.isArray(b.seats)) {
            b.seats.forEach((seat: string) => {
              dbBookedSeats.add(seat.trim().toUpperCase());
            });
          }
        });
      }
    } catch (dbErr) {
      console.error("Database fetch error in proxy-layout:", dbErr);
    }

    if (!BACKEND_MAP[location]) {
      // Return custom layout directly if location is unknown
      const layout = getPreconfiguredLayout(location, dbBookedSeats);
      return NextResponse.json({ fallback: false, layout });
    }

    const { cinemaId, movieId, regionId, targetTime } = BACKEND_MAP[location];
    const date = "2026-08-01"; // Saturday (1st Aug)

    const idValue = `${movieId}|${date}|${regionId}`;
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

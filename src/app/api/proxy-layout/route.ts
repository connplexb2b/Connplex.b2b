import { NextRequest, NextResponse } from "next/server";

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");
    if (!location || !BACKEND_MAP[location]) {
      return NextResponse.json({ fallback: true });
    }

    const { cinemaId, movieId, regionId, targetTime } = BACKEND_MAP[location];
    const date = "2026-08-01"; // Saturday (1st Aug)

    const idValue = `${movieId}|${date}|${regionId}`;
    const payload = `id=${encodeURIComponent(idValue)}&timestamp=${Date.now()}`;

    // Fetch show timings
    const showsRes = await fetch("https://backend.theconnplex.com/api/movie-detils-with-shows", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Device-Type": "web",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: payload
    });

    if (!showsRes.ok) {
      return NextResponse.json({ fallback: true, error: "Failed to fetch shows" });
    }

    const showsData = await showsRes.json();
    if (showsData.status !== 200 || !showsData.data) {
      return NextResponse.json({ fallback: true, message: showsData.message });
    }

    const cinemas = showsData.data.cinemas || showsData.data || [];
    const cinema = cinemas.find((c: any) => (c._id || c.cId) === cinemaId);

    if (!cinema || !cinema.sessions || cinema.sessions.length === 0) {
      return NextResponse.json({ fallback: true, error: "Cinema or sessions not found" });
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
      session = cinema.sessions[0]; // fallback to first session if time doesn't match exactly
    }

    // Fetch seat layout
    const layoutRes = await fetch(`https://backend.theconnplex.com/api/seat-layout/${cinemaId}/${session.sessionId}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "X-Device-Type": "web"
      }
    });

    if (!layoutRes.ok) {
      return NextResponse.json({ fallback: true, error: "Failed to fetch layout" });
    }

    const layoutData = await layoutRes.json();
    if (layoutData.status !== 200 || !layoutData.data) {
      return NextResponse.json({ fallback: true, message: layoutData.message });
    }

    // Process layout data to simple format
    const categories = layoutData.data.data || layoutData.data || [];
    const category = categories[0]; // Take the first category (usually Recliner or premium)
    
    if (!category || !category.rowData) {
      return NextResponse.json({ fallback: true, error: "No seat layout categories" });
    }

    const layout = category.rowData.map((row: any) => ({
      rowName: row.strRowPhyID || row.strRowPhyId,
      seats: row.seatData.map((seat: any) => ({
        seatId: `${row.strRowPhyID || row.strRowPhyId}${seat.strSeatNumber}`,
        seatNumber: seat.strSeatNumber,
        isBooked: seat.strSeatStatus === "1",
        isAisle: !seat.Key
      }))
    }));

    return NextResponse.json({ fallback: false, layout });
  } catch (error: any) {
    console.error("Layout proxy error:", error);
    return NextResponse.json({ fallback: true, error: error.message });
  }
}

// node 18+ has global fetch, so we don't need node-fetch.

async function run() {
  const movieId = "6a5ba6c9bb1d9a7721b13eca";
  const date = "2026-08-01";
  const regionId = "64da17939cdcb529a693aac2";
  const cinemaId = "65bcde931e72aef23e6854ee"; // Parimal Garden

  const idValue = `${movieId}|${date}|${regionId}`;
  const payload = `id=${encodeURIComponent(idValue)}&timestamp=${Date.now()}`;

  console.log("Fetching shows...");
  const showsRes = await fetch("https://backend.theconnplex.com/api/movie-detils-with-shows", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Device-Type": "web",
      "User-Agent": "Mozilla/5.0"
    },
    body: payload
  });

  if (!showsRes.ok) {
    console.error("Failed to fetch shows:", showsRes.status);
    return;
  }

  const showsData = await showsRes.json();
  console.log("Shows response status:", showsData.status);

  const cinemas = showsData.data.cinemas || showsData.data || [];
  const cinema = cinemas.find(c => (c._id || c.cId) === cinemaId);

  if (!cinema) {
    console.error("Cinema not found");
    return;
  }

  console.log("Cinema sessions:", cinema.sessions.map(s => ({
    sessionId: s.sessionId,
    showTime: s.sessionRealShow,
    time: new Date(s.sessionRealShow).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })
  })));

  const session = cinema.sessions[0];
  if (!session) {
    console.error("No session found");
    return;
  }

  console.log("Fetching seat layout for session:", session.sessionId);
  const layoutRes = await fetch(`https://backend.theconnplex.com/api/seat-layout/${cinemaId}/${session.sessionId}`, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "X-Device-Type": "web"
    }
  });

  if (!layoutRes.ok) {
    console.error("Failed to fetch layout:", layoutRes.status);
    return;
  }

  const layoutData = await layoutRes.json();
  console.log("Layout response status:", layoutData.status);

  const categories = layoutData.data.data || layoutData.data || [];
  const category = categories[0];
  
  if (!category || !category.rowData) {
    console.error("No rowData found");
    return;
  }

  category.rowData.forEach(row => {
    const rowName = row.strRowPhyID || row.strRowPhyId;
    const seatNumbers = row.seatData.map(s => s.strSeatNumber || "aisle");
    console.log(`Row ${rowName}:`, seatNumbers.join(", "));
  });
}

run().catch(console.error);

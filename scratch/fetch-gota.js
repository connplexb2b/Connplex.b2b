async function run() {
  const movieId = "6a5ba6c9bb1d9a7721b13eca";
  const date = "2026-08-01";
  const regionId = "64da17939cdcb529a693aac2";
  const cinemaId = "664746aabddbaefe64f57506"; // Gota

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
  categories.forEach(cat => {
    console.log(`\nCategory: ${cat.strAreaDesc} (Code: ${cat.strAreaCode})`);
    cat.rowData.forEach(row => {
      const rowName = row.strRowPhyID || row.strRowPhyId;
      const seatsInfo = row.seatData.map(s => {
        if (!s.Key) return "aisle";
        return `${s.strSeatNumber}(status:${s.strSeatStatus},group:${s.strGroupSeatsData})`;
      });
      console.log(`Row ${rowName}:`, seatsInfo.join(", "));
    });
  });
}

run().catch(console.error);

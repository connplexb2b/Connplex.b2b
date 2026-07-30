async function fetchGet(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'X-Device-Type': 'web'
    }
  });
  return res.json();
}

async function run() {
  try {
    const res = await fetchGet('https://backend.theconnplex.com/api/get-cinema');
    console.log("Cinemas fetched:", res.data ? res.data.length : "None");
    if (res.data) {
      res.data.forEach(c => {
        console.log(`- ${c.cinemaName} (ID: ${c._id})`);
        if (c.regionId) {
          console.log(`  Region: ${c.regionId.region} (ID: ${c.regionId._id || c.regionId})`);
        }
      });
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}

run();

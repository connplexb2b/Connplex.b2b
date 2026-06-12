const https = require('https');
const fs = require('fs');

function fetchGet(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://ticketing.theconnplex.com',
        'Referer': 'https://ticketing.theconnplex.com/',
        'X-Device-Type': 'web'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    const ahmedabadId = '64da17939cdcb529a693aac2';
    const recent = await fetchGet(`https://backend.theconnplex.com/api/user/get-recent-releases-movie-by-region/${ahmedabadId}`);
    if (recent && recent.data) {
      fs.writeFileSync('c:\\Users\\admin\\Downloads\\b2b-website-main\\b2b-website-main\\scratch\\all-movies.json', JSON.stringify(recent.data, null, 2));
      console.log('Successfully wrote to all-movies.json');
    }
  } catch (err) {
    console.error(err);
  }
}

run();

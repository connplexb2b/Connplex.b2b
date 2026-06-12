const https = require('https');

function fetchGet(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Origin': 'https://ticketing.theconnplex.com',
        'Referer': 'https://ticketing.theconnplex.com/'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  try {
    const js = await fetchGet('https://ticketing.theconnplex.com/assets/index-Bql1Xtne.js');
    console.log('JS length:', js.length);
    
    // Search for GET_MOVIES_BY_ID
    const regex = /GET_MOVIES_BY_ID\s*:\s*["'][^"']+["']/g;
    let match;
    console.log('Searching for GET_MOVIES_BY_ID...');
    while ((match = regex.exec(js)) !== null) {
      console.log(`Found match at index ${match.index}`);
      console.log(match[0]);
    }
  } catch (err) {
    console.error(err);
  }
}

run();

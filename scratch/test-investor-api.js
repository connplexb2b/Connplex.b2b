const https = require('https');

function fetchGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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
    const data = await fetchGet('https://webadmin.theconnplex.com/api/user/get-single-investor-by-user?title=General%20Meeting');
    console.log('webadmin.theconnplex.com status:', data.status);
    console.log('Data:', JSON.stringify(data.data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

run();
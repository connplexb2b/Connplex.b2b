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
    const data = await fetchGet('https://webadmin.theconnplex.com/api/user/get-all-investors-by-user');
    console.log('webadmin.theconnplex.com status:', data.status);
    if (data && data.data) {
      console.log('Categories count:', data.data.length);
      data.data.forEach((c) => {
        console.log(`Parent: "${c.parent}", Title: "${c.title}"`);
        if (c.children) {
          c.children.forEach(child => console.log(`  - Child Title: "${child.title}"`));
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
}

run();
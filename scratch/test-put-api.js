const http = require('http');

function makeRequest(options, bodyData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (bodyData) {
      req.write(bodyData);
    }
    req.end();
  });
}

async function run() {
  console.log('Sending PUT request to edit investor...');
  try {
    const putBody = JSON.stringify({ title: 'other Annoucment' });
    const putOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/investors/4887120f-272d-4780-852b-9620e1f4e1ef',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'admin_session=authenticated',
        'Content-Length': Buffer.byteLength(putBody)
      }
    };

    const putRes = await makeRequest(putOptions, putBody);
    console.log('PUT Response Status:', putRes.statusCode);
    console.log('PUT Response Headers:', putRes.headers);
    console.log('PUT Response Body:', putRes.body);

    console.log('\nSending POST request to upload a mock file...');
    // Create multipart/form-data payload
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const filename = 'test-doc.pdf';
    const fileContent = '%PDF-1.4 ... mock pdf content ...';
    
    let postData = '';
    postData += `--${boundary}\r\n`;
    postData += `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`;
    postData += 'Content-Type: application/pdf\r\n\r\n';
    postData += fileContent + '\r\n';
    postData += `--${boundary}--\r\n`;

    const postOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/investors/4887120f-272d-4780-852b-9620e1f4e1ef/upload',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Cookie': 'admin_session=authenticated',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const postRes = await makeRequest(postOptions, postData);
    console.log('POST Response Status:', postRes.statusCode);
    console.log('POST Response Headers:', postRes.headers);
    console.log('POST Response Body:', postRes.body);

  } catch (err) {
    console.error('Error making requests:', err);
  }
}

// Wait a bit to ensure server is ready
setTimeout(run, 2000);

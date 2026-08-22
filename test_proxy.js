const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify({ username_or_email: 'admin@suffat.com', password: 'AdminSecurePass123' }))
  }
};

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log('BODY:', chunk);
  });
});

req.on('error', (e) => {
  console.error('problem with request:', e.message);
});

req.write(JSON.stringify({ username_or_email: 'admin@suffat.com', password: 'AdminSecurePass123' }));
req.end();

const http = require('http');
const crypto = require('crypto');

function createJWT(payload, secret) {
    const header = { alg: 'HS256', typ: 'JWT' };
    
    function base64url(str) {
        return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    }
    
    const encodedHeader = base64url(JSON.stringify(header));
    const encodedPayload = base64url(JSON.stringify(payload));
    const signature = crypto.createHmac('sha256', secret).update(encodedHeader + '.' + encodedPayload).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

const SECRET = "supersecretkey";

const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        if (req.url === '/healthz' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('OK');
        } else if (req.url === '/api/v1/auth/token' && req.method === 'POST') {
            const data = JSON.parse(body || '{}');
            const email = data.username_or_email || '';
            let role = 'STUDENT';
            let landing_url = '/app/tenant/branch/portal/student';
            if (email === 'admin@suffat.org') {
                role = 'SUPER_ADMIN';
                landing_url = '/app/suffat-hq/main/erp';
            } else if (email === 'admin_aa59cbc5f3@suffat.com') {
                role = 'CENTER_ADMIN';
                landing_url = '/app/suffat/main/erp';
            } else if (email === 'manager@suffat.com') {
                role = 'NAZIM';
                landing_url = '/app/suffat/main/erp';
            } else if (email === 'usthad_51c88a81db@suffat.com') {
                role = 'USTAD';
                landing_url = '/app/suffat/main/erp/academics';
            }
            
            const payload = {
                sub: email,
                role: role,
                institution_code: role === 'SUPER_ADMIN' ? 'suffat-hq' : 'suffat',
                branch_code: 'main',
                exp: Math.floor(Date.now() / 1000) + (60 * 60)
            };
            
            const token = createJWT(payload, SECRET);
            
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Set-Cookie': `access_token=${token}; HttpOnly; Path=/; SameSite=Lax`
            });
            res.end(JSON.stringify({ landing_url }));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    });
});

server.listen(8000, () => {
    console.log('Mock FastAPI native running on port 8000');
});

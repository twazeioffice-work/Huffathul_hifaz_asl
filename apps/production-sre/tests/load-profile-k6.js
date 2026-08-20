import http from 'k6/http';
import { check, sleep } from 'k6';

// Simulates high-load traffic during peak admission days
export let options = {
    stages: [
        { duration: '30s', target: 50 },  // Ramp up to 50 users
        { duration: '1m', target: 200 },  // Spike to 200 concurrent connections
        { duration: '30s', target: 0 },   // Scale down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must be under 500ms
        http_req_failed: ['rate<0.01'],   // Less than 1% failure rate allowed
    },
};

export default function () {
    let res = http.get('http://localhost:3000/');
    check(res, {
        'status is 200': (r) => r.status === 200,
        'transaction time OK': (r) => r.timings.duration < 500,
    });
    sleep(1);
}

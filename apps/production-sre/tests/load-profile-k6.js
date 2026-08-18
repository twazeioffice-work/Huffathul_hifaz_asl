// Location: apps/production-sre/tests/load-profile-k6.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 500 },  // Ramp up
    { duration: '5m', target: 1000 }, // Peak concurrent load
    { duration: '1m', target: 0 },    // Cooldown
  ],
  thresholds: {
    http_req_duration: ['p(99)<200'], // SLA constraint: p99 latency must be under 200ms
    http_req_failed: ['rate<0.01'],    // SLO constraint: Request failure rate must be under 1%
  },
};

export default function () {
  const url = 'https://api.suffat.org/api/v1/app/suh01/mn01/erp/students';
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer k6-test-mock-token-payload',
    },
  };
  
  const res = http.get(url, params);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(0.5);
}

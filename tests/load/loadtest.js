import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter, Trend, Rate } from 'k6/metrics';

// Custom metrics
const pageLoadTime = new Trend('page_load_time');
const requestsPerSecond = new Rate('requests_per_second');
const failureRate = new Rate('failed_requests');
const customDuration = new Trend('custom_duration');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '3m', target: 50 },   // Stay at 50
    { duration: '1m', target: 100 },  // Ramp up to 100
    { duration: '3m', target: 100 },  // Stay at 100
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% under 500ms
    http_req_failed: ['rate<0.01'],    // <1% failures
    page_load_time: ['p(95)<1000'],    // 95% under 1s
  },
};

// Performance budget
const PERFORMANCE_BUDGET = {
  maxDuration: 1000,        // Max 1s total duration
  maxFirstContentful: 800,  // Max 800ms to FCP
  maxLargestContentful: 1200, // Max 1.2s to LCP
  maxServerResponse: 200,   // Max 200ms TTFB
  maxResourceSize: 500000,  // Max 500KB per resource
  maxTotalSize: 2000000,    // Max 2MB total
};

// Main test scenario
export default function() {
  // Test homepage
  let response = http.get('https://blackfish.digital');
  checkPerformance(response, 'homepage');

  // Test features page
  response = http.get('https://blackfish.digital/features');
  checkPerformance(response, 'features');

  // Test API endpoints
  const apiChecks = {
    '/api/contact': {
      method: 'POST',
      payload: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      }),
      headers: { 'Content-Type': 'application/json' }
    },
    '/api/newsletter': {
      method: 'POST',
      payload: JSON.stringify({ email: 'test@example.com' }),
      headers: { 'Content-Type': 'application/json' }
    }
  };

  for (const [endpoint, config] of Object.entries(apiChecks)) {
    response = http.request(
      config.method,
      `https://blackfish.digital${endpoint}`,
      config.payload,
      { headers: config.headers }
    );
    checkAPIResponse(response, endpoint);
  }

  sleep(1);
}

// Check performance metrics
function checkPerformance(response, pageName) {
  const checks = {
    'status is 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < PERFORMANCE_BUDGET.maxDuration,
    'content type is text/html': (r) => r.headers['Content-Type'].includes('text/html'),
  };

  check(response, checks);

  // Record metrics
  pageLoadTime.add(response.timings.duration);
  requestsPerSecond.add(1);
  failureRate.add(response.status !== 200);

  // Check resource sizes
  const size = response.body.length;
  if (size > PERFORMANCE_BUDGET.maxTotalSize) {
    console.warn(`${pageName} total size (${size}) exceeds budget`);
  }
}

// Check API response
function checkAPIResponse(response, endpoint) {
  const checks = {
    'status is 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 200,
    'valid JSON': (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch {
        return false;
      }
    },
  };

  check(response, checks);

  // Record API metrics
  customDuration.add(response.timings.duration, { endpoint });
  failureRate.add(response.status !== 200);
}

// Helper to check resource timing
function checkResourceTiming(timing) {
  return {
    'TTFB within budget': timing.waiting < PERFORMANCE_BUDGET.maxServerResponse,
    'Total time within budget': timing.duration < PERFORMANCE_BUDGET.maxDuration,
  };
}
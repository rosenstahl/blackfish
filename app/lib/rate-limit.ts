const MINUTE = 60 * 1000;

interface RateLimitData {
  count: number;
  firstRequest: number;
  lastRequest: number;
  blocked: boolean;
  ipAddress: string;
  userAgent?: string;
}

const rateLimits = new Map<string, RateLimitData>();

export function rateLimit(
  ip: string, 
  userAgent?: string,
  limit: number = 5, 
  windowMs: number = MINUTE
): boolean {
  const now = Date.now();
  const key = `${ip}-${userAgent || ''}`;
  
  const data = rateLimits.get(key) || {
    count: 0,
    firstRequest: now,
    lastRequest: now,
    blocked: false,
    ipAddress: ip,
    userAgent
  };

  // Blocklist Check
  if (data.blocked) {
    if (now - data.lastRequest > 10 * MINUTE) {
      data.blocked = false;
      data.count = 0;
      data.firstRequest = now;
    } else {
      return false;
    }
  }

  // Zeitfenster Reset
  if (now - data.firstRequest >= windowMs) {
    data.count = 0;
    data.firstRequest = now;
  }

  // Minimaler Request Abstand
  const timeSinceLastRequest = now - data.lastRequest;
  if (timeSinceLastRequest < 1000) {
    data.blocked = true;
    return false;
  }

  data.count++;
  data.lastRequest = now;

  if (data.count > limit) {
    data.blocked = true;
    return false;
  }

  rateLimits.set(key, data);
  return true;
}

// Cleanup-Funktion
setInterval(() => {
  const now = Date.now();
  rateLimits.forEach((data, key) => {
    if (now - data.lastRequest > 30 * MINUTE) {
      rateLimits.delete(key);
    }
  });
}, 5 * MINUTE);
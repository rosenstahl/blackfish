// app/lib/csrf.ts
const CSRF_SECRET = process.env.CSRF_SECRET || 'your-default-secret';

export function generateCSRFToken(): string {
  return Buffer.from(
    JSON.stringify({
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substring(2)
    })
  ).toString('base64');
}

export function validateCSRFToken(token: string): boolean {
  try {
    const decoded = JSON.parse(
      Buffer.from(token, 'base64').toString('utf-8')
    );
    
    // Token ist maximal 1 Stunde gültig
    const hourInMs = 60 * 60 * 1000;
    const isValid = (Date.now() - decoded.timestamp) < hourInMs;
    
    return isValid;
  } catch {
    return false;
  }
}
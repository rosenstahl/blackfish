import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { rateLimit } from '@/app/lib/rate-limit';
import { Analytics } from '@/app/lib/analytics';
import crypto from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET;
if (!CSRF_SECRET) {
  throw new Error('CSRF_SECRET environment variable is not set');
}

// Generate CSRF Token
function generateToken(): string {
  const timestamp = Date.now();
  const randomBytes = crypto.randomBytes(32).toString('hex');
  const data = `${timestamp}.${randomBytes}`;
  
  const hmac = crypto.createHmac('sha256', CSRF_SECRET);
  hmac.update(data);
  const signature = hmac.digest('hex');

  const token = Buffer.from(JSON.stringify({
    timestamp,
    random: randomBytes,
    signature
  })).toString('base64');

  return token;
}

// Validate Request
async function validateRequest(ip: string, userAgent?: string): Promise<boolean> {
  // Rate limiting
  const isAllowed = await rateLimit(ip, userAgent, 10, 60000); // 10 requests per minute
  if (!isAllowed) {
    Analytics.event({
      action: 'csrf_rate_limit_exceeded',
      category: 'Security',
      label: ip
    });
    return false;
  }

  return true;
}

export async function GET() {
  try {
    // Get request headers
    const headersList = headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const userAgent = headersList.get('user-agent');
    const ip = forwardedFor?.split(',')[0] ?? 'unknown';

    // Validate request
    const isValid = await validateRequest(ip, userAgent);
    if (!isValid) {
      return new NextResponse(null, {
        status: 429,
        statusText: 'Too Many Requests',
        headers: {
          'Retry-After': '60',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    // Generate new token
    const token = generateToken();

    // Track token generation
    Analytics.event({
      action: 'csrf_token_generated',
      category: 'Security',
      label: ip
    });

    // Return token with security headers
    return new NextResponse(token, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      }
    });

  } catch (error) {
    console.error('CSRF Token Generation Error:', error);
    
    Analytics.event({
      action: 'csrf_token_error',
      category: 'Error',
      label: error instanceof Error ? error.message : 'Unknown error'
    });

    return new NextResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
}
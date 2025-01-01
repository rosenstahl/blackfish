import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { headers } from 'next/headers';

// Sicheres Fallback für den Fall, dass keine ENV-Variable gesetzt ist
const CSRF_SECRET = process.env['CSRF_SECRET'] || crypto.randomBytes(32).toString('hex');
const CSRF_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 Stunden

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0];
  }
  const xRealIp = req.headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp;
  }
  return '127.0.0.1';
}

export async function GET(req: NextRequest) {
  try {
    // Direkte Header-Verarbeitung ohne await
    const forwardedFor = getClientIp(req);
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Erstelle einen sicheren Token
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const data = `${randomBytes}|${timestamp}|${forwardedFor}|${userAgent}`;
    
    // Signiere den Token
    const hmac = crypto.createHmac('sha256', CSRF_SECRET);
    hmac.update(data);
    const signature = hmac.digest('hex');
    
    // Kombiniere zu finalem Token
    const tokenData = `${data}|${signature}`;
    const token = Buffer.from(tokenData, 'utf-8').toString('base64');

    // Setze sichere Response-Header
    return new NextResponse(token, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store, private, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
      },
    });

  } catch (error) {
    console.error('CSRF token generation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function verifyToken(token: string, req: NextRequest): Promise<boolean> {
  try {
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decodedToken.split('|');
    if (parts.length !== 5) {
      return false;
    }

    const [randomBytes, timestamp, storedForwardedFor, storedUserAgent, signature] = parts;

    // Überprüfe Timestamp
    const parsedTimestamp = parseInt(timestamp, 10);
    if (isNaN(parsedTimestamp)) {
      return false;
    }

    const tokenAge = Date.now() - parsedTimestamp;
    if (tokenAge > CSRF_TOKEN_EXPIRY) {
      return false;
    }

    // Überprüfe Client-Informationen
    const currentForwardedFor = getClientIp(req);
    const currentUserAgent = req.headers.get('user-agent') || 'unknown';

    if (storedForwardedFor !== currentForwardedFor || storedUserAgent !== currentUserAgent) {
      return false;
    }

    // Überprüfe Signatur
    const data = `${randomBytes}|${timestamp}|${storedForwardedFor}|${storedUserAgent}`;
    const hmac = crypto.createHmac('sha256', CSRF_SECRET);
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');

    const signatureBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

  } catch (error) {
    console.error('CSRF token verification error:', error);
    return false;
  }
}
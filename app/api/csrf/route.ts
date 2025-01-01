import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CSRF_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 Stunden

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

export async function GET(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Erstelle einen sicheren Token
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const data = `${randomBytes}|${timestamp}|${clientIp}|${userAgent}`;
    
    // Signiere den Token
    const hmac = crypto.createHmac('sha256', process.env['CSRF_SECRET'] || crypto.randomBytes(32).toString('hex'));
    hmac.update(data);
    const signature = hmac.digest('hex');
    
    // Kombiniere zu finalem Token
    const tokenData = `${data}|${signature}`;
    const token = Buffer.from(tokenData).toString('base64');

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
  if (!token) return false;

  try {
    const decodedToken = Buffer.from(token, 'base64').toString();
    const parts = decodedToken.split('|');
    if (parts.length !== 5) return false;

    const [randomBytes, timestamp, storedClientIp, storedUserAgent, signature] = parts;

    // Überprüfe Timestamp
    const parsedTimestamp = Number(timestamp);
    if (isNaN(parsedTimestamp)) return false;

    const tokenAge = Date.now() - parsedTimestamp;
    if (tokenAge > CSRF_TOKEN_EXPIRY) return false;

    // Überprüfe Client-Informationen
    const currentClientIp = getClientIp(req);
    const currentUserAgent = req.headers.get('user-agent') || 'unknown';

    if (storedClientIp !== currentClientIp || storedUserAgent !== currentUserAgent) {
      return false;
    }

    // Überprüfe Signatur
    const data = `${randomBytes}|${timestamp}|${storedClientIp}|${storedUserAgent}`;
    const hmac = crypto.createHmac('sha256', process.env['CSRF_SECRET'] || crypto.randomBytes(32).toString('hex'));
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );

  } catch (error) {
    console.error('CSRF token verification error:', error);
    return false;
  }
}
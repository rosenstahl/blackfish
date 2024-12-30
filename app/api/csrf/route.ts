import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Sicheres Fallback für den Fall, dass keine ENV-Variable gesetzt ist
const CSRF_SECRET = process.env['CSRF_SECRET'] || crypto.randomBytes(32).toString('hex');
const CSRF_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 Stunden

export async function GET(req: NextRequest) {
  try {
    // Direkte Header-Verarbeitung ohne await
    const headers = req.headers;
    const forwardedFor = headers.get('x-forwarded-for') || req.ip;
    const userAgent = headers.get('user-agent') || 'unknown';

    // Erstelle einen sicheren Token
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const data = `${randomBytes}|${timestamp}|${forwardedFor}|${userAgent}`;
    
    // Signiere den Token
    const hmac = crypto.createHmac('sha256', CSRF_SECRET);
    hmac.update(data);
    const signature = hmac.digest('hex');
    
    // Kombiniere zu finalem Token
    const token = Buffer.from(`${data}|${signature}`).toString('base64');

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
    const decodedToken = Buffer.from(token, 'base64').toString();
    const [randomBytes, timestamp, storedForwardedFor, storedUserAgent, signature] = decodedToken.split('|');

    // Überprüfe Timestamp
    const tokenAge = Date.now() - parseInt(timestamp, 10);
    if (tokenAge > CSRF_TOKEN_EXPIRY) {
      return false;
    }

    // Überprüfe Client-Informationen
    const currentForwardedFor = req.headers.get('x-forwarded-for') || req.ip;
    const currentUserAgent = req.headers.get('user-agent') || 'unknown';

    if (storedForwardedFor !== currentForwardedFor || storedUserAgent !== currentUserAgent) {
      return false;
    }

    // Überprüfe Signatur
    const data = `${randomBytes}|${timestamp}|${storedForwardedFor}|${storedUserAgent}`;
    const hmac = crypto.createHmac('sha256', CSRF_SECRET);
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

  } catch (error) {
    console.error('CSRF token verification error:', error);
    return false;
  }
}
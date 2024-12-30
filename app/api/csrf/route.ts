import { type NextRequest } from 'next/server';
import crypto from 'crypto';

const tokenLength = 32;
const tokenExpiration = 60 * 60 * 1000; // 1 hour

// Verwenden Sie environment variable mit type-safety
const CSRF_SECRET = process.env['CSRF_SECRET'] || crypto.randomBytes(32).toString('hex');

export async function generateToken(userContext: string): Promise<string> {
  // Generiere zufälligen Token
  const randomToken = crypto.randomBytes(tokenLength).toString('hex');
  
  // Timestamp hinzufügen
  const timestamp = Date.now().toString();
  
  // Kombiniere Token, Timestamp und User-Context
  const data = `${randomToken}|${timestamp}|${userContext}`;
  
  // Erstelle HMAC
  const hmac = crypto.createHmac('sha256', CSRF_SECRET);
  hmac.update(data);
  const signature = hmac.digest('hex');
  
  // Kombiniere alles zum finalen Token
  const token = Buffer.from(`${data}|${signature}`).toString('base64');
  
  return token;
}

export async function validateToken(token: string, userContext: string): Promise<boolean> {
  try {
    // Dekodiere Token
    const decoded = Buffer.from(token, 'base64').toString();
    const [randomPart, timestamp, savedContext, signature] = decoded.split('|');
    
    // Überprüfe User-Context
    if (savedContext !== userContext) {
      return false;
    }
    
    // Überprüfe Timestamp
    const tokenTime = parseInt(timestamp, 10);
    if (Date.now() - tokenTime > tokenExpiration) {
      return false;
    }
    
    // Überprüfe Signatur
    const data = `${randomPart}|${timestamp}|${savedContext}`;
    const hmac = crypto.createHmac('sha256', CSRF_SECRET);
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
    
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const headersList = request.headers;
  const forwardedFor = headersList.get('x-forwarded-for');
  const userAgent = headersList.get('user-agent');
  
  // Erstelle User-Context aus verfügbaren Informationen
  const userContext = `${forwardedFor}|${userAgent}`;
  
  // Generiere Token
  const token = await generateToken(userContext);
  
  return new Response(token, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
}
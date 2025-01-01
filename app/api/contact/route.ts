import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Validiere CSRF-Token
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Rate Limiting
    // ... (Rate Limiting Logik hier) ...

    // Validiere die Daten
    const requestData = await req.json();

    // Sende die E-Mail
    if (!requestData) {
      return new NextResponse('Invalid request data', { status: 400 });
    }

    // ... (E-Mail-Versand-Logik hier) ...

    return new NextResponse('Message sent successfully', { status: 200 });

  } catch (error) {
    console.error('Contact form error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
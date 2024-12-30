import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Korrekte Header-Verarbeitung
    const headers = req.headers;
    const forwardedFor = headers.get('x-forwarded-for');
    const userAgent = headers.get('user-agent');
    const csrfToken = headers.get('x-csrf-token');

    if (!csrfToken) {
      return NextResponse.json(
        { error: 'CSRF token missing' },
        { status: 403 }
      );
    }

    // Rest der Implementierung
    const data = await req.json();
    
    return NextResponse.json(
      { message: 'Success' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
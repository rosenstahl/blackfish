import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter } from '@/app/lib/rate-limit';
import { validateCSRFToken } from '@/app/lib/csrf';
import { sendContactMail } from '@/app/lib/email';

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string | undefined;
}

const rateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5,
  blockDuration: 24 * 60 * 60 * 1000, // 24 hours
});

export async function POST(req: NextRequest) {
  try {
    const headersList = await req.headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const userAgent = headersList.get('user-agent');
    const csrfToken = headersList.get('x-csrf-token');

    if (!csrfToken) {
      return NextResponse.json(
        { error: 'CSRF token missing' },
        { status: 403 }
      );
    }

    const isValidCSRF = await validateCSRFToken(csrfToken);
    if (!isValidCSRF) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    // Rate limiting
    const rateLimitResult = await rateLimiter.check({
      ipAddress: forwardedFor || req.ip || 'unknown',
      userAgent: userAgent || 'unknown'
    });

    if (rateLimitResult.blocked) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const data = await req.json();
    const sanitizedData: ContactData = {
      name: data.name?.trim(),
      email: data.email?.trim().toLowerCase(),
      subject: data.subject?.trim(),
      message: data.message?.trim(),
      phone: data.phone?.trim() || undefined
    };

    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    for (const field of requiredFields) {
      if (!sanitizedData[field as keyof ContactData]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send email
    await sendContactMail(sanitizedData);

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
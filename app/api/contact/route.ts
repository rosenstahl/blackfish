import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { sendContactMail } from '@/app/lib/email'
import { rateLimit } from '@/app/lib/rate-limit'
import { validateCSRFToken } from '@/app/lib/csrf'
import { Analytics } from '@/app/lib/analytics'
import { z } from 'zod'

// Error Classes
class ValidationError extends Error {
  public code: number
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
    this.code = 400
  }
}

class RateLimitError extends Error {
  public code: number
  constructor(message: string) {
    super(message)
    this.name = 'RateLimitError'
    this.code = 429
  }
}

// Schema Validation
const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name muss mindestens 2 Zeichen lang sein')
    .max(100, 'Name ist zu lang (maximal 100 Zeichen)')
    .regex(/^[a-zA-ZäöüßÄÖÜ\s-]+$/, 'Name enthält ungültige Zeichen'),
  
  email: z.string()
    .email('Ungültige Email-Adresse')
    .max(254, 'Email ist zu lang'),
  
  subject: z.string()
    .min(3, 'Betreff muss mindestens 3 Zeichen lang sein')
    .max(200, 'Betreff ist zu lang (maximal 200 Zeichen)'),
  
  message: z.string()
    .min(10, 'Nachricht muss mindestens 10 Zeichen lang sein')
    .max(5000, 'Nachricht ist zu lang (maximal 5000 Zeichen)'),
  
  phone: z.string()
    .regex(/^[0-9+\-\s()]*$/, 'Ungültige Telefonnummer')
    .max(20, 'Telefonnummer ist zu lang')
    .optional()
    .nullable()
})

type ContactData = z.infer<typeof contactSchema>

// Spam Detection
const isSpam = (data: ContactData): boolean => {
  const spamPatterns = [
    /\b(viagra|casino|crypto|xxx)\b/i,
    /<[^>]*>/,  // HTML Tags
    /\b(http|https):\/\//i,  // URLs
    /\[url=/i,  // BBCode
    /\b(sex|porn|gambling)\b/i,
    /^.{0,10}$/  // Too short messages
  ]

  const contentToCheck = `${data.name} ${data.subject} ${data.message}`.toLowerCase()
  
  // Check patterns
  if (spamPatterns.some(pattern => pattern.test(contentToCheck))) {
    return true
  }

  // Check for repeated characters
  if (/(.)\1{4,}/.test(contentToCheck)) {
    return true
  }

  // Check for too many capital letters (shouting)
  const upperCasePercentage = (contentToCheck.match(/[A-Z]/g) || []).length / contentToCheck.length
  if (upperCasePercentage > 0.5) {
    return true
  }

  return false
}

// API Handler
export async function POST(request: Request) {
  try {
    // Get headers
    const headersList = headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const userAgent = headersList.get('user-agent')
    const ip = forwardedFor?.split(',')[0] ?? 'unknown'

    // CSRF Protection
    const csrfToken = headersList.get('x-csrf-token')
    if (!csrfToken || !validateCSRFToken(csrfToken)) {
      throw new ValidationError('Ungültiger oder abgelaufener Sicherheitstoken')
    }

    // Rate Limiting
    const isRateLimited = await rateLimit(ip, userAgent)
    if (!isRateLimited) {
      Analytics.event({
        action: 'rate_limit_exceeded',
        category: 'Security',
        label: ip
      })
      throw new RateLimitError('Zu viele Anfragen. Bitte versuchen Sie es in einer Minute erneut.')
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = contactSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(error => ({
        field: error.path.join('.'),
        message: error.message
      }))
      throw new ValidationError(JSON.stringify(errors))
    }

    const data = validationResult.data

    // Spam Check
    if (isSpam(data)) {
      Analytics.event({
        action: 'spam_detected',
        category: 'Security',
        label: ip
      })
      throw new ValidationError('Ihre Nachricht wurde als Spam erkannt.')
    }

    // Normalize data
    const sanitizedData: ContactData = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      phone: data.phone?.trim()
    }

    // Send email
    await sendContactMail(sanitizedData)

    // Track success
    Analytics.event({
      action: 'contact_form_success',
      category: 'Contact',
      label: sanitizedData.subject
    })

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Ihre Nachricht wurde erfolgreich gesendet.'
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json'
      }
    })

  } catch (error: any) {
    // Error logging
    console.error('Contact Form Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })

    // Track error
    Analytics.event({
      action: 'contact_form_error',
      category: 'Error',
      label: error.name
    })

    // Error response
    const status = error.code || 500
    const message = error instanceof ValidationError || error instanceof RateLimitError
      ? error.message
      : 'Ein unerwarteter Fehler ist aufgetreten'

    return NextResponse.json({ 
      success: false,
      error: message 
    }, { 
      status,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
        ...(status === 429 ? { 'Retry-After': '60' } : {})
      }
    })
  }
}
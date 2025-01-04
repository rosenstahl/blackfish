import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const CSRF_TOKEN_COOKIE = 'csrf-token'
const CSRF_SECRET = process.env.CSRF_SECRET || 'your-default-csrf-secret'

function getClientIP(forwardedFor: string | null): string {
  if (!forwardedFor) return '127.0.0.1'
  return forwardedFor.split(',')[0].trim()
}

function generateToken(data: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex')
}

export async function POST(req: Request) {
  const cookieStore = cookies()
  const clientIP = getClientIP(req.headers.get('x-forwarded-for'))
  const userAgent = req.headers.get('user-agent') || 'unknown'

  const signature = generateToken(`${clientIP}:${userAgent}`, CSRF_SECRET)
  const token = crypto.randomBytes(32).toString('hex')

  cookieStore.set(CSRF_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  })

  return NextResponse.json({
    token,
    signature: Buffer.from(signature).toString('hex')
  })
}
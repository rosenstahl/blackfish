import { Resend } from 'resend'

// Create a singleton instance of Resend
const resendClient = new Resend(process.env.RESEND_API_KEY)

// Throw an error if the API key is missing
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables')
}

export const resend = resendClient 
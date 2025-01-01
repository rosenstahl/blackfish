import nodemailer from 'nodemailer'

type EmailConfig = {
  host: string
  port: number
  auth: {
    user: string
    pass: string
  }
}

const emailConfig: EmailConfig = {
  host: process.env['SMTP_HOST'] || '',
  port: Number(process.env['SMTP_PORT']) || 587,
  auth: {
    user: process.env['SMTP_USER'] || '',
    pass: process.env['SMTP_PASS'] || ''
  }
}

const transporter = nodemailer.createTransport(emailConfig)

type EmailData = {
  from: string
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail(data: EmailData) {
  // Setze default Werte
  const emailData = {
    from: process.env['SMTP_FROM'] || 'noreply@example.com',
    to: process.env['ADMIN_EMAIL'] || 'admin@example.com',
    ...data
  }

  try {
    const info = await transporter.sendMail(emailData)
    console.log('Email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
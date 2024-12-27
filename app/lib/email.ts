import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendContactMail(data: {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
}) {
  const { name, email, subject, message, phone } = data

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `Neue Kontaktanfrage: ${subject}`,
    html: `
      <h2>Neue Kontaktanfrage</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>E-Mail:</strong> ${email}</p>
      ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
      <p><strong>Betreff:</strong> ${subject}</p>
      <p><strong>Nachricht:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `
  })
}
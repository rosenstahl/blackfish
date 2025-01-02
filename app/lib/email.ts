import nodemailer from 'nodemailer';
import { env } from './env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  }
});

type EmailData = {
  subject: string;
  text: string;
  html?: string;
  from?: string;
  to?: string;
};

export async function sendEmail(data: EmailData): Promise<any> {
  const emailData = {
    from: data.from || env.SMTP_FROM,
    to: data.to || env.ADMIN_EMAIL,
    subject: data.subject,
    text: data.text,
    html: data.html
  };

  return transporter.sendMail(emailData);
}
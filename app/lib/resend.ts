import { Resend } from 'resend';
import { env } from './env';

const resendClient = new Resend(env.RESEND_API_KEY);

export { resendClient as resend };

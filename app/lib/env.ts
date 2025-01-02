function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export const env = {
  // API
  API_URL: getEnvVar('API_URL'),
  NEXT_PUBLIC_API_URL: getEnvVar('NEXT_PUBLIC_API_URL'),

  // Analytics
  NEXT_PUBLIC_GA_ID: getEnvVar('NEXT_PUBLIC_GA_ID'),
  NEXT_PUBLIC_SENTRY_DSN: getEnvVar('NEXT_PUBLIC_SENTRY_DSN'),

  // Email
  SMTP_HOST: getEnvVar('SMTP_HOST'),
  SMTP_PORT: Number(getEnvVar('SMTP_PORT')),
  SMTP_USER: getEnvVar('SMTP_USER'),
  SMTP_PASS: getEnvVar('SMTP_PASS'),
  SMTP_FROM: getEnvVar('SMTP_FROM'),
  ADMIN_EMAIL: getEnvVar('ADMIN_EMAIL'),

  // Security
  CSRF_SECRET: getEnvVar('CSRF_SECRET'),

  // Third Party
  RESEND_API_KEY: getEnvVar('RESEND_API_KEY'),
} as const;

// Typ für alle Umgebungsvariablen
declare global {
  namespace NodeJS {
    interface ProcessEnv extends Record<keyof typeof env, string> {}
  }
}
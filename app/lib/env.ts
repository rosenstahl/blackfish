const requiredEnvVars = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_API_URL',
  'NEXT_AUTH_SECRET',
  'NEXT_JWT_SECRET',
  'DATABASE_URL',
] as const;

type EnvVar = typeof requiredEnvVars[number];

function getEnvVar(key: EnvVar): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  app: {
    url: getEnvVar('NEXT_PUBLIC_APP_URL'),
    env: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',
  },
  api: {
    url: getEnvVar('NEXT_PUBLIC_API_URL'),
  },
  auth: {
    secret: getEnvVar('NEXT_AUTH_SECRET'),
    jwtSecret: getEnvVar('NEXT_JWT_SECRET'),
  },
  database: {
    url: getEnvVar('DATABASE_URL'),
  },
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID,
  },
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  stripe: {
    publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
  },
  security: {
    csrfSecret: process.env.CSRF_SECRET || 'default-csrf-secret',
    cookieSecret: process.env.COOKIE_SECRET || 'default-cookie-secret',
  },
  cache: {
    redisUrl: process.env.REDIS_URL,
  },
  assets: {
    prefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
    imageDomain: process.env.NEXT_PUBLIC_IMAGE_DOMAIN,
  },
  features: {
    blog: process.env.NEXT_PUBLIC_FEATURE_BLOG === 'true',
    shop: process.env.NEXT_PUBLIC_FEATURE_SHOP === 'true',
  },
  vercel: {
    token: process.env.VERCEL_TOKEN,
    orgId: process.env.VERCEL_ORG_ID,
    projectId: process.env.VERCEL_PROJECT_ID,
  },
} as const;

// Type helpers
export type Env = typeof env;
export type AppEnv = Env['app']['env'];

// Validate environment variables at build time
export function validateEnv() {
  requiredEnvVars.forEach(getEnvVar);

  // Validate email configuration if provided
  if (env.email.host) {
    if (!env.email.port || !env.email.user || !env.email.password) {
      throw new Error('Incomplete email configuration');
    }
  }

  // Validate Stripe configuration if provided
  if (env.stripe.publicKey && !env.stripe.secretKey) {
    throw new Error('Missing Stripe secret key');
  }

  // Validate Redis URL format if provided
  if (env.cache.redisUrl && !env.cache.redisUrl.startsWith('redis://')) {
    throw new Error('Invalid Redis URL format');
  }

  return env;
}
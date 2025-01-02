import * as Sentry from '@sentry/nextjs';
import type { CaptureContext } from '@sentry/types';
import { env } from './env';

interface CustomError extends Error {
  context?: Record<string, any>;
}

export function initMonitoring(): void {
  if (typeof window === 'undefined' || !env.NEXT_PUBLIC_SENTRY_DSN) return;

  Sentry.init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

export function captureError(error: CustomError, context?: Record<string, any>): void {
  const errorContext: CaptureContext = {};
  
  if (context || error.context) {
    errorContext.extra = {
      ...error.context,
      ...context
    };
  }

  Sentry.captureException(error, errorContext);
}
import { NextApiRequest, NextApiResponse } from 'next';
import rateLimit from 'express-rate-limit';
import { verify } from 'jsonwebtoken';

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// CSRF token validation
const validateCSRFToken = (req: NextApiRequest) => {
  const token = req.headers['x-csrf-token'];
  if (!token || typeof token !== 'string') {
    throw new Error('Missing CSRF token');
  }
  // Verify token
  return verify(token, process.env.CSRF_SECRET || 'default-secret');
};

// Request validation
const validateRequest = (req: NextApiRequest) => {
  // Validate content type
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid content type');
    }
  }

  // Validate origin
  const origin = req.headers.origin;
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  if (origin && !allowedOrigins.includes(origin)) {
    throw new Error('Invalid origin');
  }
};

// Sanitize request body
const sanitizeBody = (body: any) => {
  if (typeof body !== 'object' || body === null) {
    return body;
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string') {
      // Basic XSS protection
      sanitized[key] = value
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeBody(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// Main middleware function
export default function apiMiddleware(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Apply rate limiting
      await new Promise((resolve, reject) => {
        limiter(req, res, (result: any) =>
          result instanceof Error ? reject(result) : resolve(result)
        );
      });

      // Skip CSRF validation for GET requests and certain endpoints
      if (req.method !== 'GET' && !req.url?.startsWith('/api/public')) {
        validateCSRFToken(req);
      }

      // Validate request
      validateRequest(req);

      // Sanitize request body
      if (req.body) {
        req.body = sanitizeBody(req.body);
      }

      // Add security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');

      // Handle the request
      await handler(req, res);

    } catch (error: any) {
      console.error('API Error:', error);

      // Error response
      res.status(error.statusCode || 500).json({
        error: error.message || 'Internal Server Error',
        code: error.code || 'INTERNAL_ERROR'
      });
    }
  };
}
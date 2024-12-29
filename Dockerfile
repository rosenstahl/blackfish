# syntax=docker/dockerfile:1.4

# Base image with common settings
FROM node:23-alpine AS base

# Install additional dependencies
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    tini

# Set Node options
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Enable Corepack for better package management
RUN corepack enable

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with exact versions
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit

# Development dependencies stage (for build tools)
FROM deps AS dev-deps
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --include=dev

# Builder stage
FROM dev-deps AS builder
WORKDIR /app

# Copy source files
COPY . .

# Build application
ENV NEXT_TELEMETRY_DISABLED=1
RUN --mount=type=cache,target=/root/.next/cache \
    npm run build

# Test stage (optional)
FROM dev-deps AS tester
WORKDIR /app
COPY . .
RUN npm run lint && npm run test:ci

# Production runner stage
FROM base AS runner
WORKDIR /app

# Don't run as root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Set up output directory ownership
RUN mkdir .next \
    && chown nextjs:nodejs .next

# Copy production artifacts
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy configurations
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Set runtime user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Expose port
EXPOSE 3000

# Use Tini as init
ENTRYPOINT ["/sbin/tini", "--"]

# Start application
CMD ["node", "server.js"]

# Labels
LABEL org.opencontainers.image.source=https://github.com/rosenstahl/blackfish
LABEL org.opencontainers.image.description="Next.js application with optimized production build"
LABEL org.opencontainers.image.licenses=MIT
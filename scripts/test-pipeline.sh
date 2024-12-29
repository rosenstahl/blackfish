#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Starting pipeline test..."

# Check environment
echo "\n📝 Checking environment..."
if [ ! -f ".env.test" ]; then
    echo "${RED}Error: .env.test file not found${NC}"
    exit 1
fi

# Install dependencies
echo "\n📦 Installing dependencies..."
npm ci

# Type checking
echo "\n✨ Running type check..."
npm run type-check

# Linting
echo "\n🔍 Running linter..."
npm run lint

# Unit tests
echo "\n🧪 Running unit tests..."
NODE_ENV=test npm run test:ci

# Build application
echo "\n🏗️ Building application..."
NODE_ENV=production npm run build

# E2E tests
echo "\n🔄 Running E2E tests..."
npm run test:e2e

# Lighthouse tests
echo "\n📊 Running Lighthouse tests..."
npm run lighthouse

# Build Docker image
echo "\n🐳 Building Docker image..."
docker build -t blackfish:test .

# Test Docker image
echo "\n🧪 Testing Docker image..."
docker run --rm blackfish:test node -e 'console.log("Container test successful")'

# Start staging environment
echo "\n🌍 Starting staging environment..."
docker-compose -f docker-compose.staging.yml up -d

# Wait for services to be ready
echo "\n⏳ Waiting for services to be ready..."
sleep 10

# Health check
echo "\n💓 Performing health check..."
curl -f http://localhost:3000/api/health || (echo "${RED}Health check failed${NC}" && exit 1)

# Clean up
echo "\n🧹 Cleaning up..."
docker-compose -f docker-compose.staging.yml down
docker rmi blackfish:test

echo "\n${GREEN}✅ Pipeline test completed successfully!${NC}"

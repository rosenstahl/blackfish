#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Setting up staging environment..."

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "${RED}Error: docker is required but not installed${NC}" >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "${RED}Error: docker-compose is required but not installed${NC}" >&2; exit 1; }

# Create necessary directories
echo "\n📁 Creating directories..."
mkdir -p data/redis
mkdir -p data/uploads
mkdir -p data/letsencrypt

# Generate random passwords
echo "\n🔑 Generating secure passwords..."
REDIS_PASSWORD=$(openssl rand -base64 32)
TRAEFIK_PASSWORD=$(openssl rand -base64 32)

# Create environment files
echo "\n📝 Creating environment files..."
cat > .env.staging << EOL
NODE_ENV=staging
NEXT_PUBLIC_API_URL=https://staging.blackfish.digital/api
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
REDIS_PASSWORD=${REDIS_PASSWORD}
ACME_EMAIL=your-email@blackfish.digital
TRAEFIK_AUTH=admin:$(echo ${TRAEFIK_PASSWORD} | openssl passwd -stdin -apr1)
EOL

# Pull required images
echo "\n🐳 Pulling Docker images..."
docker-compose -f docker-compose.staging.yml pull

# Build images
echo "\n🏗️ Building images..."
docker-compose -f docker-compose.staging.yml build

# Start services
echo "\n🌟 Starting services..."
docker-compose -f docker-compose.staging.yml up -d

# Wait for services
echo "\n⏳ Waiting for services to start..."
sleep 10

# Check health
echo "\n💓 Checking health..."
curl -f https://staging.blackfish.digital/api/health || echo "${RED}Warning: Health check failed. Please check the logs.${NC}"

echo "\n${GREEN}✅ Staging environment setup complete!${NC}"
echo "\n📝 Traefik Dashboard Credentials:"
echo "Username: admin"
echo "Password: ${TRAEFIK_PASSWORD}"
echo "\n🌍 Staging URLs:"
echo "Application: https://staging.blackfish.digital"
echo "Traefik Dashboard: https://traefik.staging.blackfish.digital"

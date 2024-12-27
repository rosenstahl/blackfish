# BLACKFISH.DIGITAL

Production-ready Next.js website with comprehensive optimizations and best practices.

## Features

- ⚡️ Next.js 14 with App Router
- 🎨 TailwindCSS with custom configuration
- 📱 Fully responsive and mobile-first
- 🔒 Comprehensive security measures
- 🌍 Internationalization support
- 📊 Analytics and performance monitoring
- ♿️ WCAG 2.1 AA compliant
- 🧪 Extensive test coverage

## Requirements

- Node.js >= 20.0.0
- npm >= 10.0.0

## Quick Start

```bash
# Clone the repository
git clone https://github.com/rosenstahl/blackfish.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## Development

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Type check
npm run typecheck

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run e2e

# Run E2E tests with UI
npm run e2e:ui
```

## Build & Deployment

```bash
# Create production build
npm run build

# Start production server
npm run start

# Analyze bundle size
npm run analyze
```

## Performance Scores

- Lighthouse Performance: 98/100
- Lighthouse Accessibility: 100/100
- Lighthouse Best Practices: 100/100
- Lighthouse SEO: 100/100
- Core Web Vitals: All metrics in green

## Testing Coverage

- Unit Tests: >90%
- Integration Tests: >85%
- E2E Tests: Key user flows covered
- Accessibility Tests: WCAG 2.1 AA compliance
- Performance Tests: Core Web Vitals thresholds met

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Mobile Support

- iOS (latest 2 versions)
- Android (latest 2 versions)
- Responsive design for all screen sizes
- Touch-optimized interactions

## Security Measures

- CSRF Protection
- XSS Prevention
- Content Security Policy
- API Rate Limiting
- Input Sanitization
- Secure Headers

## Documentation

- [Components](./docs/components.md)
- [Hooks](./docs/hooks.md)
- [Utils](./docs/utils.md)
- [API](./docs/api.md)
- [Testing](./docs/testing.md)
- [Deployment](./docs/deployment.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

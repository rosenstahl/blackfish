import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Disallow admin and api routes
Disallow: /admin/
Disallow: /api/

# Disallow development routes
Disallow: /_next/
Disallow: /static/

# Allow Sitemap
Sitemap: https://blackfish.digital/sitemap.xml

# Crawl delay
Crawl-delay: 1

# Additional rules for specific bots
User-agent: GPTBot
Disallow: /private/
Disallow: /admin/

User-agent: ChatGPT-User
Disallow: /private/
Disallow: /admin/

User-agent: Google-Extended
Allow: /

User-agent: Googlebot-Image
Allow: /images/
Allow: /assets/
Disallow: /private/images/`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}
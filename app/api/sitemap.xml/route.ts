import { NextResponse } from 'next/server';
import { getAllPages, getAllBlogPosts } from '@/app/lib/content';

type SitemapURL = {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

const BASE_URL = 'https://blackfish.digital';

export async function GET() {
  try {
    const urls: SitemapURL[] = [
      // Static pages
      {
        loc: `${BASE_URL}/`,
        changefreq: 'daily',
        priority: 1.0
      },
      {
        loc: `${BASE_URL}/about`,
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: `${BASE_URL}/contact`,
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: `${BASE_URL}/features`,
        changefreq: 'weekly',
        priority: 0.9
      },
      {
        loc: `${BASE_URL}/pricing`,
        changefreq: 'weekly',
        priority: 0.9
      }
    ];

    // Add dynamic pages
    const pages = await getAllPages();
    pages.forEach(page => {
      urls.push({
        loc: `${BASE_URL}${page.path}`,
        lastmod: page.lastModified,
        changefreq: 'monthly',
        priority: 0.7
      });
    });

    // Add blog posts
    const posts = await getAllBlogPosts();
    posts.forEach(post => {
      urls.push({
        loc: `${BASE_URL}/blog/${post.slug}`,
        lastmod: post.lastModified,
        changefreq: 'monthly',
        priority: 0.6
      });
    });

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      url => `<url>
    <loc>${url.loc}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `
    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority ? `
    <priority>${url.priority}</priority>` : ''}
  </url>`
    )
    .join('\n')}
</urlset>`;

    // Return the sitemap
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
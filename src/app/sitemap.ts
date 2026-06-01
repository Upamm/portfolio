import type { MetadataRoute } from 'next';
import { hardcodedArticles } from '@/lib/blog-data';

const SITE_URL = 'https://upam1721.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = hardcodedArticles.map((article) => {
    // Parse the human-readable date to ISO format for lastModified
    const dateStr = article.date;
    let lastModified = new Date();
    try {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        lastModified = parsed;
      }
    } catch {
      // Fallback to current date
    }

    return {
      url: `${SITE_URL}/#${article.id}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    };
  });

  return [...staticPages, ...blogPages];
}

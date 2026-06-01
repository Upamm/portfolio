'use client';

import { useMemo } from 'react';
import { hardcodedArticles } from '@/lib/blog-data';

const SITE_URL = 'https://upam1721.com';

/**
 * Parses a human-readable date string like "May 15, 2025" to ISO 8601.
 */
function parseDateToISO(dateStr: string): string {
  try {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  } catch {
    // fallback
  }
  return new Date().toISOString();
}

/**
 * Extracts plain text content from article content blocks for articleBody.
 */
function extractArticleBody(content: { type: string; text?: string; items?: string[] }[]): string {
  return content
    .map((block) => {
      if (block.type === 'paragraph' && block.text) return block.text;
      if (block.type === 'heading' && block.text) return block.text;
      if (block.type === 'list' && block.items) return block.items.join('. ');
      if (block.type === 'tip' && block.text) return block.text;
      return '';
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * Counts words in a string.
 */
function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function JsonLdSchema() {
  const schemas = useMemo(() => {
    const result: object[] = [];

    // ──────────────────────────────────────────────
    // 1. Person Schema (about Upam)
    // ──────────────────────────────────────────────
    result.push({
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Upam',
      url: SITE_URL,
      jobTitle: 'WordPress Virtual Assistant & Web Designer',
      description:
        'WordPress Virtual Assistant & B2B Lead Generation specialist with 8+ years of experience. Expert in WordPress site management, theme customization, plugin setup, speed optimization, and virtual assistant services.',
      sameAs: [
        'https://www.fiverr.com/upam1721',
        'https://twitter.com/upam1721',
        'https://www.linkedin.com/in/upam1721',
      ],
      knowsAbout: [
        'WordPress Development',
        'Web Design',
        'B2B Lead Generation',
        'Speed Optimization',
        'Virtual Assistance',
        'E-Commerce',
        'SEO',
        'Theme Customization',
      ],
    });

    // ──────────────────────────────────────────────
    // 2. WebSite Schema
    // ──────────────────────────────────────────────
    result.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Upam Portfolio',
      url: SITE_URL,
      description:
        'Professional portfolio of Upam — WordPress Virtual Assistant & Web Designer with 8+ years experience.',
      publisher: {
        '@id': `${SITE_URL}/#person`,
      },
      inLanguage: 'en-US',
    });

    // ──────────────────────────────────────────────
    // 3. BreadcrumbList Schema
    // ──────────────────────────────────────────────
    result.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog & Articles',
          item: `${SITE_URL}/#blog`,
        },
      ],
    });

    // ──────────────────────────────────────────────
    // 4. ItemList Schema (Blog Collection)
    // ──────────────────────────────────────────────
    const blogItems = hardcodedArticles.map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: article.title,
      url: `${SITE_URL}/#${article.id}`,
    }));

    result.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${SITE_URL}/#blog-list`,
      name: 'Blog & Articles by Upam',
      description: 'A collection of articles about WordPress development, web design, SEO, lead generation, and freelancing.',
      numberOfItems: blogItems.length,
      itemListElement: blogItems,
    });

    // ──────────────────────────────────────────────
    // 5. BlogPosting Schema for EACH article
    // ──────────────────────────────────────────────
    for (const article of hardcodedArticles) {
      const isoDate = parseDateToISO(article.date);
      const articleBody = extractArticleBody(article.content);
      const wordCount = countWords(articleBody);
      const articleUrl = `${SITE_URL}/#${article.id}`;

      result.push({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${articleUrl}#article`,
        headline: article.title,
        description: article.excerpt,
        image: {
          '@type': 'ImageObject',
          url: article.image.startsWith('http')
            ? article.image
            : `${SITE_URL}${article.image}`,
          width: 1200,
          height: 630,
        },
        datePublished: isoDate,
        dateModified: isoDate,
        author: {
          '@type': 'Person',
          name: 'Upam',
          url: 'https://www.fiverr.com/upam1721',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Upam Portfolio',
          url: SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/icon.svg`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': articleUrl,
        },
        wordCount,
        articleSection: article.category,
        keywords: article.tags.join(', '),
        inLanguage: 'en-US',
        url: articleUrl,
      });

      // BreadcrumbList per article
      result.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${articleUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog & Articles',
            item: `${SITE_URL}/#blog`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: articleUrl,
          },
        ],
      });
    }

    // ──────────────────────────────────────────────
    // 6. Organization Schema (for publisher reference)
    // ──────────────────────────────────────────────
    result.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Upam Portfolio',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.svg`,
      },
      sameAs: [
        'https://www.fiverr.com/upam1721',
        'https://twitter.com/upam1721',
      ],
    });

    return result;
  }, []);

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

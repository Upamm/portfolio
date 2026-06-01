'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Calendar,
  Clock,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Tag,
} from 'lucide-react';
import Image from 'next/image';
import BlogArticleModal from '@/components/portfolio/BlogArticleModal';

/* ------------------------------------------------------------------ */
/*  Exported types (used by BlogArticleModal.tsx)                      */
/* ------------------------------------------------------------------ */

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  gradient: string;
  tags: string[];
  author: string;
  content: BlogContentBlock[];
  relatedPosts: string[];
}

export interface BlogContentBlock {
  type: 'paragraph' | 'heading' | 'list' | 'tip' | 'stats' | 'code' | 'related-reading';
  text?: string;
  items?: string[];
  stats?: { label: string; value: string }[];
  links?: { title: string; articleId: string; description: string }[];
}

// Blog articles loaded from separate data module for better code splitting
import { hardcodedArticles as articles } from '@/lib/blog-data';
export { articles };


/* ------------------------------------------------------------------ */
/*  BlogCard component                                                 */
/* ------------------------------------------------------------------ */

function BlogCard({
  article,
  index,
  isInView,
  onClick,
}: {
  article: BlogArticle;
  index: number;
  isInView: boolean;
  onClick: () => void;
}) {
  return (
    <motion.article
      onClick={onClick}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.12 }}
      className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover-glow"
    >
      {/* Category gradient header with image */}
      <div
        className={`relative h-48 bg-gradient-to-br ${article.gradient} overflow-hidden`}
      >
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover opacity-60 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* overlay gradient from bottom */}
        <div className="absolute inset-0 blog-card-image-fade" />
        {/* Category badge top-left */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium">
            {article.category}
          </span>
        </div>
        {/* Read time badge top-right */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
        </div>
        {/* Book icon bottom-right */}
        <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform z-10">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs blog-card-meta mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {article.date}
          </span>
          <span className="blog-card-meta">by {article.author}</span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold blog-card-title mb-3 transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="blog-card-excerpt text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full blog-tag"
            >
              {tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="text-xs px-2.5 py-1 rounded-full blog-tag-more">
              +{article.tags.length - 3}
            </span>
          )}
        </div>

        {/* Read more link */}
        <div className="flex items-center gap-2 blog-card-readmore text-sm font-medium group-hover:gap-3 transition-all">
          Read Full Article
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  BlogSection (default export)                                       */
/* ------------------------------------------------------------------ */

const POSTS_PER_PAGE = 6;

const popularTopics = [
  {
    label: 'WordPress Development',
    category: 'WordPress',
    count: articles.filter((a) => a.category === 'WordPress').length,
  },
  {
    label: 'E-Commerce & WooCommerce',
    category: 'E-Commerce',
    count: articles.filter((a) => a.category === 'E-Commerce').length,
  },
  {
    label: 'SEO & Marketing',
    category: 'SEO',
    count: articles.filter((a) => a.category === 'SEO').length,
  },
  {
    label: 'Lead Generation',
    category: 'Lead Generation',
    count: articles.filter((a) => a.category === 'Lead Generation').length,
  },
  {
    label: 'Business & Productivity',
    category: 'Business',
    count: articles.filter((a) => a.category === 'Business').length,
  },
  {
    label: 'Website Security',
    category: 'Security',
    count: articles.filter((a) => a.category === 'Security').length,
  },
  {
    label: 'Speed Optimization',
    category: 'Speed',
    count: articles.filter((a) => a.category === 'Speed').length,
  },
  {
    label: 'Web Design',
    category: 'Web Design',
    count: articles.filter((a) => a.category === 'Web Design').length,
  },
  {
    label: 'Freelancing Tips',
    category: 'Freelancing',
    count: articles.filter((a) => a.category === 'Freelancing').length,
  },
];

// Category to gradient mapping for DB posts
const categoryGradients: Record<string, string> = {
  'Freelancing': 'from-amber-500 to-orange-500',
  'WordPress': 'from-teal-500 to-cyan-500',
  'E-Commerce': 'from-emerald-500 to-cyan-500',
  'SEO': 'from-purple-500 to-pink-500',
  'Lead Generation': 'from-rose-500 to-orange-500',
  'Web Design': 'from-sky-500 to-teal-500',
  'Business': 'from-indigo-500 to-purple-500',
  'Virtual Assistant': 'from-cyan-500 to-blue-500',
};

export default function BlogSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [openArticleIndex, setOpenArticleIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [dbArticles, setDbArticles] = useState<BlogArticle[]>([]);

  // Fetch blog posts from database on mount
  useEffect(() => {
    fetch('/api/blog?limit=100')
      .then((res) => res.json())
      .then((data) => {
        if (data.posts && Array.isArray(data.posts)) {
          const mapped: BlogArticle[] = data.posts.map((post: Record<string, unknown>) => ({
            id: post.id as string,
            title: post.title as string,
            excerpt: post.excerpt as string,
            category: post.category as string,
            readTime: post.readTime as string,
            date: new Date(post.createdAt as string).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
            image: (post.image as string) || '/blog/default.png',
            gradient: (post.gradient as string) || categoryGradients[post.category as string] || 'from-teal-500 to-cyan-500',
            tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : (post.tags as string[] || []),
            author: (post.author as string) || 'Upam',
            content: typeof post.content === 'string' ? JSON.parse(post.content) : (post.content as BlogContentBlock[] || []),
            relatedPosts: [],
          }));
          setDbArticles(mapped);
        }
      })
      .catch(() => {
        // Silently fail — hardcoded articles will be used as fallback
      });
  }, []);

  // Merge: DB articles first (newest), then hardcoded
  const allArticles = [...dbArticles, ...articles];

  const openArticle =
    openArticleIndex !== null ? allArticles[openArticleIndex] : null;

  const visibleArticles = allArticles.slice(0, visibleCount);
  const hasMore = visibleCount < allArticles.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + POSTS_PER_PAGE, allArticles.length));
  };

  // Listen for blog-navigate events from internal links in article modal
  const handleBlogNavigate = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail as string;
    if (detail) {
      const idx = dbArticles.length > 0
        ? [...dbArticles, ...articles].findIndex((a) => a.id === detail)
        : articles.findIndex((a) => a.id === detail);
      if (idx !== -1) {
        setOpenArticleIndex(idx);
      }
    }
  }, [dbArticles]);

  useEffect(() => {
    window.addEventListener('blog-navigate', handleBlogNavigate);
    return () => window.removeEventListener('blog-navigate', handleBlogNavigate);
  }, [handleBlogNavigate]);

  const handleTopicClick = (category: string) => {
    const matchIdx = allArticles.findIndex((a) => a.category === category);
    if (matchIdx !== -1) setOpenArticleIndex(matchIdx);
  };

  return (
    <section id="blog" className="relative pt-20 sm:pt-24 pb-10 sm:pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-15" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-10"
        >
          <span className="blog-section-label text-sm font-medium uppercase tracking-widest">
            Latest Insights
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Blog & <span className="gradient-text">Articles</span>
          </h2>
          <span className="section-heading-line" />
          <p className="blog-section-desc mt-6 max-w-2xl mx-auto">
            Sharing knowledge and insights about WordPress development,
            lead generation, and virtual assistance best practices.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {visibleArticles.map((article, index) => (
            <BlogCard
              key={article.id}
              article={article}
              index={index}
              isInView={isInView}
              onClick={() => setOpenArticleIndex(allArticles.indexOf(article))}
            />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex justify-center mt-10 sm:mt-12"
          >
            <button
              onClick={handleLoadMore}
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold border border-white/10 bg-white/5 backdrop-blur-sm text-slate-300 hover:border-teal-500/40 hover:text-teal-300 hover:bg-teal-500/10 transition-all duration-300"
            >
              Load More Articles
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              <span className="text-xs text-slate-500">
                ({allArticles.length - visibleCount} remaining)
              </span>
            </button>
          </motion.div>
        )}

        {/* Article Detail Modal */}
        <BlogArticleModal
          article={openArticle}
          isOpen={openArticleIndex !== null}
          onClose={() => setOpenArticleIndex(null)}
          allArticles={allArticles}
        />

        {/* Popular Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-12 sm:mt-16"
        >
          <h3 className="text-lg font-semibold blog-topic-heading mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            Popular Topics
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularTopics.map((topic) => (
              <button
                key={topic.label}
                onClick={() => handleTopicClick(topic.category)}
                className="flex items-center justify-between px-4 py-3 rounded-xl glass-card border border-white/5 hover:border-teal-500/30 transition-all group"
              >
                <span className="text-sm blog-topic-label transition-colors">
                  {topic.label}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full blog-topic-count">
                  {topic.count} article{topic.count !== 1 ? 's' : ''}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

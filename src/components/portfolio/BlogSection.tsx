'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, Clock, ArrowUpRight, BookOpen } from 'lucide-react';

const articles = [
  {
    title: '10 Essential WordPress Speed Optimization Tips for 2025',
    excerpt:
      'Learn the top strategies to make your WordPress site lightning-fast, from caching to image optimization and code minification techniques.',
    category: 'WordPress',
    readTime: '5 min read',
    date: 'May 15, 2025',
    gradient: 'from-teal-500 to-cyan-500',
    tags: ['Speed', 'Performance', 'WordPress'],
  },
  {
    title: 'How B2B Lead Generation Can Transform Your Business Growth',
    excerpt:
      'Discover proven lead generation strategies that help businesses find qualified prospects and build a sustainable sales pipeline.',
    category: 'Lead Generation',
    readTime: '7 min read',
    date: 'April 28, 2025',
    gradient: 'from-emerald-500 to-teal-500',
    tags: ['B2B', 'Lead Gen', 'Growth'],
  },
  {
    title: 'Why Every Business Needs a Virtual Assistant in 2025',
    excerpt:
      'Explore how virtual assistants can save time, reduce costs, and help business owners focus on what matters most — growing their company.',
    category: 'Business',
    readTime: '4 min read',
    date: 'April 10, 2025',
    gradient: 'from-cyan-500 to-emerald-500',
    tags: ['VA', 'Productivity', 'Business'],
  },
];

function BlogCard({
  article,
  index,
  isInView,
}: {
  article: (typeof articles)[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.15 }}
      className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover-glow"
    >
      {/* Category gradient header */}
      <div
        className={`relative h-40 bg-gradient-to-br ${article.gradient} overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
        {/* Decorative grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-grid" style={{ backgroundSize: '30px 30px' }} />
        </div>
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium">
            {article.category}
          </span>
        </div>
        {/* Book icon */}
        <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-teal-300 transition-colors leading-snug">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Read more link */}
        <div className="flex items-center gap-2 text-teal-400 text-sm font-medium group-hover:gap-3 transition-all">
          Read Article
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </motion.article>
  );
}

export default function BlogSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="blog" className="relative py-24 sm:py-32 overflow-hidden">
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
          className="text-center mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            Latest Insights
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Blog & <span className="gradient-text">Articles</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            Sharing knowledge and insights about WordPress development,
            lead generation, and virtual assistance best practices.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article, index) => (
            <BlogCard
              key={article.title}
              article={article}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* View all articles CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-teal-400 border border-teal-500/30 hover:border-teal-400/60 hover:bg-teal-500/10 transition-all duration-300 hover:scale-105"
          >
            View All Articles
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

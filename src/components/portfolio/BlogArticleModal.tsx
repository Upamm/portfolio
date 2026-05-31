'use client';

import { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, X, User, Lightbulb, Code2 } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import type { BlogArticle, BlogContentBlock } from './BlogSection';

export type ArticleModalProps = {
  article: BlogArticle | null;
  isOpen: boolean;
  onClose: () => void;
};

function ContentBlock({ block, index }: { block: BlogContentBlock; index: number }) {
  if (block.type === 'heading') {
    return (
      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.03 }}
        className="text-lg sm:text-xl font-bold text-white mt-8 mb-3 flex items-center gap-2"
      >
        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-teal-400 to-emerald-400 flex-shrink-0" />
        {block.text}
      </motion.h3>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.03 }}
        className="text-slate-400 leading-relaxed text-sm sm:text-base mb-4"
      >
        {block.text}
      </motion.p>
    );
  }

  if (block.type === 'list') {
    return (
      <motion.ul
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.03 }}
        className="space-y-2.5 mb-6"
      >
        {block.items?.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm sm:text-base text-slate-400"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </motion.ul>
    );
  }

  if (block.type === 'tip') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.03 }}
        className="my-6 p-4 sm:p-5 rounded-xl bg-teal-500/5 border border-teal-500/20"
      >
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-teal-400" />
          <span className="text-sm font-semibold text-teal-400">Pro Tip</span>
        </div>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          {block.text}
        </p>
      </motion.div>
    );
  }

  if (block.type === 'stats') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.03 }}
        className="my-6 grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {block.stats?.map((stat) => (
          <div
            key={stat.label}
            className="text-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-teal-500/5 to-emerald-500/5 border border-teal-500/10"
          >
            <div className="text-xl sm:text-2xl font-bold gradient-text mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    );
  }

  if (block.type === 'code') {
    return (
      <motion.pre
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.03 }}
        className="my-4 p-4 rounded-lg bg-black/40 border border-white/5 overflow-x-auto"
      >
        <code className="text-sm text-teal-300 font-mono whitespace-pre-wrap">
          {block.text}
        </code>
      </motion.pre>
    );
  }

  return null;
}

export default function BlogArticleModal({
  article,
  isOpen,
  onClose,
}: ArticleModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when article changes
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [isOpen, article?.id]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && article && (
          <DialogContent
            showCloseButton={false}
            className="glass-card rounded-2xl max-w-3xl mx-4 p-0 overflow-hidden border-white/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4 max-h-[90vh] flex flex-col"
          >
            <DialogTitle className="sr-only">{article.title}</DialogTitle>
            <DialogDescription className="sr-only">
              {article.excerpt}
            </DialogDescription>

            {/* Image Header */}
            <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br overflow-hidden flex-shrink-0">
              {/* Background image */}
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover opacity-70"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/50 to-[#0a1628]/20" />
              <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient} opacity-30`} />

              {/* Category badge */}
              <div className="absolute top-5 left-6 z-10">
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium border border-white/10">
                  {article.category}
                </span>
              </div>

              {/* Read time badge */}
              <div className="absolute top-5 right-16 z-10">
                <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1 border border-white/10">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>

              {/* Close Button */}
              <DialogClose asChild>
                <button
                  className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 hover:bg-teal-500/80 hover:text-white hover:border-teal-400 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:ring-offset-2 focus:ring-offset-black/20"
                  aria-label="Close article"
                >
                  <X className="w-4 h-4" />
                </button>
              </DialogClose>

              {/* Decorative corner badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="absolute bottom-5 right-6 z-10 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
              >
                <span className="text-xl font-bold text-white/70">
                  {article.category.charAt(0)}
                </span>
              </motion.div>
            </div>

            {/* Scrollable Content */}
            <div
              ref={contentRef}
              className="overflow-y-auto flex-1 p-6 sm:p-8"
            >
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  {article.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-teal-400" />
                  {article.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-400" />
                  {article.readTime}
                </span>
              </div>

              {/* Full title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-5">
                {article.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent mb-6" />

              {/* Article illustration inline */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden mb-8"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover rounded-xl"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient} opacity-20 rounded-xl`} />
              </motion.div>

              {/* Full article content */}
              <div>
                {article.content.map((block, idx) => (
                  <ContentBlock key={idx} block={block} index={idx} />
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={() => onClose()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-400 hover:to-emerald-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25"
                >
                  Back to Blog
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onClose()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:border-teal-500/30 hover:text-teal-300 transition-all duration-300"
                >
                  Share This Article
                </button>
              </div>
            </div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

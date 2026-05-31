'use client';

import { useRef, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, X, User, Lightbulb } from 'lucide-react';
import Image from 'next/image';
import type { BlogArticle, BlogContentBlock } from './BlogSection';

// Check if we're in the browser (client-side)
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

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
        className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mt-8 lg:mt-10 mb-3 lg:mb-4 flex items-start gap-2"
      >
        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-teal-400 to-emerald-400 flex-shrink-0 mt-0.5" />
        <span>{block.text}</span>
      </motion.h3>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.03 }}
        className="text-slate-400 leading-relaxed text-sm sm:text-base lg:text-[17px] mb-4 lg:mb-5"
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
            className="flex items-start gap-3 text-sm sm:text-base lg:text-[17px] text-slate-400"
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
        className="my-4 p-4 rounded-lg bg-black/40 border border-white/5 overflow-x-auto max-w-full"
      >
        <code className="text-sm text-teal-300 font-mono whitespace-pre-wrap break-all">
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
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (contentRef.current) contentRef.current.scrollTop = 0;
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, article?.id]);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && article && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 pointer-events-none"
          >
            <div
              className="relative z-[10001] w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[92vh] sm:max-h-[94vh] md:max-h-[95vh] rounded-2xl overflow-hidden pointer-events-auto glass-card border border-white/10 shadow-2xl shadow-black/40 flex flex-col mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Header */}
              <div className="relative h-40 sm:h-48 md:h-56 bg-gradient-to-br flex-shrink-0">
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
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10">
                  <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium border border-white/10">
                    {article.category}
                  </span>
                </div>

                {/* Read time badge */}
                <div className="absolute top-4 right-12 sm:top-5 sm:right-14 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1 border border-white/10">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 hover:bg-teal-500/80 hover:text-white hover:border-teal-400 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  aria-label="Close article"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div
                ref={contentRef}
                className="overflow-y-auto overflow-x-hidden flex-1 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 scroll-smooth"
              >
                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-400" />
                    {article.author}
                  </span>
                </div>

                {/* Full title */}
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4 lg:mb-5">
                  {article.title}
                </h1>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent mb-5 sm:mb-6" />

                {/* Article illustration inline */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-40 sm:h-52 md:h-60 lg:h-72 rounded-xl overflow-hidden mb-6 sm:mb-8 lg:mb-10"
                >
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width: 768px) 100vw, 672px"
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
                <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 pb-2">
                  <button
                    onClick={() => onClose()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-400 hover:to-emerald-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25"
                  >
                    Back to Blog
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:border-teal-500/30 hover:text-teal-300 transition-all duration-300"
                  >
                    Share This Article
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

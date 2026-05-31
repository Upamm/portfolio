'use client';

import { useRef, useEffect, useState, useMemo, useCallback, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  ArrowRight,
  X,
  User,
  Lightbulb,
  BookOpen,
  Twitter,
  Facebook,
  Linkedin,
  Link,
  Check,
  Copy,
  Share2,
  MessageCircle,
} from 'lucide-react';
import Image from 'next/image';
import type { BlogArticle, BlogContentBlock } from './BlogSection';
import { articles } from './BlogSection';

// Check if we're in the browser (client-side)
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export type ArticleModalProps = {
  article: BlogArticle | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (articleId: string) => void;
};

/* ------------------------------------------------------------------ */
/*  Share helper                                                       */
/* ------------------------------------------------------------------ */

function getShareUrl() {
  if (typeof window === 'undefined') return '';
  return window.location.href + '#blog';
}

function openShareWindow(url: string) {
  window.open(url, '_blank', 'width=600,height=400,noopener,noreferrer');
}

/* ------------------------------------------------------------------ */
/*  Content Block renderer (unchanged)                                 */
/* ------------------------------------------------------------------ */

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

  if (block.type === 'related-reading' && block.links && block.links.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.03 }}
        className="my-8 p-5 sm:p-6 rounded-xl bg-gradient-to-br from-teal-500/5 to-emerald-500/5 border border-teal-500/15"
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-teal-400" />
          <span className="text-sm font-semibold text-teal-400">Continue Reading</span>
        </div>
        <div className="space-y-3">
          {block.links.map((link) => {
            const relatedArticle = articles.find((a) => a.id === link.articleId);
            return (
              <a
                key={link.articleId}
                href={`#blog-${link.articleId}`}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-teal-500/5 border border-white/5 hover:border-teal-500/20 transition-all duration-200 group cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  // Navigate to related article — dispatch custom event for parent to handle
                  window.dispatchEvent(new CustomEvent('blog-navigate', { detail: link.articleId }));
                }}
              >
                {relatedArticle && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                    <Image
                      src={relatedArticle.image}
                      alt={link.title}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                      sizes="48px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-teal-300 transition-colors line-clamp-1">
                    {link.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                    {link.description}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-teal-400 shrink-0 mt-1 transition-colors" />
              </a>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  Sticky Share Sidebar (desktop only)                               */
/* ------------------------------------------------------------------ */

function StickyShareSidebar({
  articleTitle,
  onCopied,
  copied,
}: {
  articleTitle: string;
  onCopied: () => void;
  copied: boolean;
}) {
  const shareUrl = getShareUrl();
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(articleTitle);

  const buttonClass =
    'w-9 h-9 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-teal-500/20 hover:border-teal-500/30 transition-all duration-200 hover:scale-110';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="hidden lg:flex fixed left-4 xl:left-8 top-1/2 -translate-y-1/2 z-[10010] flex-col gap-2.5"
    >
      {/* Twitter / X */}
      <button
        onClick={() => openShareWindow(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`)}
        className={buttonClass}
        aria-label="Share on Twitter/X"
        title="Share on Twitter/X"
      >
        <Twitter className="w-4 h-4" />
      </button>

      {/* Facebook */}
      <button
        onClick={() => openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}
        className={buttonClass}
        aria-label="Share on Facebook"
        title="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </button>

      {/* LinkedIn */}
      <button
        onClick={() => openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`)}
        className={buttonClass}
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </button>

      {/* Copy Link */}
      <button
        onClick={onCopied}
        className={buttonClass}
        aria-label="Copy link"
        title="Copy link"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link className="w-4 h-4" />}
      </button>

      {/* WhatsApp */}
      <button
        onClick={() => openShareWindow(`https://wa.me/?text=${encodedTitle}%20-%20${encodedUrl}`)}
        className={buttonClass}
        aria-label="Share on WhatsApp"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Share Bar (bottom of article)                                      */
/* ------------------------------------------------------------------ */

function ShareBar({
  articleTitle,
  onCopied,
  copied,
}: {
  articleTitle: string;
  onCopied: () => void;
  copied: boolean;
}) {
  const shareUrl = getShareUrl();
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(articleTitle);

  const shareButtonClass =
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 hover:scale-105';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="w-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <Share2 className="w-5 h-5 text-teal-400" />
        <span className="text-sm font-semibold text-white">Share This Article</span>
        <div className="flex-1 h-px bg-gradient-to-r from-teal-500/30 to-transparent" />
      </div>

      <div className="flex flex-wrap gap-2.5">
        {/* Copy Link */}
        <button
          onClick={onCopied}
          className={`${shareButtonClass} bg-white/5 border-white/10 text-slate-300 hover:bg-teal-500/10 hover:border-teal-500/30 hover:text-teal-300`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        {/* Twitter / X */}
        <button
          onClick={() => openShareWindow(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`)}
          className={`${shareButtonClass} bg-white/5 border-white/10 text-slate-300 hover:bg-teal-500/10 hover:border-teal-500/30 hover:text-teal-300`}
        >
          <Twitter className="w-4 h-4" />
          <span>Twitter / X</span>
        </button>

        {/* Facebook */}
        <button
          onClick={() => openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}
          className={`${shareButtonClass} bg-white/5 border-white/10 text-slate-300 hover:bg-teal-500/10 hover:border-teal-500/30 hover:text-teal-300`}
        >
          <Facebook className="w-4 h-4" />
          <span>Facebook</span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`)}
          className={`${shareButtonClass} bg-white/5 border-white/10 text-slate-300 hover:bg-teal-500/10 hover:border-teal-500/30 hover:text-teal-300`}
        >
          <Linkedin className="w-4 h-4" />
          <span>LinkedIn</span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => openShareWindow(`https://wa.me/?text=${encodedTitle}%20-%20${encodedUrl}`)}
          className={`${shareButtonClass} bg-white/5 border-white/10 text-slate-300 hover:bg-teal-500/10 hover:border-teal-500/30 hover:text-teal-300`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Related Posts                                                       */
/* ------------------------------------------------------------------ */

function RelatedPosts({
  article,
  onNavigate,
}: {
  article: BlogArticle;
  onNavigate?: (articleId: string) => void;
}) {
  const related = useMemo(() => {
    return articles
      .filter((a) => a.category === article.category && a.id !== article.id)
      .slice(0, 3);
  }, [article.id, article.category]);

  if (related.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full mt-8 sm:mt-10"
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm font-semibold gradient-text">You Might Also Like</span>
        <div className="flex-1 h-px bg-gradient-to-r from-teal-500/30 to-transparent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {related.map((relatedArticle, idx) => (
          <motion.button
            key={relatedArticle.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            onClick={() => onNavigate?.(relatedArticle.id)}
            className="group text-left p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-teal-500/20 hover:bg-teal-500/[0.04] transition-all duration-300"
          >
            {/* Image */}
            <div className="relative w-full h-24 sm:h-28 rounded-lg overflow-hidden mb-3">
              <Image
                src={relatedArticle.image}
                alt={relatedArticle.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 250px"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${relatedArticle.gradient} opacity-20`} />
            </div>

            {/* Category */}
            <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium mb-1.5">
              {relatedArticle.category}
            </span>

            {/* Title */}
            <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2 mb-1.5 group-hover:text-teal-300 transition-colors duration-200">
              {relatedArticle.title}
            </h4>

            {/* Read Time */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              <span>{relatedArticle.readTime}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Modal Component                                                */
/* ------------------------------------------------------------------ */

export default function BlogArticleModal({
  article,
  isOpen,
  onClose,
  onNavigate,
}: ArticleModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [copied, setCopied] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef<number>(0);

  // Scroll handler with RAF throttling
  const handleContentScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (contentRef.current) {
        setScrollY(contentRef.current.scrollTop);
      }
    });
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
        // Dispatch a scroll event so the scroll handler picks up scrollTop=0
        contentRef.current.dispatchEvent(new Event('scroll'));
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, article?.id]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Compute header shrink values
  const maxShrinkScroll = 160;
  const shrinkRatio = Math.min(scrollY / maxShrinkScroll, 1);
  // Clamp with easeOut for smoother feel
  const easedRatio = 1 - Math.pow(1 - shrinkRatio, 3);
  const badgeOpacity = 1 - easedRatio;
  const badgeTranslateY = easedRatio * -10;
  const headerMinH = 56;
  const headerMaxH = typeof window !== 'undefined' && window.innerWidth >= 768
    ? 224
    : typeof window !== 'undefined' && window.innerWidth >= 640
      ? 192
      : 160;
  const headerHeight = headerMaxH - easedRatio * (headerMaxH - headerMinH);
  const imageScale = 1 + easedRatio * 0.08;
  const imageTranslateY = easedRatio * -8;

  const handleCopyLink = useCallback(() => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handleNavigate = useCallback(
    (articleId: string) => {
      onClose();
      // Short delay so the modal can close before re-opening with new article
      setTimeout(() => {
        onNavigate?.(articleId);
      }, 300);
    },
    [onClose, onNavigate],
  );

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

          {/* Sticky Share Sidebar (Desktop) */}
          <StickyShareSidebar
            articleTitle={article.title}
            onCopied={handleCopyLink}
            copied={copied}
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
              {/* Image Header - shrinks on scroll */}
              <div
                className="relative bg-gradient-to-br flex-shrink-0 overflow-hidden"
                style={{
                  height: `${headerHeight}px`,
                  transition: 'height 0.1s ease-out',
                }}
              >
                {/* Background image - subtle zoom on scroll */}
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover opacity-70"
                  style={{
                    transform: `scale(${imageScale}) translateY(${imageTranslateY}px)`,
                    transition: 'transform 0.1s ease-out',
                  }}
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 blog-modal-image-fade" />
                <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient} opacity-30`} />
                {/* Extra bottom gradient for shrunk state */}
                <div
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent"
                  style={{ height: `${24 + easedRatio * 32}px` }}
                />

                {/* Category badge - fades on scroll */}
                <div
                  className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10"
                  style={{
                    opacity: badgeOpacity,
                    transform: `translateY(${badgeTranslateY}px)`,
                    transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
                    pointerEvents: badgeOpacity < 0.3 ? 'none' : 'auto',
                  }}
                >
                  <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium border border-white/10">
                    {article.category}
                  </span>
                </div>

                {/* Read time badge - fades on scroll */}
                <div
                  className="absolute top-4 right-12 sm:top-5 sm:right-14 z-10"
                  style={{
                    opacity: badgeOpacity,
                    transform: `translateY(${badgeTranslateY}px)`,
                    transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
                    pointerEvents: badgeOpacity < 0.3 ? 'none' : 'auto',
                  }}
                >
                  <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1 border border-white/10">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>

                {/* Close Button - stays visible */}
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
                onScroll={handleContentScroll}
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

                {/* Related Posts */}
                <RelatedPosts article={article} onNavigate={handleNavigate} />

                {/* Share Bar */}
                <div className="mt-8 sm:mt-10 pt-6 border-t border-white/5">
                  <ShareBar
                    articleTitle={article.title}
                    onCopied={handleCopyLink}
                    copied={copied}
                  />
                </div>

                {/* Bottom CTA */}
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 pb-2">
                  <button
                    onClick={() => onClose()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-400 hover:to-emerald-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25"
                  >
                    Back to Blog
                    <ArrowRight className="w-4 h-4" />
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

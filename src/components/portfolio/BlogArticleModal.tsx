'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

export type ArticleModalProps = {
  article: {
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    date: string;
    gradient: string;
    tags: string[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function BlogArticleModal({
  article,
  isOpen,
  onClose,
}: ArticleModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && article && (
          <DialogContent
            showCloseButton={false}
            className="glass-card rounded-2xl max-w-2xl mx-4 p-0 overflow-hidden border-white/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4"
          >
            <DialogTitle className="sr-only">{article.title}</DialogTitle>
            <DialogDescription className="sr-only">
              {article.excerpt}
            </DialogDescription>

            {/* Gradient Header */}
            <div className="relative h-56 bg-gradient-to-br overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${article.gradient}`}
              />
              {/* Decorative grid overlay */}
              <div className="absolute inset-0 opacity-20">
                <div
                  className="absolute inset-0 bg-grid"
                  style={{ backgroundSize: '30px 30px' }}
                />
              </div>
              {/* Light sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5" />

              {/* Category badge */}
              <div className="absolute top-5 left-6">
                <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium">
                  {article.category}
                </span>
              </div>

              {/* Teal Close Button */}
              <DialogClose asChild>
                <button
                  className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-teal-300 hover:bg-teal-500/80 hover:text-white hover:border-teal-400 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:ring-offset-2 focus:ring-offset-black/20"
                  aria-label="Close article preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </DialogClose>

              {/* Book icon decoration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="absolute bottom-6 right-6 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
              >
                <span className="text-2xl font-bold text-white/60">
                  {article.category.charAt(0)}
                </span>
              </motion.div>
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-6 sm:p-8"
            >
              {/* Meta info */}
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  {article.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-400" />
                  {article.readTime}
                </span>
              </div>

              {/* Full title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">
                {article.title}
              </h1>

              {/* Full excerpt */}
              <p className="text-slate-400 leading-relaxed text-base mb-6">
                {article.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA Button */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-400 hover:to-emerald-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25"
              >
                Read Full Article
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

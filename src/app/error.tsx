'use client';

import { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

/* ------------------------------------------------------------------ */
/*  Decorative floating particles                                      */
/* ------------------------------------------------------------------ */
const particleData = [
  { id: 0, size: 8, left: '15%', delay: '0s', duration: '14s', color: '#06b6d4' },
  { id: 1, size: 6, left: '30%', delay: '2s', duration: '16s', color: '#10b981' },
  { id: 2, size: 10, left: '50%', delay: '4s', duration: '12s', color: '#06b6d4' },
  { id: 3, size: 5, left: '65%', delay: '1s', duration: '18s', color: '#10b981' },
  { id: 4, size: 7, left: '80%', delay: '3s', duration: '15s', color: '#06b6d4' },
  { id: 5, size: 4, left: '90%', delay: '5s', duration: '20s', color: '#10b981' },
];

function Particles() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {particleData.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full opacity-30"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            bottom: '-10px',
            background: p.color,
            animation: `floatUpErr ${p.duration} ${p.delay} infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Entrance animation variants                                        */
/* ------------------------------------------------------------------ */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ------------------------------------------------------------------ */
/*  Error Boundary Page                                                */
/* ------------------------------------------------------------------ */
interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  const mounted = useMounted();

  useEffect(() => {
    console.error('[ErrorBoundary]', error);
  }, [error]);

  return (
    <AnimatePresence>
      {mounted && (
        <main className="glass-card relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
          style={{ backgroundColor: '#0a1628' }}>

          {/* Floating particles */}
          <Particles />

          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[120px]"
            style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full opacity-15 blur-[100px]"
            style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
            aria-hidden
          />

          {/* Content */}
          <motion.div
            className="glass-card relative z-10 flex max-w-xl flex-col items-center gap-8 rounded-3xl px-10 py-16 text-center sm:px-16"
            style={{ backdropFilter: 'blur(16px)', backgroundColor: 'rgba(10, 22, 40, 0.6)', border: '1px solid rgba(6, 182, 212, 0.12)' }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Icon */}
            <motion.div
              variants={itemVariants}
              className="flex h-20 w-20 items-center justify-center rounded-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(16, 185, 129, 0.15))', border: '1px solid rgba(6, 182, 212, 0.2)' }}
            >
              <AlertTriangle className="h-10 w-10" style={{ color: '#06b6d4' }} />
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="gradient-text text-3xl font-bold text-white sm:text-4xl"
            >
              Oops! Something went wrong
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="max-w-md text-base leading-relaxed sm:text-lg"
              style={{ color: 'rgba(255, 255, 255, 0.55)' }}
            >
              An unexpected error occurred. Please try again.
            </motion.p>

            {/* Error detail (digest) — shown only when available */}
            {error.digest && (
              <motion.p
                variants={itemVariants}
                className="rounded-lg px-4 py-2 text-xs font-mono"
                style={{ color: 'rgba(255, 255, 255, 0.35)', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
              >
                Error digest: {error.digest}
              </motion.p>
            )}

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={reset}
                type="button"
                className="inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                  boxShadow: '0 0 24px rgba(6, 182, 212, 0.25)',
                }}
              >
                Try Again
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-base font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  color: '#06b6d4',
                  background: 'rgba(6, 182, 212, 0.06)',
                }}
              >
                Go Home
              </Link>
            </motion.div>
          </motion.div>

          {/* Inline keyframes */}
          <style jsx global>{`
            @keyframes floatUpErr {
              0% { transform: translateY(0) scale(1); opacity: 0; }
              10% { opacity: 0.3; }
              90% { opacity: 0.3; }
              100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
            }
          `}</style>
        </main>
      )}
    </AnimatePresence>
  );
}

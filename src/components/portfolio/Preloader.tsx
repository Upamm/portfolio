'use client';

import { useEffect, useState, useRef } from 'react';

export function Preloader() {
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'done'>('loading');
  const [mounted, setMounted] = useState(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    setMounted(true);
    const elapsed = Date.now() - startTimeRef.current;
    const minDisplay = 1600; // minimum display time in ms
    const remaining = Math.max(0, minDisplay - elapsed);

    const timer1 = setTimeout(() => {
      setPhase('reveal');
    }, remaining);

    const timer2 = setTimeout(() => {
      setPhase('done');
    }, remaining + 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!mounted) {
    // SSR / initial paint — show static overlay immediately (no flash)
    return (
      <div
        className="preloader-overlay preloader-initial"
        suppressHydrationWarning
      >
        <div className="preloader-logo-wrapper">
          <svg
            width="72"
            height="72"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="preloader-logo-svg"
          >
            <defs>
              <linearGradient id="preloaderGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="preloaderGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <filter id="preloaderGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Rounded square */}
            <rect x="6" y="6" width="36" height="36" rx="10" stroke="url(#preloaderGrad1)" strokeWidth="2" fill="none" />
            {/* Cursor body */}
            <path d="M18 30 L18 14 L22 20 L28 20 Z" fill="url(#preloaderGrad2)" />
            {/* Cursor line */}
            <line x1="18" y1="30" x2="28" y2="34" stroke="url(#preloaderGrad1)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`preloader-overlay ${phase === 'reveal' ? 'preloader-fade-out' : ''} ${phase === 'done' ? 'preloader-gone' : ''}`}
      suppressHydrationWarning
    >
      {/* Ambient background orbs */}
      <div className="preloader-orb preloader-orb-1" />
      <div className="preloader-orb preloader-orb-2" />
      <div className="preloader-orb preloader-orb-3" />

      {/* Grid overlay */}
      <div className="preloader-grid" />

      <div className="preloader-content">
        {/* Logo mark */}
        <div className="preloader-logo-wrapper">
          <svg
            width="72"
            height="72"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="preloader-logo-svg"
          >
            <defs>
              <linearGradient id="preloaderGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="preloaderGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="preloaderGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
              </linearGradient>
              <filter id="preloaderGlow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="preloaderGlowStrong">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer ring — slow continuous rotation (not the logo!) */}
            <circle
              cx="24"
              cy="24"
              r="23"
              stroke="url(#preloaderGrad1)"
              strokeWidth="1"
              fill="none"
              className="preloader-ring-outer"
              strokeDasharray="6 10"
              opacity="0.25"
            />

            {/* Second ring — counter-rotate */}
            <circle
              cx="24"
              cy="24"
              r="20.5"
              stroke="url(#preloaderGrad3)"
              strokeWidth="0.5"
              fill="none"
              className="preloader-ring-inner"
              strokeDasharray="3 8"
              opacity="0.2"
            />

            {/* Inner rounded square — animated stroke draw */}
            <rect
              x="6"
              y="6"
              width="36"
              height="36"
              rx="10"
              stroke="url(#preloaderGrad1)"
              strokeWidth="2"
              fill="none"
              className="preloader-shape-draw"
              filter="url(#preloaderGlow)"
            />

            {/* Subtle square fill — gradient pulse */}
            <rect
              x="7"
              y="7"
              width="34"
              height="34"
              rx="9"
              fill="url(#preloaderGrad3)"
              className="preloader-shape-fill"
            />

            {/* Cursor / pen icon */}
            <g className="preloader-cursor-group" filter="url(#preloaderGlow)">
              <path
                d="M18 30 L18 14 L22 20 L28 20 Z"
                fill="url(#preloaderGrad2)"
                className="preloader-cursor-fill"
              />
              <line
                x1="18"
                y1="30"
                x2="28"
                y2="34"
                stroke="url(#preloaderGrad1)"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="preloader-cursor-line"
              />
            </g>

            {/* Code bracket accent — left < */}
            <path
              d="M10 20 L14 24 L10 28"
              stroke="url(#preloaderGrad1)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className="preloader-bracket-left"
              opacity="0.6"
            />

            {/* Code bracket accent — right /> */}
            <path
              d="M38 20 L34 24 L38 28"
              stroke="url(#preloaderGrad1)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className="preloader-bracket-right"
              opacity="0.6"
            />

            {/* Floating particles */}
            <circle cx="8" cy="12" r="1.5" fill="#06b6d4" className="preloader-particle-1" />
            <circle cx="40" cy="10" r="1" fill="#10b981" className="preloader-particle-2" />
            <circle cx="42" cy="36" r="1.2" fill="#06b6d4" className="preloader-particle-3" />
            <circle cx="6" cy="38" r="0.8" fill="#10b981" className="preloader-particle-4" />
            <circle cx="12" cy="42" r="0.6" fill="#14b8a6" className="preloader-particle-5" />
            <circle cx="36" cy="6" r="0.9" fill="#06b6d4" className="preloader-particle-6" />

            {/* Center dot — pulsing glow */}
            <circle cx="24" cy="24" r="2" fill="url(#preloaderGrad1)" className="preloader-dot-pulse" filter="url(#preloaderGlowStrong)" />
          </svg>

          {/* Behind glow */}
          <div className="preloader-logo-glow" />
          <div className="preloader-logo-glow-2" />
        </div>

        {/* Brand text below logo */}
        <div className="preloader-brand">
          <span className="preloader-brand-text">UPAM</span>
          <div className="preloader-brand-line" />
        </div>

        {/* Loading bar */}
        <div className="preloader-bar-track">
          <div className="preloader-bar-fill" />
        </div>
      </div>
    </div>
  );
}

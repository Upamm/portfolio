'use client';

import { useEffect, useState } from 'react';

export function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`preloader-overlay ${!visible ? 'hidden' : ''}`} suppressHydrationWarning>
      <div className="preloader-logo-wrapper">
        {/* Logo SVG without text */}
        <svg
          width="56"
          height="56"
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
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer rotating ring */}
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke="url(#preloaderGrad1)"
            strokeWidth="1.5"
            fill="none"
            className="preloader-ring-outer"
            strokeDasharray="4 6"
            opacity="0.4"
          />

          {/* Inner rounded square */}
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

          {/* Cursor / pen icon */}
          <g className="preloader-cursor-group" filter="url(#preloaderGlow)">
            <path
              d="M18 30 L18 14 L22 20 L28 20 Z"
              fill="url(#preloaderGrad2)"
            />
            <line
              x1="18"
              y1="30"
              x2="28"
              y2="34"
              stroke="url(#preloaderGrad1)"
              strokeWidth="1.5"
              strokeLinecap="round"
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
            opacity="0.7"
          />

          {/* Code bracket accent — right /> */}
          <path
            d="M38 20 L34 24 L38 28"
            stroke="url(#preloaderGrad1)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.7"
          />

          {/* Floating particles */}
          <circle cx="8" cy="12" r="1.5" fill="#06b6d4" className="preloader-particle-1" />
          <circle cx="40" cy="10" r="1" fill="#10b981" className="preloader-particle-2" />
          <circle cx="42" cy="36" r="1.2" fill="#06b6d4" className="preloader-particle-3" />
          <circle cx="6" cy="38" r="0.8" fill="#10b981" className="preloader-particle-4" />

          {/* Center dot */}
          <circle cx="24" cy="24" r="2" fill="url(#preloaderGrad1)" className="preloader-dot-pulse" />
        </svg>

        {/* Subtle glow behind logo */}
        <div className="preloader-logo-glow" />
      </div>
    </div>
  );
}

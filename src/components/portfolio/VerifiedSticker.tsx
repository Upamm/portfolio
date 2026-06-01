'use client';

import { useEffect, useRef, useState } from 'react';

interface VerifiedStickerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'teal' | 'amber';
  className?: string;
}

const COLOR_MAP = {
  teal: {
    gradStart: '#06b6d4',
    gradMid: '#14b8a6',
    gradEnd: '#10b981',
    shadowColor: '#06b6d4',
    shadowOpacity: 0.5,
    hoverShadowColor: '#06b6d4',
    hoverShadowOpacity: 0.7,
  },
  amber: {
    gradStart: '#f59e0b',
    gradMid: '#f97316',
    gradEnd: '#ef4444',
    shadowColor: '#f59e0b',
    shadowOpacity: 0.5,
    hoverShadowColor: '#f59e0b',
    hoverShadowOpacity: 0.7,
  },
};

/**
 * A sticker-style verified badge with scalloped edges,
 * gradient fill, checkmark, and color variant support.
 */
export default function VerifiedSticker({ size = 'sm', variant = 'teal', className = '' }: VerifiedStickerProps) {
  const idRef = useRef(`vs-${Math.random().toString(36).slice(2, 8)}`);
  const [mounted, setMounted] = useState(false);
  const id = idRef.current;

  useEffect(() => {
    setMounted(true);
  }, []);

  const s = { sm: 18, md: 20, lg: 28 }[size];
  const c = COLOR_MAP[variant];

  // Scalloped edge circle path — 12 bumps
  const scallopedPath = (() => {
    const cx = 16, cy = 16, outerR = 14.5, innerR = 12, bumps = 12;
    const points: string[] = [];
    for (let i = 0; i < bumps * 2; i++) {
      const angle = (Math.PI * i) / bumps - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      points.push(`${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`);
    }
    return `M${points[0]} ${points.slice(1).map(p => `L${p}`).join(' ')}Z`;
  })();

  return (
    <span
      className={`inline-flex items-center justify-center verified-sticker-badge verified-sticker-badge-${size} verified-sticker-badge-${variant} ${mounted ? 'sticker-visible' : 'sticker-hidden'} ${className}`}
      title="Verified Account"
      role="img"
      aria-label="Verified Account"
    >
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.gradStart} />
            <stop offset="50%" stopColor={c.gradMid} />
            <stop offset="100%" stopColor={c.gradEnd} />
          </linearGradient>
          <linearGradient id={`${id}-shine`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <filter id={`${id}-shadow`}>
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor={c.shadowColor} floodOpacity={c.shadowOpacity} />
          </filter>
          <filter id={`${id}-inner`}>
            <feDropShadow dx="0" dy="0.5" stdDeviation="0.5" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Scalloped outer shape */}
        <path d={scallopedPath} fill={`url(#${id}-grad)`} stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" filter={`url(#${id}-shadow)`} />

        {/* Shine overlay */}
        <path d={scallopedPath} fill={`url(#${id}-shine)`} opacity="0.6" />

        {/* Inner circle */}
        <circle cx="16" cy="16" r="8.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" strokeDasharray="1.5 1" />

        {/* Checkmark */}
        <path d="M10.5 16.5L14.5 20.5L22 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${id}-inner)`} />

        {/* Sparkle dots */}
        <circle cx="8" cy="8" r="0.8" fill="white" opacity="0.7" />
        <circle cx="24" cy="8" r="0.6" fill="white" opacity="0.5" />
        <circle cx="8" cy="24" r="0.5" fill="white" opacity="0.4" />
      </svg>
    </span>
  );
}

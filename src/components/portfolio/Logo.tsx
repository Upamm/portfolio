'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Logo({ size = 'md', showText = true, className = '', onClick }: LogoProps) {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', gap: 'gap-1.5' },
    md: { icon: 36, text: 'text-xl sm:text-2xl', gap: 'gap-2' },
    lg: { icon: 44, text: 'text-3xl sm:text-4xl', gap: 'gap-3' },
  };

  const s = sizeMap[size];

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center ${s.gap} group ${className}`}
      aria-label="UPAM - Home"
    >
      {/* SVG Logo Mark */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 logo-svg"
      >
        <defs>
          <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="logoGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id="logoGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
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
          stroke="url(#logoGrad1)"
          strokeWidth="1.5"
          fill="none"
          className="logo-ring-outer"
          strokeDasharray="4 6"
          opacity="0.4"
        />

        {/* Inner rounded square - animated draw */}
        <rect
          x="6"
          y="6"
          width="36"
          height="36"
          rx="10"
          stroke="url(#logoGrad1)"
          strokeWidth="2"
          fill="none"
          className="logo-shape-draw"
          filter="url(#logoGlow)"
        />

        {/* Cursor / pen icon — freelance themed */}
        <g className="logo-cursor-group" filter="url(#logoGlow)">
          {/* Cursor body */}
          <path
            d="M18 30 L18 14 L22 20 L28 20 Z"
            fill="url(#logoGrad2)"
            className="logo-cursor-fill"
          />
          {/* Cursor line */}
          <line
            x1="18"
            y1="30"
            x2="28"
            y2="34"
            stroke="url(#logoGrad1)"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="logo-cursor-line"
          />
        </g>

        {/* Code bracket accent — left < */}
        <path
          d="M10 20 L14 24 L10 28"
          stroke="url(#logoGrad1)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="logo-bracket-left"
          opacity="0.7"
        />

        {/* Code bracket accent — right /> */}
        <path
          d="M38 20 L34 24 L38 28"
          stroke="url(#logoGrad1)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="logo-bracket-right"
          opacity="0.7"
        />

        {/* Floating particles */}
        <circle cx="8" cy="12" r="1.5" fill="#06b6d4" className="logo-particle logo-particle-1" />
        <circle cx="40" cy="10" r="1" fill="#10b981" className="logo-particle logo-particle-2" />
        <circle cx="42" cy="36" r="1.2" fill="#06b6d4" className="logo-particle logo-particle-3" />
        <circle cx="6" cy="38" r="0.8" fill="#10b981" className="logo-particle logo-particle-4" />

        {/* Center dot — cursor click point */}
        <circle cx="24" cy="24" r="2" fill="url(#logoGrad1)" className="logo-dot-pulse" />
      </svg>

      {/* Text "UPAM" */}
      {showText && (
        <span className={`${s.text} font-bold tracking-wider gradient-text logo-text-group`}>
          UPAM
        </span>
      )}
    </button>
  );
}

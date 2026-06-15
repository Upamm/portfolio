'use client';

import { cn } from '@/lib/utils';

// ─── Primitive Components ───────────────────────────────────

/** Animated shimmer rectangle — the base building block */
export function Skeleton({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        'rounded-md skeleton-shimmer',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

/** Circle skeleton (avatars, icons, stat rings) */
export function SkeletonCircle({ size = 48, className, delay = 0 }: { size?: number; className?: string; delay?: number }) {
  return (
    <Skeleton
      className={cn('rounded-full shrink-0', className)}
      delay={delay}
      style={{ width: size, height: size }}
    />
  );
}

/** A line of text skeleton */
export function SkeletonLine({
  width = '100%',
  className,
  delay = 0,
}: {
  width?: string | number;
  className?: string;
  delay?: number;
}) {
  return (
    <Skeleton
      className={cn('h-4', className)}
      delay={delay}
      style={{ width: typeof width === 'number' ? `${width}px` : width }}
    />
  );
}

/** A paragraph block of text (multiple lines) */
export function SkeletonParagraph({
  lines = 3,
  className,
  gap = 8,
  lastLineWidth = '60%',
}: {
  lines?: number;
  className?: string;
  gap?: number;
  lastLineWidth?: string;
}) {
  return (
    <div className={cn('space-y-1', className)} style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          width={i === lines - 1 ? lastLineWidth : '100%'}
          delay={i * 60}
        />
      ))}
    </div>
  );
}

/** Reusable glass-morphism skeleton card shell */
export function SkeletonCard({ className, children, delay = 0 }: { className?: string; children?: React.ReactNode; delay?: number }) {
  return (
    <div
      className={cn(
        'rounded-xl p-5 skeleton-card-glass',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Section heading skeleton (label pill + title + line + description) */
export function SkeletonSectionHeading({ delay = 0 }: { delay?: number }) {
  return (
    <div className="text-center mb-12 space-y-4">
      {/* Label pill */}
      <Skeleton className="h-6 w-28 mx-auto rounded-full" delay={delay} />
      {/* Title */}
      <Skeleton className="h-8 w-64 mx-auto max-w-[80%]" delay={delay + 80} />
      {/* Decorative line */}
      <Skeleton className="h-[3px] w-20 mx-auto rounded-full" delay={delay + 120} />
      {/* Description */}
      <Skeleton className="h-4 w-96 mx-auto max-w-[60%]" delay={delay + 160} />
    </div>
  );
}

/** Stat counter skeleton */
export function SkeletonStat({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <SkeletonCircle size={44} delay={delay} />
      <Skeleton className="h-8 w-16 mx-auto" delay={delay + 60} />
      <Skeleton className="h-3 w-20 mx-auto" delay={delay + 100} />
    </div>
  );
}

/** Generic card with icon + title + description */
export function SkeletonIconCard({ delay = 0 }: { delay?: number }) {
  return (
    <SkeletonCard delay={delay} className="space-y-4">
      <SkeletonCircle size={56} className="rounded-xl" delay={delay + 40} />
      <Skeleton className="h-5 w-3/4" delay={delay + 80} />
      <SkeletonParagraph lines={2} delay={delay + 120} />
      <Skeleton className="h-[2px] w-1/3 rounded-full" delay={delay + 200} />
    </SkeletonCard>
  );
}

/** Image card skeleton (portfolio, blog, featured) */
export function SkeletonImageCard({ delay = 0 }: { delay?: number }) {
  return (
    <SkeletonCard delay={delay} className="p-0 overflow-hidden space-y-0">
      {/* Image placeholder */}
      <Skeleton className="h-48 w-full rounded-none rounded-t-xl" delay={delay} />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-20 rounded-full" delay={delay + 60} />
        <Skeleton className="h-5 w-3/4" delay={delay + 100} />
        <SkeletonParagraph lines={2} delay={delay + 140} />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-16 rounded-full" delay={delay + 220} />
          <Skeleton className="h-5 w-14 rounded-full" delay={delay + 260} />
          <Skeleton className="h-5 w-20 rounded-full" delay={delay + 300} />
        </div>
      </div>
    </SkeletonCard>
  );
}

/** Pricing card skeleton */
export function SkeletonPricingCard({ featured = false, delay = 0 }: { featured?: boolean; delay?: number }) {
  return (
    <SkeletonCard
      delay={delay}
      className={cn(
        'space-y-4 relative',
        featured && 'ring-1 ring-teal-500/30'
      )}
    >
      {featured && <Skeleton className="h-6 w-28 mx-auto rounded-full" delay={delay} />}
      <Skeleton className="h-5 w-2/3 mx-auto" delay={delay + 60} />
      <div className="text-center">
        <Skeleton className="h-10 w-24 mx-auto" delay={delay + 100} />
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <SkeletonCircle size={16} delay={delay + 120 + i * 40} />
            <Skeleton className="h-4 flex-1" delay={delay + 140 + i * 40} />
          </div>
        ))}
      </div>
      <Skeleton className="h-10 w-full rounded-lg" delay={delay + 320} />
    </SkeletonCard>
  );
}

/** Testimonial card skeleton */
export function SkeletonTestimonialCard({ delay = 0 }: { delay?: number }) {
  return (
    <div className="max-w-3xl mx-auto">
      <SkeletonCard delay={delay} className="py-8 px-6 sm:px-8 space-y-5">
        {/* Stars */}
        <div className="flex gap-1.5 justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-5 h-5 rounded-sm" delay={delay + i * 40} />
          ))}
        </div>
        {/* Quote text */}
        <SkeletonParagraph lines={4} className="max-w-lg mx-auto" delay={delay + 100} />
        {/* Author row */}
        <div className="flex items-center gap-3 justify-center pt-2">
          <SkeletonCircle size={44} delay={delay + 200} />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" delay={delay + 240} />
            <Skeleton className="h-3 w-36" delay={delay + 280} />
          </div>
        </div>
      </SkeletonCard>
    </div>
  );
}

/** FAQ accordion skeleton */
export function SkeletonAccordionItem({ delay = 0 }: { delay?: number }) {
  return (
    <SkeletonCard delay={delay} className="px-5 py-4 flex items-center justify-between">
      <Skeleton className="h-4 w-3/4 max-w-[85%]" delay={delay + 40} />
      <Skeleton className="h-5 w-5 rounded-full shrink-0" delay={delay + 80} />
    </SkeletonCard>
  );
}

/** Timeline milestone skeleton */
export function SkeletonTimelineItem({ delay = 0, side = 'left' }: { delay?: number; side?: 'left' | 'right' }) {
  return (
    <div className={cn('flex gap-6', side === 'right' && 'flex-row-reverse')}>
      {/* Dot */}
      <div className="flex flex-col items-center shrink-0">
        <SkeletonCircle size={40} delay={delay} />
        <Skeleton className="w-[2px] flex-1 min-h-[40px]" delay={delay + 60} />
      </div>
      {/* Content */}
      <div className={cn('flex-1 pb-8 space-y-3', side === 'right' && 'text-right')}>
        <Skeleton className="h-3 w-16 rounded-full" delay={delay + 80} />
        <Skeleton className="h-5 w-3/4" delay={delay + 120} />
        <SkeletonParagraph lines={2} delay={delay + 160} />
      </div>
    </div>
  );
}

/** Contact form skeleton */
export function SkeletonContactForm({ delay = 0 }: { delay?: number }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-11 w-full rounded-lg" delay={delay} />
        <Skeleton className="h-11 w-full rounded-lg" delay={delay + 40} />
      </div>
      <Skeleton className="h-11 w-full rounded-lg" delay={delay + 80} />
      <Skeleton className="h-28 w-full rounded-lg" delay={delay + 120} />
      <Skeleton className="h-11 w-full rounded-lg" delay={delay + 160} />
    </div>
  );
}

/** Process step skeleton */
export function SkeletonProcessStep({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="relative">
        <SkeletonCircle size={48} delay={delay} />
        <Skeleton className="absolute -top-1 -right-1 w-5 h-5 rounded-full" delay={delay + 40} />
      </div>
      <Skeleton className="h-5 w-24" delay={delay + 80} />
      <SkeletonParagraph lines={2} className="max-w-[200px]" delay={delay + 120} />
    </div>
  );
}

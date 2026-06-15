'use client';

import {
  SkeletonSectionHeading,
  SkeletonIconCard,
  SkeletonImageCard,
  SkeletonPricingCard,
  SkeletonTestimonialCard,
  SkeletonAccordionItem,
  SkeletonTimelineItem,
  SkeletonContactForm,
  SkeletonProcessStep,
  SkeletonStat,
  SkeletonCircle,
  Skeleton,
  SkeletonCard,
  SkeletonLine,
} from '@/components/ui/skeleton';

// ════════════════════════════════════════════════════════════
// HOME PAGE SKELETON
// ════════════════════════════════════════════════════════════

export function HeroSkeleton() {
  return (
    <div className="min-h-[100svh] flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
        {/* Availability badge */}
        <Skeleton className="h-7 w-40 mx-auto rounded-full" />
        {/* Avatar + heading row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <SkeletonCircle size={72} />
          <Skeleton className="h-10 w-48 sm:w-64" />
        </div>
        {/* Typing subtitle */}
        <Skeleton className="h-6 w-72 mx-auto" delay={80} />
        {/* Description */}
        <div className="max-w-2xl mx-auto space-y-2.5">
          <Skeleton className="h-4 w-full" delay={120} />
          <Skeleton className="h-4 w-5/6 mx-auto" delay={160} />
          <Skeleton className="h-4 w-4/6 mx-auto" delay={200} />
        </div>
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Skeleton className="h-11 w-36 mx-auto sm:mx-0 rounded-lg" delay={240} />
          <Skeleton className="h-11 w-32 mx-auto sm:mx-0 rounded-lg" delay={280} />
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto pt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-7 w-16 mx-auto" delay={320 + i * 60} />
              <Skeleton className="h-3 w-24 mx-auto mt-2" delay={360 + i * 60} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MarqueeSkeleton() {
  return (
    <div className="py-4 overflow-hidden">
      <div className="flex gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-28 rounded-lg shrink-0" delay={i * 40} />
        ))}
      </div>
    </div>
  );
}

export function StatsBannerSkeleton() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonStat key={i} delay={i * 60} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ClientsSkeleton() {
  return (
    <div className="py-16 px-4 space-y-8">
      <SkeletonSectionHeading delay={0} />
      {/* Row 1 */}
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} delay={i * 30} className="shrink-0 flex items-center gap-3 px-4 py-3">
            <SkeletonCircle size={32} delay={i * 30 + 40} />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-24" delay={i * 30 + 80} />
              <Skeleton className="h-2.5 w-16" delay={i * 30 + 120} />
            </div>
          </SkeletonCard>
        ))}
      </div>
      {/* Row 2 */}
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} delay={i * 30 + 100} className="shrink-0 flex items-center gap-3 px-4 py-3">
            <SkeletonCircle size={32} delay={i * 30 + 140} />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28" delay={i * 30 + 180} />
              <Skeleton className="h-2.5 w-20" delay={i * 30 + 220} />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

export function IndustriesSkeleton() {
  return (
    <div className="py-16 px-4 space-y-8">
      <SkeletonSectionHeading />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonIconCard key={i} delay={i * 60} />
        ))}
      </div>
    </div>
  );
}

export function FeaturedWorkSkeleton() {
  return (
    <div className="py-16 px-4 space-y-8">
      <SkeletonSectionHeading />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonImageCard key={i} delay={i * 80} />
        ))}
      </div>
      {/* CTA button */}
      <div className="flex justify-center">
        <Skeleton className="h-11 w-44 rounded-lg" delay={400} />
      </div>
    </div>
  );
}

export function TestimonialsSkeleton() {
  return (
    <div className="py-16 px-4 space-y-10">
      <SkeletonSectionHeading />
      <SkeletonTestimonialCard delay={100} />
      {/* Navigation dots */}
      <div className="flex items-center justify-center gap-6">
        <Skeleton className="h-10 w-10 rounded-full" delay={300} />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCircle key={i} size={12} delay={320 + i * 40} />
          ))}
        </div>
        <Skeleton className="h-10 w-10 rounded-full" delay={340} />
      </div>
    </div>
  );
}

export function CertificationsSkeleton() {
  return (
    <div className="py-16 px-4 space-y-8">
      <SkeletonSectionHeading />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} delay={i * 60} className="text-center py-6 space-y-3">
            <SkeletonCircle size={64} className="mx-auto" delay={i * 60 + 40} />
            <Skeleton className="h-5 w-32 mx-auto" delay={i * 60 + 80} />
            <Skeleton className="h-3.5 w-48 mx-auto" delay={i * 60 + 120} />
            <Skeleton className="h-[2px] w-12 mx-auto rounded-full" delay={i * 60 + 160} />
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

export function WorkWithMeSkeleton() {
  return (
    <div className="py-16 px-4 space-y-8">
      <SkeletonSectionHeading />
      <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} delay={i * 80} className="space-y-4">
            <SkeletonCircle size={56} className="rounded-xl" delay={i * 80 + 40} />
            <Skeleton className="h-5 w-3/4" delay={i * 80 + 80} />
            <Skeleton className="h-3.5 w-full" delay={i * 80 + 120} />
            {/* Benefits checklist */}
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <SkeletonCircle size={14} delay={i * 80 + 140 + j * 30} />
                  <SkeletonLine width="80%" delay={i * 80 + 160 + j * 30} />
                </div>
              ))}
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// ABOUT PAGE SKELETON
// ════════════════════════════════════════════════════════════

export function AboutSkeleton() {
  return (
    <div className="py-16 px-4 space-y-8">
      <SkeletonSectionHeading />
      <div className="max-w-6xl mx-auto">
        <SkeletonCard className="flex flex-col lg:flex-row gap-8 p-0 overflow-hidden">
          {/* Image panel */}
          <div className="lg:w-[380px] xl:w-[420px] shrink-0">
            <Skeleton className="h-64 lg:h-full w-full rounded-none rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none" />
          </div>
          {/* Content panel */}
          <div className="flex-1 p-6 lg:p-8 space-y-5">
            <Skeleton className="h-7 w-48" delay={60} />
            <Skeleton className="h-4 w-36" delay={100} />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full" delay={140} />
              <Skeleton className="h-3.5 w-5/6" delay={160} />
              <Skeleton className="h-3.5 w-4/6" delay={180} />
            </div>
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} delay={200 + i * 40} className="text-center p-3 space-y-2">
                  <Skeleton className="h-5 w-12 mx-auto" delay={220 + i * 40} />
                  <Skeleton className="h-3 w-20 mx-auto" delay={240 + i * 40} />
                </SkeletonCard>
              ))}
            </div>
            {/* Skills checklist */}
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <SkeletonCircle size={14} delay={360 + i * 30} />
                  <SkeletonLine width="70%" delay={380 + i * 30} />
                </div>
              ))}
            </div>
            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-10 w-32 rounded-lg" delay={540} />
              <Skeleton className="h-10 w-36 rounded-lg" delay={580} />
            </div>
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SERVICES PAGE SKELETON
// ════════════════════════════════════════════════════════════

export function ServicesSkeleton() {
  return (
    <div className="py-16 px-4 space-y-8">
      <SkeletonSectionHeading />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonIconCard key={i} delay={i * 60} />
        ))}
      </div>
    </div>
  );
}

export function ProcessSkeleton() {
  return (
    <div className="py-16 px-4 space-y-12">
      <SkeletonSectionHeading />
      {/* Connecting line */}
      <div className="relative">
        <Skeleton className="hidden md:block h-[2px] w-full absolute top-6 left-0 right-0" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 max-w-5xl mx-auto relative">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonProcessStep key={i} delay={i * 80} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkillsSkeleton() {
  return (
    <div className="py-16 px-4 space-y-8">
      <SkeletonSectionHeading />
      {/* Skill rings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} delay={i * 50} className="text-center py-5 space-y-3">
            <SkeletonCircle size={72} className="mx-auto" delay={i * 50 + 30} />
            <Skeleton className="h-4 w-24 mx-auto" delay={i * 50 + 60} />
            <Skeleton className="h-3 w-16 mx-auto" delay={i * 50 + 90} />
          </SkeletonCard>
        ))}
      </div>
      {/* Tools + radar area */}
      <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Radar chart placeholder */}
        <SkeletonCard delay={400}>
          <Skeleton className="h-64 w-full rounded-lg" delay={420} />
        </SkeletonCard>
        {/* Tools grid */}
        <SkeletonCard delay={450} className="space-y-4">
          <Skeleton className="h-5 w-40" delay={470} />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <SkeletonCircle size={28} delay={500 + i * 30} />
                <SkeletonLine width="60%" delay={520 + i * 30} />
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// PORTFOLIO PAGE SKELETON
// ════════════════════════════════════════════════════════════

export function PortfolioSkeleton() {
  return (
    <div className="py-16 px-4 space-y-8">
      <SkeletonSectionHeading />
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 justify-center max-w-xl mx-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" delay={i * 40} />
        ))}
      </div>
      {/* Project cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonImageCard key={i} delay={100 + i * 60} />
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// PRICING PAGE SKELETON
// ════════════════════════════════════════════════════════════

export function PricingSkeleton() {
  return (
    <div className="py-16 px-4 space-y-16">
      <SkeletonSectionHeading />
      {/* 3 pricing cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <SkeletonPricingCard delay={60} />
        <SkeletonPricingCard featured delay={120} />
        <SkeletonPricingCard delay={180} />
      </div>
      {/* Process steps */}
      <div className="relative">
        <Skeleton className="hidden sm:block h-[2px] w-full absolute top-8 left-0 right-0" delay={240} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto relative">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonProcessStep key={i} delay={260 + i * 60} />
          ))}
        </div>
      </div>
      {/* Guarantee cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonIconCard key={i} delay={500 + i * 50} />
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// BLOG PAGE SKELETON
// ════════════════════════════════════════════════════════════

export function BlogSkeleton() {
  return (
    <div className="py-16 px-4 space-y-10">
      <SkeletonSectionHeading />
      {/* Blog cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonImageCard key={i} delay={80 + i * 60} />
        ))}
      </div>
      {/* Popular topics */}
      <div className="max-w-6xl mx-auto space-y-4">
        <Skeleton className="h-5 w-36" delay={500} />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" delay={540 + i * 30} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// FAQ PAGE SKELETON
// ════════════════════════════════════════════════════════════

export function FAQSkeleton() {
  return (
    <div className="py-16 px-4 space-y-8">
      <SkeletonSectionHeading />
      <div className="max-w-3xl mx-auto space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonAccordionItem key={i} delay={i * 50} />
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CONTACT PAGE SKELETON
// ════════════════════════════════════════════════════════════

export function ContactSkeleton() {
  return (
    <div className="py-16 px-4 space-y-10">
      <SkeletonSectionHeading />
      <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-5">
          <Skeleton className="h-7 w-40" delay={60} />
          <Skeleton className="h-3.5 w-full" delay={100} />
          <Skeleton className="h-3.5 w-5/6" delay={120} />
          {/* Info cards */}
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} delay={140 + i * 50} className="flex items-center gap-3 p-3.5">
              <SkeletonCircle size={36} delay={160 + i * 50} />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-20" delay={180 + i * 50} />
                <Skeleton className="h-3.5 w-32" delay={200 + i * 50} />
              </div>
            </SkeletonCard>
          ))}
          {/* Social links */}
          <div className="flex gap-3 pt-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCircle key={i} size={40} delay={340 + i * 40} />
            ))}
          </div>
          {/* CTA */}
          <Skeleton className="h-10 w-full rounded-lg" delay={500} />
        </div>
        {/* Form */}
        <div className="lg:col-span-3">
          <SkeletonCard className="p-6 space-y-4">
            <SkeletonContactForm delay={100} />
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// EXPERIENCE PAGE SKELETON
// ════════════════════════════════════════════════════════════

export function ExperienceSkeleton() {
  return (
    <div className="py-16 px-4 space-y-8">
      <SkeletonSectionHeading />
      <div className="max-w-4xl mx-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonTimelineItem key={i} delay={i * 80} side={i % 2 === 0 ? 'left' : 'right'} />
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// VALUES PAGE SKELETON
// ════════════════════════════════════════════════════════════

export function ValuesSkeleton() {
  return (
    <div className="py-16 px-4 space-y-8">
      <SkeletonSectionHeading />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonIconCard key={i} delay={i * 60} />
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// PAGE-LEVEL SKELETON COMPOSERS
// ════════════════════════════════════════════════════════════

export function HomePageSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <MarqueeSkeleton />
      <StatsBannerSkeleton />
      <ClientsSkeleton />
      <IndustriesSkeleton />
      <FeaturedWorkSkeleton />
      <TestimonialsSkeleton />
      <CertificationsSkeleton />
      <WorkWithMeSkeleton />
    </>
  );
}

export function AboutPageSkeleton() {
  return (
    <>
      <AboutSkeleton />
      <ExperienceSkeleton />
      <ValuesSkeleton />
    </>
  );
}

export function ServicesPageSkeleton() {
  return (
    <>
      <ServicesSkeleton />
      <ProcessSkeleton />
      <SkillsSkeleton />
    </>
  );
}

export function PricingPageSkeleton() {
  return <PricingSkeleton />;
}

export function BlogPageSkeleton() {
  return <BlogSkeleton />;
}

export function FAQPageSkeleton() {
  return <FAQSkeleton />;
}

export function ContactPageSkeleton() {
  return <ContactSkeleton />;
}

export function PortalPageSkeleton() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="space-y-4 text-center">
        <SkeletonCircle size={48} className="mx-auto" />
        <Skeleton className="h-5 w-40 mx-auto" delay={60} />
        <Skeleton className="h-3 w-56 mx-auto" delay={100} />
      </div>
    </div>
  );
}

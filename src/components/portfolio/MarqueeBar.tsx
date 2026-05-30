'use client';

const technologies = [
  'WordPress',
  'WooCommerce',
  'Elementor',
  'SEO',
  'Lead Generation',
  'Speed Optimization',
  'Virtual Assistant',
  'Data Research',
];

function MarqueeContent() {
  const items = [...technologies, ...technologies, ...technologies];
  return (
    <>
      {items.map((tech, i) => (
        <span
          key={`${tech}-${i}`}
          className="inline-flex items-center px-6 py-2 text-sm sm:text-base font-medium text-slate-400 whitespace-nowrap"
        >
          {tech}
          <span className="ml-6 text-teal-500/40">&#x2022;</span>
        </span>
      ))}
    </>
  );
}

export default function MarqueeBar() {
  return (
    <div className="relative py-6 sm:py-8 border-y border-teal-500/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-transparent to-[#0a1628] z-10 pointer-events-none" />
      <div className="marquee-container">
        <div className="marquee-track">
          <MarqueeContent />
        </div>
      </div>
    </div>
  );
}

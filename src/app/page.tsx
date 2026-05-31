import dynamic from 'next/dynamic';

const PortfolioApp = dynamic(() => import('@/components/portfolio/PortfolioApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
        <span className="text-sm text-slate-500">Loading...</span>
      </div>
    </div>
  ),
});

export default function Home() {
  return <PortfolioApp />;
}

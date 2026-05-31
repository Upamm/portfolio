'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, Clock, ArrowUpRight, BookOpen } from 'lucide-react';
import BlogArticleModal from '@/components/portfolio/BlogArticleModal';

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  gradient: string;
  tags: string[];
  author: string;
  content: BlogContentBlock[];
}

export interface BlogContentBlock {
  type: 'paragraph' | 'heading' | 'list' | 'tip' | 'code' | 'stats';
  text?: string;
  items?: string[];
  stats?: { label: string; value: string }[];
}

const articles: BlogArticle[] = [
  {
    id: 'wp-speed-optimization',
    title: '10 Essential WordPress Speed Optimization Tips for 2025',
    excerpt:
      'Learn the top strategies to make your WordPress site lightning-fast, from caching to image optimization and code minification techniques.',
    category: 'WordPress',
    readTime: '8 min read',
    date: 'May 15, 2025',
    gradient: 'from-teal-500 to-cyan-500',
    tags: ['Speed', 'Performance', 'WordPress', 'Core Web Vitals'],
    author: 'Upam',
    content: [
      {
        type: 'heading',
        text: 'Why WordPress Speed Matters More Than Ever',
      },
      {
        type: 'paragraph',
        text: 'In 2025, website speed is no longer optional — it\'s a critical factor that directly impacts your search rankings, user experience, and conversion rates. Google\'s Core Web Vitals have made page speed a ranking signal, and studies show that a 1-second delay in page load time can result in a 7% reduction in conversions. For WordPress sites, which power over 43% of all websites on the internet, optimizing performance is essential for staying competitive.',
      },
      {
        type: 'heading',
        text: '1. Choose a Lightweight WordPress Theme',
      },
      {
        type: 'paragraph',
        text: 'Your theme is the foundation of your site\'s performance. Heavy themes with excessive JavaScript, CSS, and unnecessary features can slow your site to a crawl. Choose themes like GeneratePress, Astra, or Kadence that are specifically built for speed. These themes offer clean code, minimal dependencies, and excellent page speed scores out of the box.',
      },
      {
        type: 'heading',
        text: '2. Implement Server-Side Caching',
      },
      {
        type: 'paragraph',
        text: 'Caching is the single most impactful optimization you can make. Server-side caching stores fully rendered pages so WordPress doesn\'t need to process PHP and query the database for every visitor. Use plugins like WP Rocket, LiteSpeed Cache, or W3 Total Cache to implement page caching, browser caching, object caching, and GZIP compression — all from one interface.',
      },
      {
        type: 'heading',
        text: '3. Optimize Images with Next-Gen Formats',
      },
      {
        type: 'paragraph',
        text: 'Images typically account for 50-65% of a web page\'s total weight. Convert your images to WebP or AVIF formats for 25-50% smaller file sizes compared to JPEG/PNG with no visible quality loss. Use tools like ShortPixel, Imagify, or Smush to automatically convert and compress images on upload. Implement lazy loading so images below the fold only load when the user scrolls near them.',
      },
      {
        type: 'heading',
        text: '4. Use a Content Delivery Network (CDN)',
      },
      {
        type: 'paragraph',
        text: 'A CDN distributes your static assets across servers worldwide, serving them from the location closest to each visitor. Cloudflare (free tier), BunnyCDN, or KeyCDN can dramatically reduce Time to First Byte (TTFB) and improve perceived load speed. For WordPress, Cloudflare\'s free plan with APO (Automatic Platform Optimization) can cache entire pages at the edge.',
      },
      {
        type: 'heading',
        text: '5. Minimize HTTP Requests',
      },
      {
        type: 'paragraph',
        text: 'Every CSS file, JavaScript file, image, and font requires a separate HTTP request. Reduce the number of requests by combining CSS/JS files, using CSS sprites or inline SVGs for icons, removing unused plugins, and employing CSS techniques (like gradients and shadows) instead of images where possible.',
      },
      {
        type: 'heading',
        text: '6. Clean Up Your Database Regularly',
      },
      {
        type: 'paragraph',
        text: 'Over time, your WordPress database accumulates post revisions, spam comments, transient options, trashed posts, and orphaned metadata. Use plugins like WP-Optimize or Advanced Database Cleaner to remove this bloat. A leaner database means faster query times and reduced server load. Schedule automatic cleanups weekly.',
      },
      {
        type: 'heading',
        text: '7. Defer Non-Essential JavaScript',
      },
      {
        type: 'paragraph',
        text: 'Render-blocking JavaScript prevents the browser from displaying your page until the scripts are downloaded and executed. Use the `defer` or `async` attributes on non-critical scripts. Plugins like Perfmatters or AssetCleanUp let you selectively disable scripts and stylesheets on specific pages, dramatically improving initial render time.',
      },
      {
        type: 'heading',
        text: '8. Optimize Your WordPress Hosting',
      },
      {
        type: 'paragraph',
        text: 'Your hosting environment has the biggest impact on speed. Shared hosting often puts hundreds of sites on a single server. Consider upgrading to managed WordPress hosting (Kinsta, WP Engine, Cloudways) or VPS hosting for dedicated resources. Look for hosts that offer PHP 8.2+, HTTP/2 or HTTP/3, and built-in server-level caching.',
      },
      {
        type: 'heading',
        text: '9. Use GZIP Compression',
      },
      {
        type: 'list',
        items: [
          'Enable GZIP via your .htaccess file or caching plugin',
          'Can reduce file sizes by 60-80% for text-based assets',
          'Most modern caching plugins handle this automatically',
          'Verify with Google PageSpeed Insights that compression is active',
        ],
      },
      {
        type: 'heading',
        text: '10. Monitor and Maintain Performance',
      },
      {
        type: 'paragraph',
        text: 'Speed optimization is an ongoing process, not a one-time task. Set up regular monitoring with tools like Google Search Console, GTmetrix, or Pingdom. Track your Core Web Vitals (LCP, FID/INP, CLS) over time. After every plugin update, theme change, or content addition, re-test your site to catch performance regressions early.',
      },
      {
        type: 'stats',
        stats: [
          { label: 'Avg Speed Improvement', value: '65%' },
          { label: 'Core Web Vitals Pass Rate', value: '95%+' },
          { label: 'Bounce Rate Reduction', value: '40%' },
          { label: 'SEO Ranking Boost', value: '25%' },
        ],
      },
      {
        type: 'tip',
        text: 'Pro Tip: Always test your site speed from multiple locations and devices. A site that loads in 1.5s in New York might take 4s in Mumbai without a CDN. Use tools like WebPageTest.org to test from specific geographic locations.',
      },
    ],
  },
  {
    id: 'b2b-lead-generation',
    title: 'How B2B Lead Generation Can Transform Your Business Growth',
    excerpt:
      'Discover proven lead generation strategies that help businesses find qualified prospects and build a sustainable sales pipeline.',
    category: 'Lead Generation',
    readTime: '10 min read',
    date: 'April 28, 2025',
    gradient: 'from-emerald-500 to-teal-500',
    tags: ['B2B', 'Lead Gen', 'Growth', 'Sales Pipeline'],
    author: 'Upam',
    content: [
      {
        type: 'heading',
        text: 'The B2B Lead Generation Landscape in 2025',
      },
      {
        type: 'paragraph',
        text: 'B2B lead generation has evolved dramatically. Cold calling and mass email blasts are being replaced by data-driven, multi-channel strategies that focus on building genuine relationships with decision-makers. According to HubSpot\'s 2025 State of Marketing report, 61% of marketers say generating traffic and leads is their top challenge. The businesses that solve this challenge effectively gain a massive competitive advantage.',
      },
      {
        type: 'heading',
        text: 'Understanding Your Ideal Customer Profile (ICP)',
      },
      {
        type: 'paragraph',
        text: 'Before generating any leads, you must clearly define who you\'re trying to reach. Your Ideal Customer Profile (ICP) goes beyond basic demographics — it includes firmographics (company size, industry, revenue), technographics (tools they use), pain points, buying triggers, and decision-making processes. Create detailed buyer personas for each stakeholder in the buying committee.',
      },
      {
        type: 'heading',
        text: 'Content-Led Lead Generation Strategies',
      },
      {
        type: 'paragraph',
        text: 'Content is the backbone of modern B2B lead generation. High-quality content educates prospects, builds authority, and captures contact information at every stage of the funnel.',
      },
      {
        type: 'list',
        items: [
          'Case Studies: Document real results with measurable outcomes for credibility',
          'Whitepapers & E-books: Deep-dive content that captures email addresses',
          'Webinars: Live or on-demand presentations that demonstrate expertise',
          'Blog Articles: SEO-optimized content that attracts organic traffic over time',
          'Templates & Tools: Practical resources that prospects find genuinely useful',
          'Industry Reports: Original research that positions you as a thought leader',
        ],
      },
      {
        type: 'heading',
        text: 'Building a High-Converting Landing Page',
      },
      {
        type: 'paragraph',
        text: 'Your landing page is where visitors become leads. A well-optimized landing page should have a clear value proposition above the fold, social proof (testimonials, logos, case studies), minimal form fields (start with name, email, and company), a compelling CTA that communicates the benefit, fast load times (under 3 seconds), and mobile-responsive design. A/B test headlines, CTAs, and form length continuously.',
      },
      {
        type: 'heading',
        text: 'Email Nurturing Sequences That Convert',
      },
      {
        type: 'paragraph',
        text: 'Most B2B buyers are not ready to purchase immediately. An effective email nurturing sequence guides prospects through the awareness, consideration, and decision stages. Structure your sequences with educational content first (no selling), then social proof and case studies, followed by product demos or consultation offers. Space emails 2-3 days apart, personalize subject lines, and track open rates and click-through rates to optimize.',
      },
      {
        type: 'heading',
        text: 'Leveraging LinkedIn for B2B Leads',
      },
      {
        type: 'paragraph',
        text: 'LinkedIn remains the #1 social platform for B2B lead generation. Optimize your company page and personal profiles with relevant keywords. Publish valuable content 3-5 times per week. Use LinkedIn Sales Navigator to identify and engage with decision-makers. Join and participate actively in industry-specific groups. Run targeted LinkedIn Ads using Matched Audiences for retargeting.',
      },
      {
        type: 'heading',
        text: 'SEO as a Long-Term Lead Engine',
      },
      {
        type: 'paragraph',
        text: 'Search engine optimization is the most sustainable lead generation channel. Target long-tail keywords that indicate buying intent (e.g., "best CRM for small manufacturing companies"). Create comprehensive content that answers specific questions your prospects are searching for. Build topical authority by covering your niche thoroughly. Earn backlinks through original research, partnerships, and digital PR.',
      },
      {
        type: 'stats',
        stats: [
          { label: 'Lead Increase (Avg)', value: '3.5x' },
          { label: 'Cost Per Lead Reduction', value: '60%' },
          { label: 'Email Open Rate Target', value: '25%+' },
          { label: 'Conversion Rate Boost', value: '2.8x' },
        ],
      },
      {
        type: 'tip',
        text: 'Pro Tip: Focus on quality over quantity. 100 highly-qualified leads are worth more than 1,000 unqualified ones. Use lead scoring to prioritize prospects based on their engagement level, company fit, and buying signals.',
      },
    ],
  },
  {
    id: 'virtual-assistant-2025',
    title: 'Why Every Business Needs a Virtual Assistant in 2025',
    excerpt:
      'Explore how virtual assistants can save time, reduce costs, and help business owners focus on what matters most — growing their company.',
    category: 'Business',
    readTime: '7 min read',
    date: 'April 10, 2025',
    gradient: 'from-cyan-500 to-emerald-500',
    tags: ['VA', 'Productivity', 'Business', 'Remote Work'],
    author: 'Upam',
    content: [
      {
        type: 'heading',
        text: 'The Rise of Virtual Assistance',
      },
      {
        type: 'paragraph',
        text: 'The virtual assistant industry has grown from a niche service into a $25+ billion global market. As businesses embrace remote work and digital transformation, VAs have become essential team members for startups, agencies, and enterprises alike. In 2025, with AI tools amplifying their capabilities, virtual assistants are more productive and versatile than ever before.',
      },
      {
        type: 'heading',
        text: 'What Can a Virtual Assistant Do for Your Business?',
      },
      {
        type: 'paragraph',
        text: 'Modern virtual assistants handle a wide range of tasks that previously required in-house staff. Here\'s what the most in-demand VAs do for their clients:',
      },
      {
        type: 'list',
        items: [
          'Email Management: Organize inboxes, draft responses, flag priority messages, and manage follow-ups',
          'Calendar & Scheduling: Coordinate meetings across time zones, manage appointments, and prevent conflicts',
          'Social Media Management: Create content calendars, schedule posts, engage with followers, and track analytics',
          'Data Entry & CRM: Maintain accurate records, update databases, and manage customer relationships',
          'WordPress Management: Update content, manage plugins, monitor uptime, and handle security updates',
          'Research & Reporting: Gather market intelligence, compile reports, and present actionable insights',
          'Customer Support: Handle inquiries via email, chat, and phone with professional communication',
          'Bookkeeping Basics: Track expenses, manage invoices, and reconcile accounts using tools like QuickBooks',
        ],
      },
      {
        type: 'heading',
        text: 'The Cost Advantage',
      },
      {
        type: 'paragraph',
        text: 'Hiring a full-time in-house employee costs significantly more than engaging a virtual assistant. When you factor in salary, benefits, office space, equipment, taxes, and training, a full-time employee might cost $60,000-100,000+ per year. A skilled virtual assistant, on the other hand, typically costs $15-40 per hour — and you only pay for the hours actually worked. This flexibility allows businesses to scale support up or down as needed.',
      },
      {
        type: 'heading',
        text: 'How to Choose the Right Virtual Assistant',
      },
      {
        type: 'paragraph',
        text: 'Not all VAs are created equal. The best virtual assistants have specific skills aligned with your business needs, strong communication skills, proactive problem-solving abilities, reliability and consistent availability, familiarity with the tools you use (Slack, Asana, WordPress, HubSpot), and a track record of positive client feedback.',
      },
      {
        type: 'heading',
        text: 'Setting Up Your VA for Success',
      },
      {
        type: 'paragraph',
        text: 'The key to a successful VA relationship is clear communication and proper onboarding. Document your processes with SOPs (Standard Operating Procedures). Use project management tools to assign and track tasks. Schedule regular check-ins (daily or weekly). Start with smaller tasks and gradually increase responsibility. Provide constructive feedback and recognize good work.',
      },
      {
        type: 'stats',
        stats: [
          { label: 'Time Saved Per Week', value: '15-20hrs' },
          { label: 'Cost Savings vs In-House', value: '78%' },
          { label: 'Productivity Increase', value: '35%' },
          { label: 'Client Satisfaction Rate', value: '97%' },
        ],
      },
      {
        type: 'tip',
        text: 'Pro Tip: Start with a trial period of 2-4 weeks before committing to a long-term arrangement. This gives both parties time to assess the working relationship and ensure expectations are aligned.',
      },
    ],
  },
  {
    id: 'wordpress-security-guide',
    title: 'The Complete WordPress Security Guide: Protect Your Site in 2025',
    excerpt:
      'A comprehensive guide to securing your WordPress website from hackers, malware, and common vulnerabilities with practical steps.',
    category: 'WordPress',
    readTime: '9 min read',
    date: 'March 22, 2025',
    gradient: 'from-teal-600 to-cyan-500',
    tags: ['Security', 'WordPress', 'Hacking', 'SSL'],
    author: 'Upam',
    content: [
      {
        type: 'heading',
        text: 'Why WordPress Security is Critical',
      },
      {
        type: 'paragraph',
        text: 'WordPress powers over 43% of all websites, making it the most targeted CMS by hackers. Every day, approximately 90,000 attacks are launched against WordPress sites. From brute force login attempts to SQL injection and malware distribution, the threats are real and constant. A compromised site can damage your reputation, hurt your SEO rankings, steal customer data, and cost thousands of dollars to clean up.',
      },
      {
        type: 'heading',
        text: 'Essential Security Measures',
      },
      {
        type: 'list',
        items: [
          'Keep WordPress, themes, and plugins updated — 73% of hacked sites run outdated software',
          'Use strong, unique passwords (16+ characters) with a password manager like 1Password or Bitwarden',
          'Enable two-factor authentication (2FA) for all admin accounts using Wordfence or Sucuri',
          'Install an SSL certificate (free via Let\'s Encrypt) and force HTTPS across your entire site',
          'Limit login attempts to prevent brute force attacks — plugins like Limit Login Attempts Reloaded help',
          'Change the default "admin" username to something unique and hard to guess',
          'Disable file editing in the WordPress admin dashboard via wp-config.php',
          'Set up automated daily backups with UpdraftPlus or BlogVault — store offsite',
        ],
      },
      {
        type: 'heading',
        text: 'Advanced Protection Strategies',
      },
      {
        type: 'paragraph',
        text: 'Beyond the basics, implement a Web Application Firewall (WAF) through Cloudflare or Wordfence to block malicious traffic before it reaches your server. Use security headers (X-Frame-Options, X-Content-Type-Options, Content-Security-Policy) via your .htaccess file or a security plugin. Monitor your site with uptime monitoring tools — Uptime Robot (free) alerts you if your site goes down. Regularly scan for malware with Wordfence, Sucuri SiteCheck, or MalCare.',
      },
      {
        type: 'heading',
        text: 'What to Do If Your Site Gets Hacked',
      },
      {
        type: 'paragraph',
        text: 'Don\'t panic, but act quickly. Take your site offline temporarily to prevent further damage. Restore from your most recent clean backup. Change all passwords immediately — WordPress admin, FTP, database, hosting. Scan thoroughly for malware and backdoors. Review user accounts for unauthorized additions. Check your Google Search Console for security warnings. Submit a review to Google once the site is cleaned.',
      },
      {
        type: 'stats',
        stats: [
          { label: 'Daily WP Attacks', value: '90,000+' },
          { label: 'Caused by Outdated Software', value: '73%' },
          { label: 'Sites with 2FA Enabled', value: '<10%' },
          { label: 'Recovery Time (With Backup)', value: '30 min' },
        ],
      },
      {
        type: 'tip',
        text: 'Pro Tip: A security plugin alone is not enough. Think of WordPress security as layers of defense — hosting environment, server configuration, WordPress hardening, monitoring, and incident response planning all work together.',
      },
    ],
  },
  {
    id: 'woocommerce-setup-guide',
    title: 'WooCommerce Setup Guide: Launch Your Online Store Like a Pro',
    excerpt:
      'Step-by-step guide to setting up a high-converting WooCommerce store, from product listings to payment gateways and shipping configuration.',
    category: 'E-Commerce',
    readTime: '11 min read',
    date: 'March 5, 2025',
    gradient: 'from-emerald-500 to-cyan-500',
    tags: ['WooCommerce', 'E-Commerce', 'Setup', 'Online Store'],
    author: 'Upam',
    content: [
      {
        type: 'heading',
        text: 'Getting Started with WooCommerce',
      },
      {
        type: 'paragraph',
        text: 'WooCommerce powers over 5 million online stores worldwide, making it the most popular e-commerce platform on the web. As a free, open-source WordPress plugin, it gives you complete control over your store without monthly platform fees or restrictions. Whether you\'re selling physical products, digital downloads, or services, WooCommerce provides the flexibility and scalability to grow with your business.',
      },
      {
        type: 'heading',
        text: 'Step 1: Choose the Right Hosting',
      },
      {
        type: 'paragraph',
        text: 'E-commerce hosting requires more resources than a regular website. Look for PHP 8.1+ support, SSL certificates included, daily automated backups, CDN integration, and scalable resources. Recommended hosts include SiteGround (great for beginners), Kinsta (premium managed WordPress), and Cloudways (flexible cloud hosting). Budget at least $10-30/month for reliable WooCommerce hosting.',
      },
      {
        type: 'heading',
        text: 'Step 2: Configure Payment Gateways',
      },
      {
        type: 'paragraph',
        text: 'Set up multiple payment options to maximize conversions. WooCommerce supports Stripe (credit/debit cards), PayPal, Apple Pay, Google Pay, bank transfers, and cash on delivery out of the box. For subscriptions or complex billing, consider adding WooCommerce Subscriptions. Configure your currency, tax settings, and checkout flow for the smoothest customer experience.',
      },
      {
        type: 'heading',
        text: 'Step 3: Optimize Product Pages',
      },
      {
        type: 'list',
        items: [
          'High-quality product images (at least 800x800px) with zoom functionality',
          'Clear, benefit-focused product descriptions with formatting and bullet points',
          'Customer reviews and ratings — enable and encourage them prominently',
          'Related products and upsells to increase average order value',
          'Trust badges (secure checkout, money-back guarantee, shipping info)',
          'Stock status indicators to create urgency and transparency',
          'Mobile-optimized layouts — over 70% of e-commerce traffic is mobile',
        ],
      },
      {
        type: 'heading',
        text: 'Step 4: Shipping & Tax Configuration',
      },
      {
        type: 'paragraph',
        text: 'Configure shipping zones, rates, and methods based on your logistics. WooCommerce supports flat rate, free shipping (based on minimum order), local pickup, and real-time carrier rates via extensions like WooCommerce Shipping. Set up tax calculations based on your location and customer destinations. Consider offering free shipping with a minimum order threshold to boost average order values.',
      },
      {
        type: 'heading',
        text: 'Step 5: Essential Plugins for Growth',
      },
      {
        type: 'paragraph',
        text: 'Enhance your store with these must-have plugins: WooCommerce Subscriptions for recurring revenue, YITH WooCommerce Wishlist for customer engagement, MailChimp for WooCommerce for email marketing, Google Analytics for WooCommerce for tracking, and WPForms or Gravity Forms for custom checkout fields. Keep plugin count reasonable to maintain speed.',
      },
      {
        type: 'stats',
        stats: [
          { label: 'Active WooCommerce Stores', value: '5M+' },
          { label: 'E-Commerce Market Share', value: '28%' },
          { label: 'Avg Conversion Rate', value: '2.5-3%' },
          { label: 'Mobile E-Commerce Share', value: '73%' },
        ],
      },
      {
        type: 'tip',
        text: 'Pro Tip: Invest in professional product photography. Studies show that high-quality images increase conversion rates by up to 40%. Consider 360-degree product views and customer-submitted photos for social proof.',
      },
    ],
  },
  {
    id: 'seo-fundamentals-2025',
    title: 'SEO Fundamentals Every Website Owner Must Know in 2025',
    excerpt:
      'Master the core SEO strategies that drive organic traffic, from on-page optimization to technical SEO and link building best practices.',
    category: 'SEO',
    readTime: '9 min read',
    date: 'February 18, 2025',
    gradient: 'from-cyan-500 to-teal-600',
    tags: ['SEO', 'Google', 'Organic Traffic', 'Rankings'],
    author: 'Upam',
    content: [
      {
        type: 'heading',
        text: 'SEO in 2025: What Actually Works',
      },
      {
        type: 'paragraph',
        text: 'Search engine optimization continues to evolve, but the core principles remain the same: provide the best answer to the searcher\'s question. Google\'s algorithms are increasingly sophisticated at understanding content quality, user intent, and expertise. In 2025, the most successful SEO strategies combine technical excellence, outstanding content, and genuine authority building.',
      },
      {
        type: 'heading',
        text: 'On-Page SEO Essentials',
      },
      {
        type: 'paragraph',
        text: 'On-page optimization is the foundation of your SEO strategy. Every page on your site should target a specific keyword cluster and search intent. Key elements include:',
      },
      {
        type: 'list',
        items: [
          'Title Tags: Include your primary keyword naturally, keep under 60 characters',
          'Meta Descriptions: Write compelling summaries under 155 characters with a clear CTA',
          'Header Hierarchy: Use H1-H6 tags logically, with one H1 per page',
          'URL Structure: Clean, descriptive URLs that include keywords (e.g., /blog/wordpress-speed-tips)',
          'Internal Linking: Connect related pages to distribute authority and help navigation',
          'Image Optimization: Descriptive alt text, compressed file sizes, next-gen formats',
          'Content Length: Match search intent — some queries need 500 words, others need 3,000+',
        ],
      },
      {
        type: 'heading',
        text: 'Technical SEO Checklist',
      },
      {
        type: 'paragraph',
        text: 'Technical SEO ensures search engines can crawl, index, and render your site properly. Prioritize: site speed (Core Web Vitals), mobile-first indexing (test with Google\'s Mobile-Friendly Test), XML sitemap submitted to Google Search Console, robots.txt configured correctly, structured data markup (Schema.org) for rich snippets, canonical URLs to avoid duplicate content issues, and proper 301 redirects for changed URLs.',
      },
      {
        type: 'heading',
        text: 'Content Strategy That Ranks',
      },
      {
        type: 'paragraph',
        text: 'Content is the engine of organic traffic growth. Focus on creating content that demonstrates E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness). Research competitors\' top-ranking pages and create something better. Update existing content regularly to maintain rankings. Build topical authority by comprehensively covering your subject area. Use data, original research, and unique perspectives to differentiate your content.',
      },
      {
        type: 'heading',
        text: 'Link Building the Right Way',
      },
      {
        type: 'paragraph',
        text: 'Backlinks remain one of Google\'s top ranking factors, but the quality matters far more than quantity. Focus on earning links naturally through: creating link-worthy content (original research, comprehensive guides, infographics), digital PR and outreach to industry publications, guest posting on reputable sites in your niche, broken link building on relevant websites, and strategic partnerships and collaborations.',
      },
      {
        type: 'stats',
        stats: [
          { label: 'Organic Click Share', value: '53%' },
          { label: 'Pages Needing Speed Fix', value: '90%' },
          { label: 'Avg Time to Rank', value: '3-6 mo' },
          { label: 'Featured Snippet CTR', value: '35%+' },
        ],
      },
      {
        type: 'tip',
        text: 'Pro Tip: Don\'t chase every SEO trend. Focus on consistently creating helpful, well-structured content that genuinely serves your audience. Google\'s algorithms are designed to reward exactly that.',
      },
    ],
  },
];

function BlogCard({
  article,
  index,
  isInView,
  onClick,
}: {
  article: BlogArticle;
  index: number;
  isInView: boolean;
  onClick: () => void;
}) {
  return (
    <motion.article
      onClick={onClick}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.12 }}
      className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover-glow"
    >
      {/* Category gradient header */}
      <div
        className={`relative h-44 bg-gradient-to-br ${article.gradient} overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
        {/* Decorative grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-grid" style={{ backgroundSize: '30px 30px' }} />
        </div>
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium">
            {article.category}
          </span>
        </div>
        {/* Book icon */}
        <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        {/* Read time badge */}
        <div className="absolute top-4 right-4">
          <span className="px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {article.date}
          </span>
          <span className="text-slate-600">by {article.author}</span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-white mb-3 group-hover:text-teal-300 transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20"
            >
              {tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">
              +{article.tags.length - 3}
            </span>
          )}
        </div>

        {/* Read more link */}
        <div className="flex items-center gap-2 text-teal-400 text-sm font-medium group-hover:gap-3 transition-all">
          Read Full Article
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </motion.article>
  );
}

export default function BlogSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [openArticleIndex, setOpenArticleIndex] = useState<number | null>(null);

  const openArticle =
    openArticleIndex !== null ? articles[openArticleIndex] : null;

  return (
    <section id="blog" className="relative py-16 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-15" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            Latest Insights
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Blog & <span className="gradient-text">Articles</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            Sharing knowledge and insights about WordPress development,
            lead generation, and virtual assistance best practices.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {articles.slice(0, 6).map((article, index) => (
            <BlogCard
              key={article.id}
              article={article}
              index={index}
              isInView={isInView}
              onClick={() => setOpenArticleIndex(index)}
            />
          ))}
        </div>

        {/* Article Detail Modal */}
        <BlogArticleModal
          article={openArticle}
          isOpen={openArticleIndex !== null}
          onClose={() => setOpenArticleIndex(null)}
        />

        {/* Featured Articles Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-12 sm:mt-16"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            Popular Topics
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'WordPress Development', count: articles.filter((a) => a.category === 'WordPress').length },
              { label: 'E-Commerce & WooCommerce', count: articles.filter((a) => a.category === 'E-Commerce').length },
              { label: 'SEO & Marketing', count: articles.filter((a) => a.category === 'SEO').length },
              { label: 'Lead Generation', count: articles.filter((a) => a.category === 'Lead Generation').length },
              { label: 'Business & Productivity', count: articles.filter((a) => a.category === 'Business').length },
              { label: 'Website Security', count: 1 },
            ].map((topic, idx) => (
              <button
                key={topic.label}
                onClick={() => {
                  const matchIdx = articles.findIndex(
                    (a) =>
                      (topic.label.includes('WordPress') && a.category === 'WordPress') ||
                      (topic.label.includes('E-Commerce') && a.category === 'E-Commerce') ||
                      (topic.label.includes('SEO') && a.category === 'SEO') ||
                      (topic.label.includes('Lead') && a.category === 'Lead Generation') ||
                      (topic.label.includes('Business') && a.category === 'Business') ||
                      (topic.label.includes('Security') && a.tags.includes('Security'))
                  );
                  if (matchIdx !== -1) setOpenArticleIndex(matchIdx);
                }}
                className="flex items-center justify-between px-4 py-3 rounded-xl glass-card border border-white/5 hover:border-teal-500/30 transition-all group"
              >
                <span className="text-sm text-slate-300 group-hover:text-teal-300 transition-colors">
                  {topic.label}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400">
                  {topic.count} article{topic.count !== 1 ? 's' : ''}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

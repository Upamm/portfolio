// Comprehensive seed script to populate the database with realistic demo data
// Run with: bun run scripts/seed-demo.ts

import { db } from '../src/lib/db';
import bcrypt from 'bcryptjs';
import { addDays, subDays, subHours, subMinutes } from 'date-fns';

// ──────────────────── Types ────────────────────

interface InvoiceItem {
  description: string;
  hours?: number;
  rate?: number;
  quantity?: number;
  unitPrice?: number;
  amount: number;
}

interface ClientSeed {
  name: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  lastLoginDaysAgo: number;
}

interface ProjectSeed {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'review' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  budget: number;
  progress: number;
  startDaysAgo: number;
  deadlineDaysFromNow: number;
  milestones: {
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    dueDaysFromStart: number;
  }[];
}

// ──────────────────── Seed Data ────────────────────

const ADMIN_EMAIL = 'mailupamm@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';
const CLIENT_PASSWORD = 'Client@123';

const clientsData: ClientSeed[] = [
  {
    name: 'John Carter',
    email: 'john.carter@techstart.com',
    company: 'TechStart Inc',
    phone: '+1 (555) 234-5678',
    address: '1234 Innovation Drive, San Francisco, CA 94107',
    lastLoginDaysAgo: 1,
  },
  {
    name: 'Sarah Mitchell',
    email: 'sarah.m@greenleaf.agency',
    company: 'GreenLeaf Agency',
    phone: '+1 (555) 876-5432',
    address: '567 Eco Lane, Portland, OR 97201',
    lastLoginDaysAgo: 3,
  },
  {
    name: 'Michael Chen',
    email: 'm.chen@nexusdigital.io',
    company: 'Nexus Digital',
    phone: '+1 (555) 345-6789',
    address: '890 Tech Blvd, Austin, TX 78701',
    lastLoginDaysAgo: 0,
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.r@urbaneats.co',
    company: 'Urban Eats Co.',
    phone: '+1 (555) 456-7890',
    address: '321 Flavor Street, New York, NY 10001',
    lastLoginDaysAgo: 5,
  },
  {
    name: 'David Kim',
    email: 'd.kim@cloudniinelabs.com',
    company: 'CloudNine Labs',
    phone: '+1 (555) 567-8901',
    address: '654 Cloud Way, Seattle, WA 98101',
    lastLoginDaysAgo: 2,
  },
];

const projectTemplates: Record<string, ProjectSeed[]> = {
  'TechStart Inc': [
    {
      title: 'Corporate Website Redesign',
      description: 'Complete redesign of TechStart corporate website with modern UI/UX, improved performance, and mobile-first approach. Includes CMS setup for blog and careers pages.',
      status: 'in-progress',
      priority: 'high',
      category: 'Web Design',
      budget: 8500,
      progress: 65,
      startDaysAgo: 18,
      deadlineDaysFromNow: 25,
      milestones: [
        { title: 'Discovery & Wireframes', description: 'Stakeholder interviews, competitor analysis, and wireframe designs', status: 'completed', dueDaysFromStart: 5 },
        { title: 'UI/UX Design', description: 'High-fidelity mockups and design system creation', status: 'completed', dueDaysFromStart: 12 },
        { title: 'Frontend Development', description: 'Responsive HTML/CSS/JS implementation with animations', status: 'in-progress', dueDaysFromStart: 25 },
        { title: 'CMS Integration', description: 'WordPress CMS setup with custom post types and page builder', status: 'pending', dueDaysFromStart: 35 },
      ],
    },
    {
      title: 'SaaS Landing Page',
      description: 'High-converting landing page for TechStart\'s new SaaS product with A/B testing capability, analytics integration, and email capture forms.',
      status: 'completed',
      priority: 'medium',
      category: 'Web Design',
      budget: 3200,
      progress: 100,
      startDaysAgo: 40,
      deadlineDaysFromNow: -10,
      milestones: [
        { title: 'Copy & Content Strategy', description: 'Landing page copy, value proposition, and CTA strategy', status: 'completed', dueDaysFromStart: 3 },
        { title: 'Design & Mockup', description: 'Hero section, features, pricing, and testimonial sections', status: 'completed', dueDaysFromStart: 8 },
        { title: 'Development & Launch', description: 'HTML/CSS implementation, form integration, and deployment', status: 'completed', dueDaysFromStart: 15 },
      ],
    },
    {
      title: 'SEO Optimization Campaign',
      description: 'Technical SEO audit, on-page optimization, keyword research, and content strategy for TechStart main website to improve organic rankings.',
      status: 'pending',
      priority: 'medium',
      category: 'SEO',
      budget: 4500,
      progress: 0,
      startDaysAgo: -5,
      deadlineDaysFromNow: 60,
      milestones: [
        { title: 'SEO Audit & Analysis', description: 'Technical audit, competitor analysis, and keyword research', status: 'pending', dueDaysFromStart: 7 },
        { title: 'On-Page Optimization', description: 'Meta tags, content optimization, schema markup, and internal linking', status: 'pending', dueDaysFromStart: 21 },
        { title: 'Content Strategy & Creation', description: 'Blog content calendar, pillar pages, and supporting articles', status: 'pending', dueDaysFromStart: 40 },
        { title: 'Monitoring & Reporting', description: 'Rank tracking, analytics setup, and monthly reports', status: 'pending', dueDaysFromStart: 55 },
      ],
    },
  ],
  'GreenLeaf Agency': [
    {
      title: 'Eco-Friendly E-Commerce Store',
      description: 'Full WooCommerce store for sustainable products with custom product filters, subscription options, and eco-friendly packaging calculator.',
      status: 'review',
      priority: 'high',
      category: 'E-Commerce',
      budget: 12000,
      progress: 90,
      startDaysAgo: 25,
      deadlineDaysFromNow: 5,
      milestones: [
        { title: 'Store Planning & Setup', description: 'Product catalog structure, payment gateways, and shipping configuration', status: 'completed', dueDaysFromStart: 7 },
        { title: 'Custom Theme Development', description: 'WooCommerce theme with custom product pages and checkout flow', status: 'completed', dueDaysFromStart: 18 },
        { title: 'Advanced Features', description: 'Product filters, subscriptions, wishlist, and reviews system', status: 'completed', dueDaysFromStart: 28 },
        { title: 'Testing & QA', description: 'Cross-browser testing, performance optimization, and security audit', status: 'in-progress', dueDaysFromStart: 35 },
      ],
    },
    {
      title: 'Monthly WordPress Maintenance',
      description: 'Ongoing WordPress maintenance including security updates, backups, performance monitoring, and content updates for GreenLeaf main website.',
      status: 'in-progress',
      priority: 'low',
      category: 'Maintenance',
      budget: 500,
      progress: 70,
      startDaysAgo: 60,
      deadlineDaysFromNow: 30,
      milestones: [
        { title: 'January Maintenance', description: 'Core updates, plugin updates, security scan, and backup verification', status: 'completed', dueDaysFromStart: 5 },
        { title: 'Performance Optimization', description: 'Image optimization, caching setup, and database cleanup', status: 'completed', dueDaysFromStart: 15 },
        { title: 'Content Updates', description: 'Blog post formatting, page updates, and SEO tweaks', status: 'in-progress', dueDaysFromStart: 30 },
      ],
    },
  ],
  'Nexus Digital': [
    {
      title: 'B2B Lead Generation Dashboard',
      description: 'Custom WordPress-based lead generation platform with CRM integration, automated email sequences, and real-time analytics dashboard.',
      status: 'in-progress',
      priority: 'urgent',
      category: 'WordPress',
      budget: 15000,
      progress: 45,
      startDaysAgo: 22,
      deadlineDaysFromNow: 20,
      milestones: [
        { title: 'Architecture & Planning', description: 'System architecture, database design, and API integrations planning', status: 'completed', dueDaysFromStart: 5 },
        { title: 'Core Platform Build', description: 'Custom post types, user roles, and lead management system', status: 'in-progress', dueDaysFromStart: 20 },
        { title: 'CRM Integration', description: 'HubSpot/Salesforce API integration and data sync', status: 'pending', dueDaysFromStart: 30 },
        { title: 'Analytics Dashboard', description: 'Real-time reporting, charts, and export functionality', status: 'pending', dueDaysFromStart: 38 },
      ],
    },
    {
      title: 'Client Portal Development',
      description: 'Secure client portal for Nexus Digital customers to view project progress, download deliverables, and communicate with the team.',
      status: 'completed',
      priority: 'high',
      category: 'WordPress',
      budget: 6800,
      progress: 100,
      startDaysAgo: 50,
      deadlineDaysFromNow: -15,
      milestones: [
        { title: 'Portal Design', description: 'User interface design for dashboard, projects, messages, and files sections', status: 'completed', dueDaysFromStart: 8 },
        { title: 'Backend Development', description: 'User authentication, role management, and API endpoints', status: 'completed', dueDaysFromStart: 20 },
        { title: 'Frontend Build', description: 'React-based SPA with real-time updates and file uploads', status: 'completed', dueDaysFromStart: 32 },
        { title: 'Testing & Deployment', description: 'Security testing, UAT, and production deployment', status: 'completed', dueDaysFromStart: 38 },
      ],
    },
    {
      title: 'Company Blog Setup',
      description: 'WordPress blog with custom theme, newsletter signup, social sharing, and content categorization for Nexus Digital thought leadership.',
      status: 'paused',
      priority: 'low',
      category: 'WordPress',
      budget: 2500,
      progress: 30,
      startDaysAgo: 15,
      deadlineDaysFromNow: 45,
      milestones: [
        { title: 'Blog Design & Theme', description: 'Custom blog theme matching brand guidelines', status: 'completed', dueDaysFromStart: 5 },
        { title: 'Content Migration', description: 'Import existing articles, format, and categorize', status: 'in-progress', dueDaysFromStart: 15 },
        { title: 'Newsletter Integration', description: 'Mailchimp integration and signup forms', status: 'pending', dueDaysFromStart: 25 },
      ],
    },
  ],
  'Urban Eats Co.': [
    {
      title: 'Restaurant Website & Online Ordering',
      description: 'Modern restaurant website with online ordering system, menu management, reservation booking, and delivery tracking integration.',
      status: 'in-progress',
      priority: 'urgent',
      category: 'E-Commerce',
      budget: 9500,
      progress: 55,
      startDaysAgo: 20,
      deadlineDaysFromNow: 15,
      milestones: [
        { title: 'Menu System Design', description: 'Digital menu with categories, modifiers, and dietary labels', status: 'completed', dueDaysFromStart: 5 },
        { title: 'Ordering System Build', description: 'Cart, checkout, payment integration, and order tracking', status: 'in-progress', dueDaysFromStart: 18 },
        { title: 'Reservation System', description: 'Table booking with time slots, party size, and confirmation emails', status: 'pending', dueDaysFromStart: 28 },
        { title: 'Launch & Training', description: 'Staff training, soft launch, and final adjustments', status: 'pending', dueDaysFromStart: 35 },
      ],
    },
    {
      title: 'Social Media Integration',
      description: 'Instagram feed integration, user-generated content gallery, and social sharing tools on the Urban Eats website.',
      status: 'completed',
      priority: 'medium',
      category: 'Web Design',
      budget: 1800,
      progress: 100,
      startDaysAgo: 45,
      deadlineDaysFromNow: -5,
      milestones: [
        { title: 'Instagram Feed Widget', description: 'Real-time Instagram grid and story highlights on homepage', status: 'completed', dueDaysFromStart: 5 },
        { title: 'UGC Gallery', description: 'Customer photo gallery with hashtag tracking and moderation', status: 'completed', dueDaysFromStart: 12 },
        { title: 'Social Sharing Tools', description: 'Share buttons, Open Graph optimization, and social login', status: 'completed', dueDaysFromStart: 18 },
      ],
    },
  ],
  'CloudNine Labs': [
    {
      title: 'Tech Documentation Website',
      description: 'Comprehensive documentation portal for CloudNine APIs and SDKs with search, versioning, interactive code examples, and developer community features.',
      status: 'in-progress',
      priority: 'high',
      category: 'WordPress',
      budget: 7200,
      progress: 40,
      startDaysAgo: 16,
      deadlineDaysFromNow: 30,
      milestones: [
        { title: 'Documentation Architecture', description: 'Information architecture, navigation structure, and search design', status: 'completed', dueDaysFromStart: 5 },
        { title: 'Theme Development', description: 'Developer-friendly theme with syntax highlighting and code blocks', status: 'in-progress', dueDaysFromStart: 18 },
        { title: 'Content Migration', description: 'Import existing docs, format code examples, add cross-references', status: 'pending', dueDaysFromStart: 30 },
        { title: 'Search & Versioning', description: 'Algolia search integration and API version management', status: 'pending', dueDaysFromStart: 40 },
      ],
    },
    {
      title: 'Performance Optimization',
      description: 'Comprehensive WordPress speed optimization including Core Web Vitals improvements, caching strategy, image optimization, and code minification.',
      status: 'review',
      priority: 'high',
      category: 'WordPress',
      budget: 3500,
      progress: 95,
      startDaysAgo: 12,
      deadlineDaysFromNow: 3,
      milestones: [
        { title: 'Performance Audit', description: 'Lighthouse audit, waterfall analysis, and bottleneck identification', status: 'completed', dueDaysFromStart: 3 },
        { title: 'Server-Side Optimization', description: 'Caching layer, database optimization, and CDN configuration', status: 'completed', dueDaysFromStart: 8 },
        { title: 'Frontend Optimization', description: 'Image optimization, CSS/JS minification, and lazy loading', status: 'completed', dueDaysFromStart: 15 },
        { title: 'Verification & Report', description: 'Final Lighthouse scores, Core Web Vitals report, and recommendations', status: 'in-progress', dueDaysFromStart: 18 },
      ],
    },
    {
      title: 'Data Entry & Content Management',
      description: 'Bulk data entry for product catalog, team member profiles, and service pages across CloudNine website properties.',
      status: 'completed',
      priority: 'low',
      category: 'WordPress',
      budget: 1200,
      progress: 100,
      startDaysAgo: 30,
      deadlineDaysFromNow: -10,
      milestones: [
        { title: 'Product Catalog Entry', description: 'Enter 150+ products with descriptions, specs, images, and pricing', status: 'completed', dueDaysFromStart: 7 },
        { title: 'Team Profiles', description: 'Create team member pages with bios, photos, and social links', status: 'completed', dueDaysFromStart: 12 },
        { title: 'QA & Cleanup', description: 'Data validation, formatting consistency, and broken link check', status: 'completed', dueDaysFromStart: 18 },
      ],
    },
  ],
};

const messageTemplates: Record<string, { client: string[]; admin: string[] }> = {
  'TechStart Inc': {
    client: [
      'Hi Upam! I wanted to check in on the website redesign progress. How are things coming along?',
      'The wireframes look great! The team really liked the navigation structure you proposed.',
      'We have some feedback on the UI mockups. Can we schedule a call this week to discuss?',
      'Just reviewed the frontend progress on staging. The animations are amazing! A few minor tweaks needed though.',
      'Quick question - will the CMS support custom post types for our case studies?',
      'Thanks for the update! Looking forward to seeing the next iteration.',
      'The client meeting went well. They loved the design direction. Green light to proceed!',
      'Can we add an emergency contact form to the site? Something that stands out on the homepage.',
    ],
    admin: [
      'Hey John! Great to hear from you. The redesign is on track - currently at 65% completion.',
      'Thanks for the positive feedback! I\'ll start on the high-fidelity designs this week.',
      'Absolutely! How about Thursday at 2 PM EST? I\'ll send a calendar invite.',
      'Glad you like it! I\'ve noted the tweaks - should have them implemented by Friday.',
      'Yes! We\'ll set up a custom "Case Studies" post type with custom fields for project details.',
      'No problem! I\'ll push an update to staging later today.',
      'That\'s wonderful news! I\'ll prioritize the remaining frontend tasks.',
      'Sure thing! I\'ll add a prominent contact form with a pulsing CTA button to the hero section.',
    ],
  },
  'GreenLeaf Agency': {
    client: [
      'Hey Upam, the eco-store is looking fantastic! The product filters work beautifully.',
      'We need to add a carbon footprint calculator to the product pages. Is that feasible?',
      'The subscription option for monthly deliveries is a game-changer for our business model.',
      'Can you update the shipping rates? We just negotiated better rates with our carrier.',
      'The maintenance report looks good. Are there any security concerns we should address?',
      'Thanks for handling those plugin updates so quickly!',
      'We\'d like to add a blog section to the store for sustainability tips. Can we discuss?',
    ],
    admin: [
      'Thanks Sarah! I\'m really happy with how the filters turned out. The AJAX loading is smooth.',
      'Great idea! I can build a custom carbon calculator widget. Should take about 3-4 days.',
      'Agreed! WooCommerce Subscriptions integration is all set up and tested.',
      'Done! Updated the shipping zones and rates in WooCommerce settings.',
      'Everything looks clean. I ran a full security scan and all checks passed.',
      'Always happy to help keep things running smoothly!',
      'Absolutely! A blog would be great for SEO. I can set that up this week.',
    ],
  },
  'Nexus Digital': {
    client: [
      'Hey Upam, the lead gen platform is coming together nicely. The dashboard mockups are impressive!',
      'We need to integrate with HubSpot CRM. Do you have experience with their API?',
      'The real-time analytics feature - can we add custom date range filters?',
      'How\'s the client portal performing? Any issues reported by users?',
      'The blog setup is on hold for now - we\'re focusing on the lead gen platform first.',
      'Can we add a lead scoring system based on engagement metrics?',
      'Great work on the portal! Our clients are loving the new interface.',
    ],
    admin: [
      'Thanks Michael! The dashboard is my favorite part too. Lots of Chart.js customization there.',
      'Yes! I\'ve integrated HubSpot API on several projects. Their REST API is well-documented.',
      'Good thinking. I\'ll add preset ranges (7d, 30d, 90d) plus a custom date picker.',
      'The portal has been rock solid. Zero downtime since launch. Users particularly love the file upload feature.',
      'Understood! I\'ll pause the blog work and reallocate those hours to the lead gen project.',
      'Absolutely! I can implement a weighted scoring algorithm based on page views, form fills, and email opens.',
      'So glad to hear that! The React frontend really made a difference in the UX.',
    ],
  },
  'Urban Eats Co.': {
    client: [
      'The online ordering system is exactly what we needed! Our test orders went through perfectly.',
      'We need to add gluten-free and vegan labels to the menu items. Can you update the modifiers?',
      'The reservation system is crucial for our weekend rush. How\'s that coming along?',
      'Love the Instagram integration! Our food photos look amazing on the homepage.',
      'Can we add a "popular items" section that updates based on order frequency?',
      'The delivery tracking API integration - is that included in the current scope?',
      'Thanks for making the menu mobile-friendly. Our customers are ordering from their phones like crazy!',
    ],
    admin: [
      'That\'s great to hear Emily! The Stripe integration is solid and payment processing is fast.',
      'Done! Added dietary filter buttons and modifier tags for allergens.',
      'The reservation system is about 60% complete. ETA is next week for initial testing.',
      'The Instagram feed really adds that appetizing visual appeal! Custom CSS styling helped a lot.',
      'Great idea! I\'ll create a dynamic "Popular" section that pulls from order data.',
      'Yes, the DoorDash API integration is part of the scope. I\'m working on that now.',
      'Mobile-first was a priority from the start! Glad it\'s paying off.',
    ],
  },
  'CloudNine Labs': {
    client: [
      'The documentation site is shaping up well! The code syntax highlighting looks professional.',
      'We need to support API versioning - v1, v2, and v3. Each version should have its own section.',
      'The performance results are incredible! Our Lighthouse score jumped from 42 to 96!',
      'Can you add interactive code playgrounds where developers can test API calls?',
      'The data entry is all done and looks perfect. Great attention to detail!',
      'We\'d like to add a dark mode toggle to the docs. Developers love dark themes.',
      'The search functionality - can it support fuzzy matching and synonyms?',
    ],
    admin: [
      'Thanks David! I\'m using Prism.js with a custom theme matching your brand colors.',
      'Versioning is on the roadmap! I\'ll implement a version switcher in the sidebar and URL structure.',
      'Those results speak for themselves! Server-side caching and image optimization made the biggest impact.',
      'I can integrate a sandboxed code editor - something like CodeSandbox embeds. Let me prototype it.',
      'Appreciate that! I triple-checked all the product specs and cross-referenced with your spreadsheet.',
      'Dark mode is a must for dev docs! I\'ll add a toggle with system preference detection.',
      'Absolutely! Algolia supports fuzzy matching and synonyms out of the box. I\'ll configure both.',
    ],
  },
};

const ticketTemplates: Record<string, { subject: string; description: string; priority: string; category: string }[]> = {
  'TechStart Inc': [
    {
      subject: 'Website loading slowly on mobile devices',
      description: 'Our team reports that the staging site takes 8+ seconds to load on mobile. The desktop version loads fine in about 3 seconds. Can you investigate and optimize for mobile performance?',
      priority: 'high',
      category: 'bug',
    },
    {
      subject: 'Request for additional blog categories',
      description: 'We need to add three new blog categories: "Case Studies", "Press Releases", and "Tech Insights". Can you set these up and migrate existing posts to appropriate categories?',
      priority: 'medium',
      category: 'feature',
    },
  ],
  'GreenLeaf Agency': [
    {
      subject: 'Subscription renewal emails not sending',
      description: 'Customers with active subscriptions are not receiving renewal reminder emails. The WooCommerce Subscriptions plugin shows the emails are queued but not being sent. This is affecting our monthly recurring revenue.',
      priority: 'urgent',
      category: 'bug',
    },
  ],
  'Nexus Digital': [
    {
      subject: 'CRM sync failing for large contact lists',
      description: 'When importing contact lists over 500 records, the HubSpot sync fails silently. Small lists sync fine. We need this fixed urgently as we have a 2000+ contact import pending.',
      priority: 'urgent',
      category: 'bug',
    },
    {
      subject: 'Need export to PDF feature for reports',
      description: 'Our sales team needs to export the lead generation reports as PDF files for client presentations. Currently only CSV export is available. A branded PDF template would be ideal.',
      priority: 'medium',
      category: 'feature',
    },
  ],
  'Urban Eats Co.': [
    {
      subject: 'Menu items not displaying correct prices after update',
      description: 'After the latest menu update, several items are showing $0.00 prices on the frontend even though the correct prices are in the WooCommerce backend. This is affecting about 15 items across 3 categories.',
      priority: 'high',
      category: 'bug',
    },
  ],
  'CloudNine Labs': [
    {
      subject: 'Search index not updating for new documentation pages',
      description: 'New documentation pages published in the last 48 hours are not appearing in the Algolia search index. Existing pages search fine. The index rebuild button in wp-admin shows success but new pages remain unindexed.',
      priority: 'high',
      category: 'bug',
    },
    {
      subject: 'Request for API rate limiting documentation',
      description: 'Can you add a new documentation section covering API rate limits, quota management, and best practices for handling rate limit responses? Our developer community has been asking for this.',
      priority: 'medium',
      category: 'feature',
    },
  ],
};

const ticketReplyTemplates: Record<string, { content: string; senderRole: string }[]> = {
  'Website loading slowly on mobile devices': [
    { content: 'I\'ve identified the issue - there are unoptimized images and render-blocking CSS causing the slowdown. Working on fixes now.', senderRole: 'admin' },
    { content: 'Thanks for the quick response! How long do you estimate the fix will take?', senderRole: 'client' },
    { content: 'Should be resolved within 24 hours. I\'m compressing images, implementing lazy loading, and deferring non-critical CSS.', senderRole: 'admin' },
    { content: 'Fixed! Mobile load time is now under 3 seconds. Please have your team test and let me know.', senderRole: 'admin' },
    { content: 'Just tested on my phone - loads super fast now! Great work Upam!', senderRole: 'client' },
  ],
  'Request for additional blog categories': [
    { content: 'I can set those up right away. Should I also create category archive templates with custom designs?', senderRole: 'admin' },
    { content: 'Yes please! Each category should have a unique header color to match our brand.', senderRole: 'client' },
    { content: 'Done! All three categories are live with custom colored headers. I\'ve also migrated the existing posts.', senderRole: 'admin' },
    { content: 'Looks perfect! Thank you for the quick turnaround.', senderRole: 'client' },
  ],
  'Subscription renewal emails not sending': [
    { content: 'This is likely a cron job issue. WooCommerce scheduled actions may not be running. Let me check the system cron and WP-Cron configuration.', senderRole: 'admin' },
    { content: 'Found it! The WP-Cron was being blocked by a security plugin. I\'ve added the necessary exceptions and manually triggered the pending emails.', senderRole: 'admin' },
    { content: 'Confirmed - customers are receiving their renewal emails now. Thank you for the quick fix!', senderRole: 'client' },
  ],
  'CRM sync failing for large contact lists': [
    { content: 'The issue is a PHP memory limit and timeout problem. Large imports exceed the default 128MB limit. I\'m increasing it and adding batch processing.', senderRole: 'admin' },
    { content: 'I\'ve implemented chunked processing (100 records per batch) and increased the memory limit to 512MB. Can you test the 2000-contact import?', senderRole: 'admin' },
    { content: 'Running the import now. It\'s processing in batches and showing progress. Much better!', senderRole: 'client' },
    { content: 'Import completed successfully! All 2034 contacts synced to HubSpot. Thank you!', senderRole: 'client' },
  ],
  'Need export to PDF feature for reports': [
    { content: 'Great idea! I\'ll implement a PDF export using a server-side PDF generator with your brand template. ETA: 3-4 days.', senderRole: 'admin' },
    { content: 'The PDF export is ready! It generates branded reports with charts, tables, and your company header/footer. Check it out on the reports page.', senderRole: 'admin' },
    { content: 'This looks professional! The sales team is going to love this. Exactly what we needed.', senderRole: 'client' },
  ],
  'Menu items not displaying correct prices after update': [
    { content: 'I see the issue - there\'s a WooCommerce product price cache that wasn\'t cleared after the bulk update. Running a cache purge now.', senderRole: 'admin' },
    { content: 'Cache has been purged and the prices are now displaying correctly. I\'ve also added an automatic cache clear to the bulk update workflow to prevent this in the future.', senderRole: 'admin' },
    { content: 'All prices are showing correctly now. Thanks for the quick fix and the preventative measure!', senderRole: 'client' },
  ],
  'Search index not updating for new documentation pages': [
    { content: 'The Algolia webhook seems to be failing silently for new posts. Checking the webhook logs and reindex configuration.', senderRole: 'admin' },
    { content: 'Found the issue - the webhook URL was changed during a plugin update. I\'ve restored the correct endpoint and triggered a full reindex. All pages should be searchable within 10 minutes.', senderRole: 'admin' },
    { content: 'Verified - all new documentation pages are now appearing in search. Thanks!', senderRole: 'client' },
  ],
  'Request for API rate limiting documentation': [
    { content: 'I\'ll create a comprehensive rate limiting guide with code examples in multiple languages. Should be ready by end of week.', senderRole: 'admin' },
    { content: 'The rate limiting documentation is now live! It covers limits per tier, retry strategies, and code examples for Python, JavaScript, and Go.', senderRole: 'admin' },
    { content: 'Excellent! Our developer community is going to appreciate this. Well written and clear.', senderRole: 'client' },
  ],
};

const fileUploadTemplates: Record<string, { filename: string; filetype: string; category: string; sizeKB: number }[]> = {
  'TechStart Inc': [
    { filename: 'TechStart-BrandGuidelines-v2.pdf', filetype: 'application/pdf', category: 'project', sizeKB: 4500 },
    { filename: 'TechStart-Wireframes-Final.fig', filetype: 'application/octet-stream', category: 'project', sizeKB: 12300 },
    { filename: 'TechStart-Content-Sitemap.xlsx', filetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', category: 'project', sizeKB: 340 },
    { filename: 'TechStart-Security-Audit-Report.pdf', filetype: 'application/pdf', category: 'contract', sizeKB: 2100 },
  ],
  'GreenLeaf Agency': [
    { filename: 'GreenLeaf-Product-Catalog-2025.csv', filetype: 'text/csv', category: 'project', sizeKB: 890 },
    { filename: 'EcoStore-UI-Design-Files.zip', filetype: 'application/zip', category: 'project', sizeKB: 45600 },
    { filename: 'GreenLeaf-Maintenance-Report-Jan.pdf', filetype: 'application/pdf', category: 'invoice', sizeKB: 1200 },
  ],
  'Nexus Digital': [
    { filename: 'Nexus-LeadGen-Platform-Flowchart.pdf', filetype: 'application/pdf', category: 'project', sizeKB: 1800 },
    { filename: 'HubSpot-API-Integration-Doc.pdf', filetype: 'application/pdf', category: 'project', sizeKB: 950 },
    { filename: 'Nexus-Contract-SOW-2025.pdf', filetype: 'application/pdf', category: 'contract', sizeKB: 3200 },
    { filename: 'LeadGen-Database-Schema.png', filetype: 'image/png', category: 'project', sizeKB: 560 },
  ],
  'Urban Eats Co.': [
    { filename: 'UrbanEats-Full-Menu-2025.xlsx', filetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', category: 'project', sizeKB: 245 },
    { filename: 'Restaurant-HighRes-Photos.zip', filetype: 'application/zip', category: 'project', sizeKB: 89000 },
    { filename: 'OnlineOrdering-Technical-Specs.pdf', filetype: 'application/pdf', category: 'project', sizeKB: 1500 },
  ],
  'CloudNine Labs': [
    { filename: 'CloudNine-API-Endpoints-v3.json', filetype: 'application/json', category: 'project', sizeKB: 128 },
    { filename: 'Docs-Site-Theme-Design.fig', filetype: 'application/octet-stream', category: 'project', sizeKB: 8700 },
    { filename: 'Performance-Report-BeforeAfter.pdf', filetype: 'application/pdf', category: 'project', sizeKB: 2800 },
    { filename: 'CloudNine-Product-Data-Batch1.csv', filetype: 'text/csv', category: 'project', sizeKB: 1560 },
  ],
};

const notificationTemplates = [
  { title: 'Project Update', message: 'Your project status has been updated to In Progress.', type: 'info', category: 'project', link: 'projects' },
  { title: 'New Message', message: 'You have a new message from Upam.', type: 'info', category: 'message', link: 'messages' },
  { title: 'Invoice Generated', message: 'A new invoice has been generated for your project.', type: 'warning', category: 'invoice', link: 'invoices' },
  { title: 'Payment Received', message: 'Your payment has been processed successfully.', type: 'success', category: 'invoice', link: 'invoices' },
  { title: 'Milestone Completed', message: 'A project milestone has been marked as completed.', type: 'success', category: 'project', link: 'projects' },
  { title: 'Ticket Update', message: 'Your support ticket has received a new reply.', type: 'info', category: 'ticket', link: 'tickets' },
  { title: 'Ticket Resolved', message: 'Your support ticket has been resolved.', type: 'success', category: 'ticket', link: 'tickets' },
  { title: 'File Uploaded', message: 'A new file has been uploaded to your project.', type: 'info', category: 'file', link: 'files' },
  { title: 'Payment Overdue', message: 'An invoice payment is now overdue. Please process at your earliest convenience.', type: 'warning', category: 'invoice', link: 'invoices' },
  { title: 'Project Review', message: 'Your project is ready for review. Please check and provide feedback.', type: 'info', category: 'project', link: 'projects' },
  { title: 'Welcome!', message: 'Welcome to your client portal! Here you can manage projects, invoices, and communicate with us.', type: 'info', category: 'general', link: 'dashboard' },
  { title: 'Maintenance Complete', message: 'Scheduled maintenance has been completed successfully.', type: 'success', category: 'project', link: 'projects' },
];

// ──────────────────── Helpers ────────────────────

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0);
  return d;
}

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(17, 0, 0, 0);
  return d;
}

function hoursAgo(hours: number): Date {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d;
}

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateInvoiceItems(category: string): InvoiceItem[] {
  const itemSets: Record<string, InvoiceItem[]> = {
    'Web Design': [
      { description: 'UI/UX Design - Homepage', hours: 12, rate: 85, amount: 1020 },
      { description: 'UI/UX Design - Inner Pages', hours: 18, rate: 85, amount: 1530 },
      { description: 'Frontend Development', hours: 40, rate: 75, amount: 3000 },
      { description: 'Responsive Optimization', hours: 8, rate: 75, amount: 600 },
      { description: 'Animation & Interaction Design', hours: 10, rate: 90, amount: 900 },
    ],
    'E-Commerce': [
      { description: 'WooCommerce Setup & Configuration', hours: 8, rate: 85, amount: 680 },
      { description: 'Custom Theme Development', hours: 35, rate: 85, amount: 2975 },
      { description: 'Product Catalog Migration (150+ items)', hours: 15, rate: 50, amount: 750 },
      { description: 'Payment Gateway Integration', hours: 6, rate: 85, amount: 510 },
      { description: 'Advanced Product Filters', hours: 12, rate: 85, amount: 1020 },
      { description: 'Subscription Module Setup', hours: 10, rate: 85, amount: 850 },
    ],
    'WordPress': [
      { description: 'WordPress Installation & Configuration', hours: 4, rate: 75, amount: 300 },
      { description: 'Custom Theme Development', hours: 30, rate: 85, amount: 2550 },
      { description: 'Custom Plugin Development', hours: 20, rate: 95, amount: 1900 },
      { description: 'API Integration Development', hours: 16, rate: 90, amount: 1440 },
      { description: 'Database Schema Design', hours: 8, rate: 90, amount: 720 },
      { description: 'Security Hardening', hours: 6, rate: 85, amount: 510 },
    ],
    'Maintenance': [
      { description: 'Monthly Security Updates (Jan)', quantity: 1, unitPrice: 200, amount: 200 },
      { description: 'Performance Monitoring & Optimization', quantity: 1, unitPrice: 150, amount: 150 },
      { description: 'Content Updates (5 pages)', quantity: 5, unitPrice: 30, amount: 150 },
      { description: 'Backup Management & Verification', quantity: 1, unitPrice: 50, amount: 50 },
    ],
    'SEO': [
      { description: 'Technical SEO Audit', hours: 10, rate: 90, amount: 900 },
      { description: 'Keyword Research & Strategy', hours: 8, rate: 85, amount: 680 },
      { description: 'On-Page Optimization (20 pages)', hours: 15, rate: 75, amount: 1125 },
      { description: 'Content Strategy Development', hours: 6, rate: 85, amount: 510 },
      { description: 'Schema Markup Implementation', hours: 5, rate: 85, amount: 425 },
    ],
  };

  const items = itemSets[category] || itemSets['WordPress'];
  return pickRandom(items, 3 + Math.floor(Math.random() * 2));
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// ──────────────────── Seed Function ────────────────────

export async function seed() {
  console.log('🔄 Starting demo data seed...');
  console.log('');

  // ── Step 1: Clean existing data ──
  console.log('🧹 Cleaning existing demo data...');

  await db.ticketReply.deleteMany();
  await db.ticket.deleteMany();
  await db.notification.deleteMany();
  await db.fileUpload.deleteMany();
  await db.message.deleteMany();
  await db.invoice.deleteMany();
  await db.milestone.deleteMany();
  await db.project.deleteMany();
  await db.client.deleteMany();

  console.log('✅ Existing data cleaned.');
  console.log('');

  // ── Step 2: Create admin account ──
  console.log('👤 Creating admin account...');
  const adminPassword = await hashPassword(ADMIN_PASSWORD);
  const admin = await db.client.create({
    data: {
      name: 'Upam',
      email: ADMIN_EMAIL,
      password: adminPassword,
      role: 'admin',
      company: 'Upam Web Services',
      phone: null,
      address: null,
      isActive: true,
      lastLogin: daysAgo(0),
    },
  });
  console.log(`   ✅ Admin created: ${admin.email}`);
  console.log('');

  // ── Step 3: Create client accounts and related data ──
  const clientPassword = await hashPassword(CLIENT_PASSWORD);
  let invoiceCounter = 1;
  const stats = {
    clients: 0,
    projects: 0,
    milestones: 0,
    invoices: 0,
    messages: 0,
    tickets: 0,
    ticketReplies: 0,
    fileUploads: 0,
    notifications: 0,
  };

  for (const clientData of clientsData) {
    console.log(`👤 Creating client: ${clientData.name} (${clientData.company})...`);

    const client = await db.client.create({
      data: {
        name: clientData.name,
        email: clientData.email,
        password: clientPassword,
        role: 'client',
        company: clientData.company,
        phone: clientData.phone,
        address: clientData.address,
        isActive: true,
        lastLogin: daysAgo(clientData.lastLoginDaysAgo),
      },
    });
    stats.clients++;

    // ── Projects ──
    const projects = projectTemplates[clientData.company] || [];
    for (const projectData of projects) {
      const projectStartDate = daysAgo(projectData.startDaysAgo);
      const projectDeadline = daysFromNow(projectData.deadlineDaysFromNow);

      const project = await db.project.create({
        data: {
          title: projectData.title,
          description: projectData.description,
          status: projectData.status,
          priority: projectData.priority,
          category: projectData.category,
          budget: projectData.budget,
          deadline: projectDeadline,
          startDate: projectStartDate,
          progress: projectData.progress,
          clientId: client.id,
        },
      });
      stats.projects++;

      // ── Milestones ──
      for (let mi = 0; mi < projectData.milestones.length; mi++) {
        const milestoneData = projectData.milestones[mi];
        const milestoneDueDate = addDays(projectStartDate, milestoneData.dueDaysFromStart);
        let completedAt: Date | null = null;

        if (milestoneData.status === 'completed') {
          completedAt = addDays(milestoneDueDate, -Math.floor(Math.random() * 3));
        }

        await db.milestone.create({
          data: {
            title: milestoneData.title,
            description: milestoneData.description,
            status: milestoneData.status,
            dueDate: milestoneDueDate,
            completedAt,
            order: mi,
            projectId: project.id,
          },
        });
        stats.milestones++;
      }

      // ── Invoices (1-3 per project, weighted toward active projects) ──
      const invoiceCount = projectData.status === 'completed' ? 3 : projectData.status === 'in-progress' ? 2 : 1;
      for (let inv = 0; inv < invoiceCount; inv++) {
        const invoiceItems = generateInvoiceItems(projectData.category);
        const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
        const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
        const discount = inv === 0 ? Math.round(subtotal * 0.1 * 100) / 100 : 0; // 10% discount on first invoice
        const amount = subtotal + tax - discount;

        const invoiceStatuses: Array<'pending' | 'paid' | 'overdue'> =
          projectData.status === 'completed'
            ? ['paid', 'paid', 'paid']
            : inv === 0
              ? ['paid', 'paid']
              : ['pending', 'overdue'];

        const status = invoiceStatuses[inv] || 'pending';
        const invoiceDueDate = addDays(projectStartDate, 15 + inv * 20);
        let paidAt: Date | null = null;
        if (status === 'paid') {
          paidAt = addDays(invoiceDueDate, -Math.floor(Math.random() * 10));
        }

        const invoiceNumber = `INV-${String(invoiceCounter).padStart(4, '0')}`;

        await db.invoice.create({
          data: {
            invoiceNumber,
            clientId: client.id,
            projectId: project.id,
            amount,
            tax,
            discount,
            status,
            dueDate: invoiceDueDate,
            paidAt,
            notes: `Payment for ${projectData.title} - ${status === 'paid' ? 'Thank you for your payment!' : status === 'overdue' ? 'Please process payment at your earliest convenience.' : 'Due within 30 days.'}`,
            items: JSON.stringify(invoiceItems),
          },
        });
        invoiceCounter++;
        stats.invoices++;
      }
    }

    // ── Messages (5-15 per client, conversation style) ──
    const msgTemplates = messageTemplates[clientData.company];
    if (msgTemplates) {
      const messageCount = 6 + Math.floor(Math.random() * 8); // 6-13
      const allMessages: Array<{ content: string; senderRole: string }> = [];

      // Interleave client and admin messages
      const maxPairs = Math.min(messageCount / 2, Math.min(msgTemplates.client.length, msgTemplates.admin.length));
      for (let mi = 0; mi < maxPairs; mi++) {
        allMessages.push(
          { content: msgTemplates.client[mi], senderRole: 'client' },
          { content: msgTemplates.admin[mi], senderRole: 'admin' }
        );
      }

      for (let mi = 0; mi < allMessages.length; mi++) {
        const msg = allMessages[mi];
        const hoursOffset = (allMessages.length - mi) * 6 + Math.random() * 4;
        const createdAt = hoursAgo(hoursOffset);

        await db.message.create({
          data: {
            content: msg.content,
            senderId: msg.senderRole === 'admin' ? admin.id : client.id,
            senderRole: msg.senderRole,
            clientId: client.id,
            isRead: hoursOffset < 24,
            createdAt,
          },
        });
        stats.messages++;
      }
    }

    // ── Tickets (1-2 per client) ──
    const tickets = ticketTemplates[clientData.company] || [];
    for (const ticketData of tickets) {
      const ticket = await db.ticket.create({
        data: {
          subject: ticketData.subject,
          description: ticketData.description,
          status: 'resolved',
          priority: ticketData.priority,
          category: ticketData.category,
          clientId: client.id,
          createdAt: daysAgo(8 + Math.floor(Math.random() * 15)),
        },
      });
      stats.tickets++;

      // ── Ticket Replies ──
      const replies = ticketReplyTemplates[ticketData.subject] || [];
      for (let ri = 0; ri < replies.length; ri++) {
        const reply = replies[ri];
        const replyDate = subHours(ticket.createdAt, -(ri * 4 + Math.floor(Math.random() * 3)));

        await db.ticketReply.create({
          data: {
            content: reply.content,
            senderId: reply.senderRole === 'admin' ? admin.id : client.id,
            senderRole: reply.senderRole,
            ticketId: ticket.id,
            createdAt: replyDate,
          },
        });
        stats.ticketReplies++;
      }
    }

    // ── File Uploads (2-4 per client) ──
    const files = fileUploadTemplates[clientData.company] || [];
    for (const fileData of files) {
      await db.fileUpload.create({
        data: {
          filename: fileData.filename,
          filepath: `/uploads/${clientData.company.toLowerCase().replace(/\s+/g, '-')}/${fileData.filename}`,
          filetype: fileData.filetype,
          filesize: fileData.sizeKB * 1024,
          category: fileData.category,
          clientId: client.id,
          projectId: null, // Will be linked randomly if we want
          createdAt: daysAgo(Math.floor(Math.random() * 25) + 1),
        },
      });
      stats.fileUploads++;
    }

    // ── Notifications (3-6 per client) ──
    const notifCount = 3 + Math.floor(Math.random() * 4);
    const selectedNotifs = pickRandom(notificationTemplates, notifCount);

    for (let ni = 0; ni < selectedNotifs.length; ni++) {
      const notif = selectedNotifs[ni];
      const notifDate = daysAgo(ni + 1);

      await db.notification.create({
        data: {
          title: notif.title,
          message: notif.message,
          type: notif.type,
          category: notif.category,
          link: notif.link,
          isRead: ni < Math.ceil(notifCount / 2),
          clientId: client.id,
          createdAt: notifDate,
        },
      });
      stats.notifications++;
    }

    console.log(`   ✅ ${clientData.name} fully seeded.`);
  }

  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('   SEED COMPLETE - Summary');
  console.log('═══════════════════════════════════════');
  console.log(`   👤 Admin Account:     1`);
  console.log(`   👤 Client Accounts:   ${stats.clients}`);
  console.log(`   📁 Projects:          ${stats.projects}`);
  console.log(`   📌 Milestones:         ${stats.milestones}`);
  console.log(`   💰 Invoices:           ${stats.invoices} (INV-0001 to INV-${String(invoiceCounter - 1).padStart(4, '0')})`);
  console.log(`   💬 Messages:           ${stats.messages}`);
  console.log(`   🎫 Tickets:            ${stats.tickets}`);
  console.log(`   💬 Ticket Replies:     ${stats.ticketReplies}`);
  console.log(`   📎 File Uploads:       ${stats.fileUploads}`);
  console.log(`   🔔 Notifications:      ${stats.notifications}`);
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log('🔑 Admin Login:');
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log('');
  console.log('🔑 Client Login (any client):');
  console.log(`   Email:    john.carter@techstart.com`);
  console.log(`   Password: ${CLIENT_PASSWORD}`);
  console.log('');
}

// ──────────────────── Run ────────────────────

seed()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

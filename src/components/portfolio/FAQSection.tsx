'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'What services do you offer?',
    answer:
      'I offer WordPress development, theme customization, speed optimization, B2B lead generation, virtual assistant services, and ongoing WordPress maintenance. Whether you need a brand new website or want to enhance an existing one, I can help you achieve your goals.',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'Most WordPress projects are completed within 3-7 business days depending on complexity. Simple website setups and customizations can be done in 2-3 days, while more complex e-commerce stores or lead generation campaigns may take 7-14 days. I always provide a clear timeline before starting.',
  },
  {
    question: 'Do you offer post-project support?',
    answer:
      'Yes! I provide 30 days of free support after project completion. This includes bug fixes, minor adjustments, and answering any questions about your website. For ongoing maintenance, I offer monthly plans that include updates, backups, security monitoring, and performance checks.',
  },
  {
    question: 'What is your pricing structure?',
    answer:
      'Pricing varies based on project scope and complexity. I offer competitive rates with transparent pricing — no hidden fees. I provide a detailed quote before starting any work so you know exactly what to expect. Contact me for a free consultation and personalized quote.',
  },
  {
    question: 'Can you work with my existing WordPress site?',
    answer:
      'Absolutely! I can audit, optimize, and enhance your existing WordPress installation. Whether you need speed optimization, security hardening, design improvements, or new functionality added, I work with your current setup to deliver results without disrupting your existing content.',
  },
  {
    question: 'How do we communicate during the project?',
    answer:
      "I'm available via Fiverr messaging, email, and video calls for project discussions. I provide regular progress updates and am responsive to messages throughout the project. Clear communication is a priority, and I make sure you're always informed about the status of your project.",
  },
];

export default function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="faq" className="relative py-16 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <HelpCircle className="w-4 h-4 text-teal-400" />
            <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
              Got Questions?
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            Everything you need to know about working together. Can&apos;t find the answer you&apos;re looking for? Feel free to reach out.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="glass-card rounded-xl px-6 border-0 overflow-hidden data-[state=open]:border-teal-500/20"
                >
                  <AccordionTrigger className="text-white hover:text-teal-300 hover:no-underline text-left text-sm sm:text-base font-semibold py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 text-sm leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Glow Separator - FAQ → Contact */}
        <div className="glow-separator mt-16 sm:mt-32" />
      </div>
    </section>
  );
}

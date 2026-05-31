'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'mailupamm@gmail.com',
    href: 'mailto:mailupamm@gmail.com',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Bangladesh',
    href: null,
  },
  {
    icon: Clock,
    label: 'Response Time',
    value: 'Within 24 hours',
    href: null,
  },
];

const socialLinks = [
  {
    name: 'Fiverr',
    href: 'https://www.fiverr.com/upam1721',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M23.004 15.588a.995.995 0 10.002-1.99.995.995 0 00-.002 1.99zm-.996-3.705h-.857c-.084-.654-.27-1.269-.54-1.834l.602-.602a.996.996 0 10-1.408-1.408l-.46.46A6.018 6.018 0 0016.5 7.29V5.005a1 1 0 10-2 0V7.29a6.022 6.022 0 00-2.846 1.21l-.46-.46a.996.996 0 10-1.408 1.408l.602.602a5.974 5.974 0 00-.54 1.834h-.856a1 1 0 100 2h.856c.084.654.27 1.269.54 1.834l-.602.602a.996.996 0 101.408 1.408l.46-.46c.83.542 1.792.92 2.846 1.046v2.284a1 1 0 102 0V17.8a6.022 6.022 0 002.846-1.21l.46.46a.996.996 0 101.408-1.408l-.602-.602c.27-.565.456-1.18.54-1.834h.857a1 1 0 100-2zm-6.006 2.943a4.01 4.01 0 110-8.018 4.01 4.01 0 010 8.018zm0-5.014a1.003 1.003 0 100 2.007 1.003 1.003 0 000-2.007z" />
      </svg>
    ),
  },
  {
    name: 'Twitter / X',
    href: 'https://twitter.com/upam1721',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/upam1721',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: 'Message sent!',
          description: "Thank you for reaching out. I'll get back to you within 24 hours.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-10 sm:py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-15" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-10"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            Contact
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            Have a project in mind? Let&apos;s discuss how I can help you achieve
            your goals.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Let&apos;s Work Together
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Whether you need a WordPress website, lead generation, or virtual
                assistant services, I&apos;m here to help. Reach out and let&apos;s
                start a conversation.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="glass-card rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                    <info.icon className="w-5 h-5 text-teal-400" />
                  </div>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="hover:text-teal-400 transition-colors"
                      {...(info.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <p className="text-xs text-slate-500">{info.label}</p>
                      <p className="text-sm font-medium text-white">{info.value}</p>
                    </a>
                  ) : (
                    <div>
                      <p className="text-xs text-slate-500">{info.label}</p>
                      <p className="text-sm font-medium text-white">{info.value}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-3">
                Find me on
              </h4>
              <div className="flex gap-3 justify-center lg:justify-start">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-teal-400 transition-all duration-300 hover:scale-110"
                    aria-label={link.name}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Fiverr CTA */}
            <motion.a
              href="https://www.fiverr.com/upam1721"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-medium text-sm hover:from-green-500 hover:to-green-400 transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:scale-105"
            >
              <ExternalLink className="w-4 h-4" />
              Hire Me on Fiverr
            </motion.a>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            id="contact-form"
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="glass-card rounded-2xl p-6 sm:p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2 contact-field-group">
                  <label className="text-sm font-medium text-slate-300 transition-colors duration-300" htmlFor="name">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    onFocus={(e) => {
                      e.currentTarget.parentElement?.querySelector('label')?.classList.add('text-teal-400');
                    }}
                    onBlur={(e) => {
                      e.currentTarget.parentElement?.querySelector('label')?.classList.remove('text-teal-400');
                    }}
                    className="contact-input bg-[#0a1628]/50 border-teal-500/10 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2 contact-field-group">
                  <label className="text-sm font-medium text-slate-300 transition-colors duration-300" htmlFor="email">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    onFocus={(e) => {
                      e.currentTarget.parentElement?.querySelector('label')?.classList.add('text-teal-400');
                    }}
                    onBlur={(e) => {
                      e.currentTarget.parentElement?.querySelector('label')?.classList.remove('text-teal-400');
                    }}
                    className="contact-input bg-[#0a1628]/50 border-teal-500/10 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2 contact-field-group">
                <label className="text-sm font-medium text-slate-300 transition-colors duration-300" htmlFor="subject">
                  Subject
                </label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="WordPress Website Project"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  onFocus={(e) => {
                    e.currentTarget.parentElement?.querySelector('label')?.classList.add('text-teal-400');
                  }}
                  onBlur={(e) => {
                    e.currentTarget.parentElement?.querySelector('label')?.classList.remove('text-teal-400');
                  }}
                  className="contact-input bg-[#0a1628]/50 border-teal-500/10 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2 contact-field-group">
                <label className="text-sm font-medium text-slate-300 transition-colors duration-300" htmlFor="message">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project..."
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  onFocus={(e) => {
                    e.currentTarget.parentElement?.querySelector('label')?.classList.add('text-teal-400');
                  }}
                  onBlur={(e) => {
                    e.currentTarget.parentElement?.querySelector('label')?.classList.remove('text-teal-400');
                  }}
                  className="contact-input bg-[#0a1628]/50 border-teal-500/10 text-white placeholder:text-slate-500 min-h-[120px]"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-medium py-6 rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all duration-300"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

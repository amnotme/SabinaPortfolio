import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Download, MapPin } from 'lucide-react';
import { EDITORIAL_EASE } from '../lib/motion';
import type { ContactInfo, PortfolioContent } from '../types/content';

interface HeroProps {
  meta: PortfolioContent['meta'];
  contact: ContactInfo;
}

export function Hero({ meta, contact }: HeroProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <section id="about" className="relative overflow-x-clip pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pt-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Editorial Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EDITORIAL_EASE }}
            className="lg:col-span-7"
          >
            {/* Availability Pill */}
            <div className="mb-8 inline-flex items-center gap-2.5 border border-border bg-surface px-3.5 py-1.5 shadow-[0_1px_2px_rgba(15,30,54,0.03)]">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/70 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              <span className="font-mono text-[11px] font-medium tracking-wide text-navy">
                {meta.availability}
              </span>
            </div>

            {/* Display Name */}
            <h1 className="font-serif text-5xl font-medium leading-[1.02] tracking-tight text-navy sm:text-6xl lg:text-[4.5rem]">
              {meta.firstName}{' '}
              <span className="italic font-normal text-navy/90">{meta.lastName}</span>
            </h1>

            {/* Headline & Location */}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-l-2 border-gold pl-4">
              <p className="text-sm font-semibold tracking-wide text-navy sm:text-[15px]">
                {meta.headline}
              </p>
              <span className="hidden text-border sm:inline" aria-hidden="true">
                /
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
                <MapPin className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                {meta.location}
              </span>
            </div>

            {/* Positioning Statement */}
            <p className="mt-7 max-w-xl text-base leading-relaxed text-charcoal sm:text-[17px]">
              {meta.heroSummary}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              {meta.editorialNote}
            </p>

            {/* Primary CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={contact.resumeUrl}
                download={contact.resumeFilename}
                className="group inline-flex items-center gap-2.5 border border-navy bg-navy px-6 py-3.5 text-xs font-semibold tracking-wider text-alabaster uppercase transition-all hover:bg-navy/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-alabaster"
              >
                <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                <span>Download CV</span>
              </a>

              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 border border-border bg-surface px-6 py-3.5 text-xs font-semibold tracking-wider text-navy uppercase transition-all hover:border-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-alabaster"
              >
                <span>Connect on LinkedIn</span>
                <ArrowUpRight
                  className="h-4 w-4 text-cobalt transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </motion.div>

          {/* Right Framed Portrait Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: EDITORIAL_EASE }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto max-w-[360px] lg:ml-auto lg:mr-0">
              {/* Architectural offset accent frame */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-3.5 -right-3.5 h-full w-full border border-gold/45"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-2.5 -top-2.5 h-8 w-8 border-l border-t border-navy/40"
              />

              {/* Portrait Frame */}
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-border bg-surface shadow-[0_20px_50px_-24px_rgba(15,30,54,0.22)]">
                {!imageFailed ? (
                  <img
                    src={meta.portraitUrl}
                    alt={meta.portraitAlt}
                    onError={() => setImageFailed(true)}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="relative flex h-full w-full flex-col justify-between bg-gradient-to-br from-navy via-[#132645] to-[#0B172A] p-7 text-alabaster">
                    {/* Subtle quantitative grid overlay */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-[0.07]"
                      style={{
                        backgroundImage:
                          'linear-gradient(to right, #F8F7F4 1px, transparent 1px), linear-gradient(to bottom, #F8F7F4 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                      }}
                    />

                    <div className="relative flex items-center justify-between border-b border-alabaster/15 pb-4">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-gold uppercase">
                        Profile Dossier
                      </span>
                      <span className="font-mono text-[10px] text-alabaster/60">
                        43.2389° N · 76.8897° E
                      </span>
                    </div>

                    <div className="relative my-auto flex flex-col items-center py-6 text-center">
                      <div className="flex h-28 w-28 items-center justify-center rounded-full border border-gold/45 bg-alabaster/[0.04]">
                        <span className="font-serif text-5xl font-medium tracking-tight text-alabaster">
                          {meta.monogram.replace('.', '')}
                          <span className="text-gold">.</span>
                        </span>
                      </div>
                      <p className="mt-6 font-serif text-2xl font-normal tracking-wide text-alabaster">
                        {meta.name}
                      </p>
                      <p className="mt-1.5 font-mono text-[11px] tracking-wider text-alabaster/65 uppercase">
                        Finance &amp; Big Data Analytics
                      </p>
                    </div>

                    <div className="relative flex items-center justify-between border-t border-alabaster/15 pt-4 font-mono text-[10px] text-alabaster/65">
                      <span>KIMEP University</span>
                      <span className="text-gold">GPA 3.90 / 4.33</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Minimal Caption Tag */}
              <div className="mt-5 flex items-center justify-between font-mono text-[11px] text-muted">
                <span>BSc Finance · Big Data Analytics</span>
                <span className="text-navy">Almaty, KZ</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

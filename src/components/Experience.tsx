import { motion } from 'framer-motion';
import { Briefcase, MapPin } from 'lucide-react';
import { EDITORIAL_EASE, fadeUpVariants, staggerContainerVariants, VIEWPORT_ONCE } from '../lib/motion';
import type { PortfolioContent } from '../types/content';

interface ExperienceProps {
  experience: PortfolioContent['experience'];
}

export function Experience({ experience }: ExperienceProps) {
  return (
    <section id="experience" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {/* Asymmetric Section Header */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="grid grid-cols-1 gap-6 border-b border-border pb-10 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-7">
            <p className="font-mono text-xs font-medium tracking-editorial text-gold uppercase">
              {experience.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-navy sm:text-4xl lg:text-[2.75rem]">
              {experience.title}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm leading-relaxed text-muted sm:text-[15px]">
              {experience.subtitle}
            </p>
          </div>
        </motion.div>

        {/* Featured Editorial Case Cards */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-10 space-y-6"
        >
          {experience.items.map((item) => (
            <motion.article
              key={item.id}
              variants={fadeUpVariants}
              whileHover={{ y: -3, transition: { duration: 0.25, ease: EDITORIAL_EASE } }}
              className="group relative border border-border bg-surface p-7 transition-shadow duration-300 hover:border-navy/25 hover:shadow-[0_18px_40px_-24px_rgba(15,30,54,0.18)] sm:p-9"
            >
              {/* Subtle top accent line on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-navy transition-transform duration-300 group-hover:scale-x-100"
              />

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Left Metadata Column */}
                <div className="flex flex-col justify-between border-b border-border/80 pb-6 lg:col-span-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-xs font-semibold tracking-widest text-gold">
                        CASE {item.index}
                      </span>
                      <span className="border border-border bg-alabaster px-2.5 py-1 font-mono text-[11px] font-medium text-navy">
                        {item.period}
                      </span>
                    </div>

                    <h3 className="mt-5 font-serif text-2xl font-semibold leading-snug text-navy">
                      {item.organization}
                    </h3>

                    <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs text-muted">
                      <MapPin className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                      {item.location}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 lg:border-t lg:border-border/70">
                    <p className="font-mono text-[10px] tracking-widest text-muted uppercase">
                      Domain Focus
                    </p>
                    <p className="mt-1 text-xs font-medium text-navy">{item.focus}</p>
                  </div>
                </div>

                {/* Right Role & Impact Column */}
                <div className="flex flex-col justify-between lg:col-span-8">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="h-4 w-4 text-cobalt" aria-hidden="true" />
                      <p className="text-base font-semibold tracking-tight text-navy sm:text-lg">
                        {item.role}
                      </p>
                    </div>

                    <ul className="mt-5 space-y-3.5">
                      {item.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-3.5 text-sm leading-relaxed text-charcoal sm:text-[15px]"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                          />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tag Pills */}
                  <div className="mt-7 flex flex-wrap gap-2 border-t border-border/70 pt-5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-border bg-alabaster px-3 py-1 font-mono text-[11px] font-medium text-navy transition-colors group-hover:border-cobalt/30 group-hover:bg-cobalt/[0.04]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

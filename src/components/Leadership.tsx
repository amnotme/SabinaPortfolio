import { motion } from 'framer-motion';
import { Globe, Landmark, Mic2, Sparkles, Users } from 'lucide-react';
import { EDITORIAL_EASE, fadeUpVariants, staggerContainerVariants, VIEWPORT_ONCE } from '../lib/motion';
import type { PortfolioContent } from '../types/content';

interface LeadershipProps {
  leadership: PortfolioContent['leadership'];
}

const BENTO_LAYOUT: Record<string, string> = {
  'kimep-finance-club': 'lg:col-span-7',
  unicef: 'lg:col-span-5',
  'tedx-kimep': 'lg:col-span-4',
  'buddies-kimep': 'lg:col-span-4',
  'lyceum-debate': 'lg:col-span-4',
};

function renderIcon(id: string, isDark: boolean) {
  const cls = `h-4 w-4 ${isDark ? 'text-gold' : 'text-cobalt'}`;
  switch (id) {
    case 'kimep-finance-club':
      return <Landmark className={cls} aria-hidden="true" />;
    case 'unicef':
      return <Globe className={cls} aria-hidden="true" />;
    case 'tedx-kimep':
      return <Sparkles className={cls} aria-hidden="true" />;
    case 'buddies-kimep':
      return <Users className={cls} aria-hidden="true" />;
    default:
      return <Mic2 className={cls} aria-hidden="true" />;
  }
}

export function Leadership({ leadership }: LeadershipProps) {
  return (
    <section id="leadership" className="border-t border-border bg-surface/65 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {/* Section Header */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="grid grid-cols-1 gap-6 border-b border-border pb-10 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-7">
            <p className="font-mono text-xs font-medium tracking-editorial text-gold uppercase">
              {leadership.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-navy sm:text-4xl lg:text-[2.75rem]">
              {leadership.title}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm leading-relaxed text-muted sm:text-[15px]">
              {leadership.subtitle}
            </p>
          </div>
        </motion.div>

        {/* Asymmetric 12-Column Bento Grid */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12"
        >
          {leadership.items.map((item, idx) => {
            const isHeroBento = idx === 0;
            const spanClass = BENTO_LAYOUT[item.id] ?? 'lg:col-span-4';

            return (
              <motion.article
                key={item.id}
                variants={fadeUpVariants}
                whileHover={{ y: -3, transition: { duration: 0.25, ease: EDITORIAL_EASE } }}
                className={`group flex flex-col justify-between border p-7 transition-all duration-300 ${spanClass} ${
                  isHeroBento
                    ? 'border-navy bg-navy text-alabaster shadow-[0_20px_40px_-24px_rgba(15,30,54,0.45)]'
                    : 'border-border bg-surface text-navy hover:border-navy/25 hover:shadow-[0_14px_32px_-20px_rgba(15,30,54,0.16)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-2 font-mono text-[11px] font-medium tracking-wider uppercase ${
                        isHeroBento ? 'text-gold' : 'text-muted'
                      }`}
                    >
                      {renderIcon(item.id, isHeroBento)}
                      {item.category}
                    </span>
                    <span
                      className={`font-mono text-[11px] ${
                        isHeroBento
                          ? 'border border-alabaster/20 bg-alabaster/10 px-2.5 py-0.5 text-alabaster/90'
                          : 'border border-border bg-alabaster px-2.5 py-0.5 text-navy'
                      }`}
                    >
                      {item.period}
                    </span>
                  </div>

                  <h3
                    className={`mt-5 font-serif text-2xl font-semibold leading-snug ${
                      isHeroBento ? 'text-alabaster sm:text-[1.75rem]' : 'text-navy'
                    }`}
                  >
                    {item.organization}
                  </h3>

                  <p
                    className={`mt-3 text-sm leading-relaxed ${
                      isHeroBento ? 'max-w-xl text-alabaster/80 sm:text-[15px]' : 'text-charcoal'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>

                <div
                  className={`mt-6 flex items-center justify-between border-t pt-4 font-mono text-[11px] ${
                    isHeroBento
                      ? 'border-alabaster/15 text-alabaster/70'
                      : 'border-border/80 text-muted'
                  }`}
                >
                  <span>{item.role}</span>
                  <span className={isHeroBento ? 'text-gold' : 'text-navy/60'}>
                    0{idx + 1}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

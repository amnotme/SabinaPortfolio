import { motion } from 'framer-motion';
import { fadeUpVariants, staggerContainerVariants, VIEWPORT_ONCE } from '../lib/motion';
import type { MetricItem } from '../types/content';

interface MetricsBarProps {
  metrics: MetricItem[];
}

export function MetricsBar({ metrics }: MetricsBarProps) {
  return (
    <section aria-label="Key academic and research highlights" className="border-y border-border bg-surface">
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x"
      >
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.id}
            variants={fadeUpVariants}
            className={`group relative px-6 py-7 transition-colors hover:bg-alabaster/70 sm:px-8 sm:py-8 ${
              idx >= 2 ? 'sm:border-t sm:border-border lg:border-t-0' : ''
            } ${idx % 2 === 1 ? 'sm:border-l sm:border-border lg:border-l' : ''}`}
          >
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-semibold tracking-tight text-navy sm:text-[1.75rem]">
                {metric.value}
              </span>
              {metric.unit && (
                <span className="font-mono text-xs font-medium text-gold">
                  {metric.unit}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs font-semibold tracking-wider text-navy uppercase">
              {metric.label}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {metric.sublabel}
            </p>
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-[2px] w-0 bg-gold transition-all duration-300 group-hover:w-full"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

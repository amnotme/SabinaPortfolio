import { motion } from 'framer-motion';
import { Award, BookOpen, GraduationCap, Languages, Wrench } from 'lucide-react';
import { EDITORIAL_EASE, fadeUpVariants, staggerContainerVariants, VIEWPORT_ONCE } from '../lib/motion';
import type { PortfolioContent } from '../types/content';

interface CredentialsProps {
  education: PortfolioContent['education'];
  skills: PortfolioContent['skills'];
}

export function Credentials({ education, skills }: CredentialsProps) {
  return (
    <section id="education" className="border-t border-border py-20 sm:py-28">
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
              {education.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-navy sm:text-4xl lg:text-[2.75rem]">
              {education.title}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm leading-relaxed text-muted sm:text-[15px]">
              {education.subtitle}
            </p>
          </div>
        </motion.div>

        {/* Split Layout: Left Education + IELTS, Right Skills & Languages */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column (7/12): Education + IELTS Breakdown */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="space-y-6 lg:col-span-7"
          >
            {education.items.map((edu) => (
              <motion.article
                key={edu.id}
                variants={fadeUpVariants}
                className="border border-border bg-surface p-7 sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="h-4 w-4 text-gold" aria-hidden="true" />
                    <span className="font-mono text-xs font-medium text-muted">
                      {edu.period}
                    </span>
                  </div>
                  {edu.gpa && (
                    <span className="border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-xs font-semibold text-navy">
                      GPA {edu.gpa}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-serif text-2xl font-semibold text-navy">
                  {edu.institution}
                </h3>

                <p className="mt-1 text-sm font-semibold text-navy/90 sm:text-[15px]">
                  {edu.degree}
                  {edu.minor && (
                    <span className="font-normal text-charcoal"> · {edu.minor}</span>
                  )}
                </p>

                <ul className="mt-4 space-y-2.5 border-t border-border/70 pt-4">
                  {edu.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-3 text-sm leading-relaxed text-charcoal"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1 w-3 shrink-0 bg-gold/80"
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}

            {/* IELTS Academic Score Breakdown Card */}
            <motion.div
              variants={fadeUpVariants}
              className="border border-border bg-surface p-7 sm:p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-cobalt" aria-hidden="true" />
                    <span className="font-mono text-[11px] font-medium tracking-wider text-muted uppercase">
                      English Language Credential · {education.ielts.testDate}
                    </span>
                  </div>
                  <h3 className="mt-2 font-serif text-2xl font-semibold text-navy">
                    IELTS Academic Breakdown
                  </h3>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1.5">
                    <span className="font-mono text-3xl font-semibold text-navy">
                      {education.ielts.overall.toFixed(1)}
                    </span>
                    <span className="font-mono text-xs text-muted">
                      / {education.ielts.maxScore.toFixed(1)}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-medium text-gold uppercase">
                    {education.ielts.cefrLevel}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {education.ielts.scores.map((band, index) => {
                  const percent = Math.round((band.score / band.maxScore) * 100);
                  return (
                    <div key={band.skill} className="space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-semibold tracking-wide text-navy uppercase">
                          {band.skill}
                        </span>
                        <span className="font-mono text-xs font-semibold text-navy">
                          {band.score.toFixed(1)}
                          <span className="font-normal text-muted"> / {band.maxScore.toFixed(1)}</span>
                        </span>
                      </div>
                      <div
                        className="h-2 w-full overflow-hidden bg-alabaster ring-1 ring-inset ring-border"
                        role="progressbar"
                        aria-label={`IELTS ${band.skill} score`}
                        aria-valuenow={band.score}
                        aria-valuemin={0}
                        aria-valuemax={band.maxScore}
                      >
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={VIEWPORT_ONCE}
                          transition={{
                            duration: 0.75,
                            delay: 0.1 + index * 0.08,
                            ease: EDITORIAL_EASE,
                          }}
                          style={{ width: `${percent}%`, transformOrigin: 'left center' }}
                          className={`h-full ${
                            band.score >= 8.0 ? 'bg-gold' : 'bg-navy'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column (5/12): Technical Skills, Core Competencies, Languages */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="space-y-6 lg:col-span-5"
          >
            {/* Technical Skills */}
            <motion.div
              variants={fadeUpVariants}
              className="border border-border bg-surface p-7"
            >
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <Wrench className="h-4 w-4 text-cobalt" aria-hidden="true" />
                <h3 className="font-mono text-xs font-semibold tracking-editorial text-navy uppercase">
                  Technical Toolkit
                </h3>
              </div>

              <ul className="mt-5 space-y-3">
                {skills.technical.map((tool) => (
                  <li
                    key={tool}
                    className="flex items-center justify-between border border-border/80 bg-alabaster/70 px-4 py-3 text-sm font-medium text-navy"
                  >
                    <span>{tool}</span>
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-gold"
                    />
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Core Competencies */}
            <motion.div
              variants={fadeUpVariants}
              className="border border-border bg-surface p-7"
            >
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <BookOpen className="h-4 w-4 text-cobalt" aria-hidden="true" />
                <h3 className="font-mono text-xs font-semibold tracking-editorial text-navy uppercase">
                  Core Competencies
                </h3>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {skills.competencies.map((competency) => (
                  <span
                    key={competency}
                    className="border border-border bg-alabaster px-3.5 py-2 text-xs font-medium text-navy transition-colors hover:border-navy"
                  >
                    {competency}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Languages */}
            <motion.div
              variants={fadeUpVariants}
              className="border border-border bg-surface p-7"
            >
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
                <Languages className="h-4 w-4 text-cobalt" aria-hidden="true" />
                <h3 className="font-mono text-xs font-semibold tracking-editorial text-navy uppercase">
                  Languages
                </h3>
              </div>

              <div className="mt-5 space-y-5">
                {skills.languages.map((lang) => (
                  <div key={lang.name} className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-serif text-xl font-semibold text-navy">
                        {lang.name}
                      </span>
                      <span className="font-mono text-xs font-semibold text-gold">
                        {lang.proficiency}
                      </span>
                    </div>
                    <p className="text-xs text-muted">{lang.detail}</p>
                    <div className="h-1.5 w-full overflow-hidden bg-alabaster ring-1 ring-inset ring-border">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={VIEWPORT_ONCE}
                        transition={{ duration: 0.7, ease: EDITORIAL_EASE }}
                        style={{ width: `${lang.levelPercent}%`, transformOrigin: 'left center' }}
                        className="h-full bg-navy"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

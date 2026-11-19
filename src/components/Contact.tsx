import { type FormEvent, useEffect, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Mail,
  Phone,
  Send,
} from 'lucide-react';
import { fadeUpVariants, VIEWPORT_ONCE } from '../lib/motion';
import type { PortfolioContent } from '../types/content';

interface ContactProps {
  contact: PortfolioContent['contact'];
}

function legacyCopy(text: string): boolean {
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.cssText = 'position:fixed;inset-block-start:0;opacity:0';
  document.body.append(field);
  field.select();
  try {
    return document.execCommand('copy');
  } finally {
    field.remove();
  }
}

export function Contact({ contact }: ContactProps) {
  const emailValueId = useId();
  const nameId = useId();
  const nameErrorId = useId();
  const emailInputId = useId();
  const emailHintId = useId();
  const emailErrorId = useId();
  const orgId = useId();
  const messageId = useId();
  const messageErrorId = useId();

  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const copyTipRef = useRef<HTMLSpanElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [copiedVisual, setCopiedVisual] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Copy button with Invoker Commands (command + commandfor) and single-path fallback
  useEffect(() => {
    const buttonEl = copyButtonRef.current;
    const tipEl = copyTipRef.current;
    if (!buttonEl || !tipEl) return;

    let timer: number | undefined;
    let lastMessage = '';

    const report = (ok: boolean) => {
      window.clearTimeout(timer);
      buttonEl.removeAttribute('data-copied');
      buttonEl.removeAttribute('data-failed');

      let message = ok ? 'Copied' : 'Copy failed';
      if (message === lastMessage) {
        message += '\u00A0';
      }
      lastMessage = message;

      tipEl.textContent = '';
      void buttonEl.offsetWidth;
      buttonEl.setAttribute(ok ? 'data-copied' : 'data-failed', '');
      setCopiedVisual(ok);

      requestAnimationFrame(() => {
        tipEl.textContent = message;
      });

      timer = window.setTimeout(() => {
        buttonEl.removeAttribute('data-copied');
        buttonEl.removeAttribute('data-failed');
        tipEl.textContent = '';
        setCopiedVisual(false);
      }, 2200);
    };

    const performCopy = async (target: HTMLElement) => {
      const text = target.innerText.trim();
      if (!text) return;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else if (!legacyCopy(text)) {
          throw new Error('Copy failed');
        }
        report(true);
      } catch {
        if (legacyCopy(text)) {
          report(true);
        } else {
          report(false);
        }
      }
    };

    if ('CommandEvent' in window) {
      const onCommand = (event: Event) => {
        const cmdEvent = event as Event & {
          command?: string;
          source?: EventTarget | null;
        };
        if (
          cmdEvent.command === '--copy' &&
          cmdEvent.source === buttonEl &&
          cmdEvent.target instanceof HTMLElement
        ) {
          void performCopy(cmdEvent.target);
        }
      };
      document.addEventListener('command', onCommand, true);
      return () => {
        window.clearTimeout(timer);
        document.removeEventListener('command', onCommand, true);
      };
    }

    const onFallbackClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const clicked = event.target.closest('button[command^="--copy"]');
      if (clicked !== buttonEl) return;
      const targetId = buttonEl.getAttribute('commandfor');
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        void performCopy(target);
      }
    };
    document.addEventListener('click', onFallbackClick);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('click', onFallbackClick);
    };
  }, []);

  // Sync aria-invalid, dynamic aria-describedby, and polite announcer with :user-invalid
  // (+ WeakMap fallback for browsers without :user-invalid support)
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const supportsUserInvalid = CSS.supports('selector(:user-invalid)');
    const dirtyState = new WeakMap<
      HTMLInputElement | HTMLTextAreaElement,
      { hasInteracted: boolean; hasBlurred: boolean }
    >();
    const flagged = new WeakSet<Element>();
    const announced = new WeakSet<Element>();

    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.className = 'visually-hidden';
    document.body.append(announcer);

    let announceTimer: number | undefined;
    let announcedField: Element | undefined;

    const isFormControl = (
      el: EventTarget | null
    ): el is HTMLInputElement | HTMLTextAreaElement =>
      el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;

    const linkError = (el: HTMLInputElement | HTMLTextAreaElement, shown: boolean) => {
      const errorId = el.dataset.error;
      if (!errorId) return;
      const ids = (el.getAttribute('aria-describedby') || '')
        .split(/\s+/)
        .filter((id) => id && id !== errorId);
      if (shown) ids.push(errorId);
      if (ids.length) {
        el.setAttribute('aria-describedby', ids.join(' '));
      } else {
        el.removeAttribute('aria-describedby');
      }
    };

    const spokenText = (node: Element): string => {
      const clone = node.cloneNode(true) as Element;
      clone.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
      clone.querySelectorAll('[role="img"][aria-label]').forEach((n) => {
        n.replaceWith(`${n.getAttribute('aria-label')}: `);
      });
      return (clone.textContent || '').replace(/\s+/g, ' ').trim();
    };

    const announceError = (el: HTMLInputElement | HTMLTextAreaElement) => {
      const errorId = el.dataset.error;
      if (!errorId) return;
      const errorNode = document.getElementById(errorId);
      if (!errorNode) return;
      const labelNode = el.labels?.[0];
      const labelPrefix = labelNode ? `${spokenText(labelNode)}: ` : '';
      window.clearTimeout(announceTimer);
      announcer.textContent = '';
      announcedField = el;
      announceTimer = window.setTimeout(() => {
        announcer.textContent = labelPrefix + spokenText(errorNode);
      }, 500);
    };

    const syncControl = (
      el: HTMLInputElement | HTMLTextAreaElement,
      announce = false,
      forceInvalidCheck = false
    ) => {
      let invalid = false;
      if (supportsUserInvalid) {
        invalid = el.matches(':user-invalid');
      } else if (forceInvalidCheck) {
        invalid = !el.validity.valid;
        el.classList.toggle('user-invalid-fallback', invalid);
        el.classList.toggle('user-valid-fallback', !invalid);
      } else {
        invalid = el.classList.contains('user-invalid-fallback');
      }

      if (invalid) {
        if (announce && !announced.has(el)) {
          announceError(el);
          announced.add(el);
        }
        el.setAttribute('aria-invalid', 'true');
        linkError(el, true);
        flagged.add(el);
      } else if (flagged.has(el) || el.getAttribute('aria-invalid') !== 'true') {
        el.setAttribute('aria-invalid', 'false');
        linkError(el, false);
        flagged.delete(el);
        announced.delete(el);
        if (announcedField === el) {
          window.clearTimeout(announceTimer);
          announcer.textContent = '';
        }
      }
    };

    form.querySelectorAll('input, textarea').forEach((node) => {
      if (isFormControl(node) && node.type !== 'hidden') {
        node.setAttribute('aria-invalid', 'false');
      }
    });

    const onBlur = (event: FocusEvent) => {
      if (!isFormControl(event.target) || event.target.type === 'hidden') return;
      if (!supportsUserInvalid) {
        const state = dirtyState.get(event.target) ?? {
          hasInteracted: false,
          hasBlurred: false,
        };
        state.hasBlurred = true;
        dirtyState.set(event.target, state);
        if (state.hasInteracted) {
          syncControl(event.target, true, true);
        }
        return;
      }
      syncControl(event.target, true);
    };

    const onInput = (event: Event) => {
      if (!isFormControl(event.target) || event.target.type === 'hidden') return;
      if (!supportsUserInvalid) {
        const state = dirtyState.get(event.target) ?? {
          hasInteracted: false,
          hasBlurred: false,
        };
        state.hasInteracted = true;
        dirtyState.set(event.target, state);
        if (state.hasBlurred) {
          syncControl(event.target, false, true);
        }
        return;
      }
      if (event.target.hasAttribute('aria-invalid')) {
        syncControl(event.target, false);
      }
    };

    const onInvalid = (event: Event) => {
      if (!isFormControl(event.target) || event.target.type === 'hidden') return;
      announced.add(event.target);
      if (!supportsUserInvalid) {
        dirtyState.set(event.target, { hasInteracted: true, hasBlurred: true });
        syncControl(event.target, false, true);
        return;
      }
      syncControl(event.target, false);
    };

    const onReset = () => {
      window.setTimeout(() => {
        form.querySelectorAll('input, textarea').forEach((node) => {
          if (isFormControl(node) && node.type !== 'hidden') {
            dirtyState.delete(node);
            node.classList.remove('user-invalid-fallback', 'user-valid-fallback');
            syncControl(node, false);
          }
        });
      });
    };

    form.addEventListener('blur', onBlur, true);
    form.addEventListener('input', onInput);
    form.addEventListener('invalid', onInvalid, true);
    form.addEventListener('reset', onReset, true);

    return () => {
      window.clearTimeout(announceTimer);
      announcer.remove();
      form.removeEventListener('blur', onBlur, true);
      form.removeEventListener('input', onInput);
      form.removeEventListener('invalid', onInvalid, true);
      form.removeEventListener('reset', onReset, true);
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    setSubmitting(true);
    setSubmitError(null);

    const formData = new FormData(form);
    const encoded = new URLSearchParams();
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        encoded.append(key, value);
      }
    });

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encoded.toString(),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setSubmitted(true);
      form.reset();
    } catch {
      setSubmitError(
        `Unable to submit online right now. Please email directly at ${contact.info.email}.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="border-t border-border bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Recruiter CTA & Direct Channels */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="flex flex-col justify-between lg:col-span-5"
          >
            <div>
              <p className="font-mono text-xs font-medium tracking-editorial text-gold uppercase">
                {contact.eyebrow}
              </p>
              <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-navy sm:text-4xl">
                {contact.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-charcoal sm:text-[15px]">
                {contact.subtitle}
              </p>
              <p className="mt-3 font-mono text-xs text-muted">
                {contact.availabilityNote}
              </p>

              {/* Direct Contact Stack */}
              <div className="mt-8 space-y-4 border-t border-border pt-7">
                {/* Email Row with One-Click Copy Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-alabaster/80 p-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] tracking-widest text-muted uppercase">
                      Direct Email
                    </p>
                    <a
                      href={`mailto:${contact.info.email}`}
                      className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-navy transition-colors hover:text-cobalt"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0 text-gold" aria-hidden="true" />
                      <span id={emailValueId} className="truncate font-mono text-xs sm:text-[13px]">
                        {contact.info.email}
                      </span>
                    </a>
                  </div>

                  {/* Copy button + external status live-region bubble */}
                  <span className="copy-control shrink-0">
                    <button
                      ref={copyButtonRef}
                      type="button"
                      className="copy-button inline-flex min-h-9 min-w-9 items-center gap-1.5 border border-navy bg-navy px-3 py-1.5 font-mono text-[11px] font-medium text-alabaster transition-colors hover:bg-navy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-alabaster"
                      {...({
                        command: '--copy',
                        commandfor: emailValueId,
                      } as Record<string, string>)}
                    >
                      {copiedVisual ? (
                        <Check className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>{copiedVisual ? 'Copied' : 'Copy Email'}</span>
                    </button>
                    <span ref={copyTipRef} className="copy-tip" role="status" />
                  </span>
                </div>

                {/* Phone & LinkedIn Row */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a
                    href={contact.info.phoneHref}
                    className="group flex flex-col justify-between border border-border bg-alabaster/60 p-4 transition-colors hover:border-navy"
                  >
                    <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
                      Phone
                    </span>
                    <span className="mt-2 inline-flex items-center gap-2 font-mono text-xs font-medium text-navy">
                      <Phone className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                      {contact.info.phone}
                    </span>
                  </a>

                  <a
                    href={contact.info.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col justify-between border border-border bg-alabaster/60 p-4 transition-colors hover:border-navy"
                  >
                    <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
                      LinkedIn
                    </span>
                    <span className="mt-2 inline-flex items-center justify-between gap-2 font-mono text-xs font-medium text-navy">
                      <span className="truncate">{contact.info.linkedinHandle}</span>
                      <ArrowUpRight
                        className="h-3.5 w-3.5 shrink-0 text-cobalt transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <a
                href={contact.info.resumeUrl}
                download={contact.info.resumeFilename}
                className="inline-flex items-center gap-2 font-mono text-xs font-medium text-navy underline decoration-gold/70 underline-offset-4 transition-colors hover:text-cobalt"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Download Full Resume ({contact.info.resumeFilename})</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Netlify-Compatible Contact Form */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-7"
          >
            <div className="border border-border bg-alabaster p-7 sm:p-9">
              <div className="flex items-baseline justify-between border-b border-border pb-4">
                <h3 className="font-serif text-2xl font-semibold text-navy">
                  Send a Direct Message
                </h3>
                <span className="font-mono text-[11px] text-muted">
                  Recruiter Inquiry
                </span>
              </div>

              {submitted ? (
                <div
                  role="status"
                  className="mt-6 border border-navy/20 bg-surface p-6 text-navy"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                    <div>
                      <p className="font-serif text-xl font-semibold">
                        Thank you for reaching out.
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-charcoal">
                        Your message has been received. Sabina will respond promptly via email.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="mt-4 font-mono text-xs font-medium text-cobalt underline underline-offset-4 hover:text-navy"
                      >
                        Send another inquiry
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form
                  ref={formRef}
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  onSubmit={handleSubmit}
                  className="mt-6 space-y-5"
                >
                  <input type="hidden" name="form-name" value="contact" />
                  <p className="hidden">
                    <label>
                      Do not fill this out if you are human: <input name="bot-field" />
                    </label>
                  </p>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Name Field */}
                    <div>
                      <label
                        htmlFor={nameId}
                        className="block font-mono text-[11px] font-medium tracking-wider text-navy uppercase"
                      >
                        Full Name <span className="text-gold">*</span>
                      </label>
                      <input
                        id={nameId}
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Elena Petrova"
                        data-error={nameErrorId}
                        className="form-field-input mt-2 w-full border border-border bg-surface px-3.5 py-2.5 text-sm text-navy placeholder:text-muted/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                      />
                      <div
                        id={nameErrorId}
                        className="form-field-error mt-1.5 items-center gap-1.5 text-xs text-red-700"
                      >
                        <span role="img" aria-label="Error" className="font-mono font-bold">
                          !
                        </span>
                        <span>Please enter your name.</span>
                      </div>
                    </div>

                    {/* Email Field with format hint ABOVE input */}
                    <div>
                      <label
                        htmlFor={emailInputId}
                        className="block font-mono text-[11px] font-medium tracking-wider text-navy uppercase"
                      >
                        Work Email <span className="text-gold">*</span>
                      </label>
                      <span
                        id={emailHintId}
                        className="mt-1 block font-mono text-[11px] text-muted"
                      >
                        Format: name@company.com
                      </span>
                      <input
                        id={emailInputId}
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="recruiter@company.com"
                        aria-describedby={emailHintId}
                        data-error={emailErrorId}
                        className="form-field-input mt-1 w-full border border-border bg-surface px-3.5 py-2.5 text-sm text-navy placeholder:text-muted/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                      />
                      <div
                        id={emailErrorId}
                        className="form-field-error mt-1.5 items-center gap-1.5 text-xs text-red-700"
                      >
                        <span role="img" aria-label="Error" className="font-mono font-bold">
                          !
                        </span>
                        <span>Enter an email address in the format name@company.com.</span>
                      </div>
                    </div>
                  </div>

                  {/* Organization Field */}
                  <div>
                    <label
                      htmlFor={orgId}
                      className="block font-mono text-[11px] font-medium tracking-wider text-navy uppercase"
                    >
                      Company / Organization
                    </label>
                    <input
                      id={orgId}
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      placeholder="Financial Institution, FinTech, or Consulting Firm"
                      className="form-field-input mt-2 w-full border border-border bg-surface px-3.5 py-2.5 text-sm text-navy placeholder:text-muted/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor={messageId}
                      className="block font-mono text-[11px] font-medium tracking-wider text-navy uppercase"
                    >
                      Message <span className="text-gold">*</span>
                    </label>
                    <textarea
                      id={messageId}
                      name="message"
                      rows={4}
                      required
                      placeholder="Share details regarding internship opportunities, research projects, or interview scheduling..."
                      data-error={messageErrorId}
                      className="form-field-input mt-2 w-full resize-y border border-border bg-surface px-3.5 py-2.5 text-sm text-navy placeholder:text-muted/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    />
                    <div
                      id={messageErrorId}
                      className="form-field-error mt-1.5 items-center gap-1.5 text-xs text-red-700"
                    >
                      <span role="img" aria-label="Error" className="font-mono font-bold">
                        !
                      </span>
                      <span>Please include a brief message before sending.</span>
                    </div>
                  </div>

                  {submitError && (
                    <p role="alert" className="border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-800">
                      {submitError}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <p className="font-mono text-[11px] text-muted">
                      Powered by Netlify Forms
                    </p>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2.5 border border-navy bg-navy px-6 py-3 text-xs font-semibold tracking-wider text-alabaster uppercase transition-all hover:bg-navy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-alabaster disabled:opacity-60"
                    >
                      <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                      <Send className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

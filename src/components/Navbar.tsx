import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, Download, Menu, X } from 'lucide-react';
import type { ContactInfo, NavItem } from '../types/content';

interface NavbarProps {
  monogram: string;
  name: string;
  navigation: NavItem[];
  contact: ContactInfo;
}

export function Navbar({ monogram, name, navigation, contact }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerId = useId();
  const drawerRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openDrawer = useCallback(async () => {
    const drawer = drawerRef.current;
    const scroller = scrollerRef.current;
    if (!drawer || !scroller || drawer.open) return;

    drawer.showModal();

    if (!CSS.supports('scroll-initial-target', 'nearest')) {
      scroller.scrollTo({ left: scroller.offsetWidth, behavior: 'instant' });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
    }

    scroller.scrollTo({ left: 0, behavior: 'auto' });
  }, []);

  const closeDrawer = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ left: scroller.offsetWidth, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const drawer = drawerRef.current;
    const scroller = scrollerRef.current;
    const sheet = sheetRef.current;
    if (!drawer || !scroller || !sheet) return;

    const visibleThreshold = Math.min(1, 1 / Math.max(window.innerWidth, 1));

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        if (entry.intersectionRatio < visibleThreshold) {
          if (drawer.open) {
            drawer.close();
          }
          setDrawerOpen(false);
        } else if (entry.intersectionRatio === 1) {
          setDrawerOpen(true);
        }
      },
      { root: drawer, threshold: [visibleThreshold, 1] }
    );

    observer.observe(sheet);

    const handleCancel = (event: Event) => {
      if (event.cancelable) {
        event.preventDefault();
        closeDrawer();
      }
    };

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !sheet.contains(event.target)) {
        closeDrawer();
      }
    };

    const handleNativeClose = () => {
      setDrawerOpen(false);
    };

    drawer.addEventListener('cancel', handleCancel);
    drawer.addEventListener('click', handleBackdropClick);
    drawer.addEventListener('close', handleNativeClose);

    // Scroll-driven backdrop fallback when animation-timeline: scroll() is unsupported
    let removeScrollFallback: (() => void) | undefined;
    if (!CSS.supports('animation-timeline: scroll()')) {
      const onScrollerScroll = () => {
        const width = sheet.offsetWidth || 1;
        const ratio = Math.max(0, Math.min(1, 1 - scroller.scrollLeft / width));
        drawer.style.setProperty('--drawer-backdrop', String(ratio));
      };
      scroller.addEventListener('scroll', onScrollerScroll, { passive: true });
      removeScrollFallback = () => scroller.removeEventListener('scroll', onScrollerScroll);
    }

    return () => {
      observer.disconnect();
      drawer.removeEventListener('cancel', handleCancel);
      drawer.removeEventListener('click', handleBackdropClick);
      drawer.removeEventListener('close', handleNativeClose);
      removeScrollFallback?.();
    };
  }, [closeDrawer]);

  const handleMobileLinkClick = (href: string) => {
    closeDrawer();
    const targetId = href.replace(/^#/, '');
    const target = document.getElementById(targetId);
    if (target) {
      window.setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
      }, 220);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-alabaster/92 backdrop-blur-md border-b border-border shadow-[0_1px_0_rgba(15,30,54,0.03)]'
            : 'bg-alabaster/75 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
          <a
            href="#top"
            aria-label={`${name} — Back to top`}
            className="group inline-flex items-baseline gap-1 font-serif text-2xl font-semibold tracking-tight text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-alabaster"
          >
            <span>{monogram.replace('.', '')}</span>
            <span className="text-gold transition-transform duration-200 group-hover:scale-125">.</span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative py-1 text-[13px] font-medium tracking-wide text-charcoal transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-alabaster after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-gold after:transition-all after:duration-200 hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={contact.resumeUrl}
              download={contact.resumeFilename}
              className="hidden items-center gap-2 border border-navy bg-navy px-4 py-2 text-xs font-medium tracking-wider text-alabaster uppercase transition-all hover:bg-transparent hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-alabaster sm:inline-flex"
            >
              <span>Resume</span>
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={openDrawer}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              aria-controls={drawerId}
              className="inline-flex min-h-10 min-w-10 items-center justify-center border border-border bg-surface text-navy transition-colors hover:border-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt md:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Top-layer modal navigation drawer with scroll-snap swipe dismissal */}
      <dialog
        ref={drawerRef}
        id={drawerId}
        className="Drawer"
        aria-label="Mobile navigation"
      >
        <div ref={scrollerRef} className="Drawer-scroller">
          <nav ref={sheetRef} className="Drawer-sheet" aria-label="Mobile navigation links">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <span className="font-serif text-2xl font-semibold tracking-tight text-navy">
                {monogram.replace('.', '')}
                <span className="text-gold">.</span>
              </span>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close navigation menu"
                autoFocus
                className="inline-flex min-h-10 min-w-10 items-center justify-center border border-border bg-surface text-navy transition-colors hover:border-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col justify-between px-6 py-8">
              <ul className="space-y-1">
                {navigation.map((item, idx) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(event) => {
                        event.preventDefault();
                        handleMobileLinkClick(item.href);
                      }}
                      className="flex items-baseline justify-between border-b border-border/70 py-4 font-serif text-2xl font-medium text-navy transition-colors hover:text-cobalt"
                    >
                      <span>{item.label}</span>
                      <span className="font-mono text-xs text-muted">
                        0{idx + 1}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 border-t border-border bg-surface px-6 py-6">
              <a
                href={contact.resumeUrl}
                download={contact.resumeFilename}
                className="flex w-full items-center justify-center gap-2 border border-navy bg-navy px-4 py-3 text-xs font-medium tracking-wider text-alabaster uppercase transition-colors hover:bg-navy/90"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Download Resume</span>
              </a>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 border border-border bg-alabaster px-4 py-3 text-xs font-medium tracking-wider text-navy uppercase transition-colors hover:border-navy"
              >
                <span>LinkedIn Profile</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <p className="pt-1 font-mono text-[11px] text-muted">{contact.location}</p>
            </div>
          </nav>
        </div>
      </dialog>
    </>
  );
}

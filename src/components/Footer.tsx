import { ArrowUp } from 'lucide-react';
import type { NavItem } from '../types/content';

interface FooterProps {
  monogram: string;
  note: string;
  location: string;
  navigation: NavItem[];
}

export function Footer({ monogram, note, location, navigation }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-alabaster">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-semibold text-navy">
              {monogram.replace('.', '')}
              <span className="text-gold">.</span>
            </span>
            <span className="text-border" aria-hidden="true">
              |
            </span>
            <span className="font-mono text-xs text-muted">{location}</span>
          </div>
          <p className="text-xs text-muted">
            © {year} {note}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-xs text-charcoal transition-colors hover:text-navy"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#top"
            aria-label="Back to top"
            className="inline-flex min-h-9 min-w-9 items-center justify-center border border-border bg-surface text-navy transition-colors hover:border-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
          >
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

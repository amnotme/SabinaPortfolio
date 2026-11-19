import rawContent from './data/content.json';
import type { PortfolioContent } from './types/content';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MetricsBar } from './components/MetricsBar';
import { Experience } from './components/Experience';
import { Leadership } from './components/Leadership';
import { Credentials } from './components/Credentials';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

const content: PortfolioContent = rawContent as PortfolioContent;

export function App() {
  return (
    <div id="top" className="min-h-screen bg-alabaster text-charcoal">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-navy focus:bg-surface focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-navy"
      >
        Skip to main content
      </a>

      <Navbar
        monogram={content.meta.monogram}
        name={content.meta.name}
        navigation={content.navigation}
        contact={content.contact.info}
      />

      <main id="main-content">
        <Hero meta={content.meta} contact={content.contact.info} />
        <MetricsBar metrics={content.metrics} />
        <Experience experience={content.experience} />
        <Leadership leadership={content.leadership} />
        <Credentials education={content.education} skills={content.skills} />
        <Contact contact={content.contact} />
      </main>

      <Footer
        monogram={content.meta.monogram}
        note={content.footer.note}
        location={content.meta.location}
        navigation={content.navigation}
      />
    </div>
  );
}

export default App;

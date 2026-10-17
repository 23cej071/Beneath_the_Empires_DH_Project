import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';

const CURRENT_YEAR = 2026;

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile nav on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinkClass = ({ isActive }) =>
    `min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3.5 py-2 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-dye focus:ring-offset-2 focus:ring-offset-parchment ${
      isActive
        ? 'bg-ink text-parchment font-semibold shadow-sm'
        : 'text-ink/80 hover:text-indigo-dye hover:bg-ash/10'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `w-full min-h-[48px] flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-dye focus:ring-offset-2 ${
      isActive
        ? 'bg-ink text-parchment font-semibold shadow-sm'
        : 'text-ink hover:bg-ash/15'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-parchment text-ink font-sans selection:bg-turmeric selection:text-ink">
      {/* Skip-to-content accessible link (WCAG 2.2 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-indigo-dye focus:text-parchment focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-turmeric focus:ring-offset-2 rounded font-semibold text-sm"
      >
        Skip to main content
      </a>

      {/* Header Landmark */}
      <header className="border-b border-ash/30 bg-parchment/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Logo & Subtitle */}
          <Link
            to="/"
            className="group flex items-baseline gap-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-dye focus:ring-offset-2 rounded"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-ink group-hover:text-indigo-dye transition-colors">
              Beneath the Empires
            </span>
            <span className="hidden sm:inline-block text-[11px] uppercase tracking-widest text-ash font-mono font-medium border-l border-ash/40 pl-2.5">
              Bombay Presidency (1300–1947)
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 sm:gap-2">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/exhibit" className={navLinkClass}>
              Exhibit Gallery
            </NavLink>
            <NavLink to="/audit" className={navLinkClass}>
              AI Audit
            </NavLink>
            <NavLink to="/methodology" className={navLinkClass}>
              Methodology
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About &amp; Ethics
            </NavLink>
          </nav>

          {/* Mobile Navigation Disclosure Button (min 44x44px touch target) */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-ash/40 text-ink hover:bg-ash/15 focus:outline-none focus:ring-2 focus:ring-indigo-dye focus:ring-offset-2"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav"
            aria-label="Mobile Navigation Menu"
            className="md:hidden border-t border-ash/20 bg-[#EFE8DA] px-4 py-4 space-y-2 shadow-lg"
          >
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClass}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/exhibit"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Exhibit Gallery
            </NavLink>
            <NavLink
              to="/audit"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              AI Audit Suite
            </NavLink>
            <NavLink
              to="/methodology"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Methodology Statement
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              About &amp; Dublin Core Schema
            </NavLink>
          </nav>
        )}
      </header>

      {/* Main Content Landmark */}
      <main id="main-content" tabIndex="-1" className="flex-1 focus:outline-none">
        {children || <Outlet />}
      </main>

      {/* Footer Landmark */}
      <footer className="border-t border-ash/30 bg-[#ECE5D8] text-ink/80 text-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="font-serif text-lg font-bold text-ink mb-2">Beneath the Empires</h3>
              <p className="text-sm text-ash leading-relaxed mb-4 max-w-xl">
                A Digital Humanities archive reconstructing the labor, material culture, and bodily
                autonomy of subaltern and working-class women in the Bombay Presidency across 1300–1947.
                Auditing generative algorithmic erasures against ground-truth material history.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-ash font-mono">
                <span className="px-2 py-0.5 bg-ash/15 rounded">Dublin Core Extended</span>
                <span className="px-2 py-0.5 bg-ash/15 rounded">Grindmill Songs Archive</span>
                <span className="px-2 py-0.5 bg-ash/15 rounded">WCAG 2.2 AA Target</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-ink uppercase text-xs tracking-wider mb-3 font-mono">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-indigo-dye transition-colors">Home &amp; Pillars</Link></li>
                <li><Link to="/exhibit" className="hover:text-indigo-dye transition-colors">Archival Exhibit</Link></li>
                <li><Link to="/audit" className="hover:text-indigo-dye transition-colors">AI Audit Suite</Link></li>
                <li><Link to="/methodology" className="hover:text-indigo-dye transition-colors">Subaltern Methodology</Link></li>
                <li><Link to="/about" className="hover:text-indigo-dye transition-colors">About &amp; Dublin Core Schema</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-ink uppercase text-xs tracking-wider mb-3 font-mono">Licensing &amp; Provenance</h4>
              <p className="text-xs text-ash leading-relaxed">
                Archival photographs sourced from Wikimedia Commons and Library of Congress public-domain
                collections. Oral Ovi meter referenced from the Grindmill Songs Project.
                Interpretive texts and extended Dublin Core schema licensed under{' '}
                <span className="text-ink font-medium">CC BY-SA 4.0</span>.
              </p>
            </div>
          </div>

          <div className="border-t border-ash/20 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ash gap-2">
            <div>&copy; {CURRENT_YEAR} Beneath the Empires. Curated for Digital Humanities research.</div>
            <div className="italic">Reading against the archival grain.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

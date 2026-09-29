import React from 'react';

interface FooterProps {
  onOpenShadeFinder: () => void;
  onSelectCategory?: (category: string) => void;
  onNavigate?: (route: 'home' | 'our-story' | 'contact' | 'account' | 'gifts-sets' | 'shade-finder') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenShadeFinder, onSelectCategory, onNavigate }) => {
  return (
    <footer className="bg-[#151412] text-stone-400 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('home');
              }}
              className="font-serif text-2xl font-bold text-white tracking-tight cursor-pointer"
            >
              Bekky&apos;s Touch
            </a>
            <p className="text-stone-400 text-xs max-w-sm leading-relaxed">
              Curated beauty essentials designed to enhance natural elegance for every complexion. Proudly cruelty-free, skin-first, and formulated with luxurious botanical integrity.
            </p>
            <p className="text-[11px] text-stone-500 italic">
              London · United Kingdom
            </p>
            <div>
              <a
                href="/our-story"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.('our-story');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>Read Our Full Story &amp; Craft</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Column 1: Shop Collections */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Collection
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#shop?category=face"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('home');
                    onSelectCategory?.('FACE');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block py-0.5"
                >
                  Complexion &amp; Face
                </a>
              </li>
              <li>
                <a
                  href="#shop?category=lips"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('home');
                    onSelectCategory?.('LIPS');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block py-0.5"
                >
                  Lip Care &amp; Gloss
                </a>
              </li>
              <li>
                <a
                  href="#shop?category=eyes"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('home');
                    onSelectCategory?.('EYES');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block py-0.5"
                >
                  Eyes &amp; Lashes
                </a>
              </li>
              <li>
                <a
                  href="#shop?category=brows"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('home');
                    onSelectCategory?.('BROWS');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block py-0.5"
                >
                  Brows &amp; Definition
                </a>
              </li>
              <li>
                <a
                  href="#shop?category=tools"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('home');
                    onSelectCategory?.('TOOLS');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block py-0.5"
                >
                  Artisanal Brushes &amp; Tools
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Experience & Heritage */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Heritage &amp; Story
            </h4>
            <ul className="space-y-2">
              <li><a href="/gifts-sets" onClick={(e) => { e.preventDefault(); onNavigate?.('gifts-sets'); }} className="hover:text-white block py-0.5">Gifts &amp; Sets</a></li>
              <li>
                <a
                  href="/our-story"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('our-story');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block py-0.5"
                >
                  Our Story &amp; Founder
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenShadeFinder}
                  className="hover:text-white transition-colors text-left cursor-pointer block py-0.5"
                >
                  Shade Finder Matcher
                </button>
              </li>
              <li>
                <a
                  href="#values"
                  onClick={(e) => {
                    if (window.location.pathname !== '/') {
                      e.preventDefault();
                      onNavigate?.('home');
                      setTimeout(() => {
                        const el = document.getElementById('values');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  }}
                  className="hover:text-white transition-colors block py-0.5"
                >
                  Clean Formula Standards
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  onClick={(e) => {
                    if (window.location.pathname !== '/') {
                      e.preventDefault();
                      onNavigate?.('home');
                      setTimeout(() => {
                        const el = document.getElementById('reviews');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  }}
                  className="hover:text-white transition-colors block py-0.5"
                >
                  Verified Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Support &amp; Contact
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('contact');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block py-0.5"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/account"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('account');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block py-0.5"
                >
                  My Account &amp; Orders
                </a>
              </li>
              <li>
                <span className="text-stone-400 block py-0.5">
                  Free UK delivery on every order
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} Bekky&apos;s Touch Beauty Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-400 cursor-pointer">Privacy Notice</span>
            <span>·</span>
            <span className="hover:text-stone-400 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-stone-400 cursor-pointer">London Boutique</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

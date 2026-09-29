import React from 'react';
import { ArrowRight, Star, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenShadeFinder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenShadeFinder }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F4EE] to-[#FAF9F5] border-b border-[#ECE7DE] py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Brand Message & Direct Route */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-900/80">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Elevated Clean Luxury</span>
              <span className="text-stone-300">·</span>
              <span>Made For Daily Elegance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-[#1E1B18] leading-[1.12] text-balance">
              Discover your <br className="hidden sm:inline" />
              <span className="italic font-normal text-amber-950">natural elegance</span>.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-xl">
              Thoughtfully crafted cosmetics engineered to illuminate and celebrate your true skin. Cruelty-free, lightweight, and meticulously formulated with skin-nourishing botanicals.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href="#shop"
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1E1B18] text-[#FAF9F5] rounded-full font-medium text-sm hover:bg-stone-800 transition-all active:scale-[0.98] shadow-sm tracking-wide"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenShadeFinder}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-stone-300 text-stone-800 rounded-full font-medium text-sm hover:bg-stone-50 hover:border-stone-400 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Find Your Match</span>
              </button>
            </div>

            {/* Social proof adjacent to claim */}
            <div className="pt-2 flex items-center gap-3 text-xs sm:text-sm text-stone-600">
              <div className="flex items-center text-amber-600">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="font-semibold text-stone-900">4.9 / 5.0</span>
              <span className="text-stone-300">·</span>
              <span>Loved by thousands across the UK</span>
            </div>
          </div>

          {/* Right Column: Visual Anchor */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-xl bg-stone-200 border border-stone-200/80">
              <img
                src="/hero.jpg"
                alt="Bekky's Touch luxury beauty editorial"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  // Fallback styled visual container
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.classList.add('bg-gradient-to-tr', 'from-[#E8DFD5]', 'to-[#FAF9F5]');
                  }
                }}
              />

              {/* Gentle bottom scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

              {/* Featured Formula Badge Floating at Bottom */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-stone-100">
                <div className="flex items-center justify-between text-[11px] text-amber-800 font-semibold uppercase tracking-wider mb-1">
                  <span>Featured Formula</span>
                  <span className="text-amber-600 font-bold">£17.00</span>
                </div>
                <h4 className="font-serif text-base font-semibold text-stone-900">Glass Lip Oil</h4>
                <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">Deep hydration with a mirror-like glassy finish</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

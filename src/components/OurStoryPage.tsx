import React, { useEffect } from 'react';
import { Sparkles, Heart, ShieldCheck, Truck, ArrowRight, MapPin, Feather, Check } from 'lucide-react';

interface OurStoryPageProps {
  onNavigateHome: () => void;
  onOpenShadeFinder: () => void;
  onSelectCategory?: (category: string) => void;
}

export const OurStoryPage: React.FC<OurStoryPageProps> = ({
  onNavigateHome,
  onOpenShadeFinder,
  onSelectCategory
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = "Our Story & Philosophy | Bekky's Touch Luxury Beauty";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        "Discover the philosophy, clean formulation standards, and craftsmanship behind Bekky's Touch Beauty. Luxury cosmetics engineered with intention, purity, and purpose in London."
      );
    }
  }, []);

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-stone-800">
      {/* Editorial Hero Header */}
      <section className="relative py-20 sm:py-28 border-b border-[#ECE7DE] bg-gradient-to-b from-[#F4EFE6] to-[#FAF9F5] overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-stone-200/90 text-amber-950 text-xs font-semibold uppercase tracking-widest shadow-2xs mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Our Heritage &amp; Vision</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-semibold text-stone-900 tracking-tight leading-tight max-w-3xl mx-auto">
            Beauty engineered with intention, purity, and purpose.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-light">
            Born from a passion for clean, effortless glamour, <strong>Bekky’s Touch</strong> was created in London to redefine daily beauty essentials for every complexion.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-stone-500">
            <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full border border-stone-200/60">
              <MapPin className="w-3.5 h-3.5 text-amber-800" /> London · United Kingdom
            </span>
            <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full border border-stone-200/60">
              <Heart className="w-3.5 h-3.5 text-amber-800" /> 100% Cruelty-Free
            </span>
            <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full border border-stone-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-800" /> Skin-First Botanical Formulas
            </span>
          </div>
        </div>
      </section>

      {/* Main Narrative & Visual Showcase */}
      <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 bg-stone-100 relative group">
              <img
                src="/Philosophy.png"
                alt="Bekky's Touch luxury editorial craftsmanship"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  // Fallback to /philosophy.jpg if png not loaded
                  (e.target as HTMLImageElement).src = '/philosophy.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-serif italic drop-shadow-sm">
                Bekky’s Touch Boutique Editorial · London
              </div>
            </div>

            {/* Founder Pull Quote Card */}
            <div className="mt-6 sm:-mt-10 sm:ml-8 relative sm:z-10 bg-white p-6 sm:p-7 rounded-2xl shadow-lg border border-stone-200/90 max-w-md">
              <span className="text-3xl font-serif text-amber-800/40 leading-none">&ldquo;</span>
              <p className="font-serif italic text-stone-900 text-sm sm:text-base leading-relaxed -mt-2">
                True beauty doesn’t mask who you are — it illuminates the confidence you already carry inside.
              </p>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="font-serif font-bold text-xs uppercase tracking-wider text-amber-950 block">
                    — Bekky
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">Founder, Bekky’s Touch Beauty Ltd.</span>
                </div>
                <Feather className="w-4 h-4 text-amber-700" />
              </div>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-amber-900 uppercase">
              <span>The Origin</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 leading-tight">
              Curated beauty essentials designed to enhance natural elegance for every complexion.
            </h2>

            <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
              Every formula at <strong>Bekky’s Touch</strong> begins with a simple truth: cosmetics should never be a chore, a mask, or an irritation to your skin. We combine skin-first nourishment with high-performance wear to create formulas that feel weightless from morning to evening.
            </p>

            <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
              From our flagship <em>Second Skin Foundation</em> and silk-drenched <em>Cloud Blush</em> to our precision brow sculpting essentials, each product is developed with rich botanical integrity, ensuring every shade looks vibrant and radiant across diverse undertones without ashiness.
            </p>

            {/* Quick Commitments List */}
            <div className="pt-2 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <p className="text-xs sm:text-sm text-stone-700">
                  <strong>Skin-First Actives:</strong> Enriched with squalane, hyaluronic acid, and botanical oils for all-day comfort.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <p className="text-xs sm:text-sm text-stone-700">
                  <strong>Undertone Balance:</strong> Formulated specifically to complement deep, warm, olive, and neutral skin profiles.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <p className="text-xs sm:text-sm text-stone-700">
                  <strong>Ethical Integrity:</strong> 100% cruelty-free, paraben-free, and packaged with sustainable care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Pillars Section */}
      <section className="py-16 sm:py-20 bg-white border-y border-[#ECE7DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-amber-900 font-semibold">
              Our Formulation Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 mt-2">
              The Three Pillars of Our Craft
            </h2>
            <p className="text-stone-600 text-sm mt-3">
              We hold our entire boutique catalogue to uncompromising standards of purity, efficacy, and ethical production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-8 rounded-2xl bg-[#FAF9F5] border border-stone-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100/70 border border-amber-200/80 flex items-center justify-center text-amber-900 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-stone-900">
                1. Skin-First Nourishment
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                Infused with premium botanical actives, ultra-hydrating oils, and restorative skincare compounds. Every product actively protects and conditions your barrier throughout wear.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-2xl bg-[#FAF9F5] border border-stone-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100/70 border border-amber-200/80 flex items-center justify-center text-amber-900 mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-stone-900">
                2. Inclusive Spectrum
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                Expertly balanced undertones crafted to celebrate every skin tone. We eliminate the chalky casts and heavy masks common in conventional cosmetics.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-2xl bg-[#FAF9F5] border border-stone-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100/70 border border-amber-200/80 flex items-center justify-center text-amber-900 mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-stone-900">
                3. Clean &amp; Ethical Craft
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                100% cruelty-free, never tested on animals. Formulated without parabens, harsh sulfates, or phthalates, from laboratory to packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* London Base & Delivery Promise */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1E1B18] text-[#FAF9F5] rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
              <Truck className="w-4 h-4" /> Nationwide &amp; Beyond
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold">
              Delivered with care from our London boutique.
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              We offer complimentary tracked delivery on every UK order, packaged in conscious, protective materials.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                onNavigateHome();
                setTimeout(() => {
                  const el = document.getElementById('shop');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#FAF9F5] text-stone-900 text-xs font-semibold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Explore Boutique</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenShadeFinder}
              className="w-full sm:w-auto px-6 py-3 border border-stone-700 hover:border-stone-500 text-stone-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Find Your Shade</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

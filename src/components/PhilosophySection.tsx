import React, { useState, useEffect } from 'react';
import { Sparkles, Feather, Droplets, Camera } from 'lucide-react';

interface PhilosophySectionProps {
  image?: string;
  onUploadPhoto?: () => void;
}

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  image = '/Philosophy.png',
  onUploadPhoto,
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [image]);

  return (
    <section className="py-16 sm:py-24 bg-[#F6F3EC] border-y border-[#E9E4D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Visual Showcase */}
          <div className="lg:col-span-6 relative group">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-stone-300 relative flex items-center justify-center">
              {!imgError ? (
                <img
                  src={image}
                  alt="Bekky's Touch luxury beauty craftsmanship"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F3EFE7]">
                  <span className="font-serif text-3xl text-stone-400 font-light mb-2">Bekky&apos;s Touch</span>
                  <span className="text-sm text-stone-600 font-medium">Our Philosophy &amp; Craft</span>
                </div>
              )}

              {onUploadPhoto && (
                <button
                  type="button"
                  onClick={onUploadPhoto}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-stone-800 text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm border border-stone-200/80 backdrop-blur-xs flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-stone-700" />
                  <span>Change Photo</span>
                </button>
              )}
            </div>
            {/* Subtle floating quote block */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-white p-4 sm:p-5 rounded-xl shadow-md border border-stone-200/80 max-w-xs">
              <p className="font-serif italic text-stone-800 text-xs sm:text-sm">
                &ldquo;True beauty doesn&apos;t mask who you are — it illuminates the confidence you already carry inside.&rdquo;
              </p>
              <span className="block mt-2 text-[11px] font-semibold text-amber-950 uppercase tracking-wider">
                — Bekky, Founder
              </span>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-6 space-y-6 pt-6 lg:pt-0">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-900 font-semibold">
                Our Philosophy &amp; Craft
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 mt-1 leading-tight">
                Beauty engineered with intention, purity, and purpose.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              Born from a passion for clean, effortless glamour, <strong>Bekky&apos;s Touch</strong> was created to redefine daily beauty essentials. Every single formula is formulated to fuse skin-first nourishment with high-performance wear.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center shrink-0 text-amber-800">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-stone-900">
                    Skin-First Ingredients
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    Infused with organic squalane, hyaluronic acid, vitamin E, and jojoba oils so your skin looks even healthier after you take it off.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center shrink-0 text-amber-800">
                  <Feather className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-stone-900">
                    Featherweight Breathability
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    Zero heaviness, zero cakey residue. Built to survive bustling work days, London rain, and evening celebrations with effortless ease.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center shrink-0 text-amber-800">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-stone-900">
                    True Complexion Inclusivity
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    Nuanced warm, olive, neutral, and deep undertones tested on real complexions to guarantee no ashy cast and no oxidation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

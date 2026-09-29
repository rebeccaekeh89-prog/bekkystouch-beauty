import React, { useState } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { X, Sparkles, Check, ArrowRight, RefreshCw, Camera } from 'lucide-react';

interface ShadeFinderModalProps {
  isOpen: boolean;
  pageMode?: boolean;
  onClose: () => void;
  onAddRoutineToCart: (items: { product: Product; shade: string }[]) => void;
  products?: Product[];
  onUploadPhoto?: (product: Product) => void;
}

function BundleItemCard({
  item,
  onUploadPhoto,
}: {
  item: { product: Product; shade: string };
  onUploadPhoto?: (product: Product) => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="p-3 bg-[#FAF9F5] border border-stone-200 rounded-xl flex flex-col justify-between group relative">
      <div className="aspect-square bg-white rounded-lg overflow-hidden mb-2 border border-stone-200 relative flex items-center justify-center">
        {!imgError ? (
          <img
            src={item.product.shadeImages?.[item.shade] || item.product.image}
            alt={item.product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#F3EFE7]">
            <span className="font-serif text-sm font-semibold text-stone-700">{item.product.name}</span>
            <span className="text-[10px] text-amber-900 mt-1 font-medium bg-amber-100/70 px-2 py-0.5 rounded">
              {item.shade}
            </span>
          </div>
        )}

        {onUploadPhoto && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUploadPhoto(item.product);
            }}
            title={`Upload photo for ${item.product.name}`}
            className="absolute top-2 right-2 p-1.5 bg-white/95 hover:bg-white text-stone-700 rounded-md shadow-xs border border-stone-200 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-stone-700" />
          </button>
        )}
      </div>

      <div>
        <span className="text-[10px] uppercase font-semibold text-stone-400 block">{item.product.category}</span>
        <h4 className="font-serif text-sm font-semibold text-stone-900 leading-snug">{item.product.name}</h4>
        <div className="mt-1 text-xs font-medium text-amber-950 bg-amber-100/60 px-2 py-0.5 rounded inline-block">
          Shade: {item.shade}
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-stone-200 text-xs font-semibold text-stone-900 tabular-nums">
        £{item.product.price.toFixed(2)}
      </div>
    </div>
  );
}

export const ShadeFinderModal: React.FC<ShadeFinderModalProps> = ({
  isOpen,
  pageMode = false,
  onClose,
  onAddRoutineToCart,
  products,
  onUploadPhoto,
}) => {
  const [resultShade, setResultShade] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);
  const [skinTone, setSkinTone] = useState<string>('deep');
  const [undertone, setUndertone] = useState<string>('warm');
  const [desiredFinish, setDesiredFinish] = useState<string>('radiant');
  const [priorityArea, setPriorityArea] = useState<string>('complexion');

  if (!isOpen) return null;

  const catalog = products && products.length > 0 ? products : PRODUCTS;

  // Compute recommendations
  const foundationProduct = catalog.find((p) => p.name === 'Second Skin Foundation') || catalog[0];
  const blushProduct = catalog.find((p) => p.name === 'Cloud Blush') || catalog[1];
  const lipProduct = catalog.find((p) => p.name === 'Glass Lip Oil') || catalog[4];

  const getRecommendedFoundationShade = () => {
    if (skinTone === 'fair') return '01 Warm Ivory';
    if (skinTone === 'light-medium') return '02 Neutral Beige';
    if (skinTone === 'medium-tan') return '04 Warm Honey';
    if (skinTone === 'deep') return '08 Warm Espresso';
    return '06 Rich Amber';
  };

  const getRecommendedBlushShade = () => {
    if (skinTone === 'fair' || skinTone === 'light-medium') return 'Rose Muse';
    if (skinTone === 'medium-tan') return 'Peachy Sunset';
    return 'Berry Bloom';
  };

  const getRecommendedLipShade = () => {
    if (skinTone === 'deep') return 'Golden Honey';
    return 'Nude Pinkish';
  };

  const recommendedBundle = [
    { product: foundationProduct, shade: resultShade || getRecommendedFoundationShade() },
    { product: blushProduct, shade: getRecommendedBlushShade() },
    { product: lipProduct, shade: getRecommendedLipShade() }
  ];

  const bundleTotal = recommendedBundle.reduce((sum, item) => sum + item.product.price, 0);
  const discountedBundleTotal = (bundleTotal * 0.85).toFixed(2); // 15% bundle savings

  const handleAddBundle = () => {
    onAddRoutineToCart(recommendedBundle);
    onClose();
  };

  return (
    <div className={pageMode ? "flex justify-center px-4 py-12 sm:py-16 bg-[#FAF9F5]" : "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"}>
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in zoom-in-95 duration-200 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors"
          aria-label={pageMode ? "Back to shop" : "Close modal"}
        >
          <X className="w-5 h-5" />
        </button>

        {pageMode && <h1 className="font-serif text-3xl sm:text-4xl mb-6">Find Your Shade</h1>}
        {step < 3 ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-900 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Step {step} of 2 · Precision Shade Matcher</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 mb-2">
              {step === 1 ? 'Select Your Complexion Depth' : 'What finish do you desire?'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mb-6">
              {step === 1
                ? 'We formulate with authentic neutral, golden, and rich warm undertones that never turn grey.'
                : 'Choose the canvas texture that makes you feel most confident and radiant.'}
            </p>

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'fair', label: 'Fair / Light', hex: '#F0DEC8' },
                    { id: 'light-medium', label: 'Medium Beige', hex: '#DDB792' },
                    { id: 'medium-tan', label: 'Caramel Tan', hex: '#B87E4C' },
                    { id: 'deep', label: 'Deep / Espresso', hex: '#583623' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => { setSkinTone(t.id); setResultShade(null); }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                        skinTone === t.id
                          ? 'border-stone-900 bg-stone-50 ring-2 ring-stone-900/10'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <span
                        className="w-10 h-10 rounded-full shadow-inner border border-black/10"
                        style={{ backgroundColor: t.hex }}
                      />
                      <span className="text-xs font-semibold text-stone-800 text-center">{t.label}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <span className="block text-xs font-semibold text-stone-800 mb-2">Your Undertone</span>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'warm', title: 'Warm / Golden', desc: 'Golds, bronzes & honey tones glow best' },
                      { id: 'neutral', title: 'Neutral', desc: 'Balanced mix of warm & cool tones' },
                      { id: 'cool', title: 'Cool / Rosy', desc: 'Subtle reddish or blue-toned undertones' }
                    ].map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => { setUndertone(u.id); setResultShade(null); }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          undertone === u.id
                            ? 'border-stone-900 bg-stone-50'
                            : 'border-stone-200 hover:border-stone-400 bg-white'
                        }`}
                      >
                        <span className="text-xs font-bold text-stone-900 block">{u.title}</span>
                        <span className="text-[11px] text-stone-500 block mt-0.5">{u.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 bg-[#1E1B18] text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next: Finish Preference</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'radiant', title: 'Dewy & Lit-from-Within', desc: 'Glass skin radiance with deep hydration' },
                    { id: 'velvet', title: 'Natural Soft Velvet', desc: 'Imperceptible skin-like finish with oil control' },
                    { id: 'sculpted', title: 'Full Glam & Sculpted', desc: 'Contoured cheekbones and high dimension' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setDesiredFinish(f.id)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        desiredFinish === f.id
                          ? 'border-stone-900 bg-stone-50'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <span className="text-xs font-bold text-stone-900 block">{f.title}</span>
                      <span className="text-[11px] text-stone-500 block mt-1">{f.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-6 flex justify-between items-center border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-800"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 bg-[#1E1B18] text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Generate My Custom Routine</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Step 3: Match Result */
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-900">
                Your Tailored Match
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
                The Bekky&apos;s Touch Radiant Trio
              </h2>
              <p className="text-xs text-stone-500">
                Handpicked to harmonize with your complexion depth and desired natural radiance.
              </p>
            </div>

            <section className="overflow-hidden rounded-2xl border border-stone-200 bg-[#FAF9F5]">
              <img
                src={foundationProduct.shadeImages?.[recommendedBundle[0].shade] || foundationProduct.image}
                alt={`Woman illustrating ${recommendedBundle[0].shade}, with Bekky's Touch Second Skin Foundation and a shade swatch`}
                className="w-full h-auto object-contain"
              />
              <div className="p-5 space-y-3">
                <h3 className="font-serif text-xl font-semibold">Your suggested shade: {recommendedBundle[0].shade}</h3>
                <p className="text-sm text-stone-600">Illustrative shade guide. Lighting and screen settings can affect how colours appear.</p>
                <label className="block text-sm font-medium" htmlFor="compare-foundation-shade">Compare the nine shades</label>
                <select id="compare-foundation-shade" value={recommendedBundle[0].shade} onChange={(event) => setResultShade(event.target.value)} className="w-full border border-stone-300 rounded-lg bg-white px-3 py-3">
                  {foundationProduct.shadesList?.map((shade) => <option key={shade} value={shade}>{shade}</option>)}
                </select>
              </div>
            </section>

            {/* Recommended Products Bundle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recommendedBundle.map((item, idx) => (
                <BundleItemCard
                  key={idx}
                  item={item}
                  onUploadPhoto={onUploadPhoto}
                />
              ))}
            </div>

            {/* Bundle Savings Action */}
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">Complete Routine Bundle</span>
                  <span className="text-[11px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-bold">15% OFF</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold text-stone-900 tabular-nums">£{discountedBundleTotal}</span>
                  <span className="text-xs text-stone-400 line-through tabular-nums">£{bundleTotal.toFixed(2)}</span>
                  <span className="text-xs text-emerald-700 font-medium">Includes Free UK Shipping</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="p-2.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200/50 transition-colors"
                  aria-label="Restart quiz"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleAddBundle}
                  className="flex-1 sm:flex-none px-6 py-3 bg-[#1E1B18] text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Add Routine to Bag (£{discountedBundleTotal})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

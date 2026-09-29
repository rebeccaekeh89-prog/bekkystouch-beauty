import React, { useState } from 'react';
import { ArrowRight, Gift, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

const sets = [
  {
    title: 'The Everyday Glow Set',
    line: 'A little glow goes a long way.',
    description: 'A soft flush and glossy lips for an easy, feel-good look.',
    names: ['Cloud Blush', 'Glass Lip Oil'],
    accent: 'bg-[#F6E9E7]'
  },
  {
    title: 'The Eye Edit',
    line: 'All eyes on you.',
    description: 'Warm colour, defined lashes and a finishing flick.',
    names: ['Velvet Eyeshadow Palette', 'Lift & Length Mascara', 'Precision Liquid Liner'],
    accent: 'bg-[#F0E8DF]'
  },
  {
    title: 'The Finishing Touch Set',
    line: 'The details make it yours.',
    description: 'A lip colour and a brow duo to bring your look together.',
    names: ['Satin Kiss Lipstick', 'Sculpting Brow Pencil', 'Feather Hold Brow Gel'],
    accent: 'bg-[#F3E5E1]'
  }
];

interface GiftsSetsPageProps {
  products: Product[];
  onAddSetToCart: (items: { product: Product; shade: string }[]) => void;
  onShopAll: () => void;
}

export const GiftsSetsPage: React.FC<GiftsSetsPageProps> = ({ products, onAddSetToCart, onShopAll }) => {
  const [selectedShades, setSelectedShades] = useState<Record<number, string>>({});

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900">
      <header className="border-b border-stone-200 bg-[#F4EFE9] px-4 py-14 text-center sm:py-20">
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-900">Bekky’s Touch Beauty</span>
        <h1 className="mt-4 font-serif text-4xl font-semibold sm:text-6xl">Gifts &amp; Sets</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-700 sm:text-lg">
          For someone special. For a little self-care. For no reason at all.
        </p>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-amber-900">The gift edit</span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">A beautiful choice, made simple.</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-stone-600">Each set contains Bekky’s Touch favourites. Choose your shades, then add the items to your bag together.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {sets.map((set) => {
            const items = set.names.map((name) => products.find((product) => product.name === name)).filter((product): product is Product => Boolean(product));
            if (items.length !== set.names.length) return null;
            const total = items.reduce((sum, item) => sum + item.price, 0);
            return (
              <article key={set.title} className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className={`relative grid aspect-[4/3] grid-cols-2 gap-2 overflow-hidden p-4 ${set.accent}`}>
                  <div className="absolute left-6 top-6 z-10 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-stone-800 shadow-sm">
                    Bekky’s Touch set
                  </div>
                  {items.slice(0, 2).map((item) => (
                    <img key={item.id} src={item.image} alt={`Bekky's Touch ${item.name}`} className="h-full w-full rounded-xl bg-white object-cover" loading="lazy" />
                  ))}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm font-semibold text-amber-900">{set.line}</p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold">{set.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-stone-700">{set.description}</p>
                  <div className="mt-5 border-t border-stone-200 pt-4">
                    <p className="text-sm font-semibold text-stone-900">What’s inside</p>
                    <ul className="mt-2 space-y-3">
                      {items.map((item) => (
                        <li key={item.id} className="text-sm text-stone-700">
                          <span className="font-medium">{item.name}</span>
                          {item.shadesList && item.shadesList.length > 1 && (
                            <label className="mt-1 flex items-center gap-2">
                              <span className="shrink-0 text-stone-500">Shade:</span>
                              <select
                                aria-label={`Shade for ${item.name} in ${set.title}`}
                                value={selectedShades[item.id] || item.shadesList[0]}
                                onChange={(event) => setSelectedShades((previous) => ({ ...previous, [item.id]: event.target.value }))}
                                className="min-w-0 flex-1 rounded-md border border-stone-300 bg-white px-2 py-2 text-sm text-stone-900"
                              >
                                {item.shadesList.map((shade) => <option key={shade} value={shade}>{shade}</option>)}
                              </select>
                            </label>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                    <span className="text-xl font-semibold">£{total.toFixed(2)}</span>
                    <span className="text-sm text-stone-500">{items.length} items</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddSetToCart(items.map((product) => ({ product, shade: selectedShades[product.id] || product.shadesList?.[0] || product.shade })))}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E1B18] px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800"
                  >
                    <ShoppingBag className="h-4 w-4" aria-hidden="true" /> Add set to bag
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-4">
            <Gift className="h-8 w-8 shrink-0 text-amber-900" aria-hidden="true" />
            <p className="text-base text-stone-700">Looking for something else? Explore the full Bekky’s Touch collection.</p>
          </div>
          <button type="button" onClick={onShopAll} className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-stone-900 underline underline-offset-4">
            Shop all products <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </main>
    </div>
  );
};

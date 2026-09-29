import React from 'react';
import { REVIEWS } from '../data/products';
import { Star, CheckCircle2 } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-amber-900 font-semibold">
          Real Stories &amp; Results
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 mt-1">
          Loved by Our Community
        </h2>
        <p className="text-stone-600 text-sm mt-2">
          Read genuine reviews from verified customers across the United Kingdom and beyond.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {REVIEWS.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-[11px] text-stone-400">{rev.date}</span>
              </div>

              <h4 className="font-serif font-semibold text-stone-900 text-base leading-snug mb-2">
                &ldquo;{rev.title}&rdquo;
              </h4>

              <p className="text-xs text-stone-600 leading-relaxed">
                {rev.content}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-stone-900">{rev.author}</span>
                  {rev.verified && (
                    <span title="Verified Customer" className="inline-flex">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-stone-400">{rev.location}</span>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-stone-800 block">{rev.productName}</span>
                <span className="text-[10px] text-stone-500">{rev.shade}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

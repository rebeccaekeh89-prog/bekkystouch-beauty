import React from 'react';
import { Heart, Sparkles, ShieldCheck, Truck } from 'lucide-react';

export const Values: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'Cruelty-Free Always',
      description: 'Never tested on animals. Ethical beauty from formulation, testing, to final packaging.'
    },
    {
      icon: Sparkles,
      title: 'Inclusive Skin Tones',
      description: 'Carefully engineered undertones developed to complement and illuminate every complex.'
    },
    {
      icon: ShieldCheck,
      title: 'Skin-First Nourishment',
      description: 'Enriched with squalane, hyaluronic acid, and botanical oils for all-day comfort.'
    },
    {
      icon: Truck,
      title: 'Fast & Free UK Delivery',
      description: 'Complimentary tracked delivery on every UK order.'
    }
  ];

  return (
    <section id="values" className="border-b border-[#ECE7DE] bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] border border-[#ECE5D8] flex items-center justify-center shrink-0 text-amber-900">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-stone-900 tracking-tight">
                    {v.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

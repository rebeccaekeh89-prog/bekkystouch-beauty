import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

interface NewsletterProps {
  onCopyPromo: (code: string) => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ onCopyPromo }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (!response.ok) throw new Error('Could not subscribe. Please try again.');
      setSubmitted(true);
      onCopyPromo('WELCOME10');
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not subscribe.'); }
    finally { setBusy(false); }
  };

  return (
    <section className="bg-[#1E1B18] text-[#FAF9F5] py-16 sm:py-20 relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-300 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>The Beauty Circle</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
          Unlock 10% Off Your First Order
        </h2>

        <p className="text-stone-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Be the first to hear about secret formula drops, masterclasses by Bekky, and exclusive member-only privileges.
        </p>

        {error && <p role="alert" className="text-red-300 text-xs">{error}</p>}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch justify-center gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-stone-800/80 border border-stone-700 text-white placeholder-stone-400 rounded-full px-5 py-3 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors flex-1"
            />
            <button
              type="submit"
              disabled={busy}
              className="px-6 py-3 bg-[#FAF9F5] text-[#1E1B18] hover:bg-white rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>JOIN CLUB</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="bg-stone-800/90 border border-stone-700 p-5 rounded-2xl max-w-md mx-auto animate-in zoom-in-95 duration-200 space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold text-sm">
              <Check className="w-4 h-4" />
              <span>You&apos;re in! Welcome to the Circle.</span>
            </div>
            <p className="text-xs text-stone-300">
              Use promo code <span className="font-mono bg-stone-900 text-amber-300 px-2 py-0.5 rounded font-bold">WELCOME10</span> at checkout for 10% off your entire order.
            </p>
          </div>
        )}

        <p className="text-[11px] text-stone-400">
          No spam, ever. Unsubscribe anytime with a single click.
        </p>
      </div>
    </section>
  );
};

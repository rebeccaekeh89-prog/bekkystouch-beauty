import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: number, delta: number, shade?: string) => void;
  onRemoveItem: (productId: number, shade?: string) => void;
  onProceedToCheckout: () => void;
  appliedPromo: string | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const freeShippingThreshold = 0;
  const amountToFreeShipping = 0;
  const freeShippingProgress = 100;

  const discountPercent = appliedPromo === 'WELCOME10' ? 0.10 : appliedPromo === 'BEKKYTOUCH' ? 0.15 : appliedPromo === 'GLOW20' ? 0.20 : 0;
  const discountAmount = subtotal * discountPercent;
  const shipping = 0;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;
    const ok = onApplyPromo(promoInput.trim().toUpperCase());
    if (ok) {
      setPromoInput('');
    } else {
      setPromoError('Invalid code. Try "WELCOME10" or "BEKKYTOUCH"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] shadow-2xl border-l border-stone-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h2 className="font-serif text-xl font-semibold text-stone-900">
                Your Shopping Bag
              </h2>
              <span className="text-xs text-stone-500 tabular-nums">
                ({items.reduce((acc, i) => acc + i.qty, 0)})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#FAF4ED] px-5 py-3 border-b border-[#EBDCCF]">
            <div className="flex items-center justify-between text-xs text-stone-800 font-medium mb-1.5">
              {amountToFreeShipping > 0 ? (
                <span>
                  Add <strong className="tabular-nums">£{amountToFreeShipping.toFixed(2)}</strong> more for <strong>Free UK Delivery</strong>
                </span>
              ) : (
                <span className="text-emerald-800 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> You&apos;ve unlocked Free UK Delivery!
                </span>
              )}
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-800 h-full transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-200">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl text-stone-800">Your bag is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                  Discover our curated collection of clean makeup and nourishing skin-first formulas.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#1E1B18] text-white rounded-full text-xs font-semibold hover:bg-stone-800 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={`${item.id}-${item.selectedShade || idx}`} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-white rounded-lg border border-stone-200 overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-semibold text-stone-900 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id, item.selectedShade)}
                          className="text-stone-400 hover:text-red-700 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedShade && (
                        <p className="text-xs text-stone-500 mt-0.5">
                          Shade: {item.selectedShade}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-stone-300 rounded bg-white">
                        <button
                          onClick={() => onUpdateQty(item.id, -1, item.selectedShade)}
                          className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100 transition-colors"
                        >
                          −
                        </button>
                        <span className="px-2 text-xs font-semibold text-stone-800 tabular-nums min-w-[20px] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.id, 1, item.selectedShade)}
                          className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-stone-900 tabular-nums">
                        £{(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-stone-200 space-y-4">
              {/* Promo code form */}
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Promo <strong>{appliedPromo}</strong> applied ({Math.round(discountPercent * 100)}% off)</span>
                  </div>
                  <button
                    onClick={onRemovePromo}
                    className="text-stone-400 hover:text-stone-700 p-1"
                    aria-label="Remove promo code"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePromoSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Discount code (e.g. WELCOME10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-1.5 text-xs uppercase placeholder:normal-case placeholder-stone-400 focus:outline-none focus:border-stone-800"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-stone-200 text-stone-800 hover:bg-stone-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && <p className="text-[11px] text-red-600">{promoError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900 tabular-nums">£{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-amber-800">
                    <span>Discount ({appliedPromo})</span>
                    <span className="tabular-nums">-£{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>UK Tracked Shipping</span>
                  <span className="font-medium text-stone-900 tabular-nums">
                    FREE
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="font-bold tabular-nums">£{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 bg-[#1E1B18] text-[#FAF9F5] rounded-xl font-medium text-xs sm:text-sm tracking-wide hover:bg-stone-800 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <span>·</span>
                <span className="font-bold tabular-nums">£{total.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <div className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Encrypted 256-Bit SSL Checkout · Apple Pay · Klarna</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

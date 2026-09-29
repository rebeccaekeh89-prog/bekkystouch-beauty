import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Star, Check, Sparkles, ShieldCheck, Heart, Camera } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, shade: string, qty: number) => void;
  onUploadPhoto?: (p: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onUploadPhoto,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedShade, setSelectedShade] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'howTo'>('benefits');
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.shadesList && product.shadesList.length > 0) {
        setSelectedShade(product.shadesList[0]);
      } else {
        setSelectedShade(product.shade);
      }
      setQuantity(1);
      setAdded(false);
      setImgError(false);
    }
  }, [product]);

  useEffect(() => {
    setImgError(false);
  }, [product?.image, selectedShade]);

  if (!product) return null;
  const shadeImage = product.shadeImages?.[selectedShade] || product.image;

  const handleAdd = () => {
    onAddToCart(product, selectedShade || product.shade, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-xs text-stone-600 hover:text-stone-900 hover:bg-white shadow-xs transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Product Image Showcase */}
        <div className="md:w-1/2 bg-[#F6F3EC] p-6 sm:p-10 flex flex-col items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-stone-200">
          {product.badge && (
            <span className="absolute top-4 left-4 text-xs font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-stone-900 px-3 py-1 rounded-sm shadow-xs border border-stone-200">
              {product.badge}
            </span>
          )}

          <div className="w-full max-w-sm aspect-square relative rounded-xl overflow-hidden shadow-sm bg-[#F5F2EB] flex items-center justify-center">
            {!imgError ? (
              <img
                key={shadeImage}
                src={shadeImage}
                alt={`${product.name} in ${selectedShade}`}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-center transition-opacity duration-200"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F3EFE7]">
                <span className="font-serif text-3xl text-stone-400 font-light mb-2">Bekky&apos;s Touch</span>
                <span className="text-sm text-stone-600 font-medium">{product.name}</span>
              </div>
            )}
          </div>

          {onUploadPhoto && (
            <button
              type="button"
              onClick={() => onUploadPhoto(product)}
              className="mt-3 w-full max-w-sm py-2 px-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5 text-stone-500" />
              <span>Upload / Change Exact Photo</span>
            </button>
          )}

          <div className="mt-4 flex items-center gap-4 text-xs text-stone-500">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Skin-First Formula</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-700" />
              <span>Cruelty-Free</span>
            </div>
          </div>
        </div>

        {/* Right Column: Information, Shade Selector & Buy Action */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] sm:max-h-none">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-wider">
                <span>{product.category}</span>
                <span className="text-stone-400">{product.volumeOrWeight}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
                {product.name}
              </h2>

              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-500 text-amber-500'
                          : 'fill-stone-200 text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-800">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-stone-300">·</span>
                <span className="text-xs text-stone-500">
                  {product.reviewsCount} verified reviews
                </span>
              </div>

              <div className="mt-3 text-2xl font-serif font-bold text-stone-900 tabular-nums">
                £{product.price.toFixed(2)}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Shade Selection (if available) */}
            {product.shadesList && product.shadesList.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-medium text-stone-800 mb-2">
                  <span>Selected Shade:</span>
                  <span className="font-semibold text-amber-950">{selectedShade}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.shadesList.map((shadeName) => {
                    const isSelected = selectedShade === shadeName;
                    return (
                      <button
                        key={shadeName}
                        type="button"
                        onClick={() => setSelectedShade(shadeName)}
                        aria-pressed={isSelected}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1E1B18] text-white shadow-xs'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200/60'
                        }`}
                      >
                        {shadeName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Information Tabs */}
            <div className="pt-3 border-t border-stone-200">
              <div className="flex items-center gap-4 border-b border-stone-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('benefits')}
                  className={`pb-2 transition-colors cursor-pointer ${
                    activeTab === 'benefits'
                      ? 'border-b-2 border-stone-900 text-stone-900'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  Key Benefits
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-2 transition-colors cursor-pointer ${
                    activeTab === 'ingredients'
                      ? 'border-b-2 border-stone-900 text-stone-900'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  Ingredients
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('howTo')}
                  className={`pb-2 transition-colors cursor-pointer ${
                    activeTab === 'howTo'
                      ? 'border-b-2 border-stone-900 text-stone-900'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  How to Apply
                </button>
              </div>

              <div className="pt-3 text-xs text-stone-600 leading-relaxed min-h-[90px]">
                {activeTab === 'benefits' && (
                  <ul className="space-y-1.5 list-disc list-inside">
                    {product.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}

                {activeTab === 'ingredients' && (
                  <p className="font-mono text-[11px] text-stone-600 leading-normal">
                    {product.ingredients.join(', ')}
                  </p>
                )}

                {activeTab === 'howTo' && (
                  <p className="italic text-stone-700">{product.howToUse}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-5 mt-4 border-t border-stone-200 space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 transition-colors text-sm font-semibold"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-3 py-2 text-xs font-semibold text-stone-800 tabular-nums min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 transition-colors text-sm font-semibold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-xs sm:text-sm tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                  added
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#1E1B18] text-white hover:bg-stone-800 active:scale-[0.99]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <span>Add to Bag</span>
                    <span className="opacity-70">·</span>
                    <span className="font-semibold tabular-nums">£{totalPrice}</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              {onToggleWishlist && (
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-3 rounded-lg border transition-colors flex items-center justify-center cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-50 text-rose-600 border-rose-300'
                      : 'bg-white text-stone-600 hover:text-rose-600 hover:bg-stone-50 border-stone-300'
                  }`}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  title={isWishlisted ? 'Saved in wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>

            <p className="text-[11px] text-stone-500 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Free UK delivery on every order</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

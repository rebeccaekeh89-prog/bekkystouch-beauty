import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Eye, Plus, Check, Camera, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, shade?: string) => void;
  onUploadPhoto?: (p: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  onUploadPhoto,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [product.image]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultShade = product.shadesList ? product.shadesList[0] : product.shade;
    onAddToCart(product, defaultShade);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative flex flex-col bg-white rounded-xl border border-[#ECE7DE] overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-[#F5F2EB] overflow-hidden flex items-center justify-center">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F3EFE7]">
            <span className="font-serif text-2xl text-stone-400 font-light mb-2">Bekky&apos;s Touch</span>
            <span className="text-xs text-stone-500 font-medium">{product.name}</span>
          </div>
        )}

        {/* Subtle Badge (Max 1 subtle text tag) */}
        {product.badge && (
          <span className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-stone-800 px-2.5 py-1 rounded-sm shadow-xs border border-stone-200">
            {product.badge}
          </span>
        )}

        {/* Wishlist toggle */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors shadow-2xs z-10 cursor-pointer ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-white/85 text-stone-500 hover:text-rose-600 hover:bg-white border border-stone-200/60'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            title={isWishlisted ? 'Saved in wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="flex-1 py-2 px-3 bg-white/95 backdrop-blur-xs text-stone-900 rounded-lg text-xs font-semibold hover:bg-white shadow-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          {onUploadPhoto && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUploadPhoto(product);
              }}
              title="Upload exact product photo"
              className="p-2 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center bg-white/95 backdrop-blur-xs text-stone-700 hover:text-stone-900 hover:bg-white"
              aria-label={`Upload photo for ${product.name}`}
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`p-2 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center ${
              added
                ? 'bg-emerald-700 text-white'
                : 'bg-[#1E1B18] text-white hover:bg-stone-800'
            }`}
            aria-label={`Quick add ${product.name}`}
          >
            {added ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-wider mb-1">
            <span>{product.category}</span>
            <span className="text-stone-400">★ {product.rating.toFixed(1)}</span>
          </div>

          <h3 className="font-serif text-lg font-semibold text-stone-900 leading-snug group-hover:text-amber-950 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
            {product.shade}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-stone-100">
          <span className="text-sm font-semibold text-stone-900 tabular-nums">
            £{product.price.toFixed(2)}
          </span>

          <span className="text-xs text-stone-400 group-hover:text-stone-700 transition-colors">
            View details →
          </span>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { CATEGORIES } from '../data/products';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, Search, RefreshCw, Camera } from 'lucide-react';

interface ShopSectionProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, shade?: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onUploadPhoto?: (p: Product) => void;
  onOpenUploadModal?: () => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  wishlistIds?: number[];
  onToggleWishlist?: (productId: number) => void;
}

export const ShopSection: React.FC<ShopSectionProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  searchQuery,
  onSearchChange,
  onUploadPhoto,
  onOpenUploadModal,
  selectedCategory: propCategory,
  onSelectCategory,
  wishlistIds = [],
  onToggleWishlist,
}) => {
  const [internalCategory, setInternalCategory] = useState<string>('ALL');
  const currentCategory = propCategory !== undefined ? propCategory : internalCategory;

  const handleCategoryChange = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      setInternalCategory(cat);
    }
  };

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (currentCategory !== 'ALL') {
      list = list.filter((p) => p.category.toUpperCase() === currentCategory.toUpperCase());
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.shade.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, currentCategory, searchQuery, sortBy]);

  return (
    <section id="shop" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#ECE7DE]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-900 mb-2">
            Curated Collection
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-[#1E1B18]">
            Bestselling Formulas
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
            Handcrafted, high-performance cosmetics engineered for seamless everyday wear and radiant natural beauty.
          </p>
        </div>

        {/* Sort & Quick Controls */}
        <div className="flex items-center gap-3 self-start md:self-end flex-wrap">
          {onOpenUploadModal && (
            <button
              type="button"
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100/90 border border-amber-200 text-amber-950 rounded-lg px-3 py-2 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-amber-800" />
              <span>Upload Photos</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-white border border-[#ECE7DE] rounded-lg px-3 py-2 text-xs font-medium text-stone-700 shadow-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-stone-900 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Collection</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="py-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const count = cat === 'ALL'
              ? products.length
              : products.filter(p => p.category.toUpperCase() === cat).length;
            const active = currentCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#1E1B18] text-[#FAF9F5] shadow-xs'
                    : 'bg-white border border-[#ECE7DE] text-stone-600 hover:text-stone-900 hover:border-stone-400'
                }`}
              >
                {cat} <span className="opacity-60 tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Inline Search Bar */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products or shades..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-[#ECE7DE] rounded-full pl-9 pr-4 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-800 transition-colors shadow-xs"
          />
        </div>
      </div>

      {/* Search Filter Status / Clear */}
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between bg-stone-100/70 border border-stone-200 px-4 py-2 rounded-lg text-xs text-stone-700">
          <span>
            Showing results for &ldquo;<strong>{searchQuery}</strong>&rdquo;
          </span>
          <button
            onClick={() => onSearchChange('')}
            className="text-stone-500 hover:text-stone-900 underline font-medium cursor-pointer"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onUploadPhoto={onUploadPhoto}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-stone-300 p-8 space-y-4 max-w-lg mx-auto">
          <p className="font-serif text-2xl text-stone-800">No formulas found</p>
          <p className="text-sm text-stone-500">
            We couldn&apos;t find any items matching your selected criteria. Try resetting the filters or searching for something else.
          </p>
          <button
            onClick={() => {
              handleCategoryChange('ALL');
              onSearchChange('');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E1B18] text-white rounded-full text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </section>
  );
};

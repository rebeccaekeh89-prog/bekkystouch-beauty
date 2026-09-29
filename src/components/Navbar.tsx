import React, { useState } from 'react';
import { ShoppingBag, Search, Sparkles, User, X, Menu, Camera, BookOpen, Mail } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAccount: () => void;
  onOpenShadeFinder: () => void;
  onOpenUploadModal?: () => void;
  onSelectCategory?: (category: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: { name: string; email: string } | null;
  onNavigate?: (route: 'home' | 'our-story' | 'contact' | 'account' | 'gifts-sets' | 'shade-finder') => void;
  currentRoute?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenAccount,
  onOpenShadeFinder,
  onOpenUploadModal,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  currentUser,
  onNavigate,
  currentRoute = 'home'
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E8E4DC] transition-all">
      {/* Slim Top Announcement Banner */}
      {!announcementDismissed && (
        <div className="bg-[#1E1B18] text-[#FAF9F5] text-xs py-2 px-4 flex items-center justify-between transition-all">
          <div className="w-6" />
          <p className="text-center font-medium tracking-wide">
            ✦ Free UK delivery on every order · Use code <span className="underline decoration-amber-400 font-semibold">WELCOME10</span> for 10% off
          </p>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            className="text-stone-400 hover:text-white transition-colors p-1 cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.('home');
          }}
          className="text-2xl sm:text-3xl font-serif tracking-tight text-[#1E1B18] hover:opacity-80 transition-opacity whitespace-nowrap cursor-pointer"
        >
          Bekky&apos;s Touch
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700 tracking-wide">
          <a
            href="#shop"
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.('home');
              if (onSelectCategory) {
                onSelectCategory('ALL');
              }
              setTimeout(() => {
                const el = document.getElementById('shop');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className={`hover:text-[#1E1B18] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-[#1E1B18] after:transition-all ${
              currentRoute === 'home' ? 'text-[#1E1B18] font-bold after:w-full' : 'after:w-0 hover:after:w-full'
            }`}
          >
            Shop Collection
          </a>

          <a href="/gifts-sets" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate?.('gifts-sets'); }} className="block text-sm font-medium hover:text-stone-900 py-1">Gifts &amp; Sets</a>

          <a
            href="/our-story"
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.('our-story');
            }}
            className={`hover:text-[#1E1B18] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-[#1E1B18] after:transition-all cursor-pointer ${
              currentRoute === 'our-story' ? 'text-[#1E1B18] font-bold after:w-full' : 'after:w-0 hover:after:w-full'
            }`}
          >
            Our Story
          </a>

          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.('contact');
            }}
            className={`hover:text-[#1E1B18] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-[#1E1B18] after:transition-all cursor-pointer ${
              currentRoute === 'contact' ? 'text-[#1E1B18] font-bold after:w-full' : 'after:w-0 hover:after:w-full'
            }`}
          >
            Contact Us
          </a>

          <button
            onClick={onOpenShadeFinder}
            className="hover:text-[#1E1B18] transition-colors py-1 flex items-center gap-1.5 text-stone-700 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Shade Finder</span>
          </button>

          <a
            href="#reviews"
            onClick={(e) => {
              if (currentRoute !== 'home') {
                e.preventDefault();
                onNavigate?.('home');
                setTimeout(() => {
                  const el = document.getElementById('reviews');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-[#1E1B18] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1.5px] after:bg-[#1E1B18] after:transition-all"
          >
            Reviews
          </a>
        </nav>

        {/* Primary Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Trigger */}
          <div className="relative">
            {showSearch ? (
              <div className="flex items-center bg-white border border-stone-300 rounded-full px-3 py-1.5 shadow-xs w-48 sm:w-64 transition-all">
                <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search formulas, shades..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none w-full"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    onSearchChange('');
                  }}
                  className="text-stone-400 hover:text-stone-700 ml-1 p-0.5 cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100/80 transition-colors cursor-pointer"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* User Account Button */}
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate('account');
              } else {
                onOpenAccount();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
              currentUser
                ? 'bg-amber-950 text-amber-100 hover:bg-black shadow-2xs'
                : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100/80'
            }`}
            aria-label="User account"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">
              {currentUser ? `Hi, ${currentUser.name.split(' ')[0]}` : 'Account'}
            </span>
          </button>

          {/* Optional Upload Photos button */}
          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              title="Upload exact product photos"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-[#F4EFE6] hover:bg-[#EAE2D5] border border-stone-300 rounded-full transition-colors cursor-pointer shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5 text-stone-700" />
              <span className="hidden md:inline">Upload Photos</span>
            </button>
          )}

          {/* Shopping Bag Button with Badge */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center p-2.5 bg-[#1E1B18] text-[#FAF9F5] rounded-full hover:bg-stone-800 transition-transform active:scale-95 shadow-xs cursor-pointer"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-900 cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF9F5] border-t border-stone-200 px-5 py-4 space-y-3">
          <a
            href="#shop"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              onNavigate?.('home');
              if (onSelectCategory) onSelectCategory('ALL');
              setTimeout(() => {
                const el = document.getElementById('shop');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="block text-sm font-semibold text-stone-800 py-1"
          >
            Shop Collection
          </a>

          <a href="/gifts-sets" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate?.('gifts-sets'); }} className="block text-sm font-medium hover:text-stone-900 py-1">Gifts &amp; Sets</a>

          <a
            href="/our-story"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              onNavigate?.('our-story');
            }}
            className="block text-sm font-medium text-stone-800 py-1"
          >
            Our Story
          </a>

          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              onNavigate?.('contact');
            }}
            className="block text-sm font-medium text-stone-800 py-1"
          >
            Contact Us
          </a>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenShadeFinder();
            }}
            className="flex items-center gap-2 text-sm font-medium text-stone-800 py-1 w-full text-left"
          >
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Find Your Shade</span>
          </button>

          <a
            href="#reviews"
            onClick={(e) => {
              setMobileMenuOpen(false);
              if (currentRoute !== 'home') {
                e.preventDefault();
                onNavigate?.('home');
                setTimeout(() => {
                  const el = document.getElementById('reviews');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="block text-sm font-medium text-stone-800 py-1"
          >
            Customer Reviews
          </a>

          <div className="pt-2 border-t border-stone-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigate) {
                  onNavigate('account');
                } else {
                  onOpenAccount();
                }
              }}
              className="flex items-center gap-2 text-sm font-semibold text-amber-950 py-1.5 w-full text-left"
            >
              <User className="w-4 h-4 text-amber-800" />
              <span>{currentUser ? `My Account (${currentUser.name})` : 'Sign In / Register'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

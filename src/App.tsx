/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Product, CartItem, CustomerOrder } from './types';
import { PRODUCTS } from './data/products';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Values } from './components/Values';
import { ShopSection } from './components/ShopSection';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { GiftsSetsPage } from './components/GiftsSetsPage';
import { ShadeFinderModal } from './components/ShadeFinderModal';
import { PhilosophySection } from './components/PhilosophySection';
import { ReviewsSection } from './components/ReviewsSection';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { AccountModal } from './components/AccountModal';
import { ImageUploadModal } from './components/ImageUploadModal';
import { Toast } from './components/Toast';
import { OurStoryPage } from './components/OurStoryPage';
import { ContactPage } from './components/ContactPage';
import { MyAccountArea } from './components/MyAccountArea';
import { restoreUser, signIn, signOut, signUp, resetPassword, updatePassword } from './auth';

type Route = 'home' | 'our-story' | 'contact' | 'account' | 'gifts-sets' | 'shade-finder';

const getInitialRoute = (): Route => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase();
  if (path === '/our-story' || path.startsWith('/our-story/')) return 'our-story';
  if (path === '/contact' || path.startsWith('/contact/')) return 'contact';
  if (path === '/account' || path.startsWith('/account/') || path === '/my-account') return 'account';

  if (path === '/gifts-sets') return 'gifts-sets';
  if (path === '/shade-finder') return 'shade-finder';
  const hash = window.location.hash.toLowerCase();
  if (hash.includes('our-story')) return 'our-story';
  if (hash.includes('contact')) return 'contact';
  if (hash.includes('account')) return 'account';

  return 'home';
};

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bekkys_touch_custom_images');
      if (saved) {
        const overrides: Record<number, string> = JSON.parse(saved);
        return PRODUCTS.map(p => {
          const customUrl = overrides[p.id];
          if (customUrl && !customUrl.startsWith('/products/')) {
            return { ...p, image: customUrl };
          }
          return p;
        });
      }
    } catch (e) {
      console.warn('Failed to load custom image overrides', e);
    }
    return PRODUCTS;
  });

  const [currentRoute, setCurrentRoute] = useState<Route>(getInitialRoute);

  useEffect(() => {
    let active = true;

    async function loadCatalogue() {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      interface DbProduct {
        id?: number | string;
        name?: string;
        price?: number | string;
        image?: string;
        [key: string]: unknown;
      }

      let rows: DbProduct[] | null = null;

      // 1. Fetch directly from Supabase bt_products table if client credentials are present
      if (supabaseUrl && supabaseKey) {
        try {
          const directRes = await fetch(`${supabaseUrl}/rest/v1/bt_products?select=*`, {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`
            }
          });
          if (directRes.ok) {
            rows = await directRes.json();
          }
        } catch (e) {
          console.warn('Direct Supabase bt_products fetch error:', e);
        }
      }

      // 2. Fallback to /api/products
      if (!rows || rows.length === 0) {
        try {
          const apiRes = await fetch('/api/products');
          if (apiRes.ok) {
            rows = await apiRes.json();
          }
        } catch (e) {
          console.warn('/api/products fetch error:', e);
        }
      }

      if (!active || !rows || rows.length === 0) return;

      setProducts(prev => {
        const customOverridesStr = localStorage.getItem('bekkys_touch_custom_images');
        const customMap: Record<number, string> = customOverridesStr ? JSON.parse(customOverridesStr) : {};

        return prev.map(p => {
          if (customMap[p.id]) {
            return { ...p, image: customMap[p.id] };
          }

          const match = rows!.find(r => {
            if (Number(r.id) === p.id) return true;
            if (r.name && String(r.name).trim().toLowerCase() === p.name.trim().toLowerCase()) return true;
            return false;
          });

          if (match) {
            const nextPrice = match.price !== undefined && !isNaN(Number(match.price)) ? Number(match.price) : p.price;
            const nextImg = (match.image && typeof match.image === 'string' && match.image.startsWith('http'))
              ? match.image
              : p.image;

            return {
              ...p,
              price: nextPrice,
              image: nextImg
            };
          }
          return p;
        });
      });
    }

    loadCatalogue();

    return () => {
      active = false;
    };
  }, []);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bekkys_touch_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pastOrders, setPastOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem('bekkys_touch_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('bekkys_touch_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleWishlist = (productId: number) => {
    setWishlistIds((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem('bekkys_touch_wishlist', JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save wishlist to storage:', e);
      }
      const prod = products.find((p) => p.id === productId);
      if (prev.includes(productId)) {
        showToast(`Removed ${prod?.name || 'item'} from your wishlist`);
      } else {
        showToast(`Added ${prod?.name || 'item'} to your wishlist!`);
      }
      return next;
    });
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountModalMode, setAccountModalMode] = useState<'signin' | 'signup' | 'forgot' | 'update_password'>('signin');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadModalTarget, setUploadModalTarget] = useState<'philosophy' | number | null>(null);
  const [philosophyImage, setPhilosophyImage] = useState<string>('/Philosophy.png');
  const [completedOrder, setCompletedOrder] = useState<CustomerOrder | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    const targetUrl = route === 'home' ? '/' : `/${route}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }

    if (route === 'gifts-sets' || route === 'shade-finder') {
      document.title = `${route === 'gifts-sets' ? 'Gifts & Sets' : 'Shade Finder'} | Bekky's Touch Beauty`;
    } else if (route === 'our-story') {
      document.title = "Our Story & Philosophy | Bekky's Touch Luxury Beauty";
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', "Discover the philosophy, clean formulation standards, and craftsmanship behind Bekky's Touch Beauty. Luxury cosmetics engineered with intention, purity, and purpose in London.");
    } else if (route === 'contact') {
      document.title = "Contact Us | Bekky's Touch Beauty";
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', "Get in touch with Bekky's Touch Beauty client concierge in London. Contact us for order support, personalized shade match advice, and boutique beauty inquiries.");
    } else if (route === 'account') {
      document.title = "My Account | Bekky's Touch Beauty";
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', "Manage your Bekky's Touch Beauty profile, view recent order history, saved delivery addresses, and wishlist.");
    } else {
      document.title = "Bekky's Touch — Luxury Beauty & Clean Cosmetics";
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', "Curated beauty essentials designed to enhance natural elegance for every complexion. Proudly cruelty-free, skin-first, and formulated with luxurious botanical integrity in London.");
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to popstate (browser back / forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const newRoute = getInitialRoute();
      setCurrentRoute(newRoute);
      if (newRoute === 'our-story') {
        document.title = "Our Story & Philosophy | Bekky's Touch Luxury Beauty";
      } else if (newRoute === 'contact') {
        document.title = "Contact Us | Bekky's Touch Beauty";
      } else if (newRoute === 'account') {
        document.title = "My Account | Bekky's Touch Beauty";
      } else {
        document.title = "Bekky's Touch — Luxury Beauty & Clean Cosmetics";
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleUpdateProductImage = async (productId: number, newImageUrl: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, image: newImageUrl } : p));
    setCart(prev => prev.map(item => item.id === productId ? { ...item, image: newImageUrl } : item));
    setSelectedProduct(prev => prev && prev.id === productId ? { ...prev, image: newImageUrl } : prev);

    try {
      const saved = localStorage.getItem('bekkys_touch_custom_images');
      const map = saved ? JSON.parse(saved) : {};
      map[productId] = newImageUrl;
      localStorage.setItem('bekkys_touch_custom_images', JSON.stringify(map));
    } catch (e) {
      console.warn('Failed to persist custom image to localStorage', e);
    }

    showToast('Product photo updated successfully!');
  };

  const handleUpdatePhilosophyImage = async (newImageUrl: string) => {
    setPhilosophyImage(newImageUrl);
    showToast('Our Philosophy & Craft photo updated successfully!');
  };

  const handleOpenUploadForProduct = (product: Product) => {
    setUploadModalTarget(product.id);
    setIsUploadModalOpen(true);
  };

  const parseCategoryFromHash = (hash: string): string | null => {
    if (!hash) return null;
    const clean = hash.replace(/^#\/?/, '').toLowerCase();

    if (clean.includes('category=')) {
      const match = clean.match(/category=([a-z]+)/);
      if (match && match[1]) {
        const cat = match[1].toUpperCase();
        if (['ALL', 'FACE', 'EYES', 'BROWS', 'LIPS', 'TOOLS'].includes(cat)) {
          return cat;
        }
      }
    }

    for (const cat of ['FACE', 'EYES', 'BROWS', 'LIPS', 'TOOLS']) {
      const lower = cat.toLowerCase();
      if (clean === lower || clean === `shop-${lower}` || clean === `category-${lower}`) {
        return cat;
      }
    }

    return null;
  };

  const handleSelectCategory = (cat: string) => {
    const upper = cat.toUpperCase();
    setSelectedCategory(upper);
    setSearchQuery('');
    navigate('home');

    if (upper === 'ALL') {
      window.history.pushState(null, '', '#shop');
    } else {
      window.history.pushState(null, '', `#shop?category=${upper.toLowerCase()}`);
    }

    setTimeout(() => {
      const el = document.getElementById('shop');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bekkys_touch_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bekkys_touch_orders', JSON.stringify(pastOrders));
    } catch (e) {
      console.warn('Failed to save orders to localStorage', e);
    }
  }, [pastOrders]);

  useEffect(() => { restoreUser().then(setCurrentUser); }, []);

  // Handle direct hash navigation to recovery link or specific section
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes('type=recovery') || hash.includes('reset-password')) {
        setAccountModalMode('update_password');
        setIsAccountOpen(true);
        return;
      }
      const cat = parseCategoryFromHash(hash);
      if (cat) {
        setSelectedCategory(cat);
        setTimeout(() => {
          const el = document.getElementById('shop');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (hash === '#shop' || hash === '#/shop') {
        setSelectedCategory('ALL');
        setTimeout(() => {
          const el = document.getElementById('shop');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleAddToCart = (product: Product, shade?: string, qty: number = 1) => {
    const selectedShade = shade || product.shade;

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.selectedShade === selectedShade
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedShade === selectedShade
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          image: product.shadeImages?.[selectedShade] || product.image,
          selectedShade,
          qty
        }
      ];
    });

    showToast(`Added ${qty} × ${product.name} to your bag`);
    setIsCartOpen(true);
  };

  const handleAddRoutineToCart = (routineItems: { product: Product; shade: string }[]) => {
    setCart((prev) => {
      let updated = [...prev];
      routineItems.forEach(({ product, shade }) => {
        const existing = updated.find(
          (item) => item.id === product.id && item.selectedShade === shade
        );
        if (existing) {
          updated = updated.map((item) =>
            item.id === product.id && item.selectedShade === shade
              ? { ...item, qty: item.qty + 1 }
              : item
          );
        } else {
          updated.push({
            ...product,
            image: product.shadeImages?.[shade] || product.image,
            selectedShade: shade,
            qty: 1
          });
        }
      });
      return updated;
    });

    const valid = ['WELCOME10', 'BEKKYTOUCH', 'GLOW20'];
    if (!appliedPromo || !valid.includes(appliedPromo)) {
      setAppliedPromo('BEKKYTOUCH');
    }

    setIsCartOpen(true);
    showToast('Radiant Routine items added to bag with special 15% discount applied!');
  };

  const handleUpdateQty = (productId: number, delta: number, shade?: string) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId && (!shade || item.selectedShade === shade)) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: number, shade?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === productId && (!shade || item.selectedShade === shade)))
    );
  };

  const handleApplyPromo = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    const valid = ['WELCOME10', 'BEKKYTOUCH', 'GLOW20'];
    if (valid.includes(clean)) {
      setAppliedPromo(clean);
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  const handleOrderSuccess = (order: CustomerOrder) => {
    setCompletedOrder(order);
    setPastOrders(prev => [order, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  const accountView = (
<AccountModal
        isOpen={currentRoute === 'account' || isAccountOpen}
        pageMode={currentRoute === 'account'}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        initialMode={accountModalMode}
        onSignIn={async (email, password) => {
          const user = await signIn(email, password);
          setCurrentUser(user);
          showToast(`Welcome back, ${user.name}!`);
        }}
        onSignUp={async (name, email, password) => {
          const res = await signUp(name, email, password);
          if (res && !res.requiresEmailConfirmation) {
            setCurrentUser({ email: res.email, name: res.name });
          }
          return res;
        }}
        onResetPassword={resetPassword}
        onUpdatePassword={async (password) => {
          const user = await updatePassword(password);
          setCurrentUser(user);
          showToast('Password updated successfully!');
          return user;
        }}
        onSignOut={() => {
          signOut();
          setCurrentUser(null);
          showToast('Signed out of account');
        }}
        pastOrders={pastOrders.filter(order => order.customer.email.toLowerCase() === currentUser?.email.toLowerCase())}
        products={products}
        wishlistIds={wishlistIds}
        onToggleWishlist={toggleWishlist}
        onAddToCart={handleAddToCart}
      />
  );

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 font-sans selection:bg-amber-900/10 selection:text-amber-900 flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAccount={() => {
          setAccountModalMode('signin');
          navigate('account');
        }}
        onOpenShadeFinder={() => navigate('shade-finder')}
        onOpenUploadModal={() => {
          setUploadModalTarget(null);
          setIsUploadModalOpen(true);
        }}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUser={currentUser}
        onNavigate={navigate}
        currentRoute={currentRoute}
      />

      {/* Main Page View Routing */}
      <main className="flex-1">
        {currentRoute === 'gifts-sets' ? (
          <GiftsSetsPage products={products} onShopAll={() => handleSelectCategory('ALL')} onAddSetToCart={(items) => { items.forEach(({ product, shade }) => handleAddToCart(product, shade)); setIsCartOpen(true); }} />
        ) : currentRoute === 'shade-finder' ? (
          <ShadeFinderModal isOpen pageMode onClose={() => navigate('home')} onAddRoutineToCart={handleAddRoutineToCart} products={products} />
        ) : currentRoute === 'our-story' ? (
          <OurStoryPage
            onNavigateHome={() => navigate('home')}
            onOpenShadeFinder={() => navigate('shade-finder')}
            onSelectCategory={handleSelectCategory}
          />
        ) : currentRoute === 'contact' ? (
          <ContactPage
            onNavigateHome={() => navigate('home')}
            onOpenShadeFinder={() => navigate('shade-finder')}
          />
        ) : currentRoute === 'account' ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="font-serif text-3xl text-center mb-8">My Account</h1>
            {accountView}
          </div>
        ) : (
          /* Default Storefront (Home) */
          <>
            {/* Cinematic Hero */}
            <Hero
              onOpenShadeFinder={() => navigate('shade-finder')}
              onExploreClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
            />

            {/* Core Values / Commitments */}
            <Values />

            {/* Main Catalogue Grid */}
            <ShopSection
              products={products}
              onSelectProduct={setSelectedProduct}
              onAddToCart={handleAddToCart}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onUploadPhoto={handleOpenUploadForProduct}
              onOpenUploadModal={() => {
                setUploadModalTarget(null);
                setIsUploadModalOpen(true);
              }}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              wishlistIds={wishlistIds}
              onToggleWishlist={toggleWishlist}
            />

            {/* Philosophy & Craft */}
            <PhilosophySection
              image={philosophyImage}
              onUploadPhoto={() => {
                setUploadModalTarget('philosophy');
                setIsUploadModalOpen(true);
              }}
            />

            {/* Verified Community Reviews */}
            <ReviewsSection />

            {/* VIP Beauty Club Newsletter */}
            <Newsletter
              onCopyPromo={(code) => {
                handleApplyPromo(code);
                showToast(`Code ${code} activated! Enjoy 10% off at checkout.`);
              }}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenShadeFinder={() => navigate('shade-finder')}
        onSelectCategory={handleSelectCategory}
        onNavigate={navigate}
      />

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct ? products.find(p => p.id === selectedProduct.id) || selectedProduct : null}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onUploadPhoto={handleOpenUploadForProduct}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={toggleWishlist}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        appliedPromo={appliedPromo}
        onOrderSuccess={handleOrderSuccess}
        currentUser={currentUser}
      />

      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />

      {currentRoute !== 'account' && accountView}

      {/* Exact Product & Philosophy Photo Uploader */}
      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        products={products}
        onUpdateProductImage={handleUpdateProductImage}
        onUpdatePhilosophyImage={handleUpdatePhilosophyImage}
        philosophyImage={philosophyImage}
        initialTarget={uploadModalTarget}
      />

      {/* Notification Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client using public environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  badge?: string;
  shade?: string;
}

interface CartItem extends Product {
  qty: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  // Modal States
  const [storyOpen, setStoryOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Auth States
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);

  // Form States
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postcode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = ['ALL', 'LIPS', 'EYES', 'FACE', 'SKINCARE'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === 'ALL' ||
      p.category.toUpperCase() === activeCategory.toUpperCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    triggerNotice(`Added ${product.name} to bag`);
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const triggerNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 4.95;
  const total = subtotal + shipping;
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setOrderError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          paymentMethod,
          items: cart,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      setOrderComplete(data.orderId);
      setCart([]);
    } catch (err: any) {
      setOrderError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        triggerNotice('Thank you for subscribing!');
        setNewsletterEmail('');
      } else {
        triggerNotice(data.error || 'Subscription failed.');
      }
    } catch (err) {
      triggerNotice('Subscription failed. Please try again.');
    }
  };

  // REAL SUPABASE AUTHENTICATION SUBMIT
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === 'signup') {
      const nameParts = authName.trim().split(' ');
      const firstName = nameParts[0] || authName;
      const lastName = nameParts.slice(1).join(' ') || '';

      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        triggerNotice(`Sign Up Error: ${error.message}`);
        return;
      }

      triggerNotice('Account created! Check profiles table in Supabase.');
      setUser({ email: authEmail, name: firstName });
      setAuthOpen(false);
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      });

      if (error) {
        triggerNotice(`Sign In Error: ${error.message}`);
        return;
      }

      triggerNotice('Signed in successfully!');
      setUser({ email: authEmail, name: data.user?.email });
      setAuthOpen(false);
    }
  };

  return (
    <main>
      {notice && <div className="toast">{notice}</div>}

      <div className="announcement">
        Complimentary UK Express Shipping on Orders Over £50
      </div>

      <header>
        <Link href="/" className="brand">
          BEKKY'S<span>TOUCH</span>
        </Link>

        <nav>
          <a href="#shop">Shop</a>
          <button className="nav-btn" onClick={() => setStoryOpen(true)}>
            Our story
          </button>
          <button className="nav-btn" onClick={() => setContactOpen(true)}>
            Contact
          </button>
        </nav>

        <div className="header-actions">
          <button
            className="icon-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            ⌕
          </button>
          <button
            className="nav-btn"
            onClick={() => setAuthOpen(true)}
            style={{ fontSize: '13px' }}
          >
            {user ? `Hi, ${user.name || user.email.split('@')[0]}` : 'Account'}
          </button>
          <button
            className="bag-btn"
            onClick={() => setCartOpen(true)}
            aria-label={`Shopping bag with ${count} items`}
          >
            Bag <span>{count}</span>
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="search-wrap">
          <input
            type="text"
            placeholder="Search products, shades, formulas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button onClick={() => setSearchOpen(false)}>✕</button>
        </div>
      )}

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">ELEVATED BEAUTY ESSENTIALS</p>
          <h1>
            Enhance your <em>natural elegance</em>
          </h1>
          <p>
            Thoughtfully crafted formulas designed to bring out your inner confidence. 
            Cruelty-free, radiant, and tailored for every skin tone.
          </p>
          <a href="#shop" className="primary">
            EXPLORE COLLECTION →
          </a>
          <p className="proof">
            <span>★★★★★</span> Loved by thousands across the UK
          </p>
        </div>
        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop"
            alt="Bekky's Touch luxury beauty setup"
          />
          <div className="hero-card">
            <span>FEATURED FORMULA</span>
            <strong>Velvet Lip Oil</strong>
            <small>Deep hydration with a glassy finish</small>
          </div>
        </div>
      </section>

      <section id="shop" className="shop">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CURATED COLLECTION</p>
            <h2>Bestselling Formulas</h2>
          </div>
          <p>Handcrafted, high-performance cosmetics engineered for seamless everyday wear.</p>
        </div>

        <div className="filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={activeCategory === cat ? 'active' : ''}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="empty">Loading collection...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty">No products found matching your selection.</div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((p) => (
              <div key={p.id} className="product">
                <div className="product-image">
                  <img src={p.image} alt={p.name} />
                  {p.badge && <span className="badge">{p.badge}</span>}
                  <button className="quick-add" onClick={() => addToCart(p)}>
                    + QUICK ADD
                  </button>
                </div>
                <div className="product-info">
                  <p className="category">{p.category}</p>
                  <h3>{p.name}</h3>
                  {p.shade && <p className="shade">{p.shade}</p>}
                  <div>
                    <strong>£{p.price.toFixed(2)}</strong>
                    <button onClick={() => addToCart(p)} aria-label={`Add ${p.name} to cart`}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="values">
        <div>
          <span>✦</span>
          <h3>Cruelty-Free</h3>
          <p>Never tested on animals. Ethical beauty from formulation to packaging.</p>
        </div>
        <div>
          <span>✦</span>
          <h3>Inclusive Shades</h3>
          <p>Formulated to complement every skin tone seamlessly.</p>
        </div>
        <div>
          <span>✦</span>
          <h3>Premium Quality</h3>
          <p>Enriched with nourishing skin-first ingredients for all-day comfort.</p>
        </div>
      </section>

      <section className="newsletter">
        <div>
          <p className="eyebrow">JOIN THE CLUB</p>
          <h2>Unlock 10% Off Your First Order</h2>
          <p>Subscribe for exclusive early access to launches and beauty tips.</p>
        </div>
        <form onSubmit={handleNewsletterSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            required
          />
          <button type="submit">JOIN</button>
        </form>
      </section>

      <footer>
        <p>BEKKY'S TOUCH BEAUTY</p>
        <div>
          <a href="#shop">Shop All</a>
          <button className="nav-btn" onClick={() => setStoryOpen(true)}>
            Our Story
          </button>
          <button className="nav-btn" onClick={() => setContactOpen(true)}>
            Contact Us
          </button>
        </div>
        <small>© {new Date().getFullYear()} Bekky's Touch. All rights reserved.</small>
      </footer>

      {/* Cart Drawer */}
      {cartOpen && (
        <>
          <div className="backdrop" onClick={() => setCartOpen(false)} />
          <aside className="cart">
            <div className="cart-head">
              <div>
                <p className="eyebrow">YOUR SELECTION</p>
                <h2>Shopping Bag ({count})</h2>
              </div>
              <button onClick={() => setCartOpen(false)}>✕</button>
            </div>

            <div className="delivery">
              <p>
                {subtotal >= 50
                  ? ' You qualify for FREE UK Express Delivery!'
                  : `Add £${(50 - subtotal).toFixed(2)} more for FREE Express Delivery`}
              </p>
              <div>
                <i style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }} />
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <span>🛍</span>
                <h3>Your bag is empty</h3>
                <p>Explore our bestsellers to find your new favorites.</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <h3>{item.name}</h3>
                        {item.shade && <p>{item.shade}</p>}
                        <div className="qty">
                          <button onClick={() => updateQty(item.id, -1)}>-</button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)}>+</button>
                        </div>
                      </div>
                      <strong>£{(item.price * item.qty).toFixed(2)}</strong>
                    </div>
                  ))}
                </div>

                <div className="cart-total">
                  <div>
                    <p>Subtotal</p>
                    <strong>£{subtotal.toFixed(2)}</strong>
                  </div>
                  <div>
                    <p>Estimated Delivery</p>
                    <strong>{shipping === 0 ? 'FREE' : `£${shipping.toFixed(2)}`}</strong>
                  </div>
                  <button
                    className="checkout"
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                  >
                    PROCEED TO CHECKOUT <span>£{total.toFixed(2)} →</span>
                  </button>
                  <small>Taxes calculated at checkout</small>
                </div>
              </>
            )}
          </aside>
        </>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <>
          <div className="backdrop" onClick={() => setCheckoutOpen(false)} />
          <section className="checkout-modal">
            <button className="modal-close" onClick={() => setCheckoutOpen(false)}>
              ✕
            </button>
            {orderComplete ? (
              <div className="order-success">
                <span>✓</span>
                <h2>Thank You for Your Order!</h2>
                <p>Your order has been placed successfully.</p>
                <div>
                  <small>ORDER REFERENCE</small>
                  <strong>#{orderComplete}</strong>
                </div>
                <button
                  className="checkout"
                  onClick={() => {
                    setCheckoutOpen(false);
                    setOrderComplete(null);
                  }}
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : (
              <>
                <p className="eyebrow">FINAL STEP</p>
                <h2>Checkout</h2>
                <div className="checkout-summary">
                  <span>
                    Total Items: <strong>{count}</strong>
                  </span>
                  <span>
                    Total Amount: <strong>£{total.toFixed(2)}</strong>
                  </span>
                </div>

                {orderError && <p className="checkout-error">{orderError}</p>}

                <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
                  <label className="wide">
                    Full Name
                    <input
                      required
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="Jane Doe"
                    />
                  </label>
                  <label className="wide">
                    Email Address
                    <input
                      required
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="jane@example.com"
                    />
                  </label>
                  <label className="wide">
                    Delivery Address
                    <input
                      required
                      type="text"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      placeholder="123 Beauty Lane"
                    />
                  </label>
                  <label>
                    City
                    <input
                      required
                      type="text"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="London"
                    />
                  </label>
                  <label>
                    Postcode
                    <input
                      required
                      type="text"
                      value={customer.postcode}
                      onChange={(e) => setCustomer({ ...customer, postcode: e.target.value })}
                      placeholder="SW1A 1AA"
                    />
                  </label>

                  <div className="wide">
                    <fieldset className="payment-methods">
                      <legend>Payment Method</legend>
                      <label className={paymentMethod === 'card' ? 'selected' : ''}>
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Card
                      </label>
                      <label className={paymentMethod === 'apple' ? 'selected' : ''}>
                        <input
                          type="radio"
                          name="payment"
                          value="apple"
                          checked={paymentMethod === 'apple'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Apple Pay
                      </label>
                      <label className={paymentMethod === 'klarna' ? 'selected' : ''}>
                        <input
                          type="radio"
                          name="payment"
                          value="klarna"
                          checked={paymentMethod === 'klarna'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Klarna
                      </label>
                    </fieldset>
                  </div>

                  <button className="checkout wide" type="submit" disabled={submitting}>
                    {submitting ? 'PROCESSING...' : `PAY £${total.toFixed(2)}`}
                  </button>
                  <p className="payment-note wide">
                    🔒 Demo Checkout - No actual payment will be charged.
                  </p>
                </form>
              </>
            )}
          </section>
        </>
      )}

      {/* Auth Modal */}
      {authOpen && (
        <>
          <div className="backdrop" onClick={() => setAuthOpen(false)} />
          <section className="checkout-modal" role="dialog" aria-modal="true">
            <button
              className="modal-close"
              onClick={() => setAuthOpen(false)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <p className="eyebrow">
              {authMode === 'login' ? 'WELCOME BACK' : 'CREATE AN ACCOUNT'}
            </p>
            <h2>{authMode === 'login' ? 'Sign In' : 'Register'}</h2>

            <form className="checkout-form" onSubmit={handleAuthSubmit}>
              {authMode === 'signup' && (
                <label className="wide">
                  Full Name
                  <input
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Bekky Smith"
                  />
                </label>
              )}
              <label className="wide">
                Email Address
                <input
                  required
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <label className="wide">
                Password
                <input
                  required
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </label>

              <button
                className="checkout wide"
                style={{ justifyContent: 'center', marginTop: '1rem' }}
              >
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p
              style={{
                marginTop: '1.5rem',
                textAlign: 'center',
                fontSize: '12px',
                color: 'var(--muted)',
              }}
            >
              {authMode === 'login'
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                onClick={() =>
                  setAuthMode(authMode === 'login' ? 'signup' : 'login')
                }
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--wine)',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {authMode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </section>
        </>
      )}

      {/* Our Story Modal */}
      {storyOpen && (
        <>
          <div className="backdrop" onClick={() => setStoryOpen(false)} />
          <section className="checkout-modal" role="dialog" aria-modal="true">
            <button
              className="modal-close"
              onClick={() => setStoryOpen(false)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <p className="eyebrow">OUR HERITAGE</p>
            <h2>Our Story</h2>
            <p style={{ lineHeight: '1.8', color: 'var(--muted)', marginTop: '15px' }}>
              Founded with a passion for clean, effortless beauty, Bekky's Touch was created
              to bring out your authentic radiance. Every formula is meticulously developed
              to nourish your skin while offering rich, long-lasting pigments suitable for
              all skin tones.
            </p>
            <p style={{ lineHeight: '1.8', color: 'var(--muted)', marginTop: '15px' }}>
              We believe luxury beauty should be accessible, cruelty-free, and empowering.
            </p>
            <button
              className="checkout wide"
              onClick={() => setStoryOpen(false)}
              style={{ justifyContent: 'center', marginTop: '25px' }}
            >
              CLOSE
            </button>
          </section>
        </>
      )}

      {/* Contact Modal */}
      {contactOpen && (
        <>
          <div className="backdrop" onClick={() => setContactOpen(false)} />
          <section className="checkout-modal" role="dialog" aria-modal="true">
            <button
              className="modal-close"
              onClick={() => setContactOpen(false)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <p className="eyebrow">GET IN TOUCH</p>
            <h2>Contact Us</h2>
            <p style={{ lineHeight: '1.8', color: 'var(--muted)', marginTop: '15px' }}>
              Have questions about your order or need product recommendations? We are here to help!
            </p>
            <div style={{ marginTop: '20px', fontSize: '14px', lineHeight: '2' }}>
              <p>
                <strong>Email Support:</strong> support@bekkystouch.com
              </p>
              <p>
                <strong>Hours:</strong> Mon – Fri, 9am – 5pm GMT
              </p>
              <p>
                <strong>Response Time:</strong> Within 24 hours
              </p>
            </div>
            <button
              className="checkout wide"
              onClick={() => setContactOpen(false)}
              style={{ justifyContent: 'center', marginTop: '25px' }}
            >
              CLOSE
            </button>
          </section>
        </>
      )}
    </main>
  );
}

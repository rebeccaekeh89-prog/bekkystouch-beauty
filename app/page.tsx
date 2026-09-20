"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Product = { id: number; name: string; category: string; price: number; shade: string; image: string; badge?: string };

const fallbackProducts: Product[] = [
  { id: 1, name: "Second Skin Foundation", category: "Face", price: 28, shade: "18 inclusive shades", badge: "Bestseller", image: "https://images.unsplash.com/photo-1631214540242-7b89d70be148?auto=format&fit=crop&w=800&q=85" },
  { id: 2, name: "Cloud Blush", category: "Face", price: 18, shade: "Rose Muse", image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=85" },
  { id: 3, name: "Brighten Concealer", category: "Face", price: 20, shade: "12 flexible shades", image: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=800&q=85" },
  { id: 4, name: "Sculpt & Glow Duo", category: "Face", price: 24, shade: "Deep Cocoa", badge: "New", image: "https://images.unsplash.com/photo-1590156206657-a214af94a395?auto=format&fit=crop&w=800&q=85" },
  { id: 5, name: "Velvet Eyeshadow Palette", category: "Eyes", price: 34, shade: "Golden Hour", badge: "Limited", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=85" },
  { id: 6, name: "Precision Liquid Liner", category: "Eyes", price: 15, shade: "Midnight Black", image: "https://images.unsplash.com/photo-1631730359585-38a4935cbec4?auto=format&fit=crop&w=800&q=85" },
  { id: 7, name: "Lift & Length Mascara", category: "Eyes", price: 17, shade: "Soft Black", image: "https://images.unsplash.com/photo-1591360236480-4ed861025fa1?auto=format&fit=crop&w=800&q=85" },
  { id: 8, name: "Sculpting Brow Pencil", category: "Brows", price: 14, shade: "Espresso", image: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=800&q=85" },
  { id: 9, name: "Feather Hold Brow Gel", category: "Brows", price: 16, shade: "Clear", badge: "Viral", image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=800&q=85" },
  { id: 10, name: "Satin Kiss Lipstick", category: "Lips", price: 19, shade: "Burgundy Bloom", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=85" },
  { id: 11, name: "Glass Lip Oil", category: "Lips", price: 17, shade: "Honey Nude", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=85" },
  { id: 12, name: "Flawless Finish Brush", category: "Tools", price: 22, shade: "Vegan fibres", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=85" },
];

const categories = ["All", "Face", "Eyes", "Brows", "Lips", "Tools"];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [catalogueStatus, setCatalogueStatus] = useState<"loading" | "live" | "fallback">("loading");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [customer, setCustomer] = useState({ customer_name: "", email: "", phone: "", address: "", city: "", postcode: "" });

  useEffect(() => {
    fetch("/api/products")
      .then(async (response) => {
        if (!response.ok) throw new Error("Catalogue unavailable");
        return response.json();
      })
      .then((data: Product[]) => {
        if (Array.isArray(data) && data.length) {
          setProducts(data.map((product) => ({ ...product, price: Number(product.price) })));
          setCatalogueStatus("live");
        } else {
          setCatalogueStatus("fallback");
        }
      })
      .catch(() => setCatalogueStatus("fallback"));
  }, []);

  async function subscribeNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      if (!response.ok) {
        throw new Error("Newsletter signup failed");
      }

      setNotice("Welcome to the Bekkystouch inner circle!");
      setNewsletterEmail("");
    } catch {
      setNotice("Sorry, we couldn't subscribe you. Please try again.");
    }
  }

  const filtered = products.filter((p) => (category === "All" || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase()));
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = useMemo(() => products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0), [cart]);

  function add(product: Product) {
    setCart((c) => ({ ...c, [product.id]: (c[product.id] || 0) + 1 }));
    setNotice(`${product.name} added to your bag`);
    setTimeout(() => setNotice(""), 2200);
  }

  function update(id: number, delta: number) {
    setCart((c) => {
      const next = Math.max(0, (c[id] || 0) + delta);
      const copy = { ...c, [id]: next };
      if (!next) delete copy[id];
      return copy;
    });
  }

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setCheckoutError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...customer,
          payment_method: `${paymentMethod} (demo)`,
          items: Object.entries(cart).map(([product_id, quantity]) => ({ product_id: Number(product_id), quantity })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not place your order.");
      setOrderNumber(result.order_id);
      setCart({});
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "We could not place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <div className="announcement">Complimentary UK delivery on every order</div>
      <header>
        <a className="brand" href="#top" aria-label="Bekkystouch home">BEKKY<span>STOUCH</span></a>
        <nav aria-label="Main navigation">
          <a href="#shop">Shop</a>
          <button onClick={() => setAboutOpen(true)} className="nav-btn">Our story</button>
          <button onClick={() => setContactOpen(true)} className="nav-btn">Contact</button>
        </nav>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">⌕</button>
          <button className="bag-btn" onClick={() => setCartOpen(true)} aria-label={`Shopping bag with ${count} items`}>Bag <span>{count}</span></button>
        </div>
        {searchOpen && (
          <div className="search-wrap">
            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your beauty essentials…" aria-label="Search products" />
            <button onClick={() => { setSearch(""); setSearchOpen(false); }}>Close</button>
          </div>
        )}
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">MAKEUP THAT MEETS YOU</p>
          <h1>Your beauty.<br/><em>Your way.</em></h1>
          <p>Thoughtfully made colour, effortless formulas and shades designed to celebrate every complexion.</p>
          <a className="primary" href="#shop">Shop the collection <span>→</span></a>
          <div className="proof"><span>★★★★★</span> Loved by 2,000+ beauty lovers</div>
        </div>
        <div className="hero-visual" role="img" aria-label="Luxury makeup products on a warm neutral background">
          <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=90" alt="A curated collection of luxury makeup products" />
          <div className="hero-card"><span>NEW</span><strong>The Golden Hour Edit</strong><small>Glow from every angle</small></div>
        </div>
      </section>

      <section className="shop" id="shop">
        <div className="section-heading">
          <div><p className="eyebrow">CURATED FOR YOU</p><h2>Find your essentials</h2></div>
          <p>High-performance makeup that feels as good as it looks.{catalogueStatus === "loading" && <span className="catalogue-note"> Updating…</span>}</p>
        </div>
        <div className="filters" role="tablist" aria-label="Product categories">
          {categories.map((c) => (
            <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)} role="tab" aria-selected={category === c}>{c}</button>
          ))}
        </div>
        <div className="product-grid">
          {filtered.map((p) => (
            <article className="product" key={p.id}>
              <div className="product-image">
                <img src={p.image} alt={p.name} loading="lazy" />
                {p.badge && <span className="badge">{p.badge}</span>}
                <button className="quick-add" onClick={() => add(p)}>Quick add</button>
              </div>
              <div className="product-info">
                <p className="category">{p.category}</p>
                <h3>{p.name}</h3>
                <p className="shade">{p.shade}</p>
                <div>
                  <strong>£{p.price.toFixed(2)}</strong>
                  <button onClick={() => add(p)} aria-label={`Add ${p.name} to bag`}>＋</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!filtered.length && <div className="empty">No products found. Try another search.</div>}
      </section>

      <section className="values" id="story">
        <div><span>◇</span><h3>Made for every shade</h3><p>Flexible formulas created to flatter a beautiful spectrum of skin tones.</p></div>
        <div><span>♧</span><h3>Consciously crafted</h3><p>Vegan-friendly, cruelty-free essentials with considered packaging.</p></div>
        <div><span>✦</span><h3>Beauty made simple</h3><p>Easy-to-use products that earn their place in your everyday routine.</p></div>
      </section>

      <section className="newsletter" id="newsletter">
        <div>
          <p className="eyebrow">JOIN THE INNER CIRCLE</p>
          <h2>A little beauty in your inbox</h2>
          <p>Get 10% off your first order, plus product drops, tips and exclusive offers.</p>
        </div>
        <form onSubmit={subscribeNewsletter}>
          <input type="email" required value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Your email address" aria-label="Email address"/>
          <button>Get 10% off</button>
        </form>
      </section>

      <footer>
        <a className="brand" href="#top">BEKKY<span>STOUCH</span></a>
        <p>Beauty that feels like you.</p>
        <div>
          <a href="#shop">Shop</a>
          <button onClick={() => setAboutOpen(true)} className="nav-btn">About</button>
          <button onClick={() => setContactOpen(true)} className="nav-btn">Contact</button>
        </div>
        <small>© 2026 Bekkystouch. All rights reserved.</small>
      </footer>

      {notice && <div className="toast" role="status">✓ {notice}</div>}

      {cartOpen && (
        <>
          <div className="backdrop" onClick={() => setCartOpen(false)} />
          <aside className="cart" aria-label="Shopping bag">
            <div className="cart-head">
              <div><p className="eyebrow">YOUR SELECTION</p><h2>Shopping bag ({count})</h2></div>
              <button onClick={() => setCartOpen(false)} aria-label="Close bag">×</button>
            </div>
            {count === 0 ? (
              <div className="cart-empty">
                <span>◇</span><h3>Your bag is waiting</h3><p>Discover something beautiful to add.</p>
                <button className="primary" onClick={() => setCartOpen(false)}>Start shopping</button>
              </div>
            ) : (
              <>
                <div className="delivery"><p>Free UK delivery included</p><div><i style={{ width: "100%" }} /></div></div>
                <div className="cart-items">
                  {products.filter((p) => cart[p.id]).map((p) => (
                    <div className="cart-item" key={p.id}>
                      <img src={p.image} alt=""/>
                      <div>
                        <h3>{p.name}</h3><p>{p.shade}</p>
                        <div className="qty">
                          <button onClick={() => update(p.id, -1)}>−</button>
                          <span>{cart[p.id]}</span>
                          <button onClick={() => update(p.id, 1)}>＋</button>
                        </div>
                      </div>
                      <strong>£{(p.price * cart[p.id]).toFixed(2)}</strong>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <div><span>Total</span><strong>£{subtotal.toFixed(2)}</strong></div>
                  <p>Free UK delivery</p>
                  <button className="checkout" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>Continue to demo checkout <span>→</span></button>
                  <small>Your demonstration order is stored in Supabase.</small>
                </div>
              </>
            )}
          </aside>
        </>
      )}

      {checkoutOpen && (
        <>
          <div className="backdrop" onClick={() => !submitting && setCheckoutOpen(false)} />
          <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
            <button className="modal-close" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout">×</button>
            {orderNumber ? (
              <div className="order-success">
                <span>✓</span><p className="eyebrow">DEMO PAYMENT SUCCESSFUL</p>
                <h2 id="checkout-title">Thank you for your order</h2>
                <p>Your demonstration order has been saved in Supabase. No money was charged.</p>
                <div><small>Order reference</small><strong>{orderNumber.slice(0, 8).toUpperCase()}</strong></div>
                <button className="checkout" onClick={() => { setCheckoutOpen(false); setOrderNumber(""); }}>Continue shopping</button>
              </div>
            ) : (
              <>
                <p className="eyebrow">PROJECT DEMO CHECKOUT</p>
                <h2 id="checkout-title">Complete your order</h2>
                <div className="demo-banner">Demo only — no real payment or card details are collected.</div>
                <div className="checkout-summary"><span>{count} {count === 1 ? "item" : "items"} · Free delivery</span><strong>£{subtotal.toFixed(2)}</strong></div>
                <form className="checkout-form" onSubmit={placeOrder}>
                  <label>Full name<input required autoComplete="name" value={customer.customer_name} onChange={(e) => setCustomer({ ...customer, customer_name: e.target.value })}/></label>
                  <label>Email address<input required type="email" autoComplete="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })}/></label>
                  <label>Phone number <small>(optional)</small><input type="tel" autoComplete="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}/></label>
                  <label className="wide">Delivery address<input required autoComplete="street-address" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })}/></label>
                  <label>Town or city<input required autoComplete="address-level2" value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })}/></label>
                  <label>Postcode<input required autoComplete="postal-code" value={customer.postcode} onChange={(e) => setCustomer({ ...customer, postcode: e.target.value })}/></label>
                  <fieldset className="payment-methods wide">
                    <legend>Demo payment method</legend>
                    {["Card", "Apple Pay", "PayPal"].map((method) => (
                      <label key={method} className={paymentMethod === method ? "selected" : ""}>
                        <input type="radio" name="payment-method" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)}/>
                        <span>{method}</span>
                      </label>
                    ))}
                  </fieldset>
                  {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}
                  <button className="checkout wide" disabled={submitting}>{submitting ? "Processing demo payment…" : `Pay £${subtotal.toFixed(2)} (demo)`}</button>
                  <p className="payment-note wide">This simulates a successful online payment for demonstration purposes only.</p>
                </form>
              </>
            )}
          </section>
        </>
      )}

      {/* About Us Modal */}
      {aboutOpen && (
        <>
          <div className="backdrop" onClick={() => setAboutOpen(false)} />
          <section className="checkout-modal" role="dialog" aria-modal="true">
            <button className="modal-close" onClick={() => setAboutOpen(false)} aria-label="Close about us">×</button>
            <p className="eyebrow">OUR STORY</p>
            <h2>About Bekky’s Touch</h2>
            <p style={{ marginTop: "1rem", lineHeight: "1.6" }}>
              Bekky’s Touch was created to celebrate individuality and true beauty. We craft high-performance, inclusive makeup essentials designed to compliment every skin tone effortlessly.
            </p>
            <p style={{ marginTop: "1rem", lineHeight: "1.6" }}>
              Our products are 100% vegan-friendly, cruelty-free, and carefully formatted to ensure seamless application for your everyday makeup routine.
            </p>
            <button className="checkout wide" style={{ marginTop: "2rem" }} onClick={() => setAboutOpen(false)}>
              Close
            </button>
          </section>
        </>
      )}

      {/* Contact Us Modal */}
      {contactOpen && (
        <>
          <div className="backdrop" onClick={() => setContactOpen(false)} />
          <section className="checkout-modal" role="dialog" aria-modal="true">
            <button className="modal-close" onClick={() => setContactOpen(false)} aria-label="Close contact us">×</button>
            <p className="eyebrow">GET IN TOUCH</p>
            <h2>Contact Us</h2>
            <p style={{ marginTop: "1rem", lineHeight: "1.6" }}>
              Have questions about your order or need product recommendations? We are here to help!
            </p>
            <div style={{ marginTop: "1.5rem", background: "#f9f6f0", padding: "1.25rem", borderRadius: "8px" }}>
              <p style={{ margin: "0 0 0.5rem 0" }}><strong>Email Support:</strong> support@bekkystouch.com</p>
              <p style={{ margin: "0 0 0.5rem 0" }}><strong>Hours:</strong> Mon – Fri, 9am – 5pm GMT</p>
              <p style={{ margin: 0 }}><strong>Response Time:</strong> Within 24 hours</p>
            </div>
            <button className="checkout wide" style={{ marginTop: "2rem" }} onClick={() => setContactOpen(false)}>
              Close
            </button>
          </section>
        </>
      )}
    </main>
  );
}

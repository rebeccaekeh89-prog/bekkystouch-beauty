// Server-side Vercel Function. Never expose SUPABASE_SECRET_KEY in VITE_ variables.
export default async function handler(req, res) {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return res.status(503).json({ error: 'Order service is not configured yet.' });
  }

  // GET: Securely retrieve orders for the signed-in customer only
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required to view orders.' });
    }

    const token = authHeader.replace(/^Bearer\s+/, '').trim();
    if (!token) {
      return res.status(401).json({ error: 'Invalid authentication token.' });
    }

    try {
      // 1. Authenticate user against Supabase Auth endpoint
      const pubKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || key;
      const userRes = await fetch(`${url}/auth/v1/user`, {
        headers: { apikey: pubKey, Authorization: `Bearer ${token}` }
      });

      if (!userRes.ok) {
        return res.status(401).json({ error: 'Session expired or invalid.' });
      }

      const authUser = await userRes.json();
      const customerEmail = authUser.email;
      if (!customerEmail) {
        return res.status(400).json({ error: 'User email not found.' });
      }

      // 2. Query orders strictly filtered to this verified customer's email
      const headers = { apikey: key, Authorization: `Bearer ${key}` };
      let ordersRes = await fetch(
        `${url}/rest/v1/studio_orders?email=ilike.${encodeURIComponent(customerEmail)}&order=created_at.desc`,
        { headers, cache: 'no-store' }
      );

      if (!ordersRes.ok) {
        ordersRes = await fetch(
          `${url}/rest/v1/bt_orders?email=ilike.${encodeURIComponent(customerEmail)}&order=created_at.desc`,
          { headers, cache: 'no-store' }
        );
      }

      if (!ordersRes.ok) {
        return res.status(200).json({ orders: [] });
      }

      const rawOrders = await ordersRes.json();
      return res.status(200).json({ orders: Array.isArray(rawOrders) ? rawOrders : [] });
    } catch (err) {
      console.error('Fetch customer orders error:', err);
      return res.status(500).json({ error: 'Could not load your orders.' });
    }
  }

  // POST: Create a new order
  if (req.method === 'POST') {
    const order = req.body || {};
    const text = field => String(order[field] || '').trim();
    const name = text('customer_name');
    const email = text('email');
    const phone = text('phone');
    const address = text('address');
    const city = text('city');
    const postcode = text('postcode');
    const items = order.items;

    if (name.length < 2 || name.length > 120 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 ||
        phone.length < 5 || phone.length > 40 || address.length < 4 || address.length > 250 ||
        city.length < 2 || city.length > 100 || postcode.length < 4 || postcode.length > 20 ||
        !Array.isArray(items) || items.length < 1 || items.length > 30) {
      return res.status(400).json({ error: 'Please complete all required order details.' });
    }

    const ids = [...new Set(items.map(item => Number(item.product_id)))];
    if (items.some(item => !Number.isSafeInteger(Number(item.product_id)) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20 || String(item.shade || '').length > 80)) {
      return res.status(400).json({ error: 'Invalid order item.' });
    }

    const headers = { apikey: key, 'Content-Type': 'application/json' };
    try {
      let catalogResponse = await fetch(`${url}/rest/v1/bt_products?select=id,name,price&id=in.(${ids.join(',')})`, { headers, cache: 'no-store' });
      if (!catalogResponse.ok) {
        catalogResponse = await fetch(`${url}/rest/v1/studio_products?select=id,name,price&active=eq.true&id=in.(${ids.join(',')})`, { headers, cache: 'no-store' });
      }
      if (!catalogResponse.ok) throw new Error('Catalog unavailable');
      const products = new Map((await catalogResponse.json()).map(p => [p.id, p]));
      if (products.size !== ids.length) return res.status(400).json({ error: 'An item is no longer available.' });

      let subtotal = 0;
      const cleanItems = items.map(item => {
        const p = products.get(Number(item.product_id));
        const price = Number(p.price);
        if (!Number.isFinite(price) || price < 0) throw new Error('Invalid catalog price');
        subtotal += price * item.quantity;
        return { product_id: p.id, name: p.name, unit_price: price, quantity: item.quantity, shade: String(item.shade || '') };
      });

      if (subtotal > 10000) return res.status(400).json({ error: 'Order is too large.' });

      const promo = String(order.promo_code || '').trim().toUpperCase();
      const rates = { WELCOME10: .10, BEKKYTOUCH: .15, GLOW20: .20 };
      if (promo && !Object.hasOwn(rates, promo)) return res.status(400).json({ error: 'Invalid promo code.' });
      const discount = Math.round(subtotal * (rates[promo] || 0) * 100) / 100;
      const total = Math.round((subtotal - discount) * 100) / 100;

      let saved = await fetch(`${url}/rest/v1/studio_orders?select=id`, {
        method: 'POST', headers: { ...headers, Prefer: 'return=representation' },
        body: JSON.stringify({ customer_name: name, email, phone, address, city, postcode, items: cleanItems,
          subtotal, discount, total, promo_code: promo || null, payment_method: 'offline', status: 'pending' })
      });
      if (!saved.ok) {
        saved = await fetch(`${url}/rest/v1/bt_orders?select=id`, {
          method: 'POST', headers: { ...headers, Prefer: 'return=representation' },
          body: JSON.stringify({ customer_name: name, email, phone, address, city, postcode, items: cleanItems,
            subtotal, discount, total, promo_code: promo || null, payment_method: 'offline', status: 'pending' })
        });
      }
      if (!saved.ok) throw new Error('Order save failed');
      const [row] = await saved.json();
      return res.status(201).json({ orderId: row.id, subtotal, discount, total });
    } catch (error) {
      console.error('Order endpoint error', error);
      return res.status(503).json({ error: 'Checkout is temporarily unavailable.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

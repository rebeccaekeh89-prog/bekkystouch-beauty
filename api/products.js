export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return res.status(503).json({ error: 'Catalogue is not configured yet.' });

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`
  };

  try {
    // 1. Fetch from bt_products first as it contains the image column for products (Cloud Blush, Brighten Concealer, etc.)
    let response = await fetch(`${url}/rest/v1/bt_products?select=*`, {
      headers,
      cache: 'no-store'
    });

    // 2. Fallback to studio_products if bt_products is not present
    if (!response.ok) {
      response = await fetch(`${url}/rest/v1/studio_products?select=*`, {
        headers,
        cache: 'no-store'
      });
    }

    if (!response.ok) {
      return res.status(503).json({ error: 'Catalogue is temporarily unavailable.' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Failed to retrieve products from Supabase:', err);
    return res.status(503).json({ error: 'Catalogue is temporarily unavailable.' });
  }
}

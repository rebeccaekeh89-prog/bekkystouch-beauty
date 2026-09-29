export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const email = String(req.body?.email || '').trim();
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) return res.status(400).json({ error: 'Enter a valid email address.' });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return res.status(503).json({ error: 'Newsletter is not configured yet.' });
  try {
    const result = await fetch(`${url}/rest/v1/newsletter_subscribers`, {
      method: 'POST',
      headers: { apikey: key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ email, status: 'subscribed' })
    });
    if (!result.ok) return res.status(503).json({ error: 'Could not subscribe. Please try again.' });
    return res.status(201).json({ success: true });
  } catch {
    return res.status(503).json({ error: 'Newsletter is temporarily unavailable.' });
  }
}

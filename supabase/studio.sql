-- Run this migration in the existing Supabase project's SQL editor before deploying checkout.
-- These tables are separate from the previous site's bt_* tables.
CREATE TABLE IF NOT EXISTS public.studio_products (
  id integer PRIMARY KEY,
  name text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  active boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS public.studio_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  postcode text NOT NULL,
  items jsonb NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  discount numeric(10,2) NOT NULL,
  total numeric(10,2) NOT NULL,
  promo_code text,
  payment_method text NOT NULL DEFAULT 'offline',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.studio_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_orders ENABLE ROW LEVEL SECURITY;
-- Public catalog browsing; orders have no public read policy.
DROP POLICY IF EXISTS "Studio product browse" ON public.studio_products;
CREATE POLICY "Studio product browse" ON public.studio_products FOR SELECT TO anon, authenticated USING (active);
INSERT INTO public.studio_products (id, name, price, active) VALUES
(1, 'Second Skin Foundation', 28.0, true),
(2, 'Cloud Blush', 18.0, true),
(3, 'Brighten Concealer', 20.0, true),
(4, 'Sculpt & Glow Duo', 24.0, true),
(5, 'Velvet Eyeshadow Palette', 34.0, true),
(6, 'Precision Liquid Liner', 15.0, true),
(7, 'Lift & Length Mascara', 17.0, true),
(8, 'Sculpting Brow Pencil', 14.0, true),
(9, 'Feather Hold Brow Gel', 16.0, true),
(10, 'Satin Kiss Lipstick', 19.0, true),
(11, 'Glass Lip Oil', 17.0, true),
(12, 'Flawless Finish Brush', 22.0, true)
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price, active=EXCLUDED.active;

-- The Vercel server function uses a secret key to write validated orders.
-- Public visitors may read active products, but cannot read or write orders directly.
GRANT SELECT ON public.studio_products TO anon, authenticated;
REVOKE ALL ON public.studio_orders FROM anon, authenticated;
GRANT SELECT ON public.studio_products TO service_role;
GRANT SELECT, INSERT ON public.studio_orders TO service_role;

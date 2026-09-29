-- Contact form enquiries. Visitors may submit; only the dashboard/service role may read.
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 40),
  subject text NOT NULL CHECK (char_length(subject) BETWEEN 2 AND 100),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 4000),
  order_number text CHECK (order_number IS NULL OR char_length(order_number) <= 80)
);
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS order_number text CHECK (order_number IS NULL OR char_length(order_number) <= 80);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.contact_messages FROM PUBLIC, anon, authenticated;
GRANT INSERT ON public.contact_messages TO anon, authenticated;
DROP POLICY IF EXISTS "Visitors can submit contact enquiries" ON public.contact_messages;
CREATE POLICY "Visitors can submit contact enquiries" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);
GRANT SELECT ON public.contact_messages TO service_role;

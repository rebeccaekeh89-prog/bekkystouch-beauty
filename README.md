# Bekkystouch Beauty Store

Vercel-ready Next.js version of the Bekkystouch Beauty project.

## Deploy to Vercel

1. Put this project in a GitHub repository.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Add these environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Keep the detected framework as **Next.js** and click **Deploy**.

The store reads products from the existing `bt_products` table and creates demo orders through the existing `create_bt_order` Supabase function.

## Local development

Copy `.env.example` to `.env.local`, add the Supabase values, then run:

```bash
npm install
npm run dev
```

# Bekky's Touch - Full-Stack E-Commerce Application

An elevated, high-performance beauty e-commerce platform built with Next.js (App Router), Supabase (PostgreSQL, Auth, Storage), and hosted on Vercel.

## 🚀 Live Demo
- **URL:** [https://bekkystouch-beauty.vercel.app](https://bekkystouch-beauty.vercel.app)

---

## 🛠 Tech Stack & Architecture
- **Frontend Framework:** Next.js (App Router, Client Components, React)
- **Database & Backend:** Supabase (PostgreSQL Relational Schema, RLS, Automated Triggers)
- **Authentication:** Supabase Auth (Email/Password, Metadata Sync)
- **Asset Storage:** Supabase Public Storage Bucket (`product-images`)
- **Hosting & Deployment:** Vercel Continuous Deployment via GitHub

---

## 🗄 Database Features & Relational Schema
- **User Management & Triggers:** Automated `on_auth_user_created` trigger synchronizes `auth.users` to `public.profiles`.
- **Product & Inventory Management:** Structured schema covering products (`bt_products`), product variants (`product_variants`), subcategories (`categories`), media (`product_images`), inventory (`inventory`), and stock movements (`stock_movements`).
- **Shopping & Checkout:** Active cart tables (`carts`, `cart_items`), orders (`bt_orders`), order items (`bt_order_items`), payments (`payments`), and payment audit logs (`payment_events`).
- **User Features:** Address book (`customer_addresses`), wishlist items (`wishlists`), customer reviews (`reviews`), dynamic discounts (`coupons`), notifications (`notifications`), and audit logs (`audit_logs`).
- **Security & Integrity:** Row Level Security (RLS) active on all sensitive user tables and public entity read policies.

---

## 💻 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/rebeccaakeh89-prog/bekkystouch-beauty.git](https://github.com/rebeccaakeh89-prog/bekkystouch-beauty.git)
   cd bekkystouch-beauty

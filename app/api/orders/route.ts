import { NextRequest, NextResponse } from "next/server";

type OrderRequest = {
  customer_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postcode?: string;
  items?: Array<{ product_id?: number; quantity?: number }>;
};

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured");
  return { url, key };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OrderRequest;
    if (!body.customer_name?.trim() || !body.email?.trim() || !body.address?.trim() || !body.city?.trim() || !body.postcode?.trim() || !body.items?.length) {
      return NextResponse.json({ error: "Please complete all required details." }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(body.email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const { url, key } = supabaseConfig();
    const response = await fetch(`${url}/rest/v1/rpc/create_bt_order`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ order_data: body }),
    });
    const result = await response.json();
    if (!response.ok) {
      console.error("Supabase order error", result);
      return NextResponse.json({ error: "We could not place your order. Please review your details and try again." }, { status: 400 });
    }
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Order submission error", error);
    return NextResponse.json({ error: "The checkout is temporarily unavailable. Please try again." }, { status: 503 });
  }
}

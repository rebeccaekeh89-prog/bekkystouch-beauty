import { NextResponse } from "next/server";

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured");
  return { url, key };
}

export async function GET() {
  try {
    const { url, key } = supabaseConfig();
    const response = await fetch(
      `${url}/rest/v1/bt_products?select=id,name,category,price,shade,image,badge&active=eq.true&inventory=gt.0&order=id.asc`,
      { headers: { apikey: key }, cache: "no-store" },
    );
    if (!response.ok) throw new Error(`Supabase returned ${response.status}`);
    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("Product catalogue error", error);
    return NextResponse.json({ error: "The product catalogue is temporarily unavailable." }, { status: 503 });
  }
}

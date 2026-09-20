import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const response = await fetch(
      "https://ttdxwrzbvievwkiozpgl.supabase.co/rest/v1/newsletter_subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ""}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          email: email,
          status: "subscribed",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Supabase REST API Error:", errorText);
      return NextResponse.json({ error: "Failed to store email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

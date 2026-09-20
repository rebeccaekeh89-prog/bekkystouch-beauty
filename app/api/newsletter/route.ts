import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Save subscriber directly to Supabase
    const response = await fetch(
      "https://ttdxwrzbvievwkiozpgl.supabase.co/rest/v1/newsletter_subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
          Authorization: `Bearer ${
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ""
          }`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          email,
          status: "subscribed",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Supabase error:", errorText);

      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter API error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

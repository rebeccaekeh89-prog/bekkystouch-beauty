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

    // Save subscriber to Supabase
    const supabaseResponse = await fetch(
      "https://ttdxwrzbviewkjopzql.supabase.co/rest/v1/newsletter_subscribers",
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

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text();
      console.error("Supabase error:", errorText);

      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 }
      );
    }

    // Send welcome email through Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Bekky's Touch <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to Bekky's Touch – Here's 10% Off 💕",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
            <h1>Welcome to Bekky's Touch 💕</h1>

            <p>Thank you for joining our beauty community.</p>

            <p>As a welcome gift, enjoy <strong>10% off</strong> your order.</p>

            <div style="padding: 20px; background: #f8eeee; text-align: center; margin: 25px 0;">
              <p style="margin: 0;">YOUR DISCOUNT CODE</p>
              <h2 style="letter-spacing: 3px;">WELCOME10</h2>
            </div>

            <p>Enter <strong>WELCOME10</strong> at checkout to receive your discount.</p>

            <p>With love,<br><strong>Bekky's Touch</strong></p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const emailError = await emailResponse.text();
      console.error("Resend error:", emailError);

      return NextResponse.json({
        success: true,
        emailSent: false,
      });
    }

    return NextResponse.json({
      success: true,
      emailSent: true,
    });
  } catch (error) {
    console.error("Newsletter API error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

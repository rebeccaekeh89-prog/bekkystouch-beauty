import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bekkystouch Beauty Store",
  description: "Elevated makeup essentials for every complexion. Shop face, eyes, brows, lips and beauty tools.",
  openGraph: { title: "Bekkystouch Beauty Store", description: "Your beauty. Your way.", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Bekkystouch Beauty Store" }] },
  twitter: { card: "summary_large_image", title: "Bekkystouch Beauty Store", description: "Your beauty. Your way.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

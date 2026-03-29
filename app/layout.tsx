import type { Metadata } from "next";
import { Inter, Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { ErrorBoundary } from "./components/error-boundary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://delight-treats.app"),
  title: {
    default: "Delight Treats - Homemade Desserts & Cakes",
    template: "%s | Delight Treats",
  },
  description: "Order delicious homemade cakes, cupcakes, cookies, and desserts. Custom orders available for weddings, parties, and special occasions.",
  keywords: ["cakes", "cupcakes", "cookies", "desserts", "baking", "homemade treats", "custom orders"],
  authors: [{ name: "Delight Treats" }],
  creator: "Delight Treats",
  publisher: "Delight Treats",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Delight Treats - Homemade Desserts & Cakes",
    description: "Order delicious homemade cakes, cupcakes, cookies, and desserts. Custom orders available for weddings, parties, and special occasions.",
    url: "https://delight-treats.app",
    siteName: "Delight Treats",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200",
        width: 1200,
        height: 630,
        alt: "Delicious homemade cakes and desserts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Delight Treats - Homemade Desserts & Cakes",
    description: "Order delicious homemade cakes, cupcakes, cookies, and desserts. Custom orders available for weddings, parties, and special occasions.",
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${geistMono.variable} min-h-dvh bg-background text-foreground antialiased`}
      >
        <ErrorBoundary>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ErrorBoundary>
      </body>
    </html>
  );
}

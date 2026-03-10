import "./globals.css";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Providers from "./providers";
import { Suspense } from "react";
import Script from "next/script";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = {
  title: {

    default:
      "Niyog Publications Book Store - Buy Academic & Islamic Books Online in Bangladesh",
    template: "%s | Niyog Publications",
  },

  description:
    "Niyog Publications is a trusted online bookstore in Bangladesh offering academic, competitive exam, fiction, non-fiction, and Islamic books at affordable prices.",

  keywords: [
    "Niyog Publications",
    "Niyog Publications books",
    "online book store Bangladesh",
    "Islamic books Bangladesh",
    "academic books BD",
    "competitive exam books Bangladesh",
    "buy books online Bangladesh",
  ],

  authors: [{ name: "Niyog Publications", url: "https://niyog-publications.vercel.app" }],
  creator: "Niyog Publications",
  publisher: "Niyog Publications",

  metadataBase: new URL("https://niyog-publications.vercel.app"),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Niyog Publications - Online Book Store in Bangladesh",
    description:
      "Buy academic, Islamic, and competitive exam books online from Niyog Publications in Bangladesh.",
    url: "https://niyog-publications.vercel.app",
    siteName: "Niyog Publications",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Niyog Publications Book Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Niyog Publications - Online Book Store",
    description:
      "Explore academic, Islamic, and exam preparation books from Niyog Publications.",
    images: ["/twitter-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    google: "google8409242389fa5575",
  },

  category: "books",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Theme */}
        <meta name="theme-color" content="#000000" />

        {/* Google Verification */}
        <meta name="google-site-verification" content="google8409242389fa5575" />
      </head>

      <body>
        <JsonLd />

        <Providers>
          <Navbar />

          <Suspense fallback={<LoadingScreen />}>
            <main>{children}</main>
          </Suspense>

          <Footer />
        </Providers>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}

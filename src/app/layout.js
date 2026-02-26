// app/layout.tsx
import  { Metadata } from "next";
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
  default: "MITA Group Book Store - Buy Academic & Islamic Books Online in Bangladesh",
  template: "%s | MITA Group"
},
description:
  "MITA Group is a trusted online bookstore in Bangladesh offering academic, competitive exam, fiction, non-fiction and Islamic books at affordable prices.",
keywords: [
  "MITA Group Book Store",
  "online book store Bangladesh",
  "Islamic books Dhaka",
  "academic books BD",
  "competitive exam books Bangladesh"
],
  authors: [{ name: "MITA Group", url: "https://mita-group.vercel.app" }],
  creator: "MITA Group",
  publisher: "MITA Group",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mita-group.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      'en-US': '/en-us',
    },
  },
  openGraph: {
    title: "MITA Group - Excellence in [Industry]",
    description: "Discover how MITA Group delivers exceptional [industry] solutions tailored to your needs.",
    url: "https://mita-group.vercel.app",
    siteName: "MITA Group",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MITA Group - Industry Leaders",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MITA Group - Industry Leaders",
    description: "Discover how MITA Group delivers exceptional solutions tailored to your needs.",
    images: ["/twitter-image.jpg"],
    creator: "@mitagroup",
    site: "@mitagroup",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google8409242389fa5575",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "business",
};

export default function RootLayout({ 
  children 
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="google-site-verification" content="google8409242389fa5575" />
        
        {/* Viewport is automatically added by Next.js */}
      </head>
      <body>
        {/* Structured Data - Server Component */}
        <JsonLd />
        
        {/* Client Providers Wrapper */}
        <Providers>
          {/* Navigation - Can be server component */}
          <Navbar />
          
          {/* Main Content with Loading State */}
          <Suspense fallback={<LoadingScreen />}>
            <main>{children}</main>
          </Suspense>
          
          {/* Footer - Can be server component */}
          <Footer />
        </Providers>

        {/* Optional: Analytics Scripts that don't block rendering */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
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
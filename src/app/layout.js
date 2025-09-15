/* eslint-disable */
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import Header from "@/ui/Header";
import { ModalProvider } from "@/providers/ModalProvider";
import Head from "next/head";
import Footer from "@/blocks/Footer";
import { GoogleTagManager } from '@next/third-parties/google'

const redHatDisplay = Red_Hat_Display({
  variable: "--font-red-hat-display",
  subsets: ["latin"],
  display: "swap", // Ensure font-display: swap is used
});

export const metadata = {
  title: "TV Mounting Services | TVPro Handy Services",
  description: `TV Pro Handy Services LLC provides expert TV mounting services, home theater installation services, and video wall installation services nationwide. We mount TVs on any surface, including brick and fireplaces, hiding wires for a clean finish.

Our TV dismount service is free with orders over $200. We also offer sound bar installation services and gaming console setups.

✅ Transparent pricing, no hidden fees
✅ Evening & weekend availability
✅ 1-year warranty on all installations
✅ Trusted by homeowners, businesses, and designers

Choose TV Pro Handy Services for fast, reliable, top-rated home theater installation services, TV mounting services, and more.`,
  address: {
    "@type": "PostalAddress",
    "addressLocality": "Houston",
    "addressRegion": "TX",
    "addressCountry": "US",
  },
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico', // Primary ICO favicon
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: '/icon.svg', // SVG favicon
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png', // Desktop PNG favicon (32x32)
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png', // Desktop PNG favicon (16x16)
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '96x96',
      url: '/favicon-96x96.png', // Desktop PNG favicon (96x96)
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/apple-touch-icon.png', // Apple Touch Icon
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '192x192',
      url: '/web-app-manifest-192x192.png', // From existing web app manifest
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '512x512',
      url: '/web-app-manifest-512x512.png', // From existing web app manifest
    },
  ],
  alternates: {
    canonical: 'https://tvprousa.com',
  },
  openGraph: {
    title: 'TV Mounting Services | TVPro Handy Services',
    description: `TV Pro Handy Services LLC provides expert TV mounting services, home theater installation services, and video wall installation services nationwide. We mount TVs on any surface, including brick and fireplaces, hiding wires for a clean finish.

Our TV dismount service is free with orders over $200. We also offer sound bar installation services and gaming console setups.

✅ Transparent pricing, no hidden fees
✅ Evening & weekend availability
✅ 1-year warranty on all installations
✅ Trusted by homeowners, businesses, and designers

Choose TV Pro Handy Services for fast, reliable, top-rated home theater installation services, TV mounting services, and more.`,
    url: 'https://tvprousa.com',
    images: [
      {
        url: 'https://tvprousa.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TV mounting services in Houston',
      },
    ],
    type: 'website',
  },
  other: {
    "apple-mobile-web-app-title": "TVPro",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TVPro Handy Services',
    description: `TV Pro Handy Services LLC provides expert TV mounting services, home theater installation services, and video wall installation services nationwide. We mount TVs on any surface, including brick and fireplaces, hiding wires for a clean finish.

Our TV dismount service is free with orders over $200. We also offer sound bar installation services and gaming console setups.

✅ Transparent pricing, no hidden fees
✅ Evening & weekend availability
✅ 1-year warranty on all installations
✅ Trusted by homeowners, businesses, and designers

Choose TV Pro Handy Services for fast, reliable, top-rated home theater installation services, TV mounting services, and more.`,
    images: ['https://tvprousa.com/og-image.png'],
  },
};

async function getCTA() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/cta`);
  const json = await res.json();

  return json.data;
}  

export default async function RootLayout({ children }) {
  const cta = await getCTA()
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href="/videoplaceholder-392.webp"
          fetchPriority="high"
          type="image/webp"
        />
        <link rel="preconnect" href="https://apps.elfsightcdn.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://static.elfsight.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cloudflareinsights.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://strapi-production-20d6.up.railway.app" />
        <link rel="dns-prefetch" href="https://strapi-production-20d6.up.railway.app" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cloudflare.com" />
        <link rel="preload" as="video" href="/optimized/mainVideo2-360p.mp4"/>
        <GoogleTagManager gtmId="GTM-5QVX2Z6S" />
      </head>
      <body className={redHatDisplay.variable}>
        <ModalProvider>
          <Header cta={cta}/>
          <main style={{ paddingTop: 80, flexGrow: 1 }}>
            {children}
          </main>
          <Footer cta={cta}/>
        </ModalProvider>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GZBG74J130"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.gtag = window.gtag || function() { (window.dataLayer = window.dataLayer || []).push(arguments); };
              window.gtag('config', 'AW-17416148778');
              window.gtag('config', 'AW-17416148778/cLquCL68mv8aEKqu1fBA', { 'phone_conversion_number': '(877) 455-5535' });
            `,
          }}
        />
      </body>
    </html>
  );
}

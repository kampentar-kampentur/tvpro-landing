/* eslint-disable */
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import Header from "@/ui/Header";
import { ModalProvider } from "@/providers/ModalProvider";
import Head from "next/head";
import Footer from "@/blocks/Footer";
import { GoogleTagManager } from '@next/third-parties/google'
import Script from "next/script";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import EngagementTracker from "@/components/EngagementTracker/EngagementTracker";
import Modals from "@/app/components/Modals";

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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
    description: `TV Pro Handy Services LLC provides expert television mounting service, home theater installation services, and video wall installation services nationwide. We mount TVs on any surface, including brick and fireplaces, hiding wires for a clean finish.

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
  verification: {
    // google: 'your-code', // Add if needed
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
        {/* Preload LCP Image */}
        <link
          rel="preload"
          as="image"
          href="/videoplaceholder-392.webp"
          fetchPriority="high"
        />
        {/* Only critical preconnects (max 4) */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <GoogleTagManager gtmId="GTM-5QVX2Z6S" />
        {/* Workiz tracking — deferred to not block rendering */}
        <Script id="workiz-tracking" strategy="lazyOnload">
          {`var $wc_load=function(a){return JSON.parse(JSON.stringify(a))},$wc_leads=$wc_leads||{doc:{url:$wc_load(document.URL),ref:$wc_load(document.referrer),search:$wc_load(location.search),hash:$wc_load(location.hash)}};`}
        </Script>
        <Script src="//s.ksrndkehqnwntyxlhgto.com/154265.js" strategy="lazyOnload" />
        {/* Meta Pixel — deferred to lazyOnload */}
        <Script id="facebook-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '809936758465245');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=809936758465245&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body className={redHatDisplay.variable}>
        <ModalProvider>
          <EngagementTracker />
          <Modals />
          <Header cta={cta} />
          <main style={{ paddingTop: 80, flexGrow: 1 }}>
            {children}
          </main>
          <Footer cta={cta} />
        </ModalProvider>
        <ScrollToTop />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-GZBG74J130" strategy="lazyOnload" />
        <Script id="google-ads-config" strategy="lazyOnload">
          {`
            window.gtag = window.gtag || function() { (window.dataLayer = window.dataLayer || []).push(arguments); };
            window.gtag('config', 'AW-17416148778');
            window.gtag('config', 'AW-17416148778/cLquCL68mv8aEKqu1fBA', { 'phone_conversion_number': '(877) 455-5535' });
          `}
        </Script>
        <Script id="clarity-script" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
          `}
        </Script>
      </body>
    </html>
  );
}

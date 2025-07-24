/* eslint-disable */
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import Header from "@/ui/Header";
import { ModalProvider } from "@/providers/ModalProvider";
import Head from "next/head";
import Footer from "@/blocks/Footer";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'

const redHatDisplay = Red_Hat_Display({
  variable: "--font-red-hat-display",
  subsets: ["latin"],
});

export const metadata = {
  title: "Same‑Day TV Installation | TVPro Handy Services – Wire Concealment, Fireplace Mounts",
  description: "Fast same‑day TV mounting on drywall, brick, tile & stone. Premium wire concealment, fireplace installations, soundbars & home theaters. Book now with TVPro!",
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
    title: 'Same-Day TV Mounting | TVPro Handy Services',
    description: 'TV mounting with hidden wires, fast install, and fireplace options. Houston and nearby areas.',
    url: 'https://tvprousa.com',
    images: [
      {
        url: 'https://tvprousa.com/og-image.jpg',
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
    description: 'Fast and clean TV wall installation.',
    images: ['https://tvprousa.com/og-image.jpg'],
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
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "TVPro Handy Services",
              "telephone": cta.phoneLabel,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Houston",
                "addressRegion": "TX",
                "addressCountry": "US"
              },
              "url": "https://tvprousa.com/",
              "openingHours": "Mo-Su 08:00-22:00",
              "priceRange": "$$",
              "servesCuisine": "TV Installation"
            }),
          }}
        />
        {/* Google Tag Manager */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5QVX2Z6S');
            `,
          }}
        /> */}
        {/* End Google Tag Manager */}
      </Head>
      <GoogleTagManager gtmId="GTM-5QVX2Z6S"/>
      <body className={redHatDisplay.variable}>
        {/* Google Tag Manager (noscript) */}
        {/* <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5QVX2Z6S"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript> */}
        {/* End Google Tag Manager (noscript) */}
        <ModalProvider>
          <Header cta={cta}/>
          <main style={{ paddingTop: 80, flexGrow: 1 }}>
            {children}
          </main>
          <Footer cta={cta}/>
        </ModalProvider>
      </body>
      <GoogleAnalytics gaId="G-GZBG74J130" />
    </html>
  );
}

import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import Header from "@/ui/Header";
import { ModalProvider } from "@/providers/ModalProvider";
import Head from "next/head";
import Footer from "@/blocks/Footer";

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
    canonical: 'https://tvpro-landing.vercel.app',
  },
  openGraph: {
    title: 'Same-Day TV Mounting | TVPro Handy Services',
    description: 'TV mounting with hidden wires, fast install, and fireplace options. Houston and nearby areas.',
    url: 'https://tvpro-landing.vercel.app',
    images: [
      {
        url: 'https://tvpro-landing.vercel.app/og-image.jpg',
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
    images: ['https://tvpro-landing.vercel.app/og-image.jpg'],
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
              "image": "https://tvpro-landing.vercel.app/og-image.jpg",
              "telephone": cta.phoneLabel,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Houston",
                "addressRegion": "TX",
                "addressCountry": "US"
              },
              "url": "https://tvpro-landing.vercel.app",
              "openingHours": "Mo-Su 08:00-22:00",
              "priceRange": "$$",
              "servesCuisine": "TV Installation"
            }),
          }}
        />
      </Head>
      <body className={redHatDisplay.variable}>
        <ModalProvider>
          <Header cta={cta}/>
          <div style={{ paddingTop: 80 }}>
            {children}
          </div>
          <Footer cta={cta}/>
        </ModalProvider>
      </body>
    </html>
  );
}

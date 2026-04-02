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
import UtmCapture from "@/components/UtmCapture/UtmCapture";
import Modals from "@/app/components/Modals";
import { CTAProvider } from "@/providers/CTAProvider";

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
    canonical: 'https://tvprousa.com/',
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
        <script async src="https://ob.sornavellon.com/i/525465f0a01f5537af7992a76b9c7bf2.js" className="ct_clicktrue"></script>
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

        <link rel="preconnect" href="https://media.tvprousa.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
          `}
        </Script>
        <Script id="delayed-marketing-scripts" strategy="afterInteractive">
          {`
            (function() {
              console.log('Marketing scripts: Initialization started');
              var fired = false;
              var timeoutId;
              
              function loadScripts() {
                if (fired) return;
                fired = true;
                console.log('Marketing scripts: Loading triggered');
                
                clearTimeout(timeoutId);
                ['scroll', 'touchstart', 'mousemove', 'mousedown', 'keydown', 'wheel'].forEach(function(e) {
                  window.removeEventListener(e, loadScripts);
                });
                
                // 1. GTM
                (function() {
                  try {
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-5QVX2Z6S');
                    console.log('Marketing scripts: GTM loaded');
                  } catch(e) { console.error('GTM Error:', e); }
                })();

                // 2. WhatConverts Chat & Tracking
                (function() {
                  try {
                    var workizLeads = {doc:{url:document.URL,ref:document.referrer,search:location.search,hash:location.hash}};
                    window.$wc_leads = JSON.parse(JSON.stringify(workizLeads));
                    
                    var workizScript = document.createElement('script');
                    workizScript.async = true;
                    workizScript.src = "//s.ksrndkehqnwntyxlhgto.com/154265.js";
                    
                    document.head.appendChild(workizScript);
                  } catch(e) { console.error('WhatConverts Error:', e); }
                })();


                // 4. LeadConnector Chat Widget
                (function() {
                  try {
                    var lcScript = document.createElement('script');
                    lcScript.async = true;
                    lcScript.src = "https://beta.leadconnectorhq.com/loader.js";
                    lcScript.setAttribute('data-resources-url', 'https://beta.leadconnectorhq.com/chat-widget/loader.js');
                    lcScript.setAttribute('data-widget-id', '69a71eb8a27e8c3d964270ee');
                    document.body.appendChild(lcScript);
                    console.log('Marketing scripts: LeadConnector loaded');
                  } catch(e) { console.error('LeadConnector Error:', e); }
                })();

                // LeadConnector Enhancement Logic
                function enhanceWidget() {
                  const widget = document.querySelector('chat-widget');
                  if (widget && widget.shadowRoot) {
                    if (!widget.shadowRoot.querySelector('#tvpro-enhancements')) {
                      const style = document.createElement('style');
                      style.id = 'tvpro-enhancements';
                      style.textContent = '@keyframes widget-sequence { \
                          0%, 6% { transform: scale(1) rotate(0); } \
                          1% { transform: scale(1.2) rotate(15deg); } \
                          2% { transform: scale(1.2) rotate(-15deg); } \
                          3% { transform: scale(1.2) rotate(15deg); } \
                          4% { transform: scale(1.2) rotate(-15deg); } \
                          5% { transform: scale(1.2) rotate(15deg); } \
                          7%, 32% { transform: scale(1) rotate(0); } \
                          33% { transform: scale(1); } \
                          34%, 35% { transform: scale(0.9) rotate(-3deg); } \
                          36%, 37%, 38% { transform: scale(1.3) rotate(3deg); } \
                          36.5%, 37.5%, 38.5% { transform: scale(1.3) rotate(-3deg); } \
                          43% { transform: scale(1) rotate(0); } \
                          44%, 65% { transform: scale(1) rotate(0); } \
                          66% { transform: translateY(0); } \
                          68% { transform: translateY(-20px); } \
                          71% { transform: translateY(0); } \
                          73% { transform: translateY(-10px); } \
                          76% { transform: translateY(0); } \
                          77%, 100% { transform: scale(1) rotate(0) translateY(0); } \
                        } \
                        button, .chat-widget-button, .chip-button { \
                          animation: widget-sequence 30s infinite !important; \
                          transform-origin: center center !important; \
                          transition: transform 0.3s ease-in-out !important; \
                          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4) !important; \
                        }';
                      widget.shadowRoot.appendChild(style);
                    }
                  } else {
                    setTimeout(enhanceWidget, 500);
                  }
                }
                
                const observer = new MutationObserver((mutations, obs) => {
                    const widget = document.querySelector('chat-widget');
                    if (widget) {
                        enhanceWidget();
                        obs.disconnect();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
                setTimeout(enhanceWidget, 2000);
              }

              timeoutId = setTimeout(loadScripts, 1000);
              ['scroll', 'touchstart', 'mousemove', 'mousedown', 'keydown', 'wheel'].forEach(function(e) {
                window.addEventListener(e, loadScripts, { passive: true, once: true });
              });
            })();
          `}
        </Script>

      </head>
      <body className={redHatDisplay.variable}>
        <noscript><iframe src="https://ob.sornavellon.com/ns/525465f0a01f5537af7992a76b9c7bf2.html?ch=" width="0" height="0" style={{ display: 'none' }}></iframe></noscript>
        <CTAProvider initialCTA={cta}>
          <ModalProvider>
            <EngagementTracker />
            <UtmCapture />
            <Modals />
            <Header cta={cta} />
            <main style={{ paddingTop: 80, flexGrow: 1 }}>
              {children}
            </main>
            <Footer cta={cta} />
          </ModalProvider>
        </CTAProvider>
        <ScrollToTop />

      </body>
    </html>
  );
}

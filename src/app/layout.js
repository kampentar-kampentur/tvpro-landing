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
        <Script id="delayed-marketing-scripts" strategy="lazyOnload">
          {`
          console.log('-----------------------');
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
                
                // GTM
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-5QVX2Z6S');

                // Meta Pixel
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
                
                // Google Ads / GA4
                var gtagScript = document.createElement('script');
                gtagScript.async = true;
                gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-GZBG74J130";
                document.head.appendChild(gtagScript);
                
                window.gtag = window.gtag || function() { (window.dataLayer = window.dataLayer || []).push(arguments); };
                window.gtag('js', new Date());
                window.gtag('config', 'G-GZBG74J130');
                window.gtag('config', 'AW-17416148778');
                window.gtag('config', 'AW-17416148778/cLquCL68mv8aEKqu1fBA', { 'phone_conversion_number': '(877) 455-5535' });

                // Workiz tracking
                var workizLeads = {doc:{url:document.URL,ref:document.referrer,search:location.search,hash:location.hash}};
                window.$wc_leads = JSON.parse(JSON.stringify(workizLeads));
                var workizScript = document.createElement('script');
                workizScript.async = true;
                workizScript.src = "//s.ksrndkehqnwntyxlhgto.com/154265.js";
                document.head.appendChild(workizScript);

                // Thumbtack Star Widget
                var ttScript = document.createElement('script');
                ttScript.async = true;
                ttScript.src = "https://www.thumbtack.com/profile/widgets/scripts/?service_pk=538968360070111254&widget_id=review&type=star";
                document.head.appendChild(ttScript);

                // LeadConnector Chat Widget
                var lcScript = document.createElement('script');
                lcScript.async = true;
                lcScript.src = "https://beta.leadconnectorhq.com/loader.js";
                lcScript.setAttribute('data-resources-url', 'https://beta.leadconnectorhq.com/chat-widget/loader.js');
                lcScript.setAttribute('data-widget-id', '69a71eb8a27e8c3d964270ee');
                document.body.appendChild(lcScript);

                // Enhancement Logic (Animations & Badge)
                function enhanceWidget() {
                  console.log('Marketing scripts: Searching for chat-widget...');
                  const widget = document.querySelector('chat-widget');
                  
                  if (widget && widget.shadowRoot) {
                    console.log('Marketing scripts: chat-widget found, injecting Shadow Styles');
                    
                    if (!widget.shadowRoot.querySelector('#tvpro-enhancements')) {
                      const style = document.createElement('style');
                      style.id = 'tvpro-enhancements';
                      style.textContent = \`
                        /* 1. Expressive Wiggle (Current) */
                        @keyframes widget-wiggle {
                          0%, 85% { transform: scale(1) rotate(0); }
                          87% { transform: scale(1.2) rotate(15deg); }
                          89% { transform: scale(1.2) rotate(-15deg); }
                          91% { transform: scale(1.2) rotate(15deg); }
                          93% { transform: scale(1.2) rotate(-15deg); }
                          95% { transform: scale(1.2) rotate(15deg); }
                          97% { transform: scale(1.2) rotate(-15deg); }
                          100% { transform: scale(1) rotate(0); }
                        }

                        /* 2. Pulse (Continuous heartbeat) */
                        @keyframes widget-pulse {
                          0% { transform: scale(1); }
                          50% { transform: scale(1.1); }
                          100% { transform: scale(1); }
                        }

                        /* 3. Tada (Celebratory shake) */
                        @keyframes widget-tada {
                          0%, 85% { transform: scale(1); }
                          87%, 89% { transform: scale(0.9) rotate(-3deg); }
                          91%, 93%, 95%, 97% { transform: scale(1.3) rotate(3deg); }
                          92%, 94%, 96% { transform: scale(1.3) rotate(-3deg); }
                          100% { transform: scale(1) rotate(0); }
                        }

                        /* 4. Bounce (Playful jump) */
                        @keyframes widget-bounce {
                           0%, 20%, 50%, 80%, 85% { transform: translateY(0); }
                           87% { transform: translateY(-20px); }
                           90% { transform: translateY(0); }
                           93% { transform: translateY(-10px); }
                           96%, 100% { transform: translateY(0); }
                        }
                        
                        /* 5. Sequence (All three in a row) - 30s Cycle */
                        @keyframes widget-sequence {
                          /* Wiggle: 0-2s (0-7%) */
                          0%, 6% { transform: scale(1) rotate(0); }
                          1% { transform: scale(1.2) rotate(15deg); }
                          2% { transform: scale(1.2) rotate(-15deg); }
                          3% { transform: scale(1.2) rotate(15deg); }
                          4% { transform: scale(1.2) rotate(-15deg); }
                          5% { transform: scale(1.2) rotate(15deg); }

                          /* Pause: 7-32% */
                          7%, 32% { transform: scale(1) rotate(0); }

                          /* Tada: 33-43% */
                          33% { transform: scale(1); }
                          34%, 35% { transform: scale(0.9) rotate(-3deg); }
                          36%, 37%, 38% { transform: scale(1.3) rotate(3deg); }
                          36.5%, 37.5%, 38.5% { transform: scale(1.3) rotate(-3deg); }
                          43% { transform: scale(1) rotate(0); }

                          /* Pause: 44-65% */
                          44%, 65% { transform: scale(1) rotate(0); }

                          /* Bounce: 66-76% */
                          66% { transform: translateY(0); }
                          68% { transform: translateY(-20px); }
                          71% { transform: translateY(0); }
                          73% { transform: translateY(-10px); }
                          76% { transform: translateY(0); }

                          /* Long Final Pause: 77-100% */
                          77%, 100% { transform: scale(1) rotate(0) translateY(0); }
                        }

                        /* 6. Chat Window Enhancements (Resize & Animation) */
                        .lc_text-widget--box {
                          //transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease, width 1s ease, height 1s ease !important;
                          transform: translateY(20px) !important;
                          opacity: 0 !important;
                          transform-origin: bottom right !important;
                          display: flex !important;
                          flex-direction: column !important;
                        }

                        .lc_text-widget--box.active {
                          transform: translateY(0) scale(1) !important;
                          opacity: 1 !important;
                          visibility: visible !important;
                        }
                        .lc_text-widget {
                          //transition: all 1s ease !important;
                        }
                        .lc_text-widget--mobile {
                          width: 100vw !important;
                          height: 100vh !important;
                          top: 0 !important;
                          left: 0 !important;
                          right: 0 !important;
                          bottom: 0 !important;
                          padding-bottom: 0px !important;
                        }
                        
                        /* Ensure the content inside doesn't overflow */
                        .lc_text-widget--mobile .lc_text-widget--box .lc_text-widget_content {
                          width: 100% !important;
                        }
                        .lc_text-widget--mobile .lc_text-widget_heading--root {
                          border-radius: 0 !important;
                        }
                        @media (any-pointer: coarse) {
                          .lc_text-widget--active {
                            width: 100vw !important;
                            height: 100vh !important;
                            top: 0 !important;
                            left: 0 !important;
                            right: 0 !important;
                            bottom: 0 !important;
                            padding-bottom: 0px !important;
                          }
                          .lc_text-widget--formContainer {
                            display: none !important;
                            width: 1px !important;
                            height: 1px !important;
                          }
                          .lc_text-widget--box {
                            width: 1px !important;
                            height: 1px !important;
                          }
                          .lc_text-widget--active .lc_text-widget--formContainer {
                            display: flex !important;
                            width: auto !important;
                            height: auto !important;
                          }

                          .lc_text-widget--active .lc_text-widget--box {
                            display: flex !important;
                            width: 100% !important;
                            height: 100% !important;
                          }
                        }
                        button, .chat-widget-button, .chip-button {
                          animation: widget-sequence 30s infinite !important;
                          transform-origin: center center !important;
                          transition: transform 0.3s ease-in-out !important;
                          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4) !important;
                        }
                      \`;
                      widget.shadowRoot.appendChild(style);
                    }

                    let badge = document.querySelector('.lc-widget-badge');
                    if (!badge) {
                      badge = document.createElement('div');
                      badge.className = 'lc-widget-badge';
                      document.body.appendChild(badge);
                      // Adding a small delay to the initial show for better UX
                      setTimeout(() => badge.classList.add('visible'), 2000);
                    }

                    // Click listner to hide badge when opened
                    const chatButton = widget.shadowRoot.querySelector('button') || 
                                     widget.shadowRoot.querySelector('.chat-widget-button') || 
                                     widget.shadowRoot.querySelector('.chip-button');
                    
                    if (chatButton && !chatButton.hasAttribute('data-badge-listener')) {
                      chatButton.setAttribute('data-badge-listener', 'true');
                      chatButton.addEventListener('click', () => {
                        const badgeToHide = document.querySelector('.lc-widget-badge');
                        if (badgeToHide) badgeToHide.classList.remove('visible');
                      });
                    }
                  } else if (widget && !widget.shadowRoot) {
                    setTimeout(enhanceWidget, 500);
                  } else {
                    setTimeout(enhanceWidget, 1000);
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

                console.log('Marketing scripts: All activated');
              }

              timeoutId = setTimeout(loadScripts, 1000);
              ['scroll', 'touchstart', 'mousemove', 'mousedown', 'keydown', 'wheel'].forEach(function(e) {
                window.addEventListener(e, loadScripts, { passive: true, once: true });
              });
            })();
          `}
        </Script>

        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=809936758465245&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className={redHatDisplay.variable}>
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

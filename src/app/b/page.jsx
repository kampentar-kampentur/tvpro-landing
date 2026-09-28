import styles from "../page.module.css";
import Hero from "@/blocks/Hero";
import UtpBar from "@/blocks/UtpBar";
import TvCountPicker from "@/blocks/TvCountPicker";
import BriefServices from "@/blocks/BriefServices";
import WorkVideoGallery from "@/blocks/WorkVideoGallery/WorkVideoGallery";
import CustomerReviews from "@/blocks/CustomerReviews/CustomerReviews";
import MountingTypes from "@/blocks/MountingTypes";
import WhyCustomersTrustUs from "@/blocks/WhyCustomersTrustUs";
import OurServices from "@/blocks/OurServices";
import OurTeam from "@/blocks/OurTeam/OurTeam";
import CareersCTA from "@/blocks/CareersCTA/CareersCTA";
import GalleryOfWork from "@/blocks/GalleryOfWork";
import Certificates from "@/blocks/Certificates";
import AboutUs from "@/blocks/AboutUs";
import FAQ from "@/blocks/FAQ";
import Contacts from "@/blocks/Contacts";
import { getGlobalConfig } from "@/lib/strapi";

export const metadata = {
  title: "TV Mounting Services | TVPro Handy Services",
  description:
    "Expert TV mounting, home theater installation & video wall setups. Transparent pricing, 5-year warranty & same-day service. Book your local TVPro handy pro!",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://tvprousa.com/",
  },
};

export default async function PageB() {
  const globalConfig = await getGlobalConfig();

  return (
    <div className={styles.tvproMain}>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var p = new URLSearchParams(window.location.search);
                var c = p.get('city');
                if (c) {
                  c = decodeURIComponent(c).trim();
                  if (c.indexOf('-') !== -1 && c.indexOf(' ') === -1) c = c.replace(/-/g, ' ');
                  c = c.replace(/\\b[a-z]/g, function(ch) { return ch.toUpperCase(); });
                  c = c.replace(/,\\s*([A-Za-z]{2})\\b/g, function(m, st) { return ', ' + st.toUpperCase(); });
                  var els = document.querySelectorAll('[data-dynamic-city]');
                  els.forEach(function(el) { el.textContent = c; });
                }
              } catch(e) {}
            })();
          `,
        }}
      />
      <Hero isVariantB={true} />
      <UtpBar isVariantB={true} />
      <TvCountPicker isVariantB={true} />
      <BriefServices />
      <WorkVideoGallery />
      <CustomerReviews />
      <GalleryOfWork />
      <Certificates />
      <MountingTypes />
      <WhyCustomersTrustUs />
      <OurServices />
      <OurTeam isVariantB={true} />
      <CareersCTA data={globalConfig?.["careers-cta"] || {}} />
      <AboutUs />
      <FAQ />
      <Contacts />
    </div>
  );
}

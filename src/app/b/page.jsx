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
      <OurTeam />
      <CareersCTA data={globalConfig?.["careers-cta"] || {}} />
      <AboutUs />
      <FAQ />
      <Contacts />
    </div>
  );
}

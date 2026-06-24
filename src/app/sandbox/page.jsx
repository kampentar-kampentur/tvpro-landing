import styles from "./page.module.css";
import Hero from "@/blocks/Hero";
import UtpBar from "@/blocks/UtpBar";
import TvCountPicker from "@/blocks/TvCountPicker";
import BriefServices from "@/blocks/BriefServices";
import WorkVideoGallery from "@/blocks/WorkVideoGallery/WorkVideoGallery";
import CustomerReviews from "@/blocks/CustomerReviews/CustomerReviews";
import TVSizes from "@/blocks/TVSizes";
import OurServices from "@/blocks/OurServices";
import MountingTypes from "@/blocks/MountingTypes";
import WhyCustomersTrustUs from "@/blocks/WhyCustomersTrustUs";
import GalleryOfWork from "@/blocks/GalleryOfWork";
import Certificates from "@/blocks/Certificates";
import AboutUs from "@/blocks/AboutUs";
import FAQ from "@/blocks/FAQ";
import Contacts from "@/blocks/Contacts";
import AreasWeServe from "@/blocks/AreasWeServe/AreasWeServe";
import OurTeam from "@/blocks/OurTeam/OurTeam";
import CareersCTA from "@/blocks/CareersCTA/CareersCTA";
import { getGlobalConfig } from "@/lib/strapi";

export default async function Sandbox() {
  const globalConfig = await getGlobalConfig();

  return (
    <div className={styles.tvproMain}>
      <Hero />
      <UtpBar />
      <TvCountPicker />
      <BriefServices />
      <WorkVideoGallery />
      <CustomerReviews />
      <GalleryOfWork />
      <Certificates />
      {/* <TVSizes /> */}
      <MountingTypes />
      <WhyCustomersTrustUs />
      <OurTeam cityContext={{ city_name: "Houston", state_code: "TX" }} />
      <CareersCTA data={globalConfig?.["careers-cta"] || {}} />
      <AboutUs />
      <FAQ />
      <Contacts />
      <AreasWeServe />
    </div>
  );
}

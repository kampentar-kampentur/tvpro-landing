import styles from "./page.module.css";
import Hero from "@/blocks/Hero";
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

export default async function Home() {
  return (
    <div className={styles.tvproMain}>
      <Hero />
      <WorkVideoGallery />
      <CustomerReviews />
      <GalleryOfWork />
      <Certificates />
      {/* <TVSizes /> */}
      <MountingTypes />
      <WhyCustomersTrustUs />
      <OurServices />
      <AboutUs />
      <FAQ />
      <Contacts />
    </div>
  );
}

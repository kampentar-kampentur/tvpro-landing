import styles from "./page.module.css";
import Hero from "@/blocks/Hero";
import TVSizes from "@/blocks/TVSizes";
import OurServices from "@/blocks/OurServices";
import MountingTypes from "@/blocks/MountingTypes";
import WhyCustomersTrustUs from "@/blocks/WhyCustomersTrustUs";
import CustomerReviews from "@/blocks/CustomerReviews";
import GalleryOfWork from "@/blocks/GalleryOfWork";
import AboutUs from "@/blocks/AboutUs";
import FAQ from "@/blocks/FAQ";
import Contacts from "@/blocks/Contacts";
import Footer from "@/blocks/Footer";
import BestQuoteModal from "@/modals/BestQuoteModal";

export default function Home() {
  return (
    <div className={styles.tvproMain}>
      <Hero />
      <TVSizes />
      <OurServices />
      <MountingTypes />
      <WhyCustomersTrustUs />
      <CustomerReviews />
      <GalleryOfWork />
      <AboutUs />
      <FAQ />
      <Contacts />
      <Footer />
      <BestQuoteModal/>
    </div>
  );
}

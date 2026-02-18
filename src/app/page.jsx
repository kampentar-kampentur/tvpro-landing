import styles from "./page.module.css";
import dynamic from "next/dynamic";

// Above-the-fold: direct imports for instant SSR (no Loading flash)
import Hero from "@/blocks/Hero";
import CustomerReviews from "@/blocks/CustomerReviews";
import WorkVideoGallery from "@/blocks/WorkVideoGallery/WorkVideoGallery";

// Below-the-fold: lazy loaded for performance (null loading = no visible placeholder)
const TVSizes = dynamic(() => import("@/blocks/TVSizes"), {
  loading: () => null
});

const OurServices = dynamic(() => import("@/blocks/OurServices"), {
  loading: () => null
});

const MountingTypes = dynamic(() => import("@/blocks/MountingTypes"), {
  loading: () => null
});

const WhyCustomersTrustUs = dynamic(() => import("@/blocks/WhyCustomersTrustUs"), {
  loading: () => null
});

const GalleryOfWork = dynamic(() => import("@/blocks/GalleryOfWork"), {
  loading: () => null
});

const Certificates = dynamic(() => import("@/blocks/Certificates"), {
  loading: () => null
});

const AboutUs = dynamic(() => import("@/blocks/AboutUs"), {
  loading: () => null
});

const FAQ = dynamic(() => import("@/blocks/FAQ"), {
  loading: () => null
});

const Contacts = dynamic(() => import("@/blocks/Contacts"), {
  loading: () => null
});


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

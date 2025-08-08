import styles from "./page.module.css";
import dynamic from "next/dynamic";

// Dynamically import heavy components with lazy loading
const Hero = dynamic(() => import("@/blocks/Hero"), {
  loading: () => <div>Loading...</div>
});

const TVSizes = dynamic(() => import("@/blocks/TVSizes"), {
  loading: () => <div>Loading...</div>
});

const OurServices = dynamic(() => import("@/blocks/OurServices"), {
  loading: () => <div>Loading...</div>
});

const MountingTypes = dynamic(() => import("@/blocks/MountingTypes"), {
  loading: () => <div>Loading...</div>
});

const WhyCustomersTrustUs = dynamic(() => import("@/blocks/WhyCustomersTrustUs"), {
  loading: () => <div>Loading...</div>
});

const CustomerReviews = dynamic(() => import("@/blocks/CustomerReviews"), {
  loading: () => <div>Loading...</div>
});

const GalleryOfWork = dynamic(() => import("@/blocks/GalleryOfWork"), {
  loading: () => <div>Loading...</div>
});

const Certificates = dynamic(() => import("@/blocks/Certificates"), {
  loading: () => <div>Loading...</div>
});

const AboutUs = dynamic(() => import("@/blocks/AboutUs"), {
  loading: () => <div>Loading...</div>
});

const FAQ = dynamic(() => import("@/blocks/FAQ"), {
  loading: () => <div>Loading...</div>
});

const Contacts = dynamic(() => import("@/blocks/Contacts"), {
  loading: () => <div>Loading...</div>
});

// Create a client component for modals
const Modals = dynamic(() => import("@/app/components/Modals"), {
  loading: () => <div>Loading modals...</div>
});

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
      <Certificates />
      <AboutUs />
      <FAQ />
      <Contacts />
      <Modals />
    </div>
  );
}

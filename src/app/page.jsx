"use client"
import styles from "./page.module.css";
import Hero from "@/blocks/Hero";
import TVSizes from "@/blocks/TVSizes";
import OurServices from "@/blocks/OurServices";
import MountingTypes from "@/blocks/MountingTypes";
import WhyCustomersTrustUs from "@/blocks/WhyCustomersTrustUs";
import CustomerReviews from "@/blocks/CustomerReviews";

export default function Home() {
  return (
    <div className={styles.tvproMain}>
      <Hero />
      <TVSizes />
      <OurServices />
      <MountingTypes />
      <WhyCustomersTrustUs />
      <CustomerReviews />
    </div>
  );
}

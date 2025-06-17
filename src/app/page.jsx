"use client"
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
import { useEffect } from "react";
import { useModalState } from "@/providers/ModalProvider";

export default function Home() {
  const {open} = useModalState('BestQuote');
  useEffect(() => {
    open()
  }, [])
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

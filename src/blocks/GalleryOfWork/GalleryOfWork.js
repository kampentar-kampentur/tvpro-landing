import React from "react";
import styles from "./GalleryOfWork.module.css";
import PhotoCard from "./components/PhotoCard";
import { SliderGallery } from "@/ui/SliderGallery/SliderGallery";
import Button from "@/ui/Button/Button";

const cardsData = [
  {src: "./galeryofwork.png", alt: "ahahhah"},
  {src: "./galeryofwork.png", alt: "ahahhah"},
  {src: "./galeryofwork.png", alt: "ahahhah"},
  {src: "./galeryofwork.png", alt: "ahahhah"},
  {src: "./galeryofwork.png", alt: "ahahhah"},
  {src: "./galeryofwork.png", alt: "ahahhah"},
  {src: "./galeryofwork.png", alt: "ahahhah"},
]

const GalleryOfWork = () => {
  return (
    <section className={styles.galleryOfWork}>
      <div className="block">
        <header className={styles.galleryOfWorkHeader}>
          <h3 className="blockHeading">
            Gallery of Our Work
          </h3>
          <p className="subText">See real installations by our team — clean, level, and built to last.</p>
        </header>
      </div>
      <div className={styles.sliderWrap}>
        <SliderGallery
          CardComponent={PhotoCard}
          cardData={cardsData}
          cardsPerPage={4}
        />
      </div>
      <div className="block">
        <div className={styles.ctaContainer}>
          <p className={styles.ctaText}>Like what you see?</p>
          <div className={styles.ctaButtons}>
            <Button variant="primary" size="small">Get The Best Quote</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryOfWork; 
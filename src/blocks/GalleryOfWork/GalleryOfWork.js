
import styles from "./GalleryOfWork.module.css";
import PhotoCard from "./components/PhotoCard";
import { SliderGallery } from "@/ui/SliderGallery/SliderGallery";
import Button from "@/ui/Button/Button";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import GalleryGrid from "./components/GalleryGrid";
import Text from "@/ui/Text/Text";

async function getGalleryOfWork() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/gallery-of-work?populate=*`);
  const json = await res.json();
  
  return json.data;
}

async function getGalleryPhotos() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/galler-photos?populate=*`);
  const json = await res.json();

  return json.data;
}

const GalleryOfWork = async () => {
  const galleryOfWorkData = await getGalleryOfWork();
  const galleryPhotos = await getGalleryPhotos();

  return (
    <section className={styles.galleryOfWork} id="gallery">
      <div className="block">
        <header className={styles.galleryOfWorkHeader}>
          <h2 className="blockHeading">
            <Text text={galleryOfWorkData.title}/>
          </h2>
          <p className="subText"><Text text={galleryOfWorkData.subTitle}/></p>
        </header>
      {/* <div className={styles.sliderWrap}>
        <SliderGallery
          CardComponent={PhotoCard}
          cardData={galleryPhotos}
          cardsPerPage={4}
        />
      </div> */}
        <GalleryGrid filters={galleryOfWorkData.types}/>
        <div className={styles.ctaContainer}>
          <p className={styles.ctaText}>Like what you see?</p>
          <div className={styles.ctaButtons}>
            <QuoteButton variant="primary" size="small" modalName="BookNow">Book Your Install Today</QuoteButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryOfWork; 

import styles from "./GalleryOfWork.module.css";
import PhotoCard from "./components/PhotoCard";
import { SliderGallery } from "@/ui/SliderGallery/SliderGallery";
import Button from "@/ui/Button/Button";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import GalleryGerid from "./components/GalleryGrid";
import Text from "@/ui/Text/Text";

const sliderCardsData = [
  { src: "/galeryofwork.webp", alt: "TV installation" },
  { src: "/galeryofwork.webp", alt: "TV installation" },
  { src: "/galeryofwork.webp", alt: "TV installation" },
  { src: "/galeryofwork.webp", alt: "TV installation" },
  { src: "/galeryofwork.webp", alt: "TV installation" },
  { src: "/galeryofwork.webp", alt: "TV installation" },
  { src: "/galeryofwork.webp", alt: "TV installation" },
];

async function getGalleryOfWork() {
  console.log("getGalleryOfWork");
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/gallery-of-work?populate=*`);
  const json = await res.json();
  console.log("getGalleryOfWork res");
  
  return json.data;
}

async function getGalleryPhotos() {
  console.log('getGalleryPhotos');
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/galler-photos?populate=*`);
  const json = await res.json();
  console.log('getGalleryPhotos res');

  return json.data;
}

const GalleryOfWork = async () => {
  const galleryOfWorkData = await getGalleryOfWork();
  const galleryPhotos = await getGalleryPhotos();

  return (
    <section className={styles.galleryOfWork} id="gallery">
      <div className="block">
        <header className={styles.galleryOfWorkHeader}>
          <h3 className="blockHeading">
            <Text text={galleryOfWorkData.title}/>
          </h3>
          <p className="subText"><Text text={galleryOfWorkData.title}/></p>
        </header>
      </div>
      <div className={styles.sliderWrap}>
        <SliderGallery
          CardComponent={PhotoCard}
          cardData={galleryPhotos}
          cardsPerPage={4}
        />
      </div>
      <div className="block">
        <GalleryGerid filters={galleryOfWorkData.types}/>
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
import styles from "./GalleryOfWork.module.css";
import PhotoCard from "./components/PhotoCard";
import { SliderGallery } from "@/ui/SliderGallery/SliderGallery";
import Button from "@/ui/Button/Button";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import GalleryGrid from "./components/GalleryGrid";
import Text from "@/ui/Text/Text";
import { resolveSpintax } from "@/lib/spintax";

async function getGalleryOfWork() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/gallery-of-work?populate=*`,
  );
  const json = await res.json();

  return json.data;
}

async function getGalleryPhotos(type) {
  if (!type) return [];
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/galler-photos?populate=*&filters[type]=${encodeURIComponent(type)}&pagination[limit]=100`
  );
  const json = await res.json();

  return json.data || [];
}

// Default export with data prop
export default async function GalleryOfWork({ data = {}, cityContext }) {
  const defaultGalleryOfWorkData = await getGalleryOfWork();

  // Merge: Use prop data if available, otherwise fallback to default
  const galleryOfWorkData = {
    ...defaultGalleryOfWorkData,
    ...data,
    title: resolveSpintax(data?.title || defaultGalleryOfWorkData.title || ""),
    subTitle: resolveSpintax(
      data?.subTitle || defaultGalleryOfWorkData.subTitle || "",
    ),
    types:
      data?.types && data.types.length > 0
        ? data.types
        : defaultGalleryOfWorkData.types,
  };

  const defaultFilter = galleryOfWorkData.types?.[0]?.type || "";
  const galleryPhotos = await getGalleryPhotos(defaultFilter);

  return (
    <section className={styles.galleryOfWork} id="gallery">
      <div className="block">
        <header className={styles.galleryOfWorkHeader}>
          <h2 className="blockHeading">
            <Text text={galleryOfWorkData.title} cityContext={cityContext} />
          </h2>
          <p className="subText">
            <Text text={galleryOfWorkData.subTitle} cityContext={cityContext} />
          </p>
        </header>
        <GalleryGrid
          filters={galleryOfWorkData.types}
          initialPhotos={galleryPhotos}
        />
        <div className={styles.ctaContainer}>
          <p className={styles.ctaText}>Like what you see?</p>
          <div className={styles.ctaButtons}>
            <QuoteButton
              variant="primary"
              size="large"
              modalName="BookNow"
              className={styles.ctaButton}
            >
              Get Your Price in 30 Seconds
            </QuoteButton>
          </div>
        </div>
      </div>
    </section>
  );
}

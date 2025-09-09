
import styles from "./PhotoGrid.module.css";
import PhotoCard from "./PhotoCard";
import photoStyles from "./PhotoCard.module.css"

const PhotoGrid = ({ images }) => {
  return (
    <div className={styles.photoGrid}>
      {images && images.map((image, index) => (
        <PhotoCard
          className={photoStyles.photoCell}
          key={index}
          image={image.image}
          videoUrl={image.videoUrl}
          video={image.video}
          images={images}
          currentIndex={index}
        />
      ))}
    </div>
  );
};

export default PhotoGrid; 
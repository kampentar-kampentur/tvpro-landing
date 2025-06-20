
import styles from "./PhotoGrid.module.css";
import PhotoCard from "./PhotoCard";
import photoStyles from "./PhotoCard.module.css"

const PhotoGrid = ({ images }) => {
  return (
    <div className={styles.photoGrid}>
      {images.map((image, index) => (
        <PhotoCard className={photoStyles.photoCell} key={index} src={image.src} alt={image.alt} />
      ))}
    </div>
  );
};

export default PhotoGrid; 
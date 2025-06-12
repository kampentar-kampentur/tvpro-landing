
import styles from "./PhotoGrid.module.css";
import PhotoCard from "./PhotoCard";

const PhotoGrid = ({ images }) => {
  return (
    <div className={styles.photoGrid}>
      {images.map((image, index) => (
        <PhotoCard key={index} src={image.src} alt={image.alt} width={372} height={280} />
      ))}
    </div>
  );
};

export default PhotoGrid; 

import styles from "./PhotoGrid.module.css";
import PhotoCard from "./PhotoCard";
import photoStyles from "./PhotoCard.module.css"

const PhotoGrid = ({ images, onPhotoClick }) => {
  return (
    <div className={styles.photoGrid}>
      {images && images.map((image, index) => (
        <PhotoCard
          className={photoStyles.photoCell}
          key={image.id || index}
          image={image.image}
          videoUrl={image.videoUrl}
          video={image.video}
          currentIndex={index}
          onClick={() => onPhotoClick(index, images)}
        />
      ))}
    </div>
  );
};

export default PhotoGrid; 
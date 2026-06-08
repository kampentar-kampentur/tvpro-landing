
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
          objectPosition={image.objectPosition || image.position || image.alignment || image.object_position}
          currentIndex={index}
          onClick={(e) => onPhotoClick(index, images, e)}
        />
      ))}
    </div>
  );
};

export default PhotoGrid; 

import styles from "./TeamMemberGrid.module.css";
import PhotoCard from "./TeamMemberCard";
import photoStyles from "./TeamMemberCard.module.css"

const PhotoGrid = ({ images }) => {
  console.log(images);
  
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
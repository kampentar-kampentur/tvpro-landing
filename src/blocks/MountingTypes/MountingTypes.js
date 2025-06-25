import ServiceCard from "@/ui/ServiceCard/ServiceCard";
import styles from "./MountingTypes.module.css";
import FixedLight from '@/assets/mount/FixedLight.svg';
import TiltingLight from '@/assets/mount/TiltingLight.svg';
import FullMotionLight from '@/assets/mount/FullMotionLight.svg';
import SpecialMountLight from '@/assets/mount/SpecialMountLight.svg';
import OptionalAddons from "./components/OptionalAddons";

const mountingTypesData = [
  {
    image: <FixedLight width={160} height={100} />,
    title: 'Fixed Mount',
    description: "A low-profile solution for a clean, streamlined look. Perfect when you don't need to adjust the angle.",
  },
  {
    image: <TiltingLight width={160} height={100} />,
    title: 'Tilting Mount',
    description: "Tilt the screen up or down to reduce glare and improve viewing angle — ideal for mounting above fireplaces or higher walls.",
  },
  {
    image: <FullMotionLight width={160} height={100} />,
    title: 'Full-Motion / Swivel Mount',
    description: "Extend, swivel, and tilt your TV in any direction. Great for open rooms, corner installations, or flexible seating areas.",
  },
  {
    image: <SpecialMountLight width={160} height={100} />,
    title: 'Specialty Mounts',
    description: "We mount on brick, stone, concrete, tile, and other non-standard surfaces. Specialized tools and anchors ensure safety and durability.",
  },
];

export default function MountingTypes() {
  return (
    <section className={`block ${styles.mountingTypes}`}>
      <header>
        <h3 className="blockHeading">
          TV Mounting Types
        </h3>
        <p className="subText">We offer a range of secure, high-quality mounting options to match your TV, wall type, and viewing needs.</p>
      </header>
      <div className={styles.cardsGrid}>
        {mountingTypesData.map((card, index) => (
          <ServiceCard
            key={index}
            image={card.image}
            title={card.title}
            description={card.description}
            buttonText="Book Now"
            modalName="BookNow"
          />
        ))}
      </div>
      <OptionalAddons />
    </section>
  );
}
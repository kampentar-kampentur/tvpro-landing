import ServiceCard from "@/ui/ServiceCard/ServiceCard";
import styles from "./TVSizes.module.css";
import UpTo31Light from '@/assets/screens/UpTo31Light.svg';
import QLEDLight from '@/assets/screens/QLEDLight.svg';
import ProjectorLight from '@/assets/screens/ProjectorLight.svg';
import Over81Light from '@/assets/screens/Over81Light.svg';
import SixtyOneEightyLight from '@/assets/screens/61–80Light.svg';
import ThirtyTwoSixtyLight from '@/assets/screens/32–60Light.svg';

const tvSizesData = [
  {
    image: <UpTo31Light width={160} height={100} />,
    title: 'Up to 31" TVs – $69"',
    description: "Great for offices, small bedrooms, or kitchens. Quick installs with flexible mounting options — even in tight spaces.",
  },
  {
    image: <ThirtyTwoSixtyLight width={160} height={100} />,
    title: '32" to 59" TVs - $109',
    description: "The most common living room size. We ensure a secure mount and optimal viewing height for everyday comfort.",
  },
  {
    image: <SixtyOneEightyLight width={160} height={100} />,
    title: '60" to 80" TVs – from $129',
    description: "A centerpiece for larger rooms. We handle weight and wall type considerations to guarantee a stable, seamless look.",
  },
  {
    image: <Over81Light width={160} height={100} />,
    title: 'Over 81" TVs – from $149',
    description: "Extra-large TVs demand expert precision. We bring the tools, experience, and technique to safely mount your biggest screens — clean finish, no exposed wires, no stress.",
  },
  {
    image: <QLEDLight width={160} height={100} />,
    title: 'Frame TV - from $159',
    description: "We mount TVs flush to the wall with a true zero-gap finish — clean, secure, and cable-free, perfect for Frame, OLED, and ultra-slim models.",
  },
  {
    image: <ProjectorLight width={160} height={100} />,
    title: 'Projectors & Screens - from $149',
    description: "We install ceiling-mounted projectors and wall/ceiling screens with precise alignment, clean cable routing, and a perfect viewing angle.",
  },
];

export default function TVSizes() {
  return (
    <section className={`block ${styles.tvsizes}`}>
      <header>
        <h3 className="blockHeading">
          TV Sizes We Mount
        </h3>
        <p className="subText">From compact screens to massive home theater displays &mdash; we&apos;ve got you covered.</p>
      </header>
      <div className={styles.cardsGrid}>
        {tvSizesData.map((card, index) => (
          <ServiceCard
            key={index}
            image={card.image}
            title={card.title}
            description={card.description}
            buttonText="Get The Best Quote"
          />
        ))}
      </div>
    </section>
  );
}
import ServiceCard from "@/ui/ServiceCard/ServiceCard";
import styles from "./TVSizes.module.css";
import UpTo31Light from '@/assets/screens/UpTo31Light.svg';
import QLEDLight from '@/assets/screens/QLEDLight.svg';
import ProjectorLight from '@/assets/screens/ProjectorLight.svg';
import Over81Light from '@/assets/screens/Over81Light.svg';
import SixtyOneEightyLight from '@/assets/screens/61–80Light.svg';
import ThirtyTwoSixtyLight from '@/assets/screens/32–60Light.svg';
import Text from "@/ui/Text/Text";

const images = [
  <UpTo31Light width={160} height={100} key="upTo31" />,
  <ThirtyTwoSixtyLight width={160} height={100} key="32-60" />,
  <SixtyOneEightyLight width={160} height={100} key="61-80" />,
  <Over81Light width={160} height={100} key="over81" />,
  <QLEDLight width={160} height={100} key="qled" />,
  <ProjectorLight width={160} height={100} key="projector" />,
];

async function getTVSizes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/tv-size?populate=*`);
  const json = await res.json();
  
  return json.data;
}

export default async function TVSizes() {
  const tvSizesData = await getTVSizes();
  return (
    <section className={`block ${styles.tvsizes}`}>
      <header>
        <h3 className="blockHeading">
        <Text text={tvSizesData.title}/>
        </h3>
        <p className="subText">
          <Text text={tvSizesData.subTitle}/>
        </p>
      </header>
      <div className={styles.cardsGrid}>
        {tvSizesData.tvsizes && tvSizesData.tvsizes.length && tvSizesData.tvsizes.map((card, index) => (
          <ServiceCard
            key={card.id || index}
            image={images[index] || null}
            title={card.title}
            description={card.description}
            buttonText="Get The Best Quote"
          />
        ))}
      </div>
    </section>
  );
}
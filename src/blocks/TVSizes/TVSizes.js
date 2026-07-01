import ServiceCard from "@/ui/ServiceCardWithMobile/ServiceCard";
import styles from "./TVSizes.module.css";
import Text from "@/ui/Text/Text";
import { resolveSpintax } from "@/lib/spintax";

async function getTVSizes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/tv-size?populate[tvsizes][populate]=*`);
  const json = await res.json();
  return json.data;
}

export default async function TVSizes({ data = {}, cityContext }) {
  // Always fetch default data (fallback)
  const defaultTvSizesData = await getTVSizes();

  const rawTvSizes = (data?.tvsizes && data.tvsizes.length > 0) ? data.tvsizes : (defaultTvSizesData.tvsizes || []);
  const tvsizes = rawTvSizes.map(card => ({
    ...card,
    title: resolveSpintax(card.title || ''),
    description: resolveSpintax(card.description || ''),
  }));

  // Merge: Use prop data if available, otherwise fallback to default
  const tvSizesData = {
    ...defaultTvSizesData,
    ...data,
    title: resolveSpintax(data?.title || defaultTvSizesData.title || ''),
    subTitle: resolveSpintax(data?.subTitle || defaultTvSizesData.subTitle || ''),
    tvsizes
  };
  return (
    <section className={`block ${styles.tvsizes}`}>
      <header>
        <h2 className="blockHeading">
          <Text text={tvSizesData.title} cityContext={cityContext} />
        </h2>
        <p className="subText">
          <Text text={tvSizesData.subTitle} cityContext={cityContext} />
        </p>
      </header>
      <div className={styles.cardsGrid}>
        {tvSizesData.tvsizes && tvSizesData.tvsizes.length && tvSizesData.tvsizes.map((card, index) => (
          <ServiceCard
            key={card.id || index}
            image={card.image}
            title={card.title}
            description={card.description}
            buttonText="Get The Best Quote"
            price={card.price}
            cityContext={cityContext}
          />
        ))}
      </div>
    </section>
  );
}
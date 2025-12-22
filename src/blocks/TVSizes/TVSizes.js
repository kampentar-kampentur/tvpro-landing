import ServiceCard from "@/ui/ServiceCardWithMobile/ServiceCard";
import styles from "./TVSizes.module.css";
import Text from "@/ui/Text/Text";

async function getTVSizes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/tv-size?populate[tvsizes][populate]=*`);
  const json = await res.json();
  return json.data;
}

export default async function TVSizes() {
  const tvSizesData = await getTVSizes();
  return (
    <section className={`block ${styles.tvsizes}`}>
      <header>
        <h2 className="blockHeading">
        <Text text={tvSizesData.title}/>
        </h2>
        <p className="subText">
          <Text text={tvSizesData.subTitle}/>
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
          />
        ))}
      </div>
    </section>
  );
}
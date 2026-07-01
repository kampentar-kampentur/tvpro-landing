import styles from "./WhyCustomersTrustUs.module.css";
import TrustCard from "./components/TrustCard";
import Text from "@/ui/Text/Text";
import { resolveSpintax } from "@/lib/spintax";

async function getWhyCustomersTrustUs() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/why-customers-choose-us?populate[cards][populate]=*`,
  );
  const json = await res.json();
  return json.data;
}

// Default export with data prop
export default async function WhyCustomersTrustUs({ data = {}, cityContext }) {
  const defaultTrustData = await getWhyCustomersTrustUs();

  // Merge: Use prop data if available, otherwise fallback to default
  const rawCards = data?.cards && data.cards.length > 0 ? data.cards : (defaultTrustData.cards || []);
  const cards = rawCards.map(card => ({
    ...card,
    title: resolveSpintax(card.title || ''),
    description: resolveSpintax(card.description || ''),
  }));

  const trustData = {
    ...defaultTrustData,
    ...data,
    title: resolveSpintax(data?.title || defaultTrustData.title || ''),
    subTitle: resolveSpintax(data?.subTitle || defaultTrustData.subTitle || ''),
    cards,
  };
  return (
    <section className={`block ${styles.whyCustomersTrustUs}`} id="trustus">
      <header>
        <h2 className="blockHeading"><Text text={trustData.title} cityContext={cityContext} /></h2>
        <p className="subText"><Text text={trustData.subTitle} cityContext={cityContext} /></p>
      </header>
      <div className={styles.cardsContainer}>
        {trustData.cards &&
          trustData.cards.length &&
          trustData.cards.map((card, index) => (
            <TrustCard
              key={card.id || index}
              image={card.image}
              title={card.title}
              description={card.description}
              cityContext={cityContext}
            />
          ))}
      </div>
    </section>
  );
}

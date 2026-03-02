import styles from "./WhyCustomersTrustUs.module.css";
import TrustCard from "./components/TrustCard";
import { getBaseUrl } from "@/lib/env";

async function getWhyCustomersTrustUs() {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/why-customers-choose-us?populate[cards][populate]=*`);
  const json = await res.json();
  return json.data;
}

// Default export with data prop
export default async function WhyCustomersTrustUs({ data = {} }) {
  const defaultTrustData = await getWhyCustomersTrustUs();

  // Merge: Use prop data if available, otherwise fallback to default
  const trustData = {
    ...defaultTrustData,
    ...data,
    title: data?.title || defaultTrustData.title,
    subTitle: data?.subTitle || defaultTrustData.subTitle,
    cards: (data?.cards && data.cards.length > 0) ? data.cards : defaultTrustData.cards
  };
  return (
    <section className={`block ${styles.whyCustomersTrustUs}`} id="reviews">
      <header>
        <h2 className="blockHeading">
          {trustData.title}
        </h2>
        <p className="subText">{trustData.subTitle}</p>
      </header>
      <div className={styles.cardsContainer}>
        {trustData.cards && trustData.cards.length && trustData.cards.map((card, index) => (
          <TrustCard
            key={card.id || index}
            image={card.image}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </section>
  );
};


import styles from "./WhyCustomersTrustUs.module.css";
import TrustCard from "./components/TrustCard";

async function getWhyCustomersTrustUs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/why-customers-choose-us?populate[cards][populate]=*`);
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


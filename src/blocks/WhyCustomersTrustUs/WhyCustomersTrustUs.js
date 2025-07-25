import styles from "./WhyCustomersTrustUs.module.css";
import TrustCard from "./components/TrustCard";

async function getWhyCustomersTrustUs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/why-customers-choose-us?populate[cards][populate]=*`);
  const json = await res.json();
  return json.data;
}

const WhyCustomersTrustUs = async () => {
  const data = await getWhyCustomersTrustUs();
  return (
    <section className={`block ${styles.whyCustomersTrustUs}`} id="reviews">
      <header>
        <h2 className="blockHeading">
          {data.title}
        </h2>
        <p className="subText">{data.subTitle}</p>
      </header>
      <div className={styles.cardsContainer}>
        {data.cards && data.cards.length && data.cards.map((card, index) => (
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

export default WhyCustomersTrustUs; 
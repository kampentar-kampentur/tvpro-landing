import ServiceCard from "@/ui/ServiceCard/ServiceCard";
import styles from "./MountingTypes.module.css";
import OptionalAddons from "./components/OptionalAddons";
import Text from "@/ui/Text/Text";

async function getMountingTypes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/tv-mounting-type?populate[mountingTypes][populate]=*`);
  const json = await res.json();
  return json.data;
}

export default async function MountingTypes() {
  const data = await getMountingTypes();
  return (
    <section className={`block ${styles.mountingTypes}`}>
      <header>
        <h2 className="blockHeading">
          <Text text={data.title} />
        </h2>
        <p className="subText">
          <Text text={data.subTitle} />
        </p>
      </header>
      <div className={styles.cardsGrid}>
        {data.mountingTypes && data.mountingTypes.length && data.mountingTypes.map((card, index) => (
          <ServiceCard
            key={card.id || index}
            image={card.image}
            title={card.title}
            description={card.description}
            buttonText="Book Now"
            modalName="BookNow"
          />
        ))}
      </div>
      <OptionalAddons addons={data.addons || []} />
    </section>
  );
}
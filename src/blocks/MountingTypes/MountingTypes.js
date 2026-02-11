import ServiceCard from "@/ui/ServiceCard/ServiceCard";
import styles from "./MountingTypes.module.css";
import OptionalAddons from "./components/OptionalAddons";
import Text from "@/ui/Text/Text";

async function getMountingTypes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/tv-mounting-type?populate[mountingTypes][populate]=*`);
  const json = await res.json();
  return json.data;
}

// Default export with data prop
export default async function MountingTypes({ data = {} }) {
  const defaultMountingData = await getMountingTypes();

  // Merge: Use prop data if available, otherwise fallback to default
  const mountingData = {
    ...defaultMountingData,
    ...data,
    title: data?.title || defaultMountingData.title,
    subTitle: data?.subTitle || defaultMountingData.subTitle,
    mountingTypes: (data?.mountingTypes && data.mountingTypes.length > 0) ? data.mountingTypes : defaultMountingData.mountingTypes,
    addons: (data?.addons && data.addons.length > 0) ? data.addons : defaultMountingData.addons
  };
  return (
    <section className={`block ${styles.mountingTypes}`}>
      <header>
        <h2 className="blockHeading">
          <Text text={mountingData.title} />
        </h2>
        <p className="subText">
          <Text text={mountingData.subTitle} />
        </p>
      </header>
      <div className={styles.cardsGrid}>
        {mountingData.mountingTypes && mountingData.mountingTypes.length && mountingData.mountingTypes.map((card, index) => (
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
      <OptionalAddons addons={mountingData.addons || []} />
    </section>
  );
}
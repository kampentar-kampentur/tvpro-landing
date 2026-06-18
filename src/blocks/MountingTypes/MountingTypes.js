import ServiceCard from "@/ui/ServiceCard/ServiceCard";
import styles from "./MountingTypes.module.css";
import OptionalAddons from "./components/OptionalAddons";
import Text from "@/ui/Text/Text";
import { resolveSpintax } from "@/lib/spintax";

async function getMountingTypes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/tv-mounting-type?populate[mountingTypes][populate]=*`);
  const json = await res.json();
  return json.data;
}

// Default export with data prop
export default async function MountingTypes({ data = {}, cityContext }) {
  const defaultMountingData = await getMountingTypes();

  // Merge: Use prop data if available, otherwise fallback to default
  const rawMountingTypes = (data?.mountingTypes && data.mountingTypes.length > 0) ? data.mountingTypes : (defaultMountingData.mountingTypes || []);
  const mountingTypes = rawMountingTypes.map(card => ({
    ...card,
    title: resolveSpintax(card.title || ''),
    description: resolveSpintax(card.description || ''),
  }));

  const mountingData = {
    ...defaultMountingData,
    ...data,
    title: resolveSpintax(data?.title || defaultMountingData.title || ''),
    subTitle: resolveSpintax(data?.subTitle || defaultMountingData.subTitle || ''),
    mountingTypes,
    addons: (data?.addons && data.addons.length > 0) ? data.addons : defaultMountingData.addons
  };
  return (
    <section className={`block ${styles.mountingTypes}`}>
      <header>
        <h2 className="blockHeading">
          <Text text={mountingData.title} cityContext={cityContext} />
        </h2>
        <p className="subText">
          <Text text={mountingData.subTitle} cityContext={cityContext} />
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
            cityContext={cityContext}
          />
        ))}
      </div>
      <OptionalAddons addons={mountingData.addons || []} />
    </section>
  );
}
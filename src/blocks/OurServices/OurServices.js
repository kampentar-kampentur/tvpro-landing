import styles from "./OurServices.module.css";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import OurServicesInteractive from "./components/OurServicesInteractive";
import ImageWrapper from "@/ui/ImageWrapper/ImageWrapper";
import Text from "@/ui/Text/Text";
import { resolveSpintax } from "@/lib/spintax";

async function getOurServices() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/our-service?populate[services][populate]=image`);
  const json = await res.json();

  return json.data;
}

// Default export with data prop
export default async function OurServices({ data = {}, cityContext }) {
  const defaultServicesData = await getOurServices();

  const rawServices = (data?.services && data.services.length > 0) ? data.services : (defaultServicesData.services || []);
  const services = rawServices.map(service => ({
    ...service,
    title: resolveSpintax(service.title || ''),
    label: resolveSpintax(service.label || ''),
    description: resolveSpintax(service.description || ''),
  }));

  // Merge: Use prop data if available, otherwise fallback to default
  const servicesData = {
    ...defaultServicesData,
    ...data,
    services
  };

  return (
    <section className={styles.ourServices} id="services">
      <div className={`blockContainer ${styles.ourServicesContainer}`}>
        <h2 className={`${styles.mainHeading} blockHeading`}>Our Services</h2>
        <div className="sr-only">
          <div className={styles.categoriesWrapper}>
            {servicesData.services.map((service) => (
              <button
                key={service.id}
                className={styles.categoryButton}
              >
                <span className={styles.progress}></span>
                <span className={styles.categoryButtonText}>
                  <Text text={service.title} cityContext={cityContext} />
                </span>
              </button>
            ))}
          </div>

          {servicesData.services.map(service => (
            <div className={`${styles.detailsWrapper} sr-only`} key={service.id}>
              <div className={styles.detailsImage}>
                <ImageWrapper media={service.image} defaultAlt={service.title} sizes="(max-width: 768px) 100vw, 800px" />
              </div>
              <div className={styles.detailsContent}>
                <h3 className={styles.detailsTitle}>
                  <Text text={service.title} cityContext={cityContext} />
                </h3>
                <p className={styles.detailsDescription}>
                  <Text text={service.description} cityContext={cityContext} />
                </p>
                <QuoteButton modalName="BookNow">Book Now</QuoteButton>
              </div>
            </div>
          ))}
        </div>
        <OurServicesInteractive servicesData={servicesData.services} cityContext={cityContext} />
      </div>
    </section>
  );
} 
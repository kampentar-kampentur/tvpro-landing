import React from "react";
import styles from "./BriefServices.module.css";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import ImageWrapper from "@/ui/ImageWrapper/ImageWrapper";
import Text from "@/ui/Text/Text";
import { resolveSpintax } from "@/lib/spintax";
import ScrollSnapSlider from "@/ui/ScrollSnapSlider/ScrollSnapSlider";

async function getOurServices() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/our-service?populate[services][populate]=image`,
  );
  const json = await res.json();
  return json.data;
}

const truncateText = (text, maxLength = 85) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

export default async function BriefServices({ data = {}, cityContext }) {
  const defaultServicesData = await getOurServices();

  const rawServices =
    data?.services && data.services.length > 0
      ? data.services
      : defaultServicesData?.services || [];

  const services = rawServices.map((service) => ({
    ...service,
    title: resolveSpintax(service.title || ""),
    label: resolveSpintax(service.label || ""),
    description: resolveSpintax(service.description || ""),
  }));

  const servicesData = {
    ...defaultServicesData,
    ...data,
    services,
  };

  // Slice the first 5 services for a clean single-row desktop layout
  const slicedServices = servicesData.services.slice(0, 5);

  return (
    <section className={`block ${styles.briefServices}`} id="services-brief">
      <header className={styles.header}>
        <h2 className="blockHeading">
          <Text text="Our Services" cityContext={cityContext} />
        </h2>
      </header>

      <ScrollSnapSlider className={styles.cardsGrid} dotsPosition="top">
        {slicedServices.map((service) => {
          const briefDescription = truncateText(service.description);
          return (
            <div key={service.id} className={styles.serviceCard}>
              <div className={styles.imageWrapper}>
                <ImageWrapper
                  media={service.image}
                  defaultAlt={service.title}
                  sizes="(max-width: 1024px) 100vw, 250px"
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.contentWrapper}>
                <h3 className={styles.title}>
                  <Text text={service.title} cityContext={cityContext} />
                </h3>
                <p className={styles.description}>
                  <Text text={briefDescription} cityContext={cityContext} />
                </p>
                <div className={styles.buttonContainer}>
                  <QuoteButton
                    modalName="BookNow"
                    variant="secondary"
                    size="small"
                    className={styles.cardButton}
                  >
                    Book Now
                  </QuoteButton>
                </div>
              </div>
            </div>
          );
        })}
      </ScrollSnapSlider>
    </section>
  );
}

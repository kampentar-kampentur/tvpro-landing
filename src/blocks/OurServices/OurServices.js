import styles from "./OurServices.module.css";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import OurServicesInteractive from "./components/OurServicesInteractive";
import ImageWrapper from "@/ui/ImageWrapper/ImgaeWrapper";

async function getOurServices() {
    console.log("getOurServices");
    const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/our-service?populate[services][populate]=image`);
    const json = await res.json();
    console.log("getOurServices res");
    
    return json.data;
  }
  

export default async function OurServices() {
  const servicesData = await getOurServices();
  
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
                <span className={styles.categoryButtonText}>{service.title}</span>
                </button>
            ))}
            </div>

            {servicesData.services.map(service => (
                <div className={`${styles.detailsWrapper} sr-only`} key={service.id}>
                    <div className={styles.detailsImage}>
                        <ImageWrapper image={service.image}/>
                    </div>
                    <div className={styles.detailsContent}>
                        <h3 className={styles.detailsTitle}>{service.title}</h3>
                    <p className={styles.detailsDescription}>
                        {service.description}
                    </p>
                        <QuoteButton modalName="BookNow">Book Now</QuoteButton>
                    </div>
                </div>
            ))}
        </div>
        <OurServicesInteractive servicesData={servicesData.services}/>
      </div>
    </section>
  );
} 
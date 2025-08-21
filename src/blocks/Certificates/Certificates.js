import styles from "./Certificates.module.css";
import { SliderGallery } from "@/ui/SliderGallery/SliderGallery";
import CertificateCard from "./components/CertificateCard";
import Text from "@/ui/Text/Text";

async function getCertificates() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/certificate?populate=*`, {
      next: { revalidate: 60 } // Revalidate at most every 60 seconds
    });
    
    if (!res.ok) {
      // Return fallback data if API is not available
      return {
        title: "Our Certificates",
        subTitle: "Professional certifications and quality assurances",
        certificates: []
      };
    }
    
    const json = await res.json();
    
    return json.data;
  } catch (error) {
    // Return fallback data if API is not available
    console.log(error);
    
    return {
      title: "Our Certificates",
      subTitle: "Professional certifications and quality assurances",
      certificates: []
    };
  }
}

const Certificates = async () => {
  const certificatesData = await getCertificates();

  return (
    <section className={`block ${styles.certificates}`}>
      <header className={styles.certificatesHeader}>
        <h2 className="blockHeading">
          <Text text={certificatesData.title}/>
        </h2>
        <p className="subText"><Text text={certificatesData.subTitle}/></p>
      </header>
      <div className={styles.sliderWrap}>
        <SliderGallery
          CardComponent={CertificateCard}
          cardData={certificatesData.certificates.map(c => ({image: c, className: styles.imgWrapper}))}
          cardsPerPage={4}
        />
      </div>
    </section>
  );
};

export default Certificates;
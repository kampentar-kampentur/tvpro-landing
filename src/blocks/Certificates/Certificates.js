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

// Default export with data prop
export default async function Certificates({ data = {} }) {
  const defaultCertificatesData = await getCertificates();

  // Merge: Use prop data if available, otherwise fallback to default
  const certificatesData = {
    ...defaultCertificatesData,
    ...data,
    title: data?.title || defaultCertificatesData.title,
    subTitle: data?.subTitle || defaultCertificatesData.subTitle,
    certificates: (data?.certificates && data.certificates.length > 0) ? data.certificates : defaultCertificatesData.certificates
  };

  return (
    <section className={`block ${styles.certificates}`}>
      <header className={styles.certificatesHeader}>
        <h2 className="blockHeading">
          <Text text={certificatesData.title} />
        </h2>
        <p className="subText"><Text text={certificatesData.subTitle} /></p>
      </header>
      <div className={styles.sliderWrap}>
        <SliderGallery
          CardComponent={CertificateCard}
          cardData={certificatesData.certificates.map((c, index) => ({
            image: c,
            className: styles.imgWrapper,
            certificates: certificatesData.certificates,
            currentIndex: index
          }))}
          cardsPerPage={4}
        />
      </div>
    </section>
  );
};

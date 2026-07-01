import styles from "./AboutUs.module.css";
import Text from "@/ui/Text/Text";
import { resolveSpintax } from "@/lib/spintax";

async function getAboutUs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/about-us?populate=*`);
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching about us:", error);
    return {};
  }
}

// Default export with data prop
export default async function AboutUs({ data = {}, cityContext }) {
  const defaultAboutUsData = await getAboutUs();

  // Merge: Use prop data if available, otherwise fallback to default
  const aboutUsData = {
    ...defaultAboutUsData,
    ...data,
    title: resolveSpintax(data?.title || defaultAboutUsData.title || ''),
    subTitle: resolveSpintax(data?.subTitle || defaultAboutUsData.subTitle || ''),
    mainTextLeft: resolveSpintax(data?.mainTextLeft || defaultAboutUsData.mainTextLeft || ''),
    mainTextRight: resolveSpintax(data?.mainTextRight || defaultAboutUsData.mainTextRight || ''),
  };
  return (
    <section className={`block ${styles.aboutUs}`} id="about">
      <header className={styles.aboutUsHeader}>
        <h2 className="blockHeading"><Text text={aboutUsData.title} cityContext={cityContext} /></h2>
        <p className="subText"><Text text={aboutUsData.subTitle} cityContext={cityContext} /></p>
      </header>
      <div className={styles.contentContainer}>
        <p className={styles.mainText}>
          <Text text={aboutUsData.mainTextLeft} cityContext={cityContext} />
        </p>
        <p className={styles.mainText}>
          <Text text={aboutUsData.mainTextRight} cityContext={cityContext} />
        </p>
      </div>
    </section>
  );
}


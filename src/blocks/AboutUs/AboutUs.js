import styles from "./AboutUs.module.css";
import Text from "@/ui/Text/Text";

async function getAboutUs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/about-us?populate=*`);
  const json = await res.json();
  return json.data;
}

// Default export with data prop
export default async function AboutUs({ data = {} }) {
  const defaultAboutUsData = await getAboutUs();

  // Merge: Use prop data if available, otherwise fallback to default
  const aboutUsData = {
    ...defaultAboutUsData,
    ...data,
    title: data?.title || defaultAboutUsData.title,
    subTitle: data?.subTitle || defaultAboutUsData.subTitle,
    mainTextLeft: data?.mainTextLeft || defaultAboutUsData.mainTextLeft,
    mainTextRight: data?.mainTextRight || defaultAboutUsData.mainTextRight,
  };
  return (
    <section className={`block ${styles.aboutUs}`} id="about">
      <header className={styles.aboutUsHeader}>
        <h2 className="blockHeading"><Text text={aboutUsData.title} /></h2>
        <p className="subText"><Text text={aboutUsData.subTitle} /></p>
      </header>
      <div className={styles.contentContainer}>
        <p className={styles.mainText}>
          <Text text={aboutUsData.mainTextLeft} />
        </p>
        <p className={styles.mainText}>
          <Text text={aboutUsData.mainTextRight} />
        </p>
      </div>
    </section>
  );
};


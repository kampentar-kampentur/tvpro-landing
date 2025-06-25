import styles from "./AboutUs.module.css";
import Text from "@/ui/Text/Text";

async function getAboutUs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/about-us?populate=*`);
  const json = await res.json();
  return json.data;
}

const AboutUs = async () => {
  const data = await getAboutUs();
  return (
    <section className={`block ${styles.aboutUs}`} id="about">
        <header className={styles.aboutUsHeader}>
          <h2 className="blockHeading"><Text text={data.title} /></h2>
          <p className="subText"><Text text={data.subTitle} /></p>
        </header>
        <div className={styles.contentContainer}>
          <p className={styles.mainText}>
            <Text text={data.mainTextLeft} />
          </p>
          <p className={styles.mainText}>
            <Text text={data.mainTextRight} />
          </p>
        </div>
    </section>
  );
};

export default AboutUs; 
import styles from "./page.module.css";
import Hero from "@/blocks/Hero";
import TVSizes from "@/blocks/TVSizes";
import OurServices from "@/blocks/OurServices";

export default function Home() {
  return (
    <div className={styles.tvproMain}>
      <Hero />
      <TVSizes />
      <OurServices />
    </div>
  );
}

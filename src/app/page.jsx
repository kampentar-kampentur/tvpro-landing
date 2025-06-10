import TVSizes from "@/blocks/TVSizes/TVSizes";
import styles from "./page.module.css";
import Hero from "@/blocks/Hero";

export default function Home() {
  return (
    <div className={styles.tvproMain}>
      <Hero />
      <TVSizes />
    </div>
  );
}

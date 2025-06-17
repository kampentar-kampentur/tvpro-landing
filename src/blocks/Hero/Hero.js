
import styles from "./Hero.module.css";
import RunningTextLine from "./components/RunningTextLine";
import Button from "@/ui/Button";
import OneYearWarantyBadge from "@/assets/badges/OneYearWarantyBadge.svg"
import FiveStarBadge from "@/assets/badges/FiveStarBadge.svg"
import AboveBadge from "@/assets/badges/AboveBadge.svg"
import VideoPlayer from "./components/VideoPlayer"

export default function Hero() {
  const heroTextLines = [
    { main: "TV Installation on Any Surface", sub: "Drywall, Brick, Tile & Stone" },
    { main: "Premium Wire Concealment", sub: "Even Through Brick Walls" },
    { main: "Shoe Covers. Clean Work Area. Respect for Your Home.", sub: "Always." },
    { main: "Elegant Wall-Mounted Solutions for Frame & Ultra-Slim TVs", sub: "" },
    { main: "TV + Soundbar Combo Installation", sub: "" },
    { main: "Discounts Available", sub: "" },
  ];

  return (
    <>
      <RunningTextLine textLines={heroTextLines} />
      <section className={`block ${styles.hero}`}>
        <div className={`blockContainer ${styles.heroContainer}`}>
          <h1 className={styles.mainHeading}>
              Same Day Exclusive TV Mounting <br/> On Any Wall - Clean, Fast, and Hidden Wires
          </h1>
          <p className="subText">Over 3,000 TVs professionally installed - just ask your neighbors.</p>
          <div className={styles.buttonWrapper}>
              <Button>Get a Free Quote</Button>
          </div>
          <div className={styles.badgesWrapper}>
              <div className={styles.badge} role="img" aria-label="Rated 5.0 from 185 reviews">
                  <FiveStarBadge aria-hidden="true" focusable="false" className={styles.fiveStarBadge}/>
                  <span className="sr-only">Rated 5.0 from 185 reviews</span>
              </div>
              <div className={styles.badge} role="img" aria-label="1 year waranty">
                  <OneYearWarantyBadge aria-hidden="true" focusable="false" className={styles.oneYearWarantyBadge}/>
                  <span className="sr-only">1 year waranty</span>
              </div>
              <div className={styles.badge} role="img" aria-label="Above Fireplace Included">
                  <AboveBadge aria-hidden="true" focusable="false" className={styles.aboveBadge}/>
                  <span className="sr-only">Above Fireplace Included</span>
              </div>
          </div>
        </div>
      </section>
      <VideoPlayer/>
    </>
  );
}
import React from "react";
import styles from "./Hero.module.css";
import RunningTextLine from "./components/RunningTextLine";
import Button from "@/ui/Button";
import AboveIMG from "@/assets/above-img.svg"
import OneYearWarantyBadge from "@/assets/oneYearWarantyBadge.svg"
import FiveStarBadge from "@/assets/fiveStarBadge.svg"
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
    <section className={styles.hero}>
      <RunningTextLine textLines={heroTextLines} />
      <div className={styles.container}>
        <h1 className={styles.mainHeading}>
            Same Day Exclusive TV Mounting <br/> On Any Wall - Clean, Fast, and Hidden Wires
        </h1>
        <p className={styles.subText}>Over 3,000 TVs professionally installed - just ask your neighbors. 5.0</p>
        <div className={styles.buttonWrapper}>
            <Button>Get a Free Quote</Button>
            <AboveIMG className={styles.aboveImg}/>
        </div>
        <div className={styles.badgesWrapper}>
            <div className={styles.badge} role="img" aria-label="Rated 5.0 from 185 reviews">
                <FiveStarBadge aria-hidden="true" focusable="false"/>
                <span className="sr-only">Rated 5.0 from 185 reviews</span>
            </div>
            <div className={styles.badge} role="img" aria-label="Rated 5.0 from 185 reviews">
                <OneYearWarantyBadge aria-hidden="true" focusable="false"/>
                <span className="sr-only">Rated 5.0 from 185 reviews</span>
            </div>
        </div>
        <VideoPlayer/>
      </div>
    </section>
  );
}
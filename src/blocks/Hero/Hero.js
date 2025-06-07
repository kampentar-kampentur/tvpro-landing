import React from "react";
import styles from "./Hero.module.css";
import RunningTextLine from "./components/RunningTextLine";

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
      <div className={styles.container}>
        {/* Main Hero content will go here */}
      </div>
      <RunningTextLine textLines={heroTextLines} />
    </section>
  );
}

import React from "react";
import styles from "./WhyCustomersTrustUs.module.css";
import TrustCard from "./components/TrustCard";

import IconTools from "@/assets/trustBlockIcons/Tools.svg";
import IconShieldUser from "@/assets/trustBlockIcons/Shield-user.svg";
import IconMoney from "@/assets/trustBlockIcons/Money.svg";
import IconLike from "@/assets/trustBlockIcons/Like.svg";
import IconFlower from "@/assets/trustBlockIcons/Flower.svg";
import IconClock from "@/assets/trustBlockIcons/Clock.svg";

const cardsData = [
  {
    icon: <IconTools width="48" height="48"/>,
    title: "Experience That Shows",
    description: "With over 3,000 TVs mounted on drywall, brick, tile, and fireplaces — we know how to get the job done right.\nFrom small bedrooms to full living room setups, we deliver clean, secure, and well-aligned installations every time.\nFast. Safe. Solid.",
  },
  {
    icon: <IconShieldUser width="48" height="48"/>,
    title: "Guaranteed Quality",
    description: "We stand behind every job with a 1-Year Warranty. Clients recommend us because we care about every finish, wire, and final result.\nIf something goes wrong — we make it right. We\'re not just installing. We\'re earning your trust.",
  },
  {
    icon: <IconMoney width="48" height="48"/>,
    title: "Clear & Honest Pricing",
    description: "No upsells. No surprises. Just flat-rate prices based on your TV size and wall type. Optional add-ons like soundbar mounting, wire concealment, or bracket supply are all listed clearly before we begin. Simple pricing. No guesswork.",
  },
  {
    icon: <IconLike width="48" height="48"/>,
    title: "Same-Day & Flexible Scheduling",
    description: "Need a last-minute install? We offer same-day service, plus evenings and weekends — no extra charge.\nWe\'re ready when you are.\nTV mounting near me — easy, fast, done.",
  },
  {
    icon: <IconFlower width="48" height="48"/>,
    title: "Clean Work, Every Time",
    description: "We wear shoe covers, work clean, and leave your home just as we found it — only with a perfectly installed TV.\nNo dust. No trash. No mess.\nRespect for your home is part of the job.",
  },
  {
    icon: <IconClock width="48" height="48"/>,
    title: "Top Rated, Near You",
    description: "5-star reviews on Google, Yelp, and Thumbtack speak for themselves.\nFrom the first message to the final result, we deliver a service people feel confident recommending.\nLocally trusted. Professionally executed.",
  },
];

const WhyCustomersTrustUs = () => {
  return (
    <section className={`block ${styles.whyCustomersTrustUs}`}>
      <header>
        <h3 className="blockHeading">
          Why Customers Choose TVPro Handy Services?
        </h3>
        <p className="subText">We&apos;re trusted by homeowners and businesses near you — not just for TV mounting, but for how we treat every space and every detail. <br/>Here&apos;s why clients choose TVPro Handy Services again and again:</p>
      </header>
      <div className={styles.cardsContainer}>
        {cardsData.map((card, index) => (
          <TrustCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </section>
  );
};

export default WhyCustomersTrustUs; 
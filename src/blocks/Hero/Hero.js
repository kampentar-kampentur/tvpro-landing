import React from "react";
import styles from "./Hero.module.css";
import RunningTextLine from "./components/RunningTextLine";
import ImageWrapper from "@/ui/ImageWrapper/ImgaeWrapper";
import dynamic from "next/dynamic";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import Text from "@/ui/Text/Text";
import Head from "next/head";
import Image from "next/image";
import OneYearWarantyImg from "@/assets/badges/1yearwaranty.webp"
import FiveStarImg from "@/assets/badges/5star.webp"
import SevenDaysImg from "@/assets/badges/7days.webp"

// Dynamically import VideoPlayer with lazy loading
const VideoPlayer = dynamic(() => import("./components/VideoPlayer"), {
  loading: () => <div className={styles.videoPlaceholder}>Loading video...</div>
});

async function getHero() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/hero?populate=*`);
  const json = await res.json();
  
  return json.data;
}
async function getHeroRunningLines() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/hero-text-lines`);
  const json = await res.json();

  return json.data;
}

export default async function Hero() {
  const heroData = await getHero();
  const heroLinesData = await getHeroRunningLines();

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": "TV Wall Mounting Demo by TVPro Handy Services",
              "description": "Watch how TVPro installs a wall-mounted TV quickly and professionally.",
              "uploadDate": "2025-07-25",
              "contentUrl": "https://tvprousa.com/mainVideo2.mp4",
              "embedUrl": "https://tvprousa.com",
            }),
          }}
        />
      </Head>
      <RunningTextLine textLines={heroLinesData} />
      <div className={`block ${styles.hero}`}>
        <div className={`blockContainer ${styles.heroContainer}`}>
          <h1 className={styles.mainHeading}>
            <Text text={heroData.title}/>
          </h1>
          <p className="subText">
            <Text text={heroData.subTitle}/>
          </p>
          <div className={styles.buttonWrapper}>
            <QuoteButton>Book With Discount</QuoteButton>
          </div>
          <div className={styles.badgesWrapper}>
              {/* {heroData.badges.map(badge => (
                <ImageWrapper
                  className={styles.badge}
                  key={badge.id}
                  media={badge}
                  defaultAlt="badge"
                />
              ))} */}
              <Image className={styles.oneYearWarantyImg} src={OneYearWarantyImg} width={94} height={64}/>
              <Image className={styles.fiveStarImg} src={FiveStarImg} width={72} height={72}/>
              <Image className={styles.sevenDaysImg} src={SevenDaysImg} width={158} height={56}/>
          </div>
        </div>
      </div>
      <VideoPlayer/>
    </>
  );
}
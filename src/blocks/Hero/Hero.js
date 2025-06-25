import React from "react";
import styles from "./Hero.module.css";
import RunningTextLine from "./components/RunningTextLine";
import ImageWrapper from "@/ui/ImageWrapper/ImgaeWrapper";
import VideoPlayer from "./components/VideoPlayer";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import Text from "@/ui/Text/Text";

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
      <RunningTextLine textLines={heroLinesData} />
      <section className={`block ${styles.hero}`}>
        <div className={`blockContainer ${styles.heroContainer}`}>
          <h1 className={styles.mainHeading}>
            <Text text={heroData.title}/>
          </h1>
          <p className="subText">
            <Text text={heroData.subTitle}/>
          </p>
          <div className={styles.buttonWrapper}>
            <QuoteButton/>
          </div>
          <div className={styles.badgesWrapper}>
              {heroData.badges.map(badge => (
                <ImageWrapper
                  className={styles.badge}
                  key={badge.id}
                  media={badge}
                  defaultAlt="badge"
                />
              ))}
          </div>
        </div>
      </section>
      <VideoPlayer src={heroData.video.url}/>
    </>
  );
}
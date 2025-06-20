import React from "react";
import styles from "./Hero.module.css";
import RunningTextLine from "./components/RunningTextLine";
import Button from "@/ui/Button";
// import Image from "next/image";
import ImageWrapper from "@/ui/ImageWrapper/ImgaeWrapper";
import VideoPlayer from "./components/VideoPlayer";

async function getHero() {
  const res = await fetch(`${process.env.SRTAPI_URL}/api/hero?populate=*`);
  const json = await res.json();
  return json.data;
}
async function getHeroRunningLines() {
  const res = await fetch(`${process.env.SRTAPI_URL}/api/hero-text-lines`);
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
            {heroData.title.split('\n').map((text, index) => (
              <React.Fragment key={index}>
                {text}
                <br />
              </React.Fragment>
            ))}
          </h1>
          <p className="subText">
            {heroData.subTitle.split('\n').map((text, index) => (
              <React.Fragment key={index}>
                {text}
                <br />
              </React.Fragment>
            ))}
          </p>
          <div className={styles.buttonWrapper}>
              <Button>Get a Free Quote</Button>
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
      <VideoPlayer src={process.env.SRTAPI_URL + heroData.video.url}/>
    </>
  );
}
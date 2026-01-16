import React from "react";
import styles from "./Hero.module.css";
import RunningTextLine from "./components/RunningTextLine";
import ImageWrapper from "@/ui/ImageWrapper/ImgaeWrapper";
import dynamic from "next/dynamic";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import Text from "@/ui/Text/Text";
import Head from "next/head";
import Image from "next/image";
import TwoYearsWarantyImg from "@/assets/badges/2yearswaranty.webp"
import FiveStarImg from "@/assets/badges/5star.webp"
import SevenDaysImg from "@/assets/badges/7days.webp"
import InsuredImg from "@/assets/badges/insured.webp"
import Banner1Img from "@/assets/banners/banner116.png"
import Banner2Img from "@/assets/banners/banner216.png"

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
            <QuoteButton>Get Your Price in 30 Seconds</QuoteButton>
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
              <Image className={styles.twoYearsWarantyImg} src={TwoYearsWarantyImg} width={94} height={64} alt="One Year Warranty Badge"/>
              <Image className={styles.fiveStarImg} src={FiveStarImg} width={72} height={72} alt="Five Star Rating Badge"/>
              <Image className={styles.sevenDaysImg} src={SevenDaysImg} width={158} height={56} alt="Seven Days Service Badge"/>
              <Image className={styles.insuredImg} src={InsuredImg} width={72} height={72} alt="Insured Protection Guaranteed Badge"/>
          </div>
        </div>
      </div>
      <div className={styles.banner1}>
        <div className={styles.banner1Text}>
          <p className={styles.bxlt}>FREE</p>
          <p className={styles.blt}>External Cable Concealment</p>
          <p className={styles.blt}>with TV Installation</p>
          <p className={styles.bmt}><b>Limited-Time Offer</b></p>
          <p className={styles.bmt}>Included with standard drywall installations.</p>
          <p className={styles.bmt}>One TV per order.</p>
        </div>
        <QuoteButton  modalName="BookNow">BOOK IN 1 MIN</QuoteButton>
        <Image className={styles.banner1Img} src={Banner1Img} width={1280} height={853} alt="Banner"/>
      </div>
      <div className={styles.banner1 + " " + styles.banner2}>
        <div className={styles.banner2Text}>
          <p className={styles.bltb}>Super Bowl Game Day deserves a PERFECT view.</p>
          <p className={styles.bmt}>Don&#8217;t let a bad TV setup ruin your night.</p>

          <ul className={styles.bannerListWrapper}>
            <li className={styles.bmt}><b>Same-Day</b> TV Installation</li>
            {/* <li className={styles.bmt}>Pro Install in <b>~20 Minutes*</b></li> */}
            <li className={styles.bmt}>Fully Insured</li>
            <li className={styles.bmt}>Fully Certified</li>
            <li className={styles.bmt}>Installation <b>From $69</b></li>
          </ul>
          {/* <p className={styles.bmt}>Limited Super Bowl slots — almost booked.</p>

          <p className={styles.bst}>*Details vary by setup.</p> <p className={styles.bst}> Confirm with our operator.</p> */}

        </div>
        <QuoteButton modalName="BookNow">CALL NOW</QuoteButton>
        <Image className={styles.banner1Img + " " + styles.banner2Img} src={Banner2Img} width={1280} height={853} alt="Banner"/>
      </div>
      {/* <VideoPlayer/> */}
    </>
  );
}
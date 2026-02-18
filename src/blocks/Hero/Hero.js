import React from "react";
import styles from "./Hero.module.css";
import RunningTextLine from "./components/RunningTextLine";
// import ImageWrapper from "@/ui/ImageWrapper/ImageWrapper";
// import dynamic from "next/dynamic";
import Button from "@/ui/Button/Button";
import Text from "@/ui/Text/Text";
// import Image from "next/image";
// import TwoYearsWarantyImg from "@/assets/badges/2yearswaranty.webp"
// import FiveStarImg from "@/assets/badges/5star.webp"
// import SevenDaysImg from "@/assets/badges/7days.webp"
// import InsuredImg from "@/assets/badges/insured.webp"
// import ExpandingSection from "./components/ExpandingSection";
// import HeroCarousel from "./components/HeroCarousel";
import HeroClientContainer from "./components/HeroClientContainer";
async function getHero() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/hero?populate=*`);
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Hero fetch failed:", error);
    return null;
  }
}
async function getHeroRunningLines() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/hero-text-lines`);
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Hero lines fetch failed:", error);
    return [];
  }
}

// Default data to empty object to prevent crash when used without props (e.g. in Home page)
export default async function Hero({ data = {}, cityContext }) {
  // Always fetch default data
  const defaultHeroData = await getHero();
  const defaultLinesData = await getHeroRunningLines();

  const displayName = cityContext?.city_name
    ? `${cityContext.city_name}${cityContext.state_code ? `, ${cityContext.state_code}` : ''}`
    : '';

  // Merge: Use prop data if available, otherwise fallback to default
  const heroData = {
    ...defaultHeroData,
    ...data,
    // Explicitly handle nested or specific fields if needed
    title: data?.title || defaultHeroData?.title || '',
    subTitle: data?.subTitle || defaultHeroData?.subTitle || '',
  };

  // For running lines, we might just replace the array entirely if provided
  const heroLinesData = data?.runningLines && data.runningLines.length > 0
    ? data.runningLines
    : defaultLinesData;

  const carouselSlides = [
    { type: 'video', data: { src720: '/optimized/mainVideo2-720p.mp4' } },
    {
      type: 'banner',
      data: {
        title: "Special Offer: $30 Off Today!",
        text: "Book your TV mounting service now and save big on professional installation.",
        buttonText: "Claim Discount",
        background: 'linear-gradient(135deg, #444 0%, #111 100%)'
      }
    }
  ];

  return (
    <>
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
      <RunningTextLine textLines={heroLinesData} />
      <div className={`block ${styles.hero}`}>
        <div className={`blockContainer ${styles.heroContainer}`}>
          <h1 className={styles.mainHeading}>
            <Text text={heroData.title} />
          </h1>
          <p className="subText">
            <Text text={heroData.subTitle} />
          </p>
          <div className={styles.buttonWrapper}>
            <Button size="big" className={styles.heroButton} href="tel:+18326647597">Unlock $30 Off</Button>
          </div>
          {/* <div className={styles.badgesWrapper}> */}
          {/* {heroData.badges.map(badge => (
                <ImageWrapper
                  className={styles.badge}
                  key={badge.id}
                  media={badge}
                  defaultAlt="badge"
                />
              ))} */}
          {/* <Image className={styles.twoYearsWarantyImg} src={TwoYearsWarantyImg} width={94} height={64} alt="One Year Warranty Badge" />
            <Image className={styles.fiveStarImg} src={FiveStarImg} width={72} height={72} alt="Five Star Rating Badge" />
            <Image className={styles.sevenDaysImg} src={SevenDaysImg} width={158} height={56} alt="Seven Days Service Badge" />
            <Image className={styles.insuredImg} src={InsuredImg} width={72} height={72} alt="Insured Protection Guaranteed Badge" /> */}
          {/* </div> */}
        </div>
      </div>
      <HeroClientContainer />
    </>
  );
}
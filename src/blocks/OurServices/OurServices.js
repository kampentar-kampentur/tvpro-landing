"use client"
import React, { useState, useEffect, useRef } from "react";
import styles from "./OurServices.module.css";
import Button from "@/ui/Button";

// Placeholder for images
// import PlaceholderImage from "@/assets/screens/32–60Light.svg"; // You'll need to replace this with actual images

const servicesData = [
  {
    id: "hidden-wiring",
    title: "Hidden Wiring, Done Right",
    description:
      "Say goodbye to dangling cables. Our expert wire concealment service hides all TV wires neatly behind the wall using code-compliant materials. Perfect for living rooms, bedrooms, and home theaters — your space stays clean, safe, and stunning. Whether it's drywall, brick, or fireplace — we've done it all.",
    image: "/serveces.png", // Replace with actual image path
  },
  {
    id: "fireplace-installation",
    title: "Fireplace TV Installation",
    description:
      "We specialize in safe and stylish TV installations above fireplaces, ensuring perfect viewing angles and discreet wiring. Our team handles various fireplace materials, from brick to stone, delivering a clean and secure setup every time.",
    image: "/serveces.png", // Replace with actual image path
  },
  {
    id: "soundbar-mounting",
    title: "Soundbar Mounting",
    description:
      "Enhance your audio experience with our professional soundbar mounting service. We integrate your soundbar seamlessly with your TV setup, ensuring optimal sound quality and a clean, clutter-free look.",
    image: "/serveces.png", // Replace with actual image path
  },
  {
    id: "gaming-console-setup",
    title: "Gaming Console Setup",
    description:
      "Get your gaming setup ready for action! We'll expertly connect and configure your gaming consoles, ensuring all cables are managed and your system is optimized for performance and a clean entertainment area.",
    image: "./serveces.png",
  },
  {
    id: "home-theater-setup",
    title: "Home Theater Setup",
    description:
      "Transform your living space into a cinematic experience. Our home theater setup service includes mounting your TV, installing speakers, and configuring all audio-visual components for immersive entertainment.",
    image: "./serveces.png",
  },
  {
    id: "wall-bracket-supply-install",
    title: "Wall Bracket Supply & Install",
    description:
      "Don't have a wall mount? No problem! We supply and professionally install high-quality wall brackets tailored to your TV size and wall type, ensuring a secure and durable mount for any screen.",
    image: "./serveces.png",
  },
  {
    id: "flush-to-wall-installation",
    title: "Flush-to-wall TV Installation",
    description:
      "Achieve a sleek, minimalist look with our flush-to-wall TV installation service. We use specialized mounts and techniques to ensure your TV sits as close to the wall as possible, virtually eliminating gaps and enhancing your space.",
    image: "./serveces.png",
  },
  {
    id: "commercial-tv-installation",
    title: "Commercial TV Installation",
    description:
      "From office lobbies to restaurants, we provide professional commercial TV installation services. We handle multiple screens, complex setups, and ensure a reliable and visually appealing display for your business needs.",
    image: "./serveces.png",
  },
  {
    id: "post-install-clean-up",
    title: "Post-Install Clean-Up",
    description:
      "We believe in leaving your home cleaner than we found it. Our post-installation clean-up ensures all debris, dust, and packaging are removed, leaving you with a perfectly installed TV and a spotless space.",
    image: "./serveces.png",
  },
  {
    id: "videowall-installation",
    title: "VideoWall Installation",
    description:
      "For dynamic visual displays, our videowall installation service creates stunning multi-screen arrays. Ideal for commercial spaces, control rooms, or large entertainment areas, we ensure precise alignment and seamless integration.",
    image: "./serveces.png",
  },
];

const INTERVAL_TIME = 5000; // 5 seconds

export default function OurServices() {
  const [activeServiceId, setActiveServiceId] = useState(null);
  const timeoutRef = useRef(null);

  const resetAndStartTimer = (newServiceId) => {
    setActiveServiceId(newServiceId);
  };

  const startTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const currentIndex = servicesData.findIndex(
      (service) => service.id === activeServiceId
    );
    const nextIndex = (currentIndex + 1) % servicesData.length;

    timeoutRef.current = setTimeout(() => {
      resetAndStartTimer(servicesData[nextIndex].id);
    }, INTERVAL_TIME);
  };

  useEffect(() => {
    setActiveServiceId(servicesData[0].id);
  }, []); 

  useEffect(() => {
    startTimer();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeServiceId]); // Re-run effect when activeServiceId changes

  const activeService = servicesData.find(
    (service) => service.id === activeServiceId
  );

  return (
    <section className={styles.ourServices}>
      <div className={`blockContainer ${styles.ourServicesContainer}`}>
        <h2 className={styles.mainHeading}>Our Services</h2>
        <div className={styles.categoriesWrapper}>
          {servicesData.map((service) => (
            <button
              key={service.id}
              className={`${styles.categoryButton} ${
                activeServiceId === service.id ? styles.active : ""
              }`}
              onClick={() => resetAndStartTimer(service.id)}
              style={{ '--interval-time': `${INTERVAL_TIME / 1000}s` }}
            >
              <span className={styles.progress}></span>
              <span className={styles.categoryButtonText}>{service.title}</span>
            </button>
          ))}
        </div>

        {activeService && (
          <div className={styles.detailsWrapper}>
            <div className={styles.detailsImage}>
              <img src={activeService.image} alt={activeService.title} />
            </div>
            <div className={styles.detailsContent}>
              <h3 className={styles.detailsTitle}>{activeService.title}</h3>
              <p className={styles.detailsDescription}>
                {activeService.description}
              </p>
              <Button>Book Now</Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 
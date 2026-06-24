import React from "react";
import { technicians as localTechnicians } from "./data/technicians";
import TechCard from "./components/TechCard";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import Button from "@/ui/Button";
import styles from "./OurTeam.module.css";
import { getGlobalConfig, getAllTechnicians, getStrapiMediaUrl } from "@/lib/strapi";
import Text from "@/ui/Text/Text";
import { resolveSpintax } from "@/lib/spintax";

async function getOurTeamData() {
  try {
    const globalConfig = await getGlobalConfig();
    return globalConfig["our-team"] || {};
  } catch (e) {
    return {};
  }
}

export default async function OurTeam({ data = {}, cityContext }) {
  const defaultTeamData = await getOurTeamData();
  
  // Аккуратно мержим данные, чтобы null из локального блока не затирал глобальные значения
  const teamData = { ...defaultTeamData };
  if (data?.title) teamData.title = data.title;
  if (data?.subTitle) teamData.subTitle = data.subTitle;
  if (data?.footerText) teamData.footerText = data.footerText;
  if (data?.technicians) teamData.technicians = data.technicians;

  const cityName = cityContext?.city_name || "your area";
  const stateCode = cityContext?.state_code ? `, ${cityContext.state_code}` : "";
  const displayLocation = `${cityName}${stateCode}`;

  let strapiTechs = [];
  
  // 1. Проверяем, не переопределены ли техники вручную в блоке
  if (teamData?.technicians && Array.isArray(teamData.technicians) && teamData.technicians.length > 0) {
    strapiTechs = teamData.technicians;
  } else {
    // 2. Если нет, берем всех из новой коллекции Technician
    strapiTechs = await getAllTechnicians();
  }

  if (strapiTechs && strapiTechs.length > 0) {
    strapiTechs = strapiTechs.map(t => {
      let photoObj = null;
      if (t.photo) {
        if (typeof t.photo === 'string') {
          photoObj = { url: t.photo };
        } else if (t.photo.data?.attributes) {
          photoObj = { id: t.photo.data.id, ...t.photo.data.attributes };
        } else if (t.photo.data) {
          photoObj = { id: t.photo.data.id, ...t.photo.data };
        } else if (t.photo.url) {
          photoObj = t.photo;
        }
      }

      return {
        ...t,
        photo: photoObj,
        // Если теги из Strapi пришли строкой "Frame TV, Fireplace", разбиваем в массив
        tags: typeof t.tags === 'string' ? t.tags.split(',').map(tag => tag.trim()) : (t.tags || [])
      };
    });
  }
  
  const allTechs = strapiTechs.length > 0 ? strapiTechs : localTechnicians;

  const cityTechs = allTechs.filter(t => 
    t.city?.toLowerCase() === cityName?.toLowerCase()
  );
  
  let selectedTechs = [];
  // Если для города есть свои техники — показываем их (максимум 6)
  // Если меньше 3 — добираем рандомных из других городов
  if (cityTechs.length >= 3) {
    const shuffled = [...cityTechs].sort(() => 0.5 - Math.random());
    selectedTechs = shuffled.slice(0, 6);
  } else {
    // Fallback: берём техников из других городов, кроме уже выбранных
    const others = allTechs.filter(t => t.city?.toLowerCase() !== cityName?.toLowerCase());
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random());
    const combined = [...cityTechs, ...shuffledOthers].slice(0, 6);
    selectedTechs = combined.sort(() => 0.5 - Math.random());
  }

  // Сортируем выбранных техников по убыванию опыта/скиллов
  const getTechSkillLevel = (tech) => {
    const localTech = localTechnicians.find(
      (l) =>
        l.name &&
        tech.name &&
        (l.name.toLowerCase() === tech.name.toLowerCase() ||
          tech.name.toLowerCase().startsWith(l.name.toLowerCase()) ||
          l.name.toLowerCase().startsWith(tech.name.toLowerCase()))
    ) || {};

    const expStr = String(tech.experience || localTech.experience || tech.jobsCount || localTech.jobsCount || "0");
    const match = expStr.replace(/,/g, "").match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (expStr.toLowerCase().includes("year")) {
        return num * 500;
      }
      return num;
    }
    return 0;
  };

  selectedTechs.sort((a, b) => getTechSkillLevel(b) - getTechSkillLevel(a));

  const title = resolveSpintax(
    teamData?.title ||
    `Meet Our TV Mounting Specialists in ${displayLocation}`
  );

  const subTitle = resolveSpintax(
    teamData?.subTitle ||
    "Every technician is background-checked, insured, and certified — ready to deliver a flawless installation in your home."
  );

  const footerText = resolveSpintax(
    teamData?.footerText ||
    "Ready to mount your TV? Book your service with one of our local specialists."
  );

  return (
    <section className={`block ${styles.ourTeam}`} id="team">
      <header className={styles.header}>
        <h2 className="blockHeading"><Text text={title} cityContext={cityContext} /></h2>
        <p className="subText"><Text text={subTitle} cityContext={cityContext} /></p>
      </header>

      <div className={styles.sliderTrack}>
        {selectedTechs.map((tech) => (
          <TechCard
            key={tech.id}
            tech={tech}
            cityName={cityName}
          />
        ))}
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          <Text text={footerText} cityContext={cityContext} />
        </p>
        <div className={styles.buttonsGroup}>
          <QuoteButton size="big">Book Your Technician Today</QuoteButton>
          <Button variant="secondary" size="big" href="/our-team/">
            Meet All Specialists
          </Button>
        </div>
      </div>
    </section>
  );
}

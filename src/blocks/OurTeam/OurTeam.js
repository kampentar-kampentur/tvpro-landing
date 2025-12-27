import styles from "./OurTeam.module.css";
import { SliderGallery } from "@/ui/SliderGallery/SliderGallery";
import Button from "@/ui/Button/Button";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import TeamGrid from "./components/TeamGrid";
import Text from "@/ui/Text/Text";

async function getOurTeam() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/our-team?populate=*`);
  const json = await res.json();
  
  return json.data;
}

async function getTeamMembers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/team-members?populate=*`);
  const json = await res.json();

  return json.data;
}

const OurTeam = async () => {
  const ourTeamData = await getOurTeam();
  const teamMembers = await getTeamMembers();

  return (
    <section className={styles.ourTeam} id="team">
      <div className="block">
        <header className={styles.ourTeamHeader}>
          <h2 className="blockHeading">
            <Text text={ourTeamData?.title}/>
          </h2>
          <p className="subText"><Text text={ourTeamData?.subTitle}/></p>
        </header>
        <TeamGrid members={teamMembers || []}/>
        <div className={styles.ctaContainer}>
          <p className={styles.ctaText}>Like what you see?</p>
          <div className={styles.ctaButtons}>
            <QuoteButton variant="primary" size="small" modalName="BookNow">Book With Discount</QuoteButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
import styles from "./AboutUs.module.css";

const AboutUs = () => {
  return (
    <section className={`block ${styles.aboutUs}`}>
        <header className={styles.aboutUsHeader}>
          <h2 className="blockHeading">About Us</h2>
          <p className="subText">TVPro Handy Services isn&apos;t just a company.</p>
        </header>
        <div className={styles.contentContainer}>
          <p className={styles.mainText}>
            It&apos;s a mission — born from the hands of a man who has personally installed thousands of TVs, soundbars, and home systems with precision, passion, and pride. We were founded by someone who knows the craft from the inside — not from an office, but from real homes, real tools, and real challenges. Today, we follow the lead of that same founder — our captain — who continues to guide the company forward with one clear goal: To raise the standard of TV installation across the country. We believe that a TV is more than a screen. It&apos;s a centerpiece. A work of modern art.
          </p>
          <p className={styles.mainText}>
            A space where families come together, where emotions unfold, and where stories are told. We see the whole picture — your walls, your lighting, your home&apos;s personality — and we treat each install as a curated experience. Our goal is not just to mount a screen, but to elevate your space with detail, alignment, and elegance. We mount with soul. We install with vision. We deliver with care. Let your TV become a statement. Let our work become your home&apos;s quiet pride.
          </p>
        </div>
    </section>
  );
};

export default AboutUs; 
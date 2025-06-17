import React, { useState } from "react";
import styles from "./FAQ.module.css";
import PlusIcon from "@/assets/icons/plus.svg";
import MinusIcon from "@/assets/icons/minus.svg";

const faqData = [
  {
    question: "How long does a TV installation take?",
    answer:
      "Most installations take between 30 to 90 minutes, depending on the wall surface and wiring needs. We work efficiently, but never rush. Every screen is aligned, secured, and finished with care. Fast, precise, and always detail-driven.",
  },
  {
    question: "Do I need to provide my own wall mount?",
    answer:
      "Not at all. You&apos;re welcome to use your own, but we also offer high-quality mounts — fixed, tilting, and full-motion. They&apos;re reliable, low-profile, and hand-selected to match your TV and your space. No stress — just the perfect fit.",
  },
  {
    question: "Can you hide the wires?",
    answer:
      "Yes — and even where others say it&apos;s not possible. We use premium materials, back plates, and thoughtful routing. We run wires through horizontal studs, around insulation, and behind tricky walls with precision. Prefer not to open your wall? We also offer external concealment — sleek, paintable channels that hide wires cleanly on the surface without the mess of drywall work. You choose the look. We make it flawless.",
  },
  {
    question: "What wall types do you work with?",
    answer:
      "Drywall, brick, tile, stone, fireplace walls — even ceilings, mirrors, and steel beams. We bring the tools, the know-how, and the confidence to get it right. Unique walls are just another day at work for us.",
  },
  {
    question: "Is the service insured?",
    answer:
      "Yes — and beyond that, you&apos;re covered for any unexpected situation. We take full responsibility for the job and treat your home with care and professionalism. You relax — we&apos;ve got everything covered.",
  },
  {
    question: "Can you mount above a fireplace?",
    answer:
      "Absolutely. And we never charge extra for it. We know fireplace framing inside out and mount with precision, safety, and style — always at the ideal height. It&apos;s not an upgrade. It&apos;s our thank-you for choosing us.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We&apos;re growing fast — because more and more people want cleaner installs, better service, and a team that actually cares. If you found us — we&apos;re likely already near you. And if not — we&apos;ll be there soon.",
  },
  {
    question: "Do you offer same-day appointments?",
    answer:
      "Yes, when available. We offer same-day, next-day, evening, and weekend service — because your time matters. We show up when it works for you.",
  },
  {
    question: "How do I book a service?",
    answer:
      "Easy. Call us, text us, or book online in under a minute. You can even send us a photo of your wall — and we&apos;ll handle the rest. One minute is all it takes to start something flawless.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={`block ${styles.faq}`} id="faq">
      <header className={styles.faqHeader}>
        <h2 className="blockHeading">FAQs</h2>
      </header>
      <div className={styles.faqContent}>
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`${styles.faqItem} ${activeIndex === index ? styles.active : ""}`}
          >
            <div
              className={styles.faqQuestionContainer}
              onClick={() => handleToggle(index)}
            >
              <h3 className={styles.faqQuestion}>{item.question}</h3>
              <div className={styles.icon}>
                {activeIndex === index ? <MinusIcon width="24" height="24" /> : <PlusIcon width="24" height="24" />}
              </div>
            </div>
            <p className={styles.faqAnswer}>{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ; 
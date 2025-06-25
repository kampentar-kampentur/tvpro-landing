import React from "react";
import styles from "./FAQ.module.css";
import PlusIcon from "@/assets/icons/plus.svg";
import MinusIcon from "@/assets/icons/minus.svg";
import Text from "@/ui/Text/Text";

async function getFAQ() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/faq?populate=*`);
  const json = await res.json();
  return json.data;
}

const FAQ = async () => {
  const faqData = await getFAQ();

  return (
    <section className={`block ${styles.faq}`} id="faq">
      <header className={styles.faqHeader}>
        <h2 className="blockHeading"><Text text={faqData.title} /></h2>
        {faqData.subTitle && <p className="subText"><Text text={faqData.subTitle} /></p>}
      </header>
      <div className={styles.faqContent}>
        {faqData.faqs && faqData.faqs.map((item, index) => (
          <div className={styles.faqItem} key={index}>
            <input
              type="radio"
              name="faq-accordion"
              id={`faq-toggle-${index}`}
              className={styles.faqToggle}
              defaultChecked={index === 0}
            />
            <label htmlFor={`faq-toggle-${index}`} className={styles.faqQuestionContainer}>
              <h3 className={styles.faqQuestion}><Text text={item.question} /></h3>
              <span className={styles.icon}>
                <PlusIcon width="24" height="24" className={styles.plusIcon} />
                <MinusIcon width="24" height="24" className={styles.minusIcon} />
              </span>
            </label>
            <div className={styles.faqAnswerWrapper}>
              <p className={styles.faqAnswer}><Text text={item.answer} /></p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ; 
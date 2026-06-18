import React from "react";
import styles from "./FAQ.module.css";
import PlusIcon from "@/assets/icons/plus.svg";
import MinusIcon from "@/assets/icons/minus.svg";
import Text from "@/ui/Text/Text";
import Head from "next/head";
import { resolveSpintax } from "@/lib/spintax";

async function getFAQ() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/faq?populate=*`);
  const json = await res.json();
  return json.data;
}

// Helper to interpolate city variables in JSON-LD strings
function interpolateVariables(str, cityContext) {
  if (!str) return '';
  let res = str;
  if (cityContext) {
    if (cityContext.city_name) {
      res = res.replace(/\{\{city\}\}/g, cityContext.city_name);
    }
    if (cityContext.state_code) {
      res = res.replace(/\{\{state\}\}/g, cityContext.state_code);
    }
  }
  return res;
}

// Default export with data prop
export default async function FAQ({ data = {}, cityContext }) {
  const defaultFaqData = await getFAQ();

  // Merge: Use prop data if available, otherwise fallback to default
  const rawFaqs = (data?.faqs && data.faqs.length > 0) ? data.faqs : (defaultFaqData.faqs || []);
  const faqs = rawFaqs.map(item => ({
    question: resolveSpintax(item.question || ''),
    answer: resolveSpintax(item.answer || ''),
  }));

  const faqData = {
    ...defaultFaqData,
    ...data,
    title: resolveSpintax(data?.title || defaultFaqData.title || ''),
    subTitle: resolveSpintax(data?.subTitle || defaultFaqData.subTitle || ''),
    faqs,
  };

  const structuredFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (faqData.faqs || []).map(({ question, answer }) => ({
      "@type": "Question",
      "name": interpolateVariables(question, cityContext),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": interpolateVariables(answer, cityContext),
      },
    })),
  };

  return (
    <section className={`block ${styles.faq}`} id="faq">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredFAQ),
          }}
        />
      </Head>
      <header className={styles.faqHeader}>
        <h2><Text text={faqData.title} cityContext={cityContext} /></h2>
        {faqData.subTitle && <p className="subText"><Text text={faqData.subTitle} cityContext={cityContext} /></p>}
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
              <span role="heading" aria-level="3" className={styles.faqQuestion}>
                <Text text={item.question} cityContext={cityContext} />
              </span>
              <span className={styles.icon}>
                <PlusIcon width="24" height="24" className={styles.plusIcon} />
                <MinusIcon width="24" height="24" className={styles.minusIcon} />
              </span>
            </label>
            <div className={styles.faqAnswerWrapper}>
              <p className={styles.faqAnswer}>
                <Text text={item.answer} cityContext={cityContext} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


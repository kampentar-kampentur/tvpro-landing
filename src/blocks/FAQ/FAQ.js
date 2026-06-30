import React from "react";
import styles from "./FAQ.module.css";
import PlusIcon from "@/assets/icons/plus.svg";
import MinusIcon from "@/assets/icons/minus.svg";
import Text from "@/ui/Text/Text";
import Head from "next/head";
import { resolveSpintax } from "@/lib/spintax";
import defaultFaqsList from "./faqs-defaults.json";

async function getFAQ() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/faq?populate=*`);
    const json = await res.json();
    return json.data || {};
  } catch (e) {
    console.error("Failed to fetch default FAQ from Strapi:", e);
    return {};
  }
}

// Helper to interpolate city variables in JSON-LD strings
function interpolateVariables(str, cityContext) {
  if (!str) return '';
  let res = str;
  const city = cityContext?.city_name || "your city";
  const state = cityContext?.state_code || "";

  res = res.replace(/\{\{city\}\}/g, city);
  if (!state) {
    res = res.replace(/,\s*\{\{state\}\}/g, "");
    res = res.replace(/\{\{state\}\}/g, "");
  } else {
    res = res.replace(/\{\{state\}\}/g, state);
  }
  return res;
}

const MAIN_QUESTIONS = [
  {
    question: "How long does TV mounting take in {{city}}?",
    answer: "Most standard single-TV installations in {{city}} take about 20-40 minutes. This usually includes shoe covers, wall inspection, bracket installation, TV leveling, basic cable cleanup, and cleaning the work area before we leave."
  },
  {
    question: "Do you offer same-day TV mounting in {{city}}?",
    answer: "Yes. Same-day TV mounting in {{city}} is often available depending on our schedule, technician availability, your location, TV size, wall type, and requested services. TVPro works 7 days a week and stays flexible whenever possible."
  },
  {
    question: "Do you provide TV mounting near me in {{city}}?",
    answer: "Yes. TVPro provides TV mounting near you in {{city}}, {{state}} and surrounding areas. Our local technicians are mobile, flexible, and can often offer same-day or next-day appointments depending on your exact address and schedule."
  },
  {
    question: "Are your TV mounting technicians insured?",
    answer: "Yes. TVPro provides insured TV mounting service for residential and commercial projects in {{city}}. For business, commercial, or organization projects, insurance documentation can be provided when required."
  },
  {
    question: "Do your technicians wear shoe covers and clean up after installation?",
    answer: "Yes. Our technicians work in shoe covers, protect your space, respect your home, clean up installation debris, organize cables, and make sure the room is left clean and ready to use."
  },
  {
    question: "Do you install Samsung The Frame TV in {{city}}?",
    answer: "Yes. TVPro installs Samsung The Frame TV in {{city}}, including Slim Fit Wall Mount setup, One Connect Box cable planning, clean wire management, recessed box options, and low-profile installation for a clean art-style look."
  },
  {
    question: "Do you install TCL NXTFRAME or Hisense CanvasTV?",
    answer: "Yes. We install TCL NXTFRAME TVs (including TCL A300W and TCL A300 Pro) and Hisense CanvasTV models (including Hisense S7 CanvasTV), with low-profile mounting, recessed box options, alignment, and a polished wall-mounted look."
  },
  {
    question: "Can you install a recessed box behind the TV?",
    answer: "Yes. We install recessed boxes behind TVs when the wall and setup allow it. Recessed boxes help hide outlets, cables, media devices, One Connect Box solutions, and other components while helping the TV sit closer to the wall."
  },
  {
    question: "Can you hide wires in brick or concrete walls?",
    answer: "Yes, depending on the wall and site conditions. TVPro provides wire concealment options for drywall, brick, concrete, tile, stone, and fireplace walls using proper routing, recessed solutions, or clean surface channels when needed."
  },
  {
    question: "Do you install MantelMount MM815 in {{city}}?",
    answer: "Yes. TVPro specializes in MantelMount MM815 installation for premium motorized pull-down fireplace TV setups. This is a strong option when you want the TV to move down to a more comfortable viewing height above a fireplace."
  },
  {
    question: "Do you offer commercial TV installation in {{city}}?",
    answer: "Yes. TVPro provides commercial TV installation in {{city}} for offices, conference rooms, restaurants, gyms, retail stores, apartment buildings, medical offices, schools, hotels, lobbies, waiting rooms, and business facilities."
  },
  {
    question: "Can you build a 4-TV or 6-TV media wall?",
    answer: "Yes. TVPro installs 4-TV and 6-TV media walls that can work as one large viewing setup. These are popular for sports rooms, restaurants, bars, gyms, offices, control rooms, media rooms, and commercial spaces."
  },
  {
    question: "Do you offer discounts for multiple TV installations?",
    answer: "Yes. Volume discounts may be available when you install multiple TVs in the same appointment. This is common for new homes, offices, apartment buildings, commercial spaces, restaurants, gyms, and multi-room projects."
  }
];

const EXCLUDED_QUESTION_TEXTS = [
  "How long does TV mounting take in {{city}}?",
  "Do you offer same-day TV mounting in {{city}}?",
  "Do you provide TV mounting near me in {{city}}?",
  "Are your TV mounting technicians insured?",
  "Do your technicians wear shoe covers?",
  "Do you clean up after TV installation?",
  "Do you install Samsung The Frame TV in {{city}}?",
  "Do you install TCL NXTFRAME TVs?",
  "Do you install Hisense CanvasTV?",
  "Can you install a recessed box behind the TV?",
  "Can you hide wires in brick or concrete walls?",
  "Do you install MantelMount MM815 in {{city}}?",
  "Do you offer commercial TV installation in {{city}}?",
  "Can you build a 4-TV or 6-TV media wall?",
  "Do you offer discounts for multiple TV installations?"
];

export default async function FAQ({ data = {}, cityContext }) {
  const defaultFaqData = await getFAQ();

  const title = resolveSpintax(data?.title || defaultFaqData.title || 'Frequently Asked Questions');
  const subTitle = resolveSpintax(data?.subTitle || defaultFaqData.subTitle || 'Everything you need to know about our TV mounting service');

  // Determine main FAQs and hidden FAQs
  let mainFaqs = [];
  let hiddenFaqs = [];

  if (data?.faqs && data.faqs.length > 0) {
    // If specific FAQs are provided by Strapi block data, use them as main
    mainFaqs = data.faqs.map(item => ({
      question: resolveSpintax(item.question || ''),
      answer: resolveSpintax(item.answer || ''),
    }));

    // Filter default list to get remaining ones
    const mainQuestionsSet = new Set(mainFaqs.map(f => f.question.toLowerCase().trim()));
    hiddenFaqs = defaultFaqsList
      .filter(item => !mainQuestionsSet.has(item.question.toLowerCase().trim()))
      .map(item => ({
        question: resolveSpintax(item.question),
        answer: resolveSpintax(item.answer),
      }));
  } else {
    // Use the main questions
    mainFaqs = MAIN_QUESTIONS.map(item => ({
      question: resolveSpintax(item.question),
      answer: resolveSpintax(item.answer),
    }));

    // Use default list minus the excluded ones
    hiddenFaqs = defaultFaqsList
      .filter(item => !EXCLUDED_QUESTION_TEXTS.includes(item.question))
      .map(item => ({
        question: resolveSpintax(item.question),
        answer: resolveSpintax(item.answer),
      }));
  }

  const allFaqs = [...mainFaqs, ...hiddenFaqs];

  const structuredFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqs.map(({ question, answer }) => ({
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
        <h2><Text text={title} cityContext={cityContext} /></h2>
        {subTitle && <p className="subText"><Text text={subTitle} cityContext={cityContext} /></p>}
      </header>

      <div className={styles.faqContent}>
        {/* Main List */}
        {mainFaqs.map((item, index) => (
          <div className={styles.faqItem} key={`main-${index}`}>
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

        {/* Hidden List with CSS Toggle wrapper */}
        {hiddenFaqs.length > 0 && (
          <div className={styles.showMoreWrapper}>
            <input
              type="checkbox"
              id="faq-show-more-toggle"
              className={styles.showMoreToggle}
            />
            <div className={styles.showMoreContent}>
              {hiddenFaqs.map((item, index) => {
                const absoluteIndex = index + mainFaqs.length;
                return (
                  <div className={styles.faqItem} key={`hidden-${index}`}>
                    <input
                      type="radio"
                      name="faq-accordion"
                      id={`faq-toggle-${absoluteIndex}`}
                      className={styles.faqToggle}
                    />
                    <label htmlFor={`faq-toggle-${absoluteIndex}`} className={styles.faqQuestionContainer}>
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
                );
              })}
            </div>
            
            <label htmlFor="faq-show-more-toggle" className={styles.showMoreBtn}>
              <span className={styles.btnTextShow}>Show More Questions</span>
              <span className={styles.btnTextHide}>Show Less</span>
            </label>
          </div>
        )}
      </div>
    </section>
  );
}

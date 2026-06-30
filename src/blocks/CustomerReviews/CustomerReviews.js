import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import Text from "@/ui/Text/Text";
import CustomerReviewsClient from "./CustomerReviewsClient";
import styles from "./CustomerReviews.module.css";
import { resolveSpintax } from "@/lib/spintax";

async function getCustomerReviews() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/customer-review?populate=*`,
  );
  const json = await res.json();
  return json.data;
}

// Default export with data prop
export default async function CustomerReviews({ data = {}, cityContext }) {
  const defaultReviewsData = await getCustomerReviews();

  // Merge: Use prop data if available, otherwise fallback to default
  const customerReviewsData = {
    ...defaultReviewsData,
    ...data,
    title: resolveSpintax(data?.title || defaultReviewsData.title || ''),
    subTitle: resolveSpintax(data?.subTitle || defaultReviewsData.subTitle || ''),
  };

  return (
    <section className={`block ${styles.customerReviews}`} id="reviews">
      <header className={styles.customerReviewsHeader}>
        <h2 className="blockHeading">
          <Text text={customerReviewsData.title} cityContext={cityContext} />
        </h2>
      </header>

      <CustomerReviewsClient />
      <div className={styles.ctaContainer}>
        <p className={styles.ctaText}>
          Ready to mount your TV? Book your service now — fast, easy, and
          professional.
        </p>
        <div className={styles.ctaButtons}>
          <QuoteButton size="big" />
        </div>
      </div>
    </section>
  );
}

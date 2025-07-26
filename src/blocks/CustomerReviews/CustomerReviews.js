import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import Text from "@/ui/Text/Text";
import CustomerReviewsClient from "./CustomerReviewsClient";
import styles from "./CustomerReviews.module.css";

async function getCustomerReviews() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/customer-review?populate=*`);
  const json = await res.json();
  return json.data;
}

const CustomerReviews = async () => {
  const [customerReviewsData] = await Promise.all([
    getCustomerReviews(),
  ]);

  return (
    <section className={`block ${styles.customerReviews}`}>
      <header className={styles.customerReviewsHeader}>
        <h2 className="blockHeading">
          <Text text={customerReviewsData.title}/>
        </h2>
        <p className="subText"><Text text={customerReviewsData.subTitle}/></p>
      </header>
      <CustomerReviewsClient />
      <div className={styles.ctaContainer}>
        <p className={styles.ctaText}>Ready to mount your TV? Book your service now — fast, easy, and professional.</p>
        <div className={styles.ctaButtons}>
          <QuoteButton variant="secondary" modalName="BookNow">Leave Yours Here!</QuoteButton>
          <QuoteButton/>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews; 
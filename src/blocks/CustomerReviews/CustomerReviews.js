import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import Text from "@/ui/Text/Text";
import CustomerReviewsClient from "./CustomerReviewsClient";
import styles from "./CustomerReviews.module.css";
import Image from "next/image";
import Script from "next/script";

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

      <div className={"widget tt"} id="tt-review-widget-star">
        <Image src="https://cdn.thumbtackstatic.com/fe-assets-web/media/logos/thumbtack/wordmark.svg" alt="Thumbtack" class="tt-logo" width={86} height={21}/>
        <a target="_blank" href="https://www.thumbtack.com/tx/houston/tv-wall-mount-install/tvprohandyservices/service/538968360070111254">
          <div>TVProHandyservices</div>
        </a>
        <div id="tt-dynamic">
          <Image
            src="https://cdn.thumbtackstatic.com/fe-assets-web/media/pages/profile/standard-widgets/review-widget/orange_star.svg"
            alt=""
            width={16}
            height={16}
          />
          <Image src="https://cdn.thumbtackstatic.com/fe-assets-web/media/pages/profile/standard-widgets/review-widget/orange_star.svg" alt="" width={16} height={16} />
          <Image src="https://cdn.thumbtackstatic.com/fe-assets-web/media/pages/profile/standard-widgets/review-widget/orange_star.svg" alt="" width={16} height={16} />
          <Image src="https://cdn.thumbtackstatic.com/fe-assets-web/media/pages/profile/standard-widgets/review-widget/orange_star.svg" alt="" width={16} height={16} />
          <Image src="https://cdn.thumbtackstatic.com/fe-assets-web/media/pages/profile/standard-widgets/review-widget/orange_star.svg" alt="" width={16} height={16} />
          <span>118 reviews</span>
        </div>
        <Script src="https://www.thumbtack.com/profile/widgets/scripts/?service_pk=538968360070111254&widget_id=review&type=star"></Script>
      </div>
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
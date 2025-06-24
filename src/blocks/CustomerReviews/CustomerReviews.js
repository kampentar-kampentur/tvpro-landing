
import styles from "./CustomerReviews.module.css";
import ReviewCard from "./components/ReviewCard";
import { SliderGallery } from "@/ui/SliderGallery/SliderGallery";
import Button from "@/ui/Button/Button";
import GoogleLogo from "@/assets/socialIcons/Google.svg"
import QuoteButton from "@/ui/QuoteButton/QuoteButton";

const reviewCardsData = [
  {
    rating: 5,
    reviewText: "Great experience, communication, follow up. 10/10 would recommend this service.",
    authorName: "Esther Howard",
    reviewDate: "May 14, 2025",
    avatar: "/images/avatar-esther.png", // Placeholder for avatar image
    Logo: <GoogleLogo width="49" height="16"/>
  },
  {
    rating: 5,
    reviewText: "Arthur came and installed a mount on my fireplace and was friendly and fast! Excellent service!",
    authorName: "Brooklyn Simmons",
    reviewDate: "May 4, 2025",
    avatar: "/images/avatar-brooklyn.png", // Placeholder for avatar image
    Logo: <GoogleLogo width="49" height="16"/>
  },
  {
    rating: 5,
    reviewText: "Arthur Ryan went far above and beyond fixing our stubborn tv issue. Definitely recommend him.",
    authorName: "Leslie Alexander",
    reviewDate: "May 9, 2025",
    avatar: "/images/avatar-leslie.png", // Placeholder for avatar image
    Logo: <GoogleLogo width="49" height="16"/>
  },
  {
    rating: 5,
    reviewText: "Artur was incredibly professional and detailed with the installation. Very glad to have picked these guys to do the work!!",
    authorName: "Sujoy Sanyal",
    reviewDate: "Jun 14, 2025",
    avatar: "/images/avatar-esther.png", // Placeholder for avatar image
    Logo: <GoogleLogo width="49" height="16"/>
  },
  {
    rating: 5,
    reviewText: "Professional, meticulous, and ensured everything was level, secure, and wires were hidden. Their problem-solving skills and attention to detail were ...",
    authorName: "BJ Olonilua",
    reviewDate: "Jun 6, 2025",
    avatar: "/images/avatar-brooklyn.png", // Placeholder for avatar image
    Logo: <GoogleLogo width="49" height="16"/>
  },
  {
    rating: 5,
    reviewText: "Artur provided excellent customer service, was on time and I appreciated the discount for doing so much work that I tipped his service",
    authorName: "Brian Busby",
    reviewDate: "May 29, 2025",
    avatar: "/images/avatar-leslie.png", // Placeholder for avatar image
    Logo: <GoogleLogo width="49" height="16"/>
  },
];

const CustomerReviews = () => {
  return (
    <section className={`block ${styles.customerReviews}`}>
      <header className={styles.customerReviewsHeader}>
        <h3 className="blockHeading">
          Customer Reviews
        </h3>
        <p className="subText">Hear from real customers who&apos;ve trusted us to mount their TVs — fast, clean, and professionally.</p>
      </header>
      <SliderGallery
        CardComponent={ReviewCard}
        cardData={reviewCardsData}
        cardsPerPage={3}
      />
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
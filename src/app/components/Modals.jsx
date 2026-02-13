"use client";

import dynamic from "next/dynamic";

// Dynamically import modals with lazy loading
// Defer CSS for BestQuoteModal by using a separate deferred component
const BestQuoteModal = dynamic(() => import("@/modals/BestQuoteModal/BestQuoteModalDeferred"), {
  ssr: false,
  loading: () => <div>Loading modal...</div>
});

const BookNowModal = dynamic(() => import("@/modals/BookNowModal"), {
  ssr: false,
  loading: () => <div>Loading modal...</div>
});

const VideoModal = dynamic(() => import("@/modals/VideoModal/VideoModal"), {
  ssr: false,
  loading: () => <div>Loading video...</div>
});

const YouTubeModal = dynamic(() => import("@/modals/YouTubeModal/YouTubeModal"), {
  ssr: false,
  loading: () => <div>Loading video...</div>
});

const ExitIntentModal = dynamic(() => import("@/modals/ExitIntentModal/ExitIntentModal"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

// const SeeYouSoonModal = dynamic(() => import("@/modals/SeeYouSoonModal"), {
//   ssr: false,
//   loading: () => <div>Loading modal...</div>
// });

// const BookingSuccessModal = dynamic(() => import("@/modals/BookingSuccessModal"), {
//   ssr: false,
//   loading: () => <div>Loading modal...</div>
// });

export default function Modals() {
  return (
    <>
      <BestQuoteModal />
      <BookNowModal />
      <VideoModal />
      <YouTubeModal />
      <ExitIntentModal />
      {/* <SeeYouSoonModal/>
      <BookingSuccessModal/> */}
    </>
  );
}
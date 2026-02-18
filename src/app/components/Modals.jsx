"use client";

import dynamic from "next/dynamic";

// Dynamically import modals with lazy loading
// No loading placeholder needed — modals are hidden by default until opened
const BestQuoteModal = dynamic(() => import("@/modals/BestQuoteModal/BestQuoteModalDeferred"), {
  ssr: false,
  loading: () => null
});

const BookNowModal = dynamic(() => import("@/modals/BookNowModal"), {
  ssr: false,
  loading: () => null
});

// const VideoModal = dynamic(() => import("@/modals/VideoModal/VideoModal"), {
//   ssr: false,
//   loading: () => null
// });

const YouTubeModal = dynamic(() => import("@/modals/YouTubeModal/YouTubeModal"), {
  ssr: false,
  loading: () => null
});

const ExitIntentModal = dynamic(() => import("@/modals/ExitIntentModal/ExitIntentModal"), {
  ssr: false,
  loading: () => null
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
      {/* <VideoModal /> */}
      <YouTubeModal />
      <ExitIntentModal />
      {/* <SeeYouSoonModal/>
      <BookingSuccessModal/> */}
    </>
  );
}
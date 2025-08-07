"use client";

import dynamic from "next/dynamic";

// Dynamically import modals with lazy loading
const BestQuoteModal = dynamic(() => import("@/modals/BestQuoteModal"), {
  ssr: false,
  loading: () => <div>Loading modal...</div>
});

const BookNowModal = dynamic(() => import("@/modals/BookNowModal"), {
  ssr: false,
  loading: () => <div>Loading modal...</div>
});

const SeeYouSoonModal = dynamic(() => import("@/modals/SeeYouSoonModal"), {
  ssr: false,
  loading: () => <div>Loading modal...</div>
});

export default function Modals() {
  return (
    <>
      <BestQuoteModal/>
      <BookNowModal/>
      <SeeYouSoonModal/>
    </>
  );
}
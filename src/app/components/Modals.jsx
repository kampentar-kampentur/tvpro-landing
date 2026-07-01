"use client";

import BestQuoteModal from "@/modals/BestQuoteModal/BestQuoteModalDeferred";
import BookNowModal from "@/modals/BookNowModal";
import VideoModal from "@/modals/VideoModal/VideoModal";
import ExitIntentModal from "@/modals/ExitIntentModal/ExitIntentModal";
import CareersModal from "@/modals/CareersModal";

export default function Modals() {
  return (
    <>
      <BestQuoteModal />
      <BookNowModal />
      <VideoModal />
      <ExitIntentModal />
      <CareersModal />
    </>
  );
}
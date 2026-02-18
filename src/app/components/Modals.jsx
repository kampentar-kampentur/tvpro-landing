"use client";

import BestQuoteModal from "@/modals/BestQuoteModal/BestQuoteModalDeferred";
import BookNowModal from "@/modals/BookNowModal";
import VideoModal from "@/modals/VideoModal/VideoModal";
import YouTubeModal from "@/modals/YouTubeModal/YouTubeModal";
import ExitIntentModal from "@/modals/ExitIntentModal/ExitIntentModal";

export default function Modals() {
  return (
    <>
      <BestQuoteModal />
      <BookNowModal />
      <VideoModal />
      <YouTubeModal />
      <ExitIntentModal />
    </>
  );
}
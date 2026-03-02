"use client";

import { useEffect } from "react";
import { openModalAction, closeModalAction } from "@/store/modalStore";
import BestQuoteModal from "@/modals/BestQuoteModal/BestQuoteModalDeferred";
import BookNowModal from "@/modals/BookNowModal";
import VideoModal from "@/modals/VideoModal/VideoModal";
import YouTubeModal from "@/modals/YouTubeModal/YouTubeModal";
import ExitIntentModal from "@/modals/ExitIntentModal/ExitIntentModal";

export default function Modals() {
  useEffect(() => {
    const handleOpen = (e) => {
      const { name, props } = e.detail || {};
      if (name) openModalAction(name, props);
    };

    const handleClose = (e) => {
      const { name } = e.detail || {};
      if (name) closeModalAction(name);
    };

    document.addEventListener("modal:open", handleOpen);
    document.addEventListener("modal:close", handleClose);

    // Notify that the bridge is ready
    window.__modalsReady = true;
    document.dispatchEvent(new CustomEvent("modals:ready"));

    return () => {
      document.removeEventListener("modal:open", handleOpen);
      document.removeEventListener("modal:close", handleClose);
    };
  }, []);

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
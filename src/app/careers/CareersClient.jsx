"use client";

import { useEffect } from "react";
import { useModal } from "@/providers/ModalProvider";

export default function CareersClient() {
  const { openModal, isModalOpen } = useModal();

  useEffect(() => {
    console.log("CareersClient: Opening modal on mount...");
    openModal("CareersForm");
  }, []); // Run only once on mount

  useEffect(() => {
    // Wait 1 second before starting the check to let the modal open
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        const isOpen = isModalOpen("CareersForm");
        console.log("CareersClient interval check: isOpen =", isOpen);
        if (!isOpen) {
          console.log("CareersClient: Modal closed, redirecting to home");
          clearInterval(interval);
          window.location.href = "/";
        }
      }, 500);

      return () => clearInterval(interval);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [isModalOpen]);

  return null;
}

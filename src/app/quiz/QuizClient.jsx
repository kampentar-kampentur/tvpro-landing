"use client";

import { useEffect } from "react";
import { useModal } from "@/providers/ModalProvider";
import { useRouter } from "next/navigation";

export default function QuizClient() {
  const { openModal, isModalOpen } = useModal();
  const router = useRouter();

  useEffect(() => {
    // Open the quiz modal immediately on mount - ONLY ONCE
    openModal("BestQuote");

    // We use a separate effect or a direct check if we want to monitor closure,
    // but we must avoid adding unstable functions to dependencies.
  }, []); // Run only on mount

  useEffect(() => {
    const checkModal = setInterval(() => {
      const isStillOnQuizPage = window.location.pathname.includes("/quiz");
      // Check if modal is closed and we are still here
      if (isStillOnQuizPage && !isModalOpen("BestQuote")) {
        router.push("/");
      }
    }, 1000);

    return () => clearInterval(checkModal);
  }, [isModalOpen, router]);

  return null;
}

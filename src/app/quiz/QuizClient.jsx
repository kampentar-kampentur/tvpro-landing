"use client";

import { useEffect } from "react";
import { useModal } from "@/providers/ModalProvider";
import { useRouter } from "next/navigation";

export default function QuizClient() {
  const { openModal, isModalOpen } = useModal();
  const router = useRouter();

  useEffect(() => {
    // Save 'from' param to sessionStorage for later use (e.g. on success page)
    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get('from');
    if (from) {
      sessionStorage.setItem('quiz_return_url', from === 'chicago' ? '/chicago/' : '/');
    }

    // Open the quiz modal immediately on mount - ONLY ONCE
    openModal("BestQuote");
  }, []); // Run only on mount

  useEffect(() => {
    const checkModal = setInterval(() => {
      const isStillOnQuizPage = window.location.pathname.includes("/quiz");
      if (isStillOnQuizPage && !isModalOpen("BestQuote")) {
        // If modal is closed manually, return to source or home
        const returnUrl = sessionStorage.getItem('quiz_return_url') || "/";
        router.push(returnUrl);
      }
    }, 1000);

    return () => clearInterval(checkModal);
  }, [isModalOpen, router]);

  return null;
}

"use client"

import { useModalState, useModal } from "@/providers/ModalProvider";
import React, { useEffect, useState } from "react";

const BestQuoteModalDeferred = () => {
  const {isOpen, close} = useModalState('BestQuote');
  const { openModal } = useModal();
  const [BestQuoteModalComponent, setBestQuoteModalComponent] = useState(null);

  useEffect(() => {
    // Dynamically import the BestQuoteModal and its styles only when needed
    if (isOpen && !BestQuoteModalComponent) {
      Promise.all([
        import("./BestQuoteModal"),
        import("./BestQuoteModal.module.css")
      ]).then(([componentModule, stylesModule]) => {
        setBestQuoteModalComponent(() => componentModule.default);
      });
    }
  }, [isOpen, BestQuoteModalComponent]);

  if (!isOpen || !BestQuoteModalComponent) {
    return null;
  }

  const ModalComponent = BestQuoteModalComponent;
  return <ModalComponent />;
};

export default BestQuoteModalDeferred;
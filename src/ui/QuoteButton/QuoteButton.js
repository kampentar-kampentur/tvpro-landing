"use client"

import Button from "@/ui/Button";
import { useModal } from "@/providers/ModalProvider";

export default function QuoteButton({ children, modalName = "BestQuote", ...props }) {
    const { openModal } = useModal();

    return (
        <Button onClick={() => openModal(modalName)} {...props}>
            {children || "Get The Best Quote"}
        </Button>
    )
} 
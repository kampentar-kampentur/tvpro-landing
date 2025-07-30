"use client"

import Button from "@/ui/Button";
import { useModal } from "@/providers/ModalProvider";
import { useRouter } from 'next/navigation'

export default function QuoteButton({ children, modalName = "BestQuote", ...props }) {
    const { openModal } = useModal();

    function onClick() {
        openModal(modalName)
    }

    if("BookNow" === modalName) {
        return (
            <Button href="/book-now" {...props}>
                {children || "Get The Best Quote"}
            </Button>
        )
    }

    return (
        <Button onClick={onClick} {...props}>
            {children || "Get The Best Quote"}
        </Button>
    )
} 
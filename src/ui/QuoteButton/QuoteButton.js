"use client"

import Button from "@/ui/Button";
import { useModal } from "@/providers/ModalProvider";
import { useRouter } from 'next/navigation';
import { useCTA } from "@/providers/CTAProvider";

export default function QuoteButton({ children, modalName = "BestQuote", onClick: existingOnClick, ...props }) {
    const { openModal } = useModal();
    const cta = useCTA();

    function onClick(e) {
        if (existingOnClick) {
            existingOnClick(e);
        }
        openModal(modalName)
    }

    // if("BookNow" === modalName) {
    //     const handleBookNowClick = (e) => {
    //         if (existingOnClick) {
    //             existingOnClick(e);
    //         }
    //     };

    //     return (
    //         <Button href="/book-now" onClick={handleBookNowClick} {...props}>
    //             {children || "Get The Best Quote"}
    //         </Button>
    //     )
    // }

    // ... other logic if needed in future

    return (
        <Button onClick={onClick} {...props}>
            {children || "Get The Best Quote"}
        </Button>
    )
}
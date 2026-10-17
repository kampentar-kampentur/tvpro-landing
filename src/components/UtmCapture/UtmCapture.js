"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { saveUtmParams } from "@/lib/utmTracker";

function UtmCaptureInner() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        saveUtmParams();
    }, [pathname, searchParams]);

    return null;
}

export default function UtmCapture() {
    return (
        <Suspense fallback={null}>
            <UtmCaptureInner />
        </Suspense>
    );
}

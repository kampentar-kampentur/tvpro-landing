"use client";

import { useEffect } from "react";
import { saveUtmParams } from "@/lib/utmTracker";

export default function UtmCapture() {
    useEffect(() => {
        saveUtmParams();
    }, []);

    return null;
}

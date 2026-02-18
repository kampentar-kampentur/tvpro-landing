"use client";

import { useModal } from "@/providers/ModalProvider";

export default function VideoCardClient({ children, videoId, isVertical }) {
    const { openModal } = useModal();

    return (
        <div
            onClick={() => openModal("YouTubeModal", { videoId, isVertical })}
            style={{ cursor: "pointer" }}
        >
            {children}
        </div>
    );
}

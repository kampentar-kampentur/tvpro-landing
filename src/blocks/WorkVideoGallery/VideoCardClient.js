"use client";

import { useModal } from "@/providers/ModalProvider";

export default function VideoCardClient({ children, selfHostedVideo, videoId, isVertical }) {
    const { openModal } = useModal();

    const handleOpenModal = () => {
        if (selfHostedVideo) {
            // Prepare data for VideoModal
            const videoData = {
                src480: selfHostedVideo.video480?.url,
                src720: selfHostedVideo.video720?.url,
                src1080: selfHostedVideo.video1080?.url,
                thumbnail: selfHostedVideo.thumbnail?.url
            };
            openModal("VideoModal", { videoData, isVertical });
        } else {
            // Fallback to YouTubeModal
            openModal("YouTubeModal", { videoId, isVertical });
        }
    };

    return (
        <div
            onClick={handleOpenModal}
            style={{ cursor: "pointer" }}
        >
            {children}
        </div>
    );
}

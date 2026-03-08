"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./VideoModal.module.css";
import Modal from "@/ui/Modal";
import { useModalState } from "@/providers/ModalProvider";
import CloseIcon from "@/assets/icons/close.svg";

const VideoModal = () => {
    const { isOpen, close, data } = useModalState("VideoModal");
    const videoData = data?.props?.videoData;
    const isVertical = data?.props?.isVertical;
    const mutedInModal = data?.props?.mutedInModal !== false; // Default to muted if not explicit
    const tracks = videoData?.tracks || [];

    const getBestVideoSrc = useCallback(() => {
        // Use provided data if available
        if (videoData) {
            if (typeof navigator !== 'undefined' && navigator.connection) {
                const { effectiveType, downlink } = navigator.connection;
                if (effectiveType === '4g' && downlink > 5) return videoData.src1080 || videoData.src720;
                if (effectiveType === '4g' && downlink > 3) return videoData.src720;
                if (effectiveType === '3g' || downlink > 1.2) return videoData.src480;
                return videoData.src480;
            }
            return videoData.src1080 || videoData.src720;
        }

        // Fallback to hardcoded old video logic
        return '/optimized/mainVideo2-720p.mp4';
    }, [videoData]);

    const [videoSrc, setVideoSrc] = useState(getBestVideoSrc());

    useEffect(() => {
        if (isOpen) {
            setVideoSrc(getBestVideoSrc());
        }
    }, [isOpen, getBestVideoSrc]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={close}
            className={`${styles.videoModalContent} ${isVertical ? styles.isVerticalModal : ""}`}
        >
            <div className={`${styles.videoContainer} ${isVertical ? styles.isVertical : ""}`}>
                <video
                    className={styles.video}
                    controls
                    controlsList="nodownload noplaybackrate"
                    disablePictureInPicture
                    autoPlay
                    playsInline
                    muted={mutedInModal}
                    poster={videoData?.thumbnail}
                    key={`${videoSrc}-${mutedInModal}`}
                >
                    {videoData?.src480 && <source src={videoData.src480} type="video/mp4" media="(max-width: 480px)" />}
                    {videoData?.src720 && <source src={videoData.src720} type="video/mp4" media="(max-width: 1024px)" />}
                    {videoData?.src1080 && <source src={videoData.src1080} type="video/mp4" />}

                    {/* Fallbacks for older browsers or if specific resolutions are missing */}
                    {!videoData && (
                        <>
                            <source src="/optimized/mainVideo2-360p.mp4" type="video/mp4" media="(max-width: 480px)" />
                            <source src="/optimized/mainVideo2-480p.mp4" type="video/mp4" media="(max-width: 1024px)" />
                            <source src="/optimized/mainVideo2-720p.mp4" type="video/mp4" />
                        </>
                    )}

                    {tracks.map((track, index) => (
                        <track
                            key={index}
                            kind={track.kind || "subtitles"}
                            src={track.src}
                            srcLang={track.srcLang}
                            label={track.label}
                            default={track.default}
                        />
                    ))}

                    Your browser does not support the video tag.
                </video>
            </div>
        </Modal>
    );
};

export default VideoModal;

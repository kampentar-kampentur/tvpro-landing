"use client";

import React, { useState, useEffect } from "react";
import styles from "./VideoModal.module.css";
import Modal from "@/ui/Modal";
import { useModalState } from "@/providers/ModalProvider";
import CloseIcon from "@/assets/icons/close.svg";

const VideoModal = () => {
    const { isOpen, close } = useModalState("VideoModal");

    const getBestVideoSrc = () => {
        if (typeof navigator !== 'undefined' && navigator.connection) {
            const { effectiveType, downlink } = navigator.connection;
            if (effectiveType === '4g' && downlink > 3) return '/optimized/mainVideo2-720p.mp4';
            if (effectiveType === '3g' || downlink > 1.2) return '/optimized/mainVideo2-480p.mp4';
            return '/optimized/mainVideo2-360p.mp4';
        }
        return '/optimized/mainVideo2-720p.mp4'; // Default to high quality in modal
    };

    const [videoSrc, setVideoSrc] = useState(getBestVideoSrc());

    useEffect(() => {
        if (isOpen) {
            setVideoSrc(getBestVideoSrc());
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={close}
            className={styles.videoModalContent}
        >
            <div className={styles.videoContainer}>
                <video
                    className={styles.video}
                    controls
                    controlsList="nodownload noplaybackrate nofullscreen"
                    disablePictureInPicture
                    autoPlay
                    playsInline
                    muted
                    key={videoSrc}
                >
                    <source src="/optimized/mainVideo2-360p.mp4" type="video/mp4" media="(max-width: 480px)" />
                    <source src="/optimized/mainVideo2-480p.mp4" type="video/mp4" media="(max-width: 1024px)" />
                    <source src="/optimized/mainVideo2-720p.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </Modal>
    );
};

export default VideoModal;

"use client";

import React from "react";
import styles from "./YouTubeModal.module.css";
import Modal from "@/ui/Modal";
import { useModalState } from "@/providers/ModalProvider";

const YouTubeModal = () => {
    const { isOpen, close, data } = useModalState("YouTubeModal");
    const videoId = data?.props?.videoId;

    if (!videoId && isOpen) {
        console.error("YouTubeModal: videoId is missing");
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={close}
            className={styles.youtubeModalContent}
        >
            <div className={styles.videoWrapper}>
                {isOpen && (
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className={styles.iframe}
                    ></iframe>
                )}
            </div>
        </Modal>
    );
};

export default YouTubeModal;

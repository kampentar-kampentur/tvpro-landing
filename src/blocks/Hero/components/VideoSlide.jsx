"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useModal } from "@/providers/ModalProvider";
import styles from "./VideoSlide.module.css";

export default function VideoSlide({ isActive, onEnd, data, index = 1 }) {
    const {
        src360 = "/optimized/mainVideo2-360p.mp4",
        src480 = "/optimized/mainVideo2-480p.mp4",
        src720 = "/optimized/mainVideo2-720p.mp4",
        poster = "/videoplaceholder-392.webp"
    } = data || {};
    const videoRef = useRef(null);
    const { openModal } = useModal();
    const [isLoaded, setIsLoaded] = useState(false);

    // Lazy loading: only render video tag if active or it's the first slide (priority)
    // We keep it once it's been active to avoid flickering
    const [shouldRender, setShouldRender] = useState(isActive || index === 0);

    useEffect(() => {
        if (isActive && !shouldRender) {
            setShouldRender(true);
        }
    }, [isActive, shouldRender]);

    useEffect(() => {
        if (isActive && videoRef.current) {
            videoRef.current.play().catch(err => console.log("Video play interrupted or blocked:", err));
        } else if (videoRef.current) {
            videoRef.current.pause();
        }
    }, [isActive, shouldRender]); // Depend on shouldRender too

    const handleVideoReady = () => setIsLoaded(true);

    return (
        <div
            className={styles.videoSlide}
            onClick={() => openModal("VideoModal", {
                videoData: data,
                mutedInModal: data?.mutedInModal
            })}
        >
            {shouldRender ? (
                <video
                    ref={videoRef}
                    poster={poster}
                    preload={index === 0 ? "auto" : "metadata"}
                    autoPlay={isActive}
                    muted
                    playsInline
                    onEnded={onEnd}
                    onLoadedData={handleVideoReady}
                    onLoadedMetadata={handleVideoReady}
                    onCanPlay={handleVideoReady}
                    onTimeUpdate={() => {
                        if (!isLoaded && videoRef.current?.currentTime > 0) {
                            handleVideoReady();
                        }
                    }}
                    className={`${styles.video} ${isLoaded ? styles.loaded : ''}`}
                    // @ts-ignore
                    fetchPriority={index === 0 ? "high" : "low"}
                >
                    <source src={src360} type="video/mp4" media="(max-width: 480px)" />
                    <source src={src480} type="video/mp4" media="(max-width: 1024px)" />
                    <source src={src720} type="video/mp4" />
                    {(data?.tracks || []).map((track, index) => (
                        <track
                            key={index}
                            kind={track.kind || "subtitles"}
                            src={track.src}
                            srcLang={track.srcLang}
                            label={track.label}
                            default={track.default}
                        />
                    ))}
                </video>
            ) : (
                <div
                    className={styles.videoPlaceholder}
                    style={{ backgroundImage: `url(${poster})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '100%' }}
                />
            )}
        </div>
    );
}

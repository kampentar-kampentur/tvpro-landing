"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import styles from "./VideoSlide.module.css";

export default function VideoSlide({ isActive, onEnd, data, index = 1 }) {
    const {
        src360 = "/optimized/mainVideo2-360p.mp4",
        src480 = "/optimized/mainVideo2-480p.mp4",
        src720 = "/optimized/mainVideo2-720p.mp4",
        poster = "/videoplaceholder-392.webp"
    } = data || {};
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Lazy loading: only render video tag if active or it's the first slide (priority)
    // For the very first slide (index 0), we delay rendering by 2s to show the poster first
    // and satisfy PageSpeed LCP metrics.
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isActive) {
            setShouldRender(true);
            return;
        }

        if (index === 0) {
            const timer = setTimeout(() => {
                setShouldRender(true);
            }, 2000); // 2s delay for the heavy video payload
            return () => clearTimeout(timer);
        }
    }, [isActive, index]);

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
        >
            {shouldRender ? (
                <video
                    ref={videoRef}
                    poster={poster}
                    preload={index === 0 ? "auto" : "metadata"}
                    autoPlay={isActive}
                    muted
                    playsInline
                    width="1920"
                    height="1080"
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
                <img
                    src={poster}
                    alt=""
                    fetchPriority={index === 0 ? "high" : "low"}
                    loading={index === 0 ? "eager" : "lazy"}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    className={styles.videoPlaceholder}
                />
            )}
        </div>
    );
}

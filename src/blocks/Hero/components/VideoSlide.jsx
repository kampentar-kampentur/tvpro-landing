"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import styles from "./VideoSlide.module.css";

export default function VideoSlide({ isActive, onEnd, data, index = 0 }) {
    const {
        src360 = "/optimized/mainVideo2-360p.mp4",
        src480 = "/optimized/mainVideo2-480p.mp4",
        src720 = "/optimized/mainVideo2-720p.mp4",
        poster = "/videoplaceholder-392.webp"
    } = data || {};

    const videoRef = useRef(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    const handlePlaying = useCallback(() => {
        setHasStarted(true);
        setShowSpinner(false);
    }, []);

    // Playback control on slide active change
    useEffect(() => {
        let spinnerTimer = null;
        let timeoutTimer = null;

        const video = videoRef.current;
        if (!video) return;

        if (isActive) {
            // Restart from beginning if ended
            if (video.ended || (video.duration && video.currentTime >= video.duration - 0.5)) {
                video.currentTime = 0;
            }

            // If video has never started, show subtle spinner after 800ms buffer delay
            if (!hasStarted) {
                spinnerTimer = setTimeout(() => {
                    setShowSpinner(true);
                }, 800);

                // Failsafe: if video doesn't play within 8s, stop spinner
                timeoutTimer = setTimeout(() => {
                    setShowSpinner(false);
                }, 8000);
            }

            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Playback started
                    })
                    .catch((err) => {
                        console.log("Hero video autoplay hindered:", err?.name || err);
                        setShowSpinner(false);
                    });
            }
        } else {
            // When slide moves away: pause video, but KEEP it visible (don't fade out to poster!)
            video.pause();
            setShowSpinner(false);
        }

        return () => {
            if (spinnerTimer) clearTimeout(spinnerTimer);
            if (timeoutTimer) clearTimeout(timeoutTimer);
        };
    }, [isActive, hasStarted]);

    const handleSlideClick = () => {
        if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play().then(handlePlaying).catch(() => {});
        }
    };

    return (
        <div
            className={styles.videoSlide}
            onClick={handleSlideClick}
        >
            {/* The original poster is ALWAYS in DOM (SSR + Client) as base layer */}
            <picture className={styles.posterWrapper}>
                <source media="(min-width: 1024px)" srcSet="/videoplaceholder-1180.webp" />
                <source media="(min-width: 481px)" srcSet="/videoplaceholder-800.webp" />
                <img
                    src={poster}
                    alt="TV Mounting installation showcase"
                    fetchPriority={index === 0 ? "high" : "low"}
                    loading={index === 0 ? "eager" : "lazy"}
                    className={styles.poster}
                />
            </picture>

            {/* Video element is ALWAYS in DOM, fades in when playback begins and STAYS visible */}
            <video
                ref={videoRef}
                preload={index === 0 ? "auto" : "metadata"}
                autoPlay={isActive}
                muted
                playsInline
                width="1920"
                height="1080"
                onEnded={onEnd}
                onPlaying={handlePlaying}
                onWaiting={() => {
                    if (isActive && !hasStarted) setShowSpinner(true);
                }}
                onCanPlayThrough={() => setShowSpinner(false)}
                onError={(e) => {
                    console.log("Hero video load notice:", e);
                    setShowSpinner(false);
                }}
                onTimeUpdate={() => {
                    if (!hasStarted && videoRef.current?.currentTime > 0) {
                        handlePlaying();
                    }
                }}
                className={`${styles.video} ${hasStarted ? styles.visible : ''}`}
                // @ts-ignore
                fetchPriority={index === 0 ? "high" : "low"}
            >
                <source src={src360} type="video/mp4" media="(max-width: 480px)" />
                <source src={src480} type="video/mp4" media="(max-width: 1024px)" />
                <source src={src720} type="video/mp4" />
                {(data?.tracks || []).map((track, trackIdx) => (
                    <track
                        key={trackIdx}
                        kind={track.kind || "subtitles"}
                        src={track.src}
                        srcLang={track.srcLang}
                        label={track.label}
                        default={track.default}
                    />
                ))}
            </video>

            {/* Subtle frosted glass spinner if buffering takes more than 800ms */}
            {showSpinner && (
                <div className={styles.spinnerWrapper} aria-hidden="true">
                    <div className={styles.spinner} />
                </div>
            )}
        </div>
    );
}

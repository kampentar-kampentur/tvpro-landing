"use client";

import React from "react";

/**
 * SelfHostedVideo Component
 * 
 * Renders an optimized HTML5 video player using multi-resolution sources
 * provided by Strapi/R2.
 * 
 * @param {Object} videoData - Data from Strapi shared.self-hosted-video component
 * @param {boolean} isVertical - Whether the video is in portrait mode
 * @param {boolean} controls - Whether to show player controls
 * @param {boolean} autoPlay - Whether to start playing automatically
 * @param {boolean} muted - Whether to mute the audio
 * @param {boolean} playsInline - Whether to play inline on mobile
 * @param {string} className - Optional CSS class
 */
export default function SelfHostedVideo({
    videoData,
    isVertical = false,
    controls = true,
    autoPlay = false,
    muted = false,
    playsInline = true,
    className = "",
    attrs = {}
}) {
    if (!videoData) return null;

    const poster = videoData.thumbnail?.url || "";
    const src480 = videoData.video480?.url;
    const src720 = videoData.video720?.url;
    const src1080 = videoData.video1080?.url;

    return (
        <video
            className={className}
            poster={poster}
            controls={controls}
            autoPlay={autoPlay}
            muted={muted}
            playsInline={playsInline}
            {...attrs}
        >
            {/* Resolution switching based on screen width */}
            {src480 && <source src={src480} type="video/mp4" media="(max-width: 480px)" />}
            {src720 && <source src={src720} type="video/mp4" media="(max-width: 1024px)" />}
            {src1080 && <source src={src1080} type="video/mp4" />}

            {/* Fallback to whatever is available if media queries don't match or aren't supported */}
            {!src1080 && src720 && <source src={src720} type="video/mp4" />}
            {!src1080 && !src720 && src480 && <source src={src480} type="video/mp4" />}

            Your browser does not support the video tag.
        </video>
    );
}

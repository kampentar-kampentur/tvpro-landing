"use client";

import React from "react";

/**
 * ImageWrapper handles image rendering across Next.js and Astro.
 * It uses a standard <img> tag to avoid framework-specific constraints and 
 * implements its own optimization logic using Strapi image formats.
 */
export default function ImageWrapper({
    media,
    className,
    defaultAlt,
    width,
    height,
    sizes = "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw",
    priority = false,
    preferFormat // optional: 'large', 'medium', 'small', 'thumbnail'
}) {
    if (!media) return null;

    const formats = media.formats || {};

    // Helper to get the best URL for a specific width (for srcSet)
    const getFormatUrl = (requestedWidth) => {
        if (!formats || Object.keys(formats).length === 0) {
            return media.url;
        }

        const availableFormats = Object.keys(formats)
            .map(key => ({ key, ...formats[key] }))
            .sort((a, b) => a.width - b.width);

        const bestFit = availableFormats.find(f => f.width >= requestedWidth);
        return bestFit ? bestFit.url : (availableFormats[availableFormats.length - 1]?.url || media.url);
    };

    // Construct srcSet
    const srcSet = Object.values(formats)
        .map(f => `${f.url} ${f.width}w`)
        .join(", ");

    // Initial src
    let src = media.url;
    if (preferFormat && formats[preferFormat]) {
        src = formats[preferFormat].url;
    }

    const finalWidth = width || (media.width ? Math.min(media.width, 1200) : 1200);
    const finalHeight = height || (media.width && media.height ? Math.round(finalWidth / (media.width / media.height)) : undefined);

    return (
        <img
            src={src}
            srcSet={srcSet || undefined}
            className={className}
            width={finalWidth}
            height={finalHeight}
            alt={media.alternativeText || media.caption || defaultAlt || ""}
            loading={priority ? "eager" : "lazy"}
            sizes={sizes}
            decoding="async"
        />
    );
}

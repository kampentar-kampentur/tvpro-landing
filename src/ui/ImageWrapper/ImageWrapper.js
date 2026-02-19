"use client";

import React from "react";

/**
 * Cloudinary loader helper.
 * Generates optimized URLs with specific widths.
 */
const cloudinaryLoader = ({ src, width, quality }) => {
    if (!src || !src.includes('res.cloudinary.com')) return src;

    // Use c_fill to ensure aspect ratio, and q_auto:eco for better compression on mobile
    const transformation = `c_fill,w_${width},f_auto,q_auto:${quality || 'eco'}`;

    // Insert transformation after /upload/
    return src.replace(
        /\/upload\//,
        `/upload/${transformation}/`
    );
};

export default function ImageWrapper({
    media,
    className,
    defaultAlt,
    width,
    height,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    priority = false
}) {
    if (!media) return null;

    // Use absolute URL from media object
    const url = media.url;

    // We use Math.min to avoid passing extremely large original dimensions to the <img> tag
    // while still providing correctly scaled width/height attributes for aspect ratio.
    const finalWidth = width || Math.min(media.width || 1200, 1200);
    const finalHeight = height || (media.width ? Math.round(finalWidth / (media.width / (media.height || 1))) : undefined);

    // For Astro/Framework-agnostic compatibility, we use standard <img> tag
    // mimicking next/image optimization via Cloudinary transformations.

    const src = cloudinaryLoader({ src: url, width: finalWidth });

    // Basic srcset for responsiveness
    const srcSet = [640, 750, 828, 1080, 1200]
        .filter(w => !media.width || w <= media.width)
        .map(w => `${cloudinaryLoader({ src: url, width: w })} ${w}w`)
        .join(', ');

    return <img
        src={src}
        srcSet={srcSet}
        className={className}
        width={finalWidth}
        height={finalHeight}
        alt={media.alternativeText || media.caption || defaultAlt || ""}
        loading={priority ? "eager" : "lazy"}
        sizes={sizes}
        style={{ height: 'auto', maxWidth: '100%' }} // Ensure responsiveness
    />;
}

"use client";

import Image from "next/image";

/**
 * Cloudinary loader for next/image.
 * Generates optimized URLs with specific widths for srcset.
 */
const cloudinaryLoader = ({ src, width, quality }) => {
    if (!src || !src.includes('res.cloudinary.com')) return src;

    // Use c_limit to ensure we don't upscale, and auto-format/quality
    const transformation = `c_limit,w_${width},f_auto,q_auto:${quality || 'good'}`;

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

    // We use Math.min to avoid passing extremely large original dimensions to the <img> tag
    // while still providing correctly scaled width/height attributes for aspect ratio.
    const finalWidth = width || Math.min(media.width, 1200);
    const finalHeight = height || Math.round(finalWidth / (media.width / (media.height || 1)));

    return <Image
        loader={cloudinaryLoader}
        src={media.url}
        className={className}
        width={finalWidth}
        height={finalHeight}
        alt={media.alternativeText || media.caption || defaultAlt || ""}
        priority={priority}
        sizes={sizes}
    // Note: loading="lazy" is default unless priority is true
    />;
}

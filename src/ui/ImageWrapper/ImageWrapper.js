"use client";

import Image from "next/image";

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

    const finalWidth = width || Math.min(media.width, 1200);
    const finalHeight = height || Math.round(finalWidth / (media.width / (media.height || 1)));

    return <Image
        src={media.url}
        className={className}
        width={finalWidth}
        height={finalHeight}
        alt={media.alternativeText || media.caption || defaultAlt || ""}
        priority={priority}
        sizes={sizes}
    />;
}

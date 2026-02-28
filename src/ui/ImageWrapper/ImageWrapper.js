"use client";

import Image from "next/image";

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

    const strapiLoader = ({ src, width: requestedWidth, quality }) => {
        if (preferFormat && formats[preferFormat]) {
            return formats[preferFormat].url;
        }

        if (!formats || Object.keys(formats).length === 0) {
            return src;
        }

        const availableFormats = Object.keys(formats)
            .map(key => ({ key, ...formats[key] }))
            .sort((a, b) => a.width - b.width);

        // Find the smallest format that is larger than or equal to the requested width
        const bestFit = availableFormats.find(f => f.width >= requestedWidth);

        if (bestFit) {
            return bestFit.url;
        }

        // Fallback to the largest available format or the original URL
        return availableFormats[availableFormats.length - 1]?.url || src;
    };

    const finalWidth = width || (media.width ? Math.min(media.width, 1200) : 1200);
    const finalHeight = height || (media.width && media.height ? Math.round(finalWidth / (media.width / media.height)) : undefined);

    return <Image
        loader={strapiLoader}
        src={media.url}
        className={className}
        width={finalWidth}
        height={finalHeight}
        alt={media.alternativeText || media.caption || defaultAlt || ""}
        priority={priority}
        sizes={sizes}
    />;
}

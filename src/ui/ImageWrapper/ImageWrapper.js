import Image from "next/image";

/**
 * Inserts Cloudinary transformations into a Cloudinary URL.
 * Adds auto-format (WebP/AVIF), auto-quality, and width limit.
 * Example: .../upload/v123/image.jpg → .../upload/c_limit,w_640,f_auto,q_auto/v123/image.jpg
 */
function getOptimizedCloudinaryUrl(url, maxWidth = 800) {
    if (!url || !url.includes('res.cloudinary.com')) return url;

    const transformation = `c_limit,w_${maxWidth},f_auto,q_auto`;

    // Insert transformation after /upload/
    return url.replace(
        /\/upload\//,
        `/upload/${transformation}/`
    );
}

export default function ImageWrapper({
    media,
    className,
    defaultAlt,
    maxWidth = 800,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    priority = false
}) {
    if (!media) return null;

    const optimizedUrl = getOptimizedCloudinaryUrl(media.url, maxWidth);

    return <Image
        className={className}
        width={media.width}
        height={media.height}
        src={optimizedUrl}
        alt={media.alternativeText || media.caption || defaultAlt || "Professional TV Mounting Service"}
        unoptimized={true}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        sizes={sizes}
    />;
}

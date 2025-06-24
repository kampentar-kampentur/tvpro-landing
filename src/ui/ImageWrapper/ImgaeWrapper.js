import Image from "next/image";

export default function ImageWrapper({media, className, defaultAlt}) {
    return media && <Image
        className={className} 
        width={media.width}
        height={media.height}
        src={media.url}
        alt={media.alternativeText || media.caption || defaultAlt || "Some Image"}
    />
} 
import Image from "next/image";

export default function ImageWrapper({media, className, defaultAlt}) {
    return <Image
        className={className} 
        width={media.width}
        height={media.height}
        src={process.env.SRTAPI_URL + media.url}
        alt={media.alternativeText || media.caption || defaultAlt || "Some Image"}
    />
} 
import React from "react";
import styles from "./WorkVideoGallery.module.css";
import Text from "@/ui/Text/Text";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import Image from "next/image";
import VideoCardClient from "./VideoCardClient";

const VideoCard = ({ video, index = 0, length }) => {
    // Optimization: Use mqdefault (320x180) for all grid thumbnails to save data.
    // Heavy maxresdefault is only needed for the full-width view in modal.
    const thumbType = length % 2 !== 0 && index !== length - 1 ? 'hqdefault' : 'sddefault';
    const thumbWidth = length % 2 !== 0 && index !== length - 1 ? 480 : 640;
    const thumbHeight = length % 2 !== 0 && index !== length - 1 ? 360 : 480;
    return (
        <VideoCardClient videoId={video.youtubeId} isVertical={video.isVertical}>
            <div
                className={`${styles.videoCard}${video.isVertical ? ` ${styles.verticalCard}` : ''}`}
                style={{ "--reveal-delay": `${index * 0.1}s` }}
            >
                <div className={styles.thumbnailWrapper}>
                    <Image
                        src={`https://img.youtube.com/vi/${video.youtubeId}/${thumbType}.jpg`}
                        alt={video.title}
                        className={styles.thumbnail}
                        width={thumbWidth}
                        height={thumbHeight}
                        loading="lazy"
                        fetchPriority="low"
                    // unoptimized={true}
                    />
                    <div className={styles.playOverlay}>
                        <div className={styles.playButton}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="6,3 20,12 6,21" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className={styles.videoInfo}>
                    <h3 className={styles.videoTitle}>{video.title}</h3>
                    <p className={styles.videoDescription}>{video.description}</p>
                </div>
            </div>
        </VideoCardClient>
    );
};

async function getWorkVideoGalleryData() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/see-our-work-in-action?populate=*`,
            { cache: 'force-cache' }
        );
        const json = await res.json();
        return json.data;
    } catch (error) {
        console.error("Error fetching WorkVideoGallery data:", error);
        return null;
    }
}

export default async function WorkVideoGallery({ data = {} }) {
    const videoGalleryData = await getWorkVideoGalleryData();
    const displayData = {
        ...videoGalleryData,
        ...data,
        videoItem: data.videoItem?.length > 0 ? data.videoItem : videoGalleryData.videoItem
    }
    const title = displayData.title || "See Our Work in Action";
    const subTitle = displayData.subTitle || "Documentation of our high-quality professional installations.";

    const videos = displayData.videoItem.map((v, idx) => ({
        id: v.id || idx,
        youtubeId: v.youtubeId || "dQw4w9WgXcQ",
        isVertical: v.isVertical ?? false,
        title: v.title || "Installation Project",
        description: v.description || "Professional TV mounting by TVPro team"
    }));

    return (
        <section className={styles.workVideoGallery} id="video-gallery">
            <div className="block">
                <header className={styles.header}>
                    <h2 className="blockHeading">
                        <Text text={title} />
                    </h2>
                    {subTitle && (
                        <p className="subText">
                            <Text text={subTitle} />
                        </p>
                    )}
                </header>

                <div className={styles.grid}>
                    {videos.map((video, idx) => (
                        <VideoCard key={video.id} video={video} index={idx} length={videos.length} />
                    ))}
                </div>

                <div className={styles.footer}>
                    <p className={styles.ctaText}>Ready to start your project?</p>
                    <QuoteButton variant="primary" size="large" className={styles.ctaButton}>
                        Get Your Price in 30 Seconds
                    </QuoteButton>
                </div>
            </div>
        </section>
    );
}

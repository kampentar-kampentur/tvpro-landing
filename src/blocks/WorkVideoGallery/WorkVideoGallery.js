import React from "react";
import styles from "./WorkVideoGallery.module.css";
import Text from "@/ui/Text/Text";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import Image from "next/image";
import VideoCardClient from "./VideoCardClient";

const VideoCard = ({ video, index = 0, isLastOdd = false }) => {
    const thumbType = isLastOdd ? 'maxresdefault' : 'hqdefault';
    const thumbWidth = isLastOdd ? 1280 : 480;
    const thumbHeight = isLastOdd ? 720 : 360;
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
                        unoptimized={true}
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

export default function WorkVideoGallery({ data = {} }) {
    const title = data.title || "See Our Work in Action";
    const subTitle = data.subTitle || "Documentation of our high-quality professional installations.";

    const rawVideos = data.videoItem || data.videos || [];

    const videos = rawVideos.map((v, idx) => ({
        id: v.id || idx,
        youtubeId: v.youtubeId || "dQw4w9WgXcQ",
        isVertical: v.isVertical || false,
        title: v.title || "Video Title",
        description: v.description || "Description placeholder"
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
                        <VideoCard key={video.id} video={video} index={idx} isLastOdd={videos.length % 2 === 1 && idx === videos.length - 1} />
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

"use client";

import React, { useState, useEffect } from "react";
import styles from "./WorkVideoGallery.module.css";
import Text from "@/ui/Text/Text";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import { useModal } from "@/providers/ModalProvider";
import Image from "next/image";

const VideoCard = ({ video }) => {
    const { openModal } = useModal();

    return (
        <div
            className={styles.videoCard}
            onClick={() => openModal("YouTubeModal", { videoId: video.youtubeId })}
        >
            <div className={styles.thumbnailWrapper}>
                <Image
                    src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                    alt={video.title}
                    className={styles.thumbnail}
                    width={560}
                    height={315}
                    unoptimized={true}
                />
                <div className={styles.playOverlay}>
                    <div className={styles.playButton}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 6c0-1.104.896-2 2-2 .345 0 .678.089.969.256l10.969 6.256c.94.537.94 1.951 0 2.488L9.969 19.256A1.999 1.999 0 017 17.5V6z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className={styles.videoInfo}>
                <h3 className={styles.videoTitle}>{video.title}</h3>
                <p className={styles.videoDescription}>{video.description}</p>
            </div>
        </div>
    );
};

async function getWorkVideoGallery() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/see-our-work-in-action?populate=*`, { cache: 'no-store' });
        const json = await res.json();
        return json.data;
    } catch (error) {
        console.error("Error fetching WorkVideoGallery data:", error);
        return null;
    }
}

export default function WorkVideoGallery({ data = {} }) {
    const [defaultData, setDefaultData] = useState(null);

    useEffect(() => {
        getWorkVideoGallery().then(setDefaultData);
    }, []);

    const titleSize = data.titleSize || defaultData?.titleSize || "h2";
    const title = data.title || defaultData?.title || "See Our Work in Action";
    const subTitle = data.subTitle || defaultData?.subTitle || "Documentation of our high-quality professional installations.";

    // Support both 'videos' (local prop) and 'videoItem' (Strapi)
    // Fix: If city-specific array is empty, fallback to global defaultData
    const cityVideos = data.videos || data.videoItem;
    const rawVideos = (cityVideos && cityVideos.length > 0)
        ? cityVideos
        : (defaultData?.videoItem || []);

    const videos = rawVideos.map((v, idx) => ({
        id: v.id || idx,
        youtubeId: v.youtubeId || "dQw4w9WgXcQ",
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
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>

                <div className={styles.footer}>
                    <p className={styles.ctaText}>Ready to start your project?</p>
                    <QuoteButton variant="primary" size="small">
                        Get Your Price in 30 Seconds
                    </QuoteButton>
                </div>
            </div>
        </section>
    );
}

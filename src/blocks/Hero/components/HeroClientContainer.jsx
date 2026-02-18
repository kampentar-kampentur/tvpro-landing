"use client";

import ExpandingSection from "./ExpandingSection";
import HeroCarousel from "./HeroCarousel";
import VideoSlide from "./VideoSlide";

// We can now define "совсем разные штуки" прямо здесь как компоненты
const PromoSlide = ({ data }) => (
    <div style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(45deg, #00c6ff 0%, #0072ff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '40px'
    }}>
        <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Limited Time</div>
        <h2 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '20px' }}>{data?.title}</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px 25px', borderRadius: '12px', backdropFilter: 'blur(5px)' }}>
                <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold' }}>$0</span>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>Trip Fee</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px 25px', borderRadius: '12px', backdropFilter: 'blur(5px)' }}>
                <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold' }}>2YR</span>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>Warranty</span>
            </div>
        </div>
    </div>
);

export default function HeroClientContainer({ videoSrc = '/optimized/mainVideo2-720p.mp4' }) {

    const carouselSlides = [
        {
            type: 'video',
            data: {
                src360: '/optimized/IMG_3107-360p.mp4',
                src480: '/optimized/IMG_3107-480p.mp4',
                src720: '/optimized/IMG_3107-720p.mp4',
                mutedInModal: false,
                tracks: [
                    { src: '/subs/IMG_3107.vtt', srcLang: 'en', label: 'English', default: false }
                ]
            }
        },
        {
            type: 'video',
            data: {
                src360: '/optimized/mainVideo2-360p.mp4',
                src480: '/optimized/mainVideo2-480p.mp4',
                src720: videoSrc,
                mutedInModal: true
            }
        },
        {
            type: 'video',
            data: {
                src360: '/optimized/IMG_3057-360p.mp4',
                src480: '/optimized/IMG_3057-480p.mp4',
                src720: '/optimized/IMG_3057-720p.mp4',
                mutedInModal: false,
            }
        },
    ];

    return (
        <ExpandingSection>
            <HeroCarousel slides={carouselSlides} />
        </ExpandingSection>
    );
}

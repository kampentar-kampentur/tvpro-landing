import React from 'react';
import { SliderGallery } from '@/ui/SliderGallery/SliderGallery';
import CertificateCard from './CertificateCard';

export default function CertificatesSlider({ certificates, ...props }) {
    const cardData = certificates.map((c, index) => ({
        image: c,
        certificates: certificates,
        currentIndex: index,
    }));

    return (
        <SliderGallery
            CardComponent={CertificateCard}
            cardData={cardData}
            {...props}
        />
    );
}

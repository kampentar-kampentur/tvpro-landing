import React from 'react';
import Hero from '@/blocks/Hero/Hero';
import TVSizes from '@/blocks/TVSizes/TVSizes';
import GalleryOfWork from '@/blocks/GalleryOfWork/GalleryOfWork';
import Certificates from '@/blocks/Certificates/Certificates';
import MountingTypes from '@/blocks/MountingTypes/MountingTypes';
import WhyCustomersTrustUs from '@/blocks/WhyCustomersTrustUs/WhyCustomersTrustUs';
import CustomerReviews from '@/blocks/CustomerReviews/CustomerReviews';
import OurServices from '@/blocks/OurServices/OurServices';
import AboutUs from '@/blocks/AboutUs/AboutUs';
import FAQ from '@/blocks/FAQ/FAQ';
import Contacts from '@/blocks/Contacts/Contacts';
import WorkVideoGallery from '@/blocks/WorkVideoGallery/WorkVideoGallery';
import AreasWeServe from '@/blocks/AreasWeServe/AreasWeServe';
import SEOBreadcrumbs from '@/ui/SEOBreadcrumbs/SEOBreadcrumbs';
import OurTeam from '@/blocks/OurTeam/OurTeam';

const blockMap = {
    'blocks.hero': Hero,
    'blocks.tv-sizes': TVSizes,
    'blocks.gallery-of-work': GalleryOfWork,
    'blocks.certificate': Certificates,
    'blocks.tv-mounting-types': MountingTypes,
    'blocks.why-customers-choose-us': WhyCustomersTrustUs,
    'blocks.customer-reviews': CustomerReviews,
    'blocks.our-services': OurServices,
    'blocks.about-us': AboutUs,
    'blocks.faq': FAQ,
    'blocks.contact-us': Contacts,
    'blocks.see-our-work-in-action': WorkVideoGallery,
    'blocks.areas-we-serve': AreasWeServe,
    'blocks.our-team': OurTeam
};

export default function BlockRenderer({ blocks, globalData, cityContext }) {
    if (!blocks) return null;

    // Auto-inject OurTeam block if not defined in Strapi
    let processedBlocks = [...blocks];
    const hasOurTeam = processedBlocks.some(block => block.__component === 'blocks.our-team');
    if (!hasOurTeam) {
        // Find best insertion slot: before FAQ, after Customer Reviews, before Contact Us, or at the end
        const faqIndex = processedBlocks.findIndex(block => block.__component === 'blocks.faq');
        if (faqIndex !== -1) {
            processedBlocks.splice(faqIndex, 0, { __component: 'blocks.our-team' });
        } else {
            const reviewsIndex = processedBlocks.findIndex(block => block.__component === 'blocks.customer-reviews');
            if (reviewsIndex !== -1) {
                processedBlocks.splice(reviewsIndex + 1, 0, { __component: 'blocks.our-team' });
            } else {
                const contactIndex = processedBlocks.findIndex(block => block.__component === 'blocks.contact-us');
                if (contactIndex !== -1) {
                    processedBlocks.splice(contactIndex, 0, { __component: 'blocks.our-team' });
                } else {
                    processedBlocks.push({ __component: 'blocks.our-team' });
                }
            }
        }
    }

    return processedBlocks.map((block, index) => {
        const Component = blockMap[block.__component];
        if (!Component) {
            console.warn(`Component not found for: ${block.__component}`);
            return null;
        }

        const blockName = block.__component.split('.')[1];
        const globalBlockData = globalData ? globalData[blockName] : {};

        const finalizedData = block.use_global && globalBlockData
            ? { ...globalBlockData, ...block }
            : block;

        const renderedBlock = (
            <Component
                key={`${block.__component}-${index}`}
                data={finalizedData}
                cityContext={cityContext}
            />
        );

        if (block.__component === 'blocks.hero' && cityContext?.city_name) {
            return (
                <React.Fragment key={`${block.__component}-${index}-fragment`}>
                    {renderedBlock}
                    <SEOBreadcrumbs cityContext={cityContext} />
                </React.Fragment>
            );
        }

        return renderedBlock;
    });
}

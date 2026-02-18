import dynamic from 'next/dynamic';

// Dynamically import blocks to reduce initial bundle size and JS execution time.
// This is critical for city pages that only use a subset of blocks.
const Hero = dynamic(() => import('@/blocks/Hero/Hero'), { ssr: true });
const TVSizes = dynamic(() => import('@/blocks/TVSizes/TVSizes'), { ssr: true });
const GalleryOfWork = dynamic(() => import('@/blocks/GalleryOfWork/GalleryOfWork'), { ssr: true });
const Certificates = dynamic(() => import('@/blocks/Certificates/Certificates'), { ssr: true });
const MountingTypes = dynamic(() => import('@/blocks/MountingTypes/MountingTypes'), { ssr: true });
const WhyCustomersTrustUs = dynamic(() => import('@/blocks/WhyCustomersTrustUs/WhyCustomersTrustUs'), { ssr: true });
const CustomerReviews = dynamic(() => import('@/blocks/CustomerReviews/CustomerReviews'), { ssr: true });
const OurServices = dynamic(() => import('@/blocks/OurServices/OurServices'), { ssr: true });
const AboutUs = dynamic(() => import('@/blocks/AboutUs/AboutUs'), { ssr: true });
const FAQ = dynamic(() => import('@/blocks/FAQ/FAQ'), { ssr: true });
const Contacts = dynamic(() => import('@/blocks/Contacts/Contacts'), { ssr: true });
const WorkVideoGallery = dynamic(() => import('@/blocks/WorkVideoGallery/WorkVideoGallery'), { ssr: true });

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
};

export default function BlockRenderer({ blocks, globalData, cityContext }) {
    if (!blocks) return null;

    return blocks.map((block, index) => {
        const Component = blockMap[block.__component];
        if (!Component) {
            console.warn(`Component not found for: ${block.__component}`);
            return null;
        }

        // Merge Strategy:
        // If block has "use_global" flag, merge global data for that block type
        // We assume globalData has a key matching the block name (e.g. 'hero')
        // and that the block name can be derived from __component (e.g. 'blocks.hero' -> 'hero')
        const blockName = block.__component.split('.')[1];
        const globalBlockData = globalData ? globalData[blockName] : {};

        const finalizedData = block.use_global && globalBlockData
            ? { ...globalBlockData, ...block }
            : block;

        return <Component
            key={`${block.__component}-${index}`}
            data={finalizedData}
            cityContext={cityContext}
        />;
    });
}

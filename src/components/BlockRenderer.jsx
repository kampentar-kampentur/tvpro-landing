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

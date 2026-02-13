import { getCityBySlug, getAllCities, getGlobalConfig } from '@/lib/strapi';
import BlockRenderer from '@/components/BlockRenderer';
import { notFound } from 'next/navigation';

// 1. Generate Static Params for SSG
export const dynamicParams = false;

export async function generateStaticParams() {
    const cities = await getAllCities() || [];
    // Filter for only "default" versions (where test_version is null/empty)
    return cities
        .filter(city => !city.test_version && city.path)
        .map((city) => ({
            city: city.path,
        }));
}

export async function generateMetadata({ params }) {
    const { city: citySlug } = await params;
    const cityData = await getCityBySlug(citySlug);

    if (!cityData) return {};

    const { seo, city_name, state_code } = cityData;
    const displayName = city_name ? `${city_name}${state_code ? `, ${state_code}` : ''}` : 'TVPro Handy Services';

    const title = seo?.metaTitle || `TV Mounting Services in ${displayName} | TVPro`;
    const description = seo?.metaDescription || `Expert TV mounting and home theater installation services in ${displayName}. Secure mounting on all surfaces, wire hiding, and same-day service.`;

    const ogImageUrl = seo?.shareImage?.url || 'https://tvprousa.com/og-image.png';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: `TV mounting services in ${displayName}`,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImageUrl],
        },
    };
}

export default async function CityPage({ params }) {
    const { city: citySlug } = await params;

    // 2. Fetch Data
    const [cityData, globalData] = await Promise.all([
        getCityBySlug(citySlug),
        getGlobalConfig()
    ]);

    if (!cityData) {
        return notFound();
    }

    // 3. Fallback Logic
    // If city has no page, use global default layout
    // Note: strapi.js populate depth needs to be sufficient
    const layout = cityData.page && cityData.page.length > 0
        ? cityData.page
        : globalData.default_layout || [];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": `TVPro Handy Services - ${cityData.city_name || 'TV Mounting'}`,
        "description": cityData.seo?.metaDescription || "Professional TV Mounting Services",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": cityData.city_name || "Houston",
            "addressRegion": cityData.state_code || "TX",
            "addressCountry": "US"
        },
        "url": `https://tvprousa.com/${citySlug}`,
        "telephone": "(877) 455-5535"
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlockRenderer
                blocks={layout}
                globalData={globalData}
                cityContext={{
                    city_name: cityData.city_name,
                    state_code: cityData.state_code
                }}
            />
        </main>
    );
}

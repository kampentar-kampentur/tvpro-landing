import { fetchAPI, getAllCities, getGlobalConfig, getCity } from '@/lib/strapi';
import BlockRenderer from '@/components/BlockRenderer';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const cities = await getAllCities();
    return cities
        .filter(city => city.test_version)
        .map((city) => ({
            city: city.path,
            version: city.test_version,
        }));
}

export async function generateMetadata({ params }) {
    const { city: citySlug, version } = await params;

    // Fetch specifically for path + version
    const data = await fetchAPI("/cities", {
        filters: {
            path: citySlug,
            test_version: version
        },
        populate: {
            seo: { populate: "*" }
        }
    });

    const cityData = data?.data[0];
    if (!cityData) return {};

    const { seo, city_name, state_code } = cityData;
    const displayName = city_name ? `${city_name}${state_code ? `, ${state_code}` : ''}` : 'TVPro Handy Services';

    const title = `[Variant ${version}] ` + (seo?.metaTitle || `TV Mounting Services in ${displayName} | TVPro`);
    const description = seo?.metaDescription || `Expert TV mounting and home theater installation services in ${displayName}. Secure mounting on all surfaces, wire hiding, and same-day service.`;

    const ogImageUrl = seo?.shareImage?.url || 'https://tvprousa.com/og-image.png';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: ogImageUrl }],
        },
    };
}

export default async function VariantPage({ params }) {
    const { city: citySlug, version } = await params;

    const [variantData, globalData] = await Promise.all([
        getCity(citySlug, version),
        getGlobalConfig()
    ]);

    if (!variantData) {
        return notFound();
    }

    const layout = variantData.page && variantData.page.length > 0
        ? variantData.page
        : globalData.default_layout || [];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": `TVPro Handy Services - ${variantData.city_name || 'TV Mounting'}`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": variantData.city_name || "Houston",
            "addressRegion": variantData.state_code || "TX",
        }
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
                    city_name: variantData.city_name,
                    state_code: variantData.state_code
                }}
            />
        </main>
    );
}

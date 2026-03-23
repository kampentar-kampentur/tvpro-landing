import qs from "qs";

const flattenStrapiData = (data) => {
    if (!data) return null;
    if (Array.isArray(data)) {
        return data.map(item => flattenStrapiData(item));
    }
    const { id, attributes, ...rest } = data;
    return {
        id,
        ...attributes,
        ...rest
    };
};

export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${import.meta.env.PUBLIC_STRAPI_URL || 'https://strapi-dev-e587.up.railway.app'}/api${path}${queryString ? `?${queryString}` : ""}`;
    
    console.log(`[Strapi Fetch] ${requestUrl}`);

    const response = await fetch(requestUrl, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!response.ok) {
        let errorDetails = "";
        try {
            const errData = await response.json();
            errorDetails = JSON.stringify(errData, null, 2);
            console.error(`Strapi error details for ${path}:`, errorDetails);
        } catch (e) { }
        throw new Error(`Error fetching ${path}: ${response.statusText} - ${errorDetails}`);
    }
    return await response.json();
}

export async function getCityBySlug(slug) {
    const data = await fetchAPI("/cities", {
        filters: { path: slug },
        populate: {
            page: { populate: "*" },
            seo: { populate: "*" },
            cta_override: { populate: "*" }
        },
    });
    return flattenStrapiData(data?.data[0]);
}

export async function getCustomerReviews() {
    const data = await fetchAPI("/customer-review", { populate: "*" });
    return flattenStrapiData(data?.data);
}

export async function getGalleryPhotos() {
    const data = await fetchAPI("/galler-photos", { 
        populate: "*",
        pagination: { pageSize: 100 }
    });
    return flattenStrapiData(data?.data);
}

export async function getFAQ() {
    const data = await fetchAPI("/faq", { populate: "*" });
    return flattenStrapiData(data?.data);
}
export async function getMountingTypes() {
    const data = await fetchAPI("/tv-mounting-type", {
        populate: {
            mountingTypes: { populate: "*" },
            addons: { populate: "*" }
        }
    });
    return flattenStrapiData(data?.data);
}
export async function getHero() {
    const data = await fetchAPI("/hero", { populate: "*" });
    return flattenStrapiData(data?.data);
}
export async function getWorkVideos() {
    const data = await fetchAPI("/see-our-work-in-action", {
        populate: {
            videoItem: {
                populate: {
                    selfHostedVideo: {
                        populate: "*"
                    }
                }
            }
        }
    });
    return flattenStrapiData(data?.data);
}
export async function getGalleryOfWork() {
    const data = await fetchAPI("/gallery-of-work", { populate: "*" });
    return flattenStrapiData(data?.data);
}
export async function getTrustData() {
    const data = await fetchAPI("/why-customers-choose-us", {
        populate: {
            cards: { populate: "*" }
        }
    });
    return flattenStrapiData(data?.data);
}
export async function getAboutUs() {
    const data = await fetchAPI("/about-us", { populate: "*" });
    return flattenStrapiData(data?.data);
}

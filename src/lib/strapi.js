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
    const baseUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SRTAPI_URL) ||
        (import.meta.env?.PUBLIC_NEXT_PUBLIC_SRTAPI_URL) ||
        (import.meta.env?.NEXT_PUBLIC_SRTAPI_URL) ||
        'https://strapi-dev-e587.up.railway.app';

    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${baseUrl}/api${path}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(requestUrl, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`Error fetching ${path}: ${response.statusText}`);
    }
    return await response.json();
}

export async function getCity(slug, version = null) {
    const filters = { path: slug };
    if (version) {
        filters.test_version = version;
    }

    const data = await fetchAPI("/cities", {
        filters: filters,
        populate: {
            page: { populate: "*" },
            seo: { populate: "*" },
        },
    });

    // Safety: If searching for a specific version, but none found, return null
    if (version && (!data?.data || data.data.length === 0)) {
        return null;
    }

    return flattenStrapiData(data?.data[0]);
}

export async function getCityBySlug(slug) {
    return getCity(slug);
}

export async function getAllCities() {
    const data = await fetchAPI("/cities", {
        pagination: { pageSize: 100 },
    });
    return flattenStrapiData(data?.data) || [];
}

export async function getGlobalConfig() {
    // Return mock or fetch
    return {
        default_layout: [
            {
                __component: "blocks.hero",
                id: "default-hero",
                use_global: true
            }
        ]
    };
}

export async function getCTA() {
    try {
        const data = await fetchAPI("/cta");
        return data?.data || null;
    } catch (error) {
        console.error("CTA fetch failed:", error);
        return null;
    }
}

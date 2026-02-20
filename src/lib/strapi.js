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
    // ... headers logic
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${process.env.NEXT_PUBLIC_SRTAPI_URL || 'https://strapi-dev-e587.up.railway.app'}/api${path}${queryString ? `?${queryString}` : ""}`;

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
            cta_override: { populate: "*" }
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

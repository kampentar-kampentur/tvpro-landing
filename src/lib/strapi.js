import qs from "qs";

const flattenStrapiData = (data) => {
  if (!data) return null;
  if (Array.isArray(data)) {
    return data.map((item) => flattenStrapiData(item));
  }
  const { id, attributes, ...rest } = data;
  return {
    id,
    ...attributes,
    ...rest,
  };
};

export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  try {
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${process.env.NEXT_PUBLIC_SRTAPI_URL || "https://strapi-staging-bd62.up.railway.app"}/api${path}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(requestUrl, {
      headers: { "Content-Type": "application/json" },
      cache:
        process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
      signal: AbortSignal.timeout(1000000), // 10 seconds timeout to prevent hanging the build
      ...options,
    });

    if (!response.ok) {
      let errorDetails = "";
      try {
        const errData = await response.json();
        errorDetails = JSON.stringify(errData, null, 2);
        console.error(`Strapi error details for ${path}:`, errorDetails);
      } catch (e) {}
      throw new Error(
        `Error fetching ${path}: ${response.statusText} - ${errorDetails}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.warn(
      `[Strapi] fetchAPI failed for ${path}:`,
      error.message || error,
    );
    throw error;
  }
}
const componentPopulateRules = {
  "blocks.hero": { populate: ["video", "badges"] },
  "blocks.tv-mounting-types": { populate: ["mountingTypes", "mountingTypes.image", "addons"] },
  "blocks.why-customers-choose-us": { populate: ["cards", "cards.image"] },
  "blocks.our-services": { populate: ["services", "services.image"] },
  "blocks.tv-sizes": { populate: ["tvsizes", "tvsizes.image"] },
  "blocks.gallery-of-work": { populate: ["types"] },
  "blocks.faq": { populate: ["faqs"] },
  "blocks.see-our-work-in-action": {
    populate: [
      "videoItem",
      "videoItem.selfHostedVideo",
      "videoItem.selfHostedVideo.thumbnail",
    ]
  },
  "blocks.certificate": { populate: ["certificates"] },
};

const simpleComponents = [
  "blocks.our-team",
  "blocks.customer-reviews",
  "blocks.about-us",
  "blocks.contact-us",
  "blocks.areas-we-serve",
  "blocks.careers-cta",
  "blocks.utp-bar",
  "blocks.tv-count-picker",
  "blocks.brief-services",
];

const pagePopulateObject = {};
[...Object.keys(componentPopulateRules), ...simpleComponents].forEach((comp) => {
  pagePopulateObject[comp] = componentPopulateRules[comp] || { populate: "*" };
});

export async function getCity(slug, version = null) {
  const filters = { path: slug };
  if (version) {
    filters.test_version = version;
  }

  const data = await fetchAPI("/cities", {
    filters: filters,
    populate: {
      page: {
        on: pagePopulateObject
      },
      seo: { populate: "*" },
      cta_override: { populate: "*" },
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
  let allCities = [];
  let page = 1;
  let pageCount = 1;

  try {
    do {
      const data = await fetchAPI("/cities", {
        pagination: { page, pageSize: 100 },
      });
      const cities = flattenStrapiData(data?.data) || [];
      allCities = [...allCities, ...cities];
      pageCount = data?.meta?.pagination?.pageCount || 1;
      page++;
    } while (page <= pageCount);
  } catch (error) {
    console.error("[Strapi] getAllCities error:", error);
  }

  return allCities;
}

/**
 * Fetches the page layout from a metro city.
 * Used when a suburb has no own page layout.
 * @param {string} metroSlug - slug of the parent metro city (e.g. "houston")
 * @returns {Array} - array of page blocks
 */
export async function getMetroCityLayout(metroSlug) {
  if (!metroSlug) return null;

  try {
    const data = await fetchAPI("/cities", {
      filters: { path: metroSlug },
      populate: {
        page: { populate: "*" },
      },
    });

    const metroCity = flattenStrapiData(data?.data[0]);
    return metroCity?.page || null;
  } catch (error) {
    console.error(
      `[Strapi] Failed to fetch metro city layout for "${metroSlug}":`,
      error,
    );
    return null;
  }
}

export async function getGlobalConfig() {
  try {
    const [ourTeamRes, careersCTARes] = await Promise.all([
      fetchAPI("/our-team", { populate: "*" }),
      fetchAPI("/careers-cta", { populate: "*" }),
    ]);

    return {
      "our-team": flattenStrapiData(ourTeamRes?.data),
      "careers-cta": flattenStrapiData(careersCTARes?.data),
      default_layout: [
        {
          __component: "blocks.hero",
          id: "default-hero",
          use_global: true,
        },
      ],
    };
  } catch (error) {
    console.error("[Strapi] getGlobalConfig failed:", error);
    return { default_layout: [] };
  }
}

export async function getAllBlogPosts() {
  try {
    const data = await fetchAPI("/blog-posts", {
      pagination: { pageSize: 200 },
      fields: [
        "title",
        "slug",
        "excerpt",
        "category",
        "readTime",
        "publishedAt",
        "featured",
      ],
      populate: ["cover", "author", "author.avatar"],
      sort: ["publishedAt:desc"],
    });
    return flattenStrapiData(data?.data) || [];
  } catch (error) {
    console.error("[Strapi] getAllBlogPosts failed:", error.message);
    return [];
  }
}

export async function getBlogPost(slug) {
  try {
    const data = await fetchAPI("/blog-posts", {
      filters: { slug: { $eq: slug } },
      populate: ["cover", "author", "author.avatar"],
    });
    if (!data?.data || data.data.length === 0) return null;
    return flattenStrapiData(data.data[0]);
  } catch (error) {
    console.error(`[Strapi] getBlogPost("${slug}") failed:`, error.message);
    return null;
  }
}

export function getStrapiMediaUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const base = process.env.NEXT_PUBLIC_SRTAPI_URL || "";
  return `${base}${url}`;
}

export async function getAllTechnicians() {
  try {
    const data = await fetchAPI("/technicians", {
      pagination: { pageSize: 200 },
      populate: ["photo"],
    });
    return flattenStrapiData(data?.data) || [];
  } catch (error) {
    console.error("[Strapi] getAllTechnicians failed:", error.message);
    return [];
  }
}

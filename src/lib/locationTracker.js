/**
 * Helper to extract location and page context for lead submissions.
 */
export function getLeadLocation(cta = null) {
  if (typeof window === "undefined") {
    return {
      page: "/",
      city: "",
      state: "",
      lat: null,
      lng: null,
    };
  }

  const path = window.location.pathname || "/";
  const pathParts = path.split("/").filter(Boolean);
  const params = new URLSearchParams(window.location.search);

  const queryCity = params.get("city") || "";
  const queryFrom = params.get("from") || "";
  const geo = window.__GEO_CITY__ || {};

  // Check if current path is a dedicated utility page vs. city landing page
  const UTILITY_PAGES = new Set([
    "book-now",
    "estimate",
    "quiz",
    "b",
    "blog",
    "see-you-soon",
    "privacy-policy",
    "terms",
    "careers",
    "index",
  ]);

  let cityFromPath = "";
  if (pathParts.length > 0 && !UTILITY_PAGES.has(pathParts[0].toLowerCase())) {
    cityFromPath = pathParts[0];
  }

  // City priority:
  // 1. Explicit query parameter ?city=
  // 2. Query parameter ?from=
  // 3. City landing page path segment (e.g. /san-antonio/)
  // 4. Cloudflare Geo-IP city
  // 5. CTA context city
  const resolvedCity =
    queryCity ||
    queryFrom ||
    cityFromPath ||
    geo.city ||
    cta?.cityName ||
    cta?.citySlug ||
    "";

  // State priority:
  // 1. Cloudflare Geo-IP state
  // 2. CTA state code
  const resolvedState =
    geo.state ||
    cta?.state_code ||
    cta?.stateCode ||
    cta?.state ||
    "";

  return {
    page: path,
    city: resolvedCity,
    state: resolvedState,
    lat: geo.lat || null,
    lng: geo.lng || null,
    postalCode: geo.postalCode || null,
  };
}

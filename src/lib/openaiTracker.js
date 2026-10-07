/**
 * Helper to track events with OpenAI Measurement Pixel (oaiq)
 * Follows strict OpenAI Ads Measurement SDK (oaiq.js) schema.
 */
export function trackOpenAIConversion(eventName, { userData = {}, customData = {} } = {}) {
  if (typeof window === "undefined" || typeof window.oaiq !== "function") return;

  try {
    // 1. Advanced Matching (User Data) via oaiq("init", { user: ... })
    const userPayload = {};

    if (userData.email) {
      const email = String(userData.email).trim().toLowerCase();
      if (email) userPayload.email_sha256 = email;
    }

    if (userData.phone) {
      const phone = String(userData.phone).trim();
      if (phone) userPayload.phone_number_sha256 = phone;
    }

    if (userData.name) {
      const nameParts = String(userData.name).trim().split(/\s+/).filter(Boolean);
      const firstName = userData.firstName || nameParts[0] || "";
      const lastName = userData.lastName || nameParts.slice(1).join(" ") || "";
      if (firstName) userPayload.first_name_sha256 = firstName;
      if (lastName) userPayload.last_name_sha256 = lastName;
    } else {
      if (userData.firstName) userPayload.first_name_sha256 = String(userData.firstName).trim();
      if (userData.lastName) userPayload.last_name_sha256 = String(userData.lastName).trim();
    }

    if (userData.zip || userData.postal_code) {
      userPayload.postal_code = String(userData.zip || userData.postal_code).trim();
    }
    if (userData.city) {
      userPayload.city = String(userData.city).trim();
    }
    if (userData.state || userData.region) {
      userPayload.region = String(userData.state || userData.region).trim();
    }
    if (userData.country) {
      userPayload.country = String(userData.country).trim();
    }

    // Register user data with oaiq if present
    if (Object.keys(userPayload).length > 0) {
      window.oaiq("init", { user: userPayload });
    }

    // 2. Standard lead_created conversion event for OpenAI Ads Manager
    // In oaiq SDK, lead_created uses schema 'customer_action' which accepts only:
    // { type: "customer_action", amount?: integer (in cents), currency?: string }
    const leadProps = {
      type: "customer_action",
    };

    if (customData && customData.total_price && Number(customData.total_price) > 0) {
      leadProps.amount = Math.round(Number(customData.total_price) * 100);
      leadProps.currency = "USD";
    }

    window.oaiq("measure", "lead_created", leadProps);

    // 3. Custom named event
    // In oaiq SDK, custom events must use eventName: "custom", schema 'custom',
    // and custom_event_name passed inside eventOptions (3rd argument).
    if (eventName && eventName !== "lead_created") {
      const normalizedEventName = String(eventName)
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "_")
        .slice(0, 64);

      const customProps = {
        type: "custom",
      };

      if (customData && customData.total_price && Number(customData.total_price) > 0) {
        customProps.amount = Math.round(Number(customData.total_price) * 100);
        customProps.currency = "USD";
      }

      window.oaiq("measure", "custom", customProps, {
        custom_event_name: normalizedEventName,
      });
    }
  } catch (err) {
    console.warn("[OpenAI Pixel] Measurement error:", err);
  }
}


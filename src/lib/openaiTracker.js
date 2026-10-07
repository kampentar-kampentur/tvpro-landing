/**
 * Helper to track events with OpenAI Measurement Pixel (oaiq)
 * Supports custom event names, user data (Advanced Matching), and custom properties (quiz/form options)
 */
export function trackOpenAIConversion(eventName, { userData = {}, customData = {} } = {}) {
  if (typeof window === "undefined" || typeof window.oaiq !== "function") return;

  const phone = (userData.phone || "").replace(/\D/g, "");
  const email = (userData.email || "").trim().toLowerCase();
  const name = (userData.name || "").trim();

  const userPayload = {};
  if (phone) userPayload.phone = phone;
  if (email) userPayload.email = email;
  if (name) userPayload.name = name;
  if (userData.zip) userPayload.postal_code = userData.zip;
  if (userData.city) userPayload.city = userData.city;
  if (userData.address) userPayload.address = userData.address;

  const eventPayload = {
    type: "customer_action",
    ...customData,
    ...(Object.keys(userPayload).length > 0 ? { user_data: userPayload } : {}),
  };

  try {
    // 1. Standard lead_created conversion event for OpenAI Ads Manager
    window.oaiq("measure", "lead_created", eventPayload);

    // 2. Custom named event with full payload and user data
    if (eventName && eventName !== "lead_created") {
      window.oaiq("measure", "custom", { type: "custom" }, {
        custom_event_name: eventName,
        ...eventPayload,
      });
      window.oaiq("measure", eventName, eventPayload);
    }
  } catch (err) {
    console.warn("[OpenAI Pixel] Measurement error:", err);
  }
}

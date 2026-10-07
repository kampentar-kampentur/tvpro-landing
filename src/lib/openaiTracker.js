/**
 * Helper to track events with OpenAI Measurement Pixel (oaiq)
 */
export function trackOpenAIConversion(eventName, { customData = {} } = {}) {
  if (typeof window === "undefined" || typeof window.oaiq !== "function") return;

  try {
    const leadProps = {
      type: "customer_action",
    };

    if (customData && customData.total_price && Number(customData.total_price) > 0) {
      leadProps.amount = Math.round(Number(customData.total_price) * 100);
      leadProps.currency = "USD";
    }

    window.oaiq("measure", "lead_created", leadProps);
  } catch (err) {
    console.warn("[OpenAI Pixel] Measurement error:", err);
  }
}



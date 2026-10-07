/**
 * Helper to track events with OpenAI Measurement Pixel (oaiq)
 */
export function trackOpenAIConversion() {
  if (typeof window === "undefined" || typeof window.oaiq !== "function") return;

  try {
    window.oaiq("measure", "lead_created", { type: "customer_action" });
  } catch (err) {
    console.warn("[OpenAI Pixel] Measurement error:", err);
  }
}




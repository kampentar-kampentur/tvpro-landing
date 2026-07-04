import { getUtmParams } from "@/lib/utmTracker";

class QuizTracker {
  constructor() {
    this.sessionId = null;
    this.startTime = null;
    this.device = "desktop";
    this.url = "";
    this.utm = {};
  }

  init() {
    if (typeof window === "undefined") return;

    this.sessionId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.startTime = Date.now();
    this.device = window.innerWidth <= 1024 ? "mobile" : "desktop";
    this.url = window.location.pathname + window.location.search;
    this.utm = getUtmParams();

    if (process.env.NODE_ENV === "development") {
      console.log(`[QuizTracker] Initialized session: ${this.sessionId}`);
    }
  }

  async sendEvent(eventType, { stepId = null, stepIndex = null, fieldName = null, fieldValue = null, errorType = null, additionalData = {} } = {}) {
    if (typeof window === "undefined" || !this.sessionId) return;

    const secondsSinceStart = this.startTime ? parseFloat(((Date.now() - this.startTime) / 1000).toFixed(1)) : 0;
    
    let formattedValue = fieldValue;
    if (fieldValue && typeof fieldValue === "object") {
      formattedValue = JSON.stringify(fieldValue);
    }

    const payload = {
      data: {
        sessionId: this.sessionId,
        eventType,
        stepId,
        stepIndex: stepIndex !== null ? parseInt(stepIndex, 10) : null,
        fieldName,
        fieldValue: formattedValue !== null ? String(formattedValue) : null,
        errorType,
        device: this.device,
        url: this.url,
        utmSource: this.utm.utm_source || null,
        utmMedium: this.utm.utm_medium || null,
        utmCampaign: this.utm.utm_campaign || null,
        utmTerm: this.utm.utm_term || null,
        utmContent: this.utm.utm_content || null,
        additionalData: {
          secondsSinceStart,
          ...additionalData
        }
      }
    };

    if (process.env.NODE_ENV === "development") {
      console.log(`%c[QuizTracker] Event: ${eventType}`, "color: #00bcd4; font-weight: bold;", payload.data);
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_SRTAPI_URL || "http://localhost:1337";
      await fetch(`${apiUrl}/api/quiz-analytics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        keepalive: true
      });
    } catch (err) {
      console.warn("[QuizTracker] Failed to send analytics event:", err);
    }
  }
}

const quizTracker = new QuizTracker();
export default quizTracker;

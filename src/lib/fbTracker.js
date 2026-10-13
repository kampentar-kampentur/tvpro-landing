/**
 * Helper to track Meta Pixel (Facebook) events
 */
export function trackMetaLead(customData = {}) {
  if (typeof window === "undefined") return;

  try {
    const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "809936758465245";

    // Ensure fbq stub exists if not yet initialized
    if (typeof window.fbq !== "function") {
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js"
      );
      window.fbq("init", pixelId);
    }

    const payload = {
      content_name: customData.content_name || "TV Mounting Lead",
      currency: "USD",
      ...customData,
    };

    window.fbq("track", "Lead", payload);

    // Also push to dataLayer for any GTM Meta Pixel tags
    if (typeof window.dataLayer !== "undefined") {
      window.dataLayer.push({
        event: "fb_lead",
        ...payload,
      });
    }
  } catch (err) {
    console.warn("[Meta Pixel] Track Lead error:", err);
  }
}

export function trackMetaPageView() {
  if (typeof window === "undefined") return;

  try {
    const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "809936758465245";

    if (typeof window.fbq !== "function") {
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js"
      );
      window.fbq("init", pixelId);
    }

    window.fbq("track", "PageView");
  } catch (err) {
    console.warn("[Meta Pixel] Track PageView error:", err);
  }
}

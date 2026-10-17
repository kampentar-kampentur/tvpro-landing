/**
 * Standalone Vanilla JS Visitor & Attribution Tracker for TVPro
 * Injected directly into HTML <head> so it initializes at 0ms before React hydration.
 */

export function getVisitorTrackerScript(strapiUrl) {
  const defaultApiUrl =
    strapiUrl ||
    process.env.NEXT_PUBLIC_SRTAPI_URL ||
    "https://strapi-production-20d6.up.railway.app";

  return `
(function(window, document) {
  "use strict";
  if (window.TVPTracker) return;

  var API_BASE = ${JSON.stringify(defaultApiUrl)}.replace(/\\/+$/, "");
  var SYNC_ENDPOINT = API_BASE + "/api/visitor/sync";
  var VID_KEY = "tvp_vid";
  var SID_KEY = "tvp_sid";
  var UTM_STORAGE_KEY = "tvp_utm_params";

  // 1. Bot & Crawler Guard — do not initialize or pollute Strapi DB for bots
  var ua = (window.navigator && window.navigator.userAgent) || "";
  var isBot =
    /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|ahrefsbot|semrushbot|dotbot|mj12bot|rogerbot|exabot|facebot|facebookexternalhit|ia_archiver|lighthouse|chrome-lighthouse|speedinsights|headlesschrome|phantomjs|prerender|applebot|petalbot|bytespider|gptbot|claudebot|ccbot|twitterbot|linkedinbot|telegrambot|discordbot|whatsapp|uptimerobot|pingdom/i.test(ua) ||
    Boolean(window.navigator && window.navigator.webdriver);

  // Storage & Cookie helpers
  function getCookie(name) {
    try {
      var raw = document.cookie || "";
      if (!raw) return null;
      var parts = raw.split(";");
      for (var i = 0; i < parts.length; i++) {
        var pair = parts[i].trim();
        var eqIdx = pair.indexOf("=");
        if (eqIdx > 0) {
          var k = pair.slice(0, eqIdx).trim();
          if (k === name) {
            return decodeURIComponent(pair.slice(eqIdx + 1));
          }
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function setCookie(name, value, maxAgeSeconds) {
    try {
      document.cookie =
        name + "=" + encodeURIComponent(value) +
        "; max-age=" + (maxAgeSeconds || 31536000) +
        "; path=/; SameSite=Lax";
    } catch (e) {}
  }

  function safeGetStorage(storage, key) {
    try {
      return storage ? storage.getItem(key) : null;
    } catch (e) {
      return null;
    }
  }

  function safeSetStorage(storage, key, val) {
    try {
      if (storage) storage.setItem(key, val);
    } catch (e) {}
  }

  function randomHex(len) {
    var chars = "0123456789abcdef";
    var out = "";
    for (var i = 0; i < len; i++) {
      out += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return out;
  }

  function getYYMMDD(date) {
    var yy = String(date.getFullYear()).slice(-2);
    var mm = String(date.getMonth() + 1).padStart(2, "0");
    var dd = String(date.getDate()).padStart(2, "0");
    return yy + mm + dd;
  }

  // Extract query parameters from current URL
  function parseQueryParams() {
    var out = {};
    try {
      var sp = new URLSearchParams(window.location.search || "");
      sp.forEach(function(val, key) {
        if (val !== "") out[key] = val;
      });
    } catch (e) {}
    return out;
  }

  // Detect external referrer (ignore same-domain referrers)
  function getExternalReferrer() {
    try {
      var ref = document.referrer || "";
      if (!ref) return "";
      var refHost = new URL(ref).hostname.replace(/^www\\./, "");
      var curHost = window.location.hostname.replace(/^www\\./, "");
      return refHost && refHost !== curHost ? ref : "";
    } catch (e) {
      return "";
    }
  }

  // Detect In-App Browsers from User-Agent (Instagram, Facebook, TikTok, etc.)
  function detectInAppAndBrowser() {
    var inAppName = null;
    if (/Instagram/i.test(ua)) inAppName = "Instagram In-App";
    else if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) inAppName = "Facebook In-App";
    else if (/TikTok|musical_ly|BytedanceWebview/i.test(ua)) inAppName = "TikTok In-App";
    else if (/LinkedInApp/i.test(ua)) inAppName = "LinkedIn In-App";
    else if (/Snap/i.test(ua)) inAppName = "Snapchat In-App";
    else if (/GSA\\//i.test(ua)) inAppName = "Google App In-App";

    var browserApp = inAppName || "Browser";
    if (!inAppName) {
      if (/CriOS/i.test(ua)) browserApp = "Chrome iOS";
      else if (/EdgiOS|EdgA|Edg\\//i.test(ua)) browserApp = "Edge";
      else if (/Chrome\\//i.test(ua)) browserApp = /Mobile|Android/i.test(ua) ? "Chrome Mobile" : "Chrome Desktop";
      else if (/Safari\\//i.test(ua)) browserApp = /iPhone|iPad|iPod/i.test(ua) ? "Safari iOS" : "Safari macOS";
      else if (/Firefox\\//i.test(ua)) browserApp = "Firefox";
    }

    return {
      isInAppBrowser: Boolean(inAppName),
      inAppName: inAppName,
      browserApp: browserApp
    };
  }

  // Determine source (short code for visitorId and full name for Strapi)
  function resolveVisitSource(params, extRef, browserInfo) {
    var utmSource = (params.utm_source || "").toLowerCase().trim();
    var oaiSource = params.openAIsource || params.openaisource || params.openai_source || "";

    if (params.fbclid || utmSource === "fb" || utmSource === "facebook" || utmSource === "meta") {
      return { code: "fb", name: "facebook" };
    }
    if (utmSource === "ig" || utmSource === "instagram") {
      return { code: "ig", name: "instagram" };
    }
    if (params.gclid || params.gbraid || params.wbraid || utmSource === "google" || utmSource === "adwords" || utmSource === "ppc") {
      return { code: "ggl", name: "google" };
    }
    if (params.msclkid || utmSource === "bing") {
      return { code: "bing", name: "bing" };
    }
    if (oaiSource || utmSource === "openai" || utmSource === "chatgpt") {
      return { code: "oai", name: "openai" };
    }
    if (utmSource) {
      var cleanCode = utmSource.replace(/[^a-z0-9]/g, "").slice(0, 4) || "utm";
      return { code: cleanCode, name: utmSource };
    }

    // Fallback to In-App Browser signature if no explicit UTM/ClickID
    if (browserInfo && browserInfo.inAppName === "Instagram In-App") {
      return { code: "ig", name: "instagram" };
    }
    if (browserInfo && browserInfo.inAppName === "Facebook In-App") {
      return { code: "fb", name: "facebook" };
    }
    if (browserInfo && browserInfo.inAppName === "TikTok In-App") {
      return { code: "ttok", name: "tiktok" };
    }

    // Fallback to External Referrer
    if (extRef) {
      var r = extRef.toLowerCase();
      if (r.indexOf("facebook.com") !== -1 || r.indexOf("fb.com") !== -1) return { code: "fb", name: "facebook" };
      if (r.indexOf("instagram.com") !== -1) return { code: "ig", name: "instagram" };
      if (r.indexOf("chatgpt.com") !== -1 || r.indexOf("openai.com") !== -1) return { code: "oai", name: "openai" };
      if (r.indexOf("google.") !== -1) return { code: "org", name: "google_organic" };
      if (r.indexOf("bing.com") !== -1) return { code: "org", name: "bing_organic" };
      if (r.indexOf("yahoo.com") !== -1 || r.indexOf("duckduckgo.com") !== -1) return { code: "org", name: "organic" };
      if (r.indexOf("yelp.com") !== -1) return { code: "yelp", name: "yelp" };
      return { code: "ref", name: "referral" };
    }

    return { code: "dir", name: "direct" };
  }

  // Read or generate Visitor ID: tvp_<YYMMDD>_<firstSourceCode>_<random8>.<timestamp>
  function getOrCreateVisitorId(sourceCode) {
    var existing =
      safeGetStorage(window.localStorage, VID_KEY) ||
      safeGetStorage(window.sessionStorage, VID_KEY) ||
      getCookie(VID_KEY);

    if (existing && existing.indexOf("tvp_") === 0) {
      // Ensure it has .timestamp at the end
      if (existing.indexOf(".") === -1) {
        existing = existing + "." + Date.now();
      }
      safeSetStorage(window.localStorage, VID_KEY, existing);
      safeSetStorage(window.sessionStorage, VID_KEY, existing);
      setCookie(VID_KEY, existing, 31536000);
      return existing;
    }

    var now = new Date();
    var vid =
      "tvp_" +
      getYYMMDD(now) +
      "_" +
      (sourceCode || "dir") +
      "_" +
      randomHex(8) +
      "." +
      now.getTime();

    safeSetStorage(window.localStorage, VID_KEY, vid);
    safeSetStorage(window.sessionStorage, VID_KEY, vid);
    setCookie(VID_KEY, vid, 31536000);
    return vid;
  }

  function getOrCreateSessionId() {
    var sid = safeGetStorage(window.sessionStorage, SID_KEY);
    var isNewSession = false;
    if (!sid) {
      sid = "sess_" + Date.now() + "_" + randomHex(6);
      safeSetStorage(window.sessionStorage, SID_KEY, sid);
      isNewSession = true;
    }
    return { sessionId: sid, isNewSession: isNewSession };
  }

  // Extract 3rd-party analytics cookies (_fbp, _fbc, _ga, _gcl_au, Microsoft Clarity _clck)
  function collectAnalyticsCookies() {
    var clck = getCookie("_clck") || "";
    var clarityId = clck ? clck.split("|")[0] : null;
    return {
      _fbp: getCookie("_fbp") || null,
      _fbc: getCookie("_fbc") || null,
      _ga: getCookie("_ga") || null,
      _gcl_au: getCookie("_gcl_au") || null,
      clarityId: clarityId || null
    };
  }

  // Collect detailed device/browser/network snapshot
  function collectDeviceSnapshot(browserInfo) {
    var nav = window.navigator || {};
    var scr = window.screen || {};
    var conn = nav.connection || nav.mozConnection || nav.webkitConnection || {};
    var tz = "";
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    } catch (e) {}

    return {
      userAgent: ua,
      browserApp: browserInfo.browserApp,
      isInAppBrowser: browserInfo.isInAppBrowser,
      inAppName: browserInfo.inAppName,
      platform: nav.platform || "",
      language: nav.language || "",
      languages: Array.isArray(nav.languages) ? nav.languages.slice(0, 5) : [],
      timezone: tz,
      screen: (scr.width || 0) + "x" + (scr.height || 0),
      viewport: (window.innerWidth || 0) + "x" + (window.innerHeight || 0),
      pixelRatio: window.devicePixelRatio || 1,
      hardwareConcurrency: nav.hardwareConcurrency || null,
      deviceMemory: nav.deviceMemory || null,
      maxTouchPoints: nav.maxTouchPoints || 0,
      connectionType: conn.effectiveType || null,
      webdriver: Boolean(nav.webdriver)
    };
  }

  // Persist last-contact params + visitorId in localStorage/sessionStorage for React forms
  function updateStoredFormParams(visitorId, queryParams, extRef, cookies, sourceName) {
    var existing = {};
    try {
      var rawLocal = safeGetStorage(window.localStorage, UTM_STORAGE_KEY);
      var rawSession = safeGetStorage(window.sessionStorage, UTM_STORAGE_KEY);
      existing = Object.assign(
        {},
        rawLocal ? JSON.parse(rawLocal) : {},
        rawSession ? JSON.parse(rawSession) : {}
      );
    } catch (e) {
      existing = {};
    }

    var hasAdParams = Boolean(
      queryParams.utm_source ||
      queryParams.utm_medium ||
      queryParams.utm_campaign ||
      queryParams.fbclid ||
      queryParams.gclid ||
      queryParams.gbraid ||
      queryParams.wbraid ||
      queryParams.msclkid ||
      queryParams.openAIsource ||
      queryParams.openaisource ||
      queryParams.openai_source
    );

    var merged = Object.assign({}, existing, queryParams);
    merged.visitorId = visitorId;

    if (!merged.landing_url || hasAdParams) {
      merged.landing_url = window.location.href;
      merged.landing_path = window.location.pathname;
    }
    if (extRef) {
      merged.referrer = extRef;
    }
    if (sourceName && sourceName !== "direct") {
      merged.last_source = sourceName;
    }

    if (cookies._ga) merged._ga = cookies._ga;
    if (cookies._gcl_au) merged._gcl_au = cookies._gcl_au;
    if (cookies._fbp) merged._fbp = cookies._fbp;
    if (cookies._fbc) merged._fbc = cookies._fbc;
    if (cookies.clarityId) merged.clarityId = cookies.clarityId;

    var serialized = JSON.stringify(merged);
    safeSetStorage(window.localStorage, UTM_STORAGE_KEY, serialized);
    safeSetStorage(window.sessionStorage, UTM_STORAGE_KEY, serialized);
    return merged;
  }

  // Send non-blocking beacon/fetch to Strapi /api/visitor/sync
  function sendToStrapi(payload) {
    if (isBot) return;
    try {
      var bodyStr = JSON.stringify(payload);
      if (window.navigator && typeof window.navigator.sendBeacon === "function") {
        var sent = window.navigator.sendBeacon(SYNC_ENDPOINT, bodyStr);
        if (sent) return;
      }
      if (typeof window.fetch === "function") {
        window.fetch(SYNC_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body: bodyStr,
          keepalive: true
        }).catch(function() {});
      }
    } catch (e) {}
  }

  // Initialize visitor state immediately
  var initialQueryParams = parseQueryParams();
  var initialExtRef = getExternalReferrer();
  var browserInfo = detectInAppAndBrowser();
  var initialSource = resolveVisitSource(initialQueryParams, initialExtRef, browserInfo);
  var visitorId = getOrCreateVisitorId(initialSource.code);
  var sessionObj = getOrCreateSessionId();
  var initialCookies = collectAnalyticsCookies();
  var storedParams = updateStoredFormParams(
    visitorId,
    initialQueryParams,
    initialExtRef,
    initialCookies,
    initialSource.name
  );

  // Determine whether this page load represents a new touchpoint
  var hasQueryKeys = Object.keys(initialQueryParams).length > 0;
  var touchpointPayload = null;
  if (sessionObj.isNewSession || hasQueryKeys || initialExtRef) {
    touchpointPayload = {
      sessionId: sessionObj.sessionId,
      timestamp: new Date().toISOString(),
      source: initialSource.name,
      url: window.location.href,
      path: window.location.pathname,
      referrer: initialExtRef,
      params: initialQueryParams
    };
  }

  // Send initial page visit sync immediately (at <head> parse time)
  sendToStrapi({
    visitorId: visitorId,
    sessionId: sessionObj.sessionId,
    url: window.location.href,
    path: window.location.pathname,
    referrer: initialExtRef,
    source: initialSource.name,
    queryParams: initialQueryParams,
    cookies: initialCookies,
    device: collectDeviceSnapshot(browserInfo),
    touchpoint: touchpointPayload,
    events: [
      {
        type: sessionObj.isNewSession ? "visit_start" : "page_view",
        page: window.location.pathname,
        source: initialSource.name,
        timestamp: new Date().toISOString()
      }
    ]
  });

  // Re-check 3rd party cookies (_fbp, _fbc, _ga, _clck) after 2.5s once GTM/Clarity/Meta scripts finish init
  setTimeout(function() {
    var laterCookies = collectAnalyticsCookies();
    var hasNewCookie =
      (laterCookies._fbp && !initialCookies._fbp) ||
      (laterCookies._fbc && !initialCookies._fbc) ||
      (laterCookies._ga && !initialCookies._ga) ||
      (laterCookies.clarityId && !initialCookies.clarityId);

    if (hasNewCookie) {
      updateStoredFormParams(visitorId, {}, "", laterCookies, null);
      sendToStrapi({
        visitorId: visitorId,
        sessionId: sessionObj.sessionId,
        path: window.location.pathname,
        cookies: laterCookies
      });
    }
  }, 2500);

  // Track deduplicated form field interactions per session so we don't spam on every keystroke
  var trackedFieldInteractions = {};

  // Helper to identify which specific form an element belongs to
  function resolveFormNameFromElement(el) {
    if (!el) return "unknown_form";
    var formEl = el.closest ? el.closest("[data-form-name], form") : null;
    if (formEl) {
      var explicitName = formEl.getAttribute("data-form-name");
      if (explicitName) return explicitName;
    }
    var modalEl = el.closest ? el.closest("[data-modal-name]") : null;
    if (modalEl) {
      return modalEl.getAttribute("data-modal-name");
    }
    var p = (window.location.pathname || "").toLowerCase();
    if (p.indexOf("/estimate") === 0) return "estimate_page_form";
    if (p.indexOf("/book-now") === 0) return "book_now_page_form";
    if (p.indexOf("/quiz") === 0) return "quiz_calculator_form";
    return "page_form";
  }

  // Public API exposed on window.TVPTracker
  window.TVPTracker = {
    getVisitorId: function() {
      return visitorId;
    },
    getSessionId: function() {
      return sessionObj.sessionId;
    },
    getParams: function() {
      try {
        var raw =
          safeGetStorage(window.localStorage, UTM_STORAGE_KEY) ||
          safeGetStorage(window.sessionStorage, UTM_STORAGE_KEY);
        var parsed = raw ? JSON.parse(raw) : {};
        parsed.visitorId = visitorId;
        var freshCookies = collectAnalyticsCookies();
        if (freshCookies._ga && !parsed._ga) parsed._ga = freshCookies._ga;
        if (freshCookies._gcl_au && !parsed._gcl_au) parsed._gcl_au = freshCookies._gcl_au;
        if (freshCookies._fbp && !parsed._fbp) parsed._fbp = freshCookies._fbp;
        if (freshCookies._fbc && !parsed._fbc) parsed._fbc = freshCookies._fbc;
        if (freshCookies.clarityId && !parsed.clarityId) parsed.clarityId = freshCookies.clarityId;
        return parsed;
      } catch (e) {
        return { visitorId: visitorId };
      }
    },
    trackEvent: function(eventObj) {
      if (!eventObj || typeof eventObj !== "object") return;
      sendToStrapi({
        visitorId: visitorId,
        sessionId: sessionObj.sessionId,
        path: window.location.pathname,
        events: [
          Object.assign(
            {
              page: window.location.pathname,
              timestamp: new Date().toISOString()
            },
            eventObj
          )
        ]
      });
    },
    trackFormInteract: function(formName, action, details) {
      var extra = details && typeof details === "object" ? details : {};
      var dedupeKey = formName + ":" + action + ":" + (extra.field || extra.step || "");
      if (action === "field_interact" || action === "modal_open") {
        if (trackedFieldInteractions[dedupeKey]) return;
        trackedFieldInteractions[dedupeKey] = true;
      }
      window.TVPTracker.trackEvent(
        Object.assign(
          {
            type: "form_interact",
            formName: formName || "unknown_form",
            action: action || "interact"
          },
          extra
        )
      );
    }
  };

  // Automatic DOM Event Delegation for:
  // 1) Phone clicks (<a href="tel:...">)
  // 2) Form field interactions (focus/input on inputs inside forms)
  // 3) Form submit attempts (submit event on forms)
  document.addEventListener(
    "click",
    function(e) {
      try {
        var target = e.target;
        if (!target || !target.closest) return;

        // Check phone link click
        var telLink = target.closest('a[href^="tel:"]');
        if (telLink) {
          var href = telLink.getAttribute("href") || "";
          var label = (telLink.textContent || "").trim().slice(0, 40);
          window.TVPTracker.trackEvent({
            type: "phone_click",
            phone: href.replace(/^tel:/i, ""),
            label: label
          });
        }
      } catch (err) {}
    },
    true
  );

  document.addEventListener(
    "focusin",
    function(e) {
      try {
        var el = e.target;
        if (!el || !el.tagName) return;
        var tag = el.tagName.toUpperCase();
        if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") return;
        var fieldName =
          el.getAttribute("name") ||
          el.getAttribute("id") ||
          el.getAttribute("placeholder") ||
          el.getAttribute("type") ||
          "input";
        var formName = resolveFormNameFromElement(el);
        window.TVPTracker.trackFormInteract(formName, "field_interact", {
          field: fieldName.slice(0, 40)
        });
      } catch (err) {}
    },
    true
  );

  document.addEventListener(
    "submit",
    function(e) {
      try {
        var formEl = e.target;
        var formName = resolveFormNameFromElement(formEl);
        window.TVPTracker.trackFormInteract(formName, "submit_click", {});
      } catch (err) {}
    },
    true
  );

  // Automatic SPA Route Change Listener (pushState / popstate)
  var lastTrackedPath = window.location.pathname + window.location.search;
  function handleUrlChange() {
    try {
      var curPathSearch = window.location.pathname + window.location.search;
      if (curPathSearch === lastTrackedPath) return;
      lastTrackedPath = curPathSearch;

      var newParams = parseQueryParams();
      var freshCookies = collectAnalyticsCookies();
      var newSource = resolveVisitSource(newParams, "", browserInfo);
      updateStoredFormParams(
        visitorId,
        newParams,
        "",
        freshCookies,
        Object.keys(newParams).length > 0 ? newSource.name : null
      );

      var newTouchpoint = null;
      if (Object.keys(newParams).length > 0) {
        newTouchpoint = {
          sessionId: sessionObj.sessionId,
          timestamp: new Date().toISOString(),
          source: newSource.name,
          url: window.location.href,
          path: window.location.pathname,
          referrer: "",
          params: newParams
        };
      }

      sendToStrapi({
        visitorId: visitorId,
        sessionId: sessionObj.sessionId,
        url: window.location.href,
        path: window.location.pathname,
        queryParams: newParams,
        cookies: freshCookies,
        touchpoint: newTouchpoint,
        events: [
          {
            type: "page_view",
            page: window.location.pathname,
            timestamp: new Date().toISOString()
          }
        ]
      });
    } catch (err) {}
  }

  var origPushState = window.history && window.history.pushState;
  if (typeof origPushState === "function") {
    window.history.pushState = function() {
      var ret = origPushState.apply(this, arguments);
      setTimeout(handleUrlChange, 0);
      return ret;
    };
  }
  window.addEventListener("popstate", function() {
    setTimeout(handleUrlChange, 0);
  });
})(window, document);
`;
}

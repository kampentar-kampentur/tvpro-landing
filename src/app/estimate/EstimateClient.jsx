"use client";

import React, { useState, useEffect } from "react";
import styles from "./EstimatePage.module.css";
import TextField from "@/ui/Form/components/fields/TextField";
import { validatePhone } from "@/ui/Form/utils/phoneValidation";
import Button from "@/ui/Button";
import Checkbox from "@/ui/Checkbox";
import { getUtmParams } from "@/lib/utmTracker";
import { trackOpenAIConversion } from "@/lib/openaiTracker";
import { trackMetaLead, trackMetaPageView } from "@/lib/fbTracker";
import { useRouter } from "next/navigation";
import { useCTA } from "@/providers/CTAProvider";
import { getLeadLocation } from "@/lib/locationTracker";

const TV_OPTIONS = [
  { id: "1 TV", label: "1 TV" },
  { id: "2–3 TVs", label: "2–3 TVs" },
  { id: "4+ TVs", label: "4+ TVs" },
];

const TIMING_OPTIONS = [
  { id: "As soon as possible", label: "As soon as possible" },
  { id: "Within a few days", label: "Within a few days" },
  { id: "Just checking prices", label: "Just checking prices" },
];

const nameField = {
  name: "name",
  type: "text",
  textLabel: "Enter your name",
  placeholder: "Your Name *",
  isRequired: true,
};

const phoneField = {
  name: "phone",
  type: "tel",
  textLabel: "Enter your phone",
  placeholder: "Phone Number *",
  isRequired: true,
};

export default function EstimateClient() {
  const router = useRouter();
  const cta = useCTA();

  const [tvCount, setTvCount] = useState("1 TV");
  const [timing, setTiming] = useState("As soon as possible");
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // 1. Immediately track PageView on Meta Pixel upon landing
  // 2. Suppress Live Chat widget & floating FAB button
  useEffect(() => {
    trackMetaPageView();

    if (typeof document !== "undefined") {
      document.body.classList.add("estimate-page", "book-now-page");

      const existingChat = document.querySelector("chat-widget");
      if (existingChat) existingChat.remove();
      const chatScript = document.querySelector(
        'script[data-widget-id="69a71eb8a27e8c3d964270ee"]'
      );
      if (chatScript) chatScript.remove();
    }

    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("estimate-page", "book-now-page");
      }
    };
  }, []);

  const handleChange = (fieldName) => (value) => {
    setSubmitError("");
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const nameValue = (formData?.name || "").trim();
  const phoneValue = (formData?.phone || "").trim();
  const isPhoneValid = validatePhone(phoneValue);
  const isFormValid = nameValue.length > 0 && isPhoneValid && Boolean(tvCount) && Boolean(timing);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (e.target && e.target.tagName !== "BUTTON" && e.target.tagName !== "A") {
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const rawApiUrl =
        process.env.NEXT_PUBLIC_SRTAPI_URL || "http://localhost:1337";
      const apiUrl = rawApiUrl.replace(/\/$/, "");

      // Resolve location and page context
      const location = getLeadLocation(cta);
      const resolvedCity = location.city;

      const submitName = nameValue;
      const submitPhone = phoneValue;
      let utm = {};
      try {
        utm = getUtmParams() || {};
      } catch (e) {}

      const trueSource =
        utm.utm_source ||
        (utm.fbclid ? "facebook" : null) ||
        (utm.gclid || utm.gbraid || utm.wbraid ? "google" : null) ||
        "direct";

      const response = await fetch(`${apiUrl}/api/book-now`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            name: submitName,
            phone: submitPhone,
            source: trueSource,
            formType: "estimate",
            tvCount,
            timing,
            city: location.city,
            state: location.state,
            page: location.page,
            lat: location.lat,
            lng: location.lng,
            ...utm,
            submittedAt: new Date().toISOString(),
            timestamp: Date.now(),
          },
        }),
      });

      if (response && response.ok) {
        try {
          sessionStorage.setItem("form_submitted", "true");
        } catch (e) {}

        // 1. Meta Pixel Lead (ONLY on successful submission!)
        try {
          trackMetaLead({
            content_name: "TV Mounting Estimate",
            form_type: "estimate",
            num_tvs: tvCount,
            timing: timing,
            city: resolvedCity,
          });
        } catch (e) {
          console.warn("[Meta Lead Error]:", e);
        }

        // 2. DataLayer & GTag Events
        try {
          if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
            const payload = {
              "user_data.phone_number": submitPhone.replace(/\D/g, ""),
              "user_data.first_name": submitName,
              form_type: "estimate",
              num_tvs: tvCount,
              timing: timing,
              city: resolvedCity,
              ...utm,
              utm_params: utm,
            };
            window.dataLayer.push({ event: "form_send_ok", ...payload });
            window.dataLayer.push({ event: "estimate_send_ok", ...payload });
            window.dataLayer.push({ event: "all_forms_send_ok", ...payload });
          }
        } catch (e) {
          console.warn("[DataLayer Error]:", e);
        }

        try {
          if (typeof window !== "undefined" && typeof window.gtag === "function") {
            window.gtag("event", "conversion", {
              send_to: "AW-17416148778/aAZCCNeF9vsaEKqu1fBA",
            });
          }
        } catch (e) {
          console.warn("[GTag Error]:", e);
        }

        // 3. OpenAI Pixel
        try {
          trackOpenAIConversion("estimate_send_ok", {
            userData: {
              name: submitName,
              phone: submitPhone,
            },
            customData: {
              form_type: "estimate",
              source: trueSource,
              num_tvs: tvCount,
              timing: timing,
              city: resolvedCity,
            },
          });
        } catch (e) {
          console.warn("[OpenAI Pixel Error]:", e);
        }

        // Redirect to /see-you-soon
        router.push("/see-you-soon");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Estimate submission error:", errorData);
        setSubmitError(
          errorData?.error?.message || "An error occurred while submitting. Please try again."
        );
      }
    } catch (error) {
      console.error("Failed to send estimate request:", error);
      setSubmitError(
        "Failed to send request. Please check your connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const TermsText = () => {
    return (
      <span
        style={{
          fontSize: "12px",
          display: "block",
          maxWidth: "100%",
          textAlign: "left",
        }}
      >
        I agree to receive SMS from TVPro Handy Services LLC regarding
        appointments and service updates.
        <span style={{ display: "block", marginTop: "4px" }}>
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="sms-link"
          >
            Privacy Policy
          </a>{" "}
          and
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="sms-link"
            style={{ marginLeft: 8 }}
          >
            Terms of Service
          </a>
        </span>
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div
          className={styles.formWrapper}
          onKeyDown={handleKeyDown}
        >
          <h1 className={styles.title}>Get Your FREE TV Mounting Estimate</h1>
          <p className={styles.subtitle}>
            Leave your number — we’ll call and give you the exact price
          </p>

          {/* Question 1: How many TVs */}
          <div className={styles.questionBlock}>
            <span className={styles.questionLabel}>
              How many TVs do you need mounted?
            </span>
            <div className={styles.optionsGrid}>
              {TV_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`${styles.optionChip} ${
                    tvCount === opt.id ? styles.optionChipSelected : ""
                  }`}
                  onClick={() => setTvCount(opt.id)}
                  aria-pressed={tvCount === opt.id}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: When do you need */}
          <div className={styles.questionBlock}>
            <span className={styles.questionLabel}>
              When do you need your TV mounted?
            </span>
            <div className={styles.optionsGrid}>
              {TIMING_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`${styles.optionChip} ${
                    timing === opt.id ? styles.optionChipSelected : ""
                  }`}
                  onClick={() => setTiming(opt.id)}
                  aria-pressed={timing === opt.id}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <TextField
            field={nameField}
            value={formData.name}
            onChange={handleChange("name")}
            className={styles.bookNowInput}
          />

          {/* Phone Input */}
          <TextField
            field={phoneField}
            value={formData.phone}
            onChange={handleChange("phone")}
            className={styles.bookNowInput}
          />

          {/* Official TVPro Discount Banner */}
          <div className={styles.discountBanner}>
            <p className={styles.discountLabel}>Installing 2 or more TVs?</p>
            <p className={styles.discountText}>
              Let the manager know to receive a multi-TVs{" "}
              <span className={styles.discountPercent}>DISCOUNT</span>.
            </p>
          </div>

          <div
            className={styles.submitErrorContainer}
            aria-live="polite"
            style={{ display: submitError ? "block" : "none" }}
          >
            <span className={styles.submitErrorText}>
              {submitError}
            </span>
          </div>

          {/* Submit Button & Compliance Checkbox */}
          <div className={styles.btnWrap}>
            <Checkbox label={<TermsText />} />
            <Button
              className={styles.button}
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? "Sending..." : "Get My FREE Estimate"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

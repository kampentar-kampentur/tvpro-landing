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
import { useCTA } from "@/providers/CTAProvider";

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
  const cta = useCTA();

  const [tvCount, setTvCount] = useState("1 TV");
  const [timing, setTiming] = useState("As soon as possible");
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const isPhoneValid = validatePhone(formData.phone);
  const isFormValid = formData.name.trim().length > 0 && isPhoneValid && Boolean(tvCount) && Boolean(timing);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_SRTAPI_URL || "http://localhost:1337";

      // Resolve city from query parameters or Geo-IP
      let resolvedCity = "";
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        resolvedCity =
          params.get("city") ||
          params.get("from") ||
          window.__GEO_CITY__?.city ||
          cta?.citySlug ||
          "";
      }

      const submitName = formData.name.trim();
      const submitPhone = formData.phone.trim();
      const utm = getUtmParams();

      const response = await fetch(`${apiUrl}/api/book-now`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            name: submitName,
            phone: submitPhone,
            source: "fb-estimate-page",
            formType: "estimate",
            tvCount,
            timing,
            city: resolvedCity,
            ...utm,
            submittedAt: new Date().toISOString(),
            timestamp: Date.now(),
          },
        }),
      });

      if (response.ok) {
        sessionStorage.setItem("form_submitted", "true");
        setIsSubmitted(true);

        // 1. Meta Pixel Lead (ONLY on successful submission!)
        trackMetaLead({
          content_name: "TV Mounting Estimate",
          form_type: "estimate",
          num_tvs: tvCount,
          timing: timing,
          city: resolvedCity,
        });

        // 2. DataLayer & GTag Events
        if (typeof dataLayer !== "undefined") {
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
          dataLayer.push({ event: "form_send_ok", ...payload });
          dataLayer.push({ event: "estimate_send_ok", ...payload });
          dataLayer.push({ event: "all_forms_send_ok", ...payload });
        }

        if (typeof gtag !== "undefined") {
          gtag("event", "conversion", {
            send_to: "AW-17416148778/aAZCCNeF9vsaEKqu1fBA",
          });
        }

        // 3. OpenAI Pixel
        trackOpenAIConversion("estimate_send_ok", {
          userData: {
            name: submitName,
            phone: submitPhone,
          },
          customData: {
            form_type: "estimate",
            source: "fb-estimate-page",
            num_tvs: tvCount,
            timing: timing,
            city: resolvedCity,
          },
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Estimate submission error:", errorData);
        setSubmitError(
          errorData?.error?.message || "An error occurred. Please try again."
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
      <div
        style={{
          fontSize: "12px",
          maxWidth: "100%",
          textWrap: "wrap",
          textAlign: "left",
        }}
      >
        I agree to receive SMS from TVPro Handy Services LLC regarding
        appointments and service updates.
        <p>
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
        </p>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {isSubmitted ? (
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className={styles.successTitle}>Thank You!</h2>
            <p className={styles.successText}>
              Your estimate request has been received. Our manager will call you shortly with the exact price.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
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

            {submitError && (
              <p className={styles.submitError}>{submitError}</p>
            )}

            {/* Submit Button & Compliance Checkbox */}
            <div className={styles.btnWrap}>
              <Checkbox label={<TermsText />} />
              <Button
                className={styles.button}
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? "Sending..." : "Get My FREE Estimate"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

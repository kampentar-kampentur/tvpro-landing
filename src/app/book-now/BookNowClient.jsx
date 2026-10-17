"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useContext } from "react";
import styles from "./BookNowPage.module.css";
import TextField from "@/ui/Form/components/fields/TextField";
import { validatePhone } from "@/ui/Form/utils/phoneValidation";
import Button from "@/ui/Button";
import Checkbox from "@/ui/Checkbox";
import { getUtmParams, resolveAttributionSource, trackFormInteract } from "@/lib/utmTracker";
import { trackOpenAIConversion } from "@/lib/openaiTracker";
import { trackMetaLead } from "@/lib/fbTracker";
import { useCTA } from "@/providers/CTAProvider";
import { getLeadLocation } from "@/lib/locationTracker";

const nameField = {
  name: "name",
  type: "text",
  textLabel: "Enter your name",
  placeholder: "Your name *",
  isRequired: true,
};

const phoneField = {
  name: "phone",
  type: "tel",
  textLabel: "Enter your phone",
  placeholder: "Phone number *",
  isRequired: true,
};

export default function BookNowClient() {
  const router = useRouter();
  const cta = useCTA();
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // 1. Manage body class to hide chat-widget and jumping phone FAB
  useEffect(() => {
    document.body.classList.add("book-now-page");

    // Hide any existing chat-widget in the DOM immediately
    const existingWidget = document.querySelector("chat-widget");
    if (existingWidget) {
      existingWidget.style.setProperty("display", "none", "important");
    }

    return () => {
      document.body.classList.remove("book-now-page");
      if (existingWidget) {
        existingWidget.style.removeProperty("display");
      }
    };
  }, []);

  // 2. Save return URL and check location/city CTA overrides
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get("from");
    const city = searchParams.get("city");
    const targetCitySlug = from || city;

    if (from) {
      sessionStorage.setItem("quiz_return_url", from.startsWith("/") ? from : `/${from}/`);
    } else if (document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        if (refUrl.origin === window.location.origin && !refUrl.pathname.includes("/book-now")) {
          sessionStorage.setItem("quiz_return_url", refUrl.pathname);
        }
      } catch (e) {
        // ignore invalid referrer
      }
    }
  }, []);

  const handleChange = (fieldName) => (value) => {
    setSubmitError("");
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.name || !validatePhone(formData.phone)) {
      return;
    }

    trackFormInteract("book_now_page_form", "submit_click");
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_SRTAPI_URL || "http://localhost:1337";

      const location = getLeadLocation(cta);
      const utm = getUtmParams() || {};
      const trueSource = resolveAttributionSource(utm);

      const response = await fetch(`${apiUrl}/api/book-now`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            name: formData.name,
            phone: formData.phone,
            source: trueSource,
            formType: "bookNow",
            tvCount: null,
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

      if (response.ok) {
        sessionStorage.setItem("form_submitted", "true");
        const submitName = formData.name || "";
        const submitPhone = formData.phone || "";
        setFormData({ name: "", phone: "" });

        if (typeof dataLayer !== "undefined") {
          const utm = getUtmParams();
          const payload = {
            "user_data.phone_number": submitPhone.replace(/\D/g, ""),
            "user_data.first_name": submitName,
            ...utm,
            utm_params: utm,
          };
          dataLayer.push({ event: "form_send_ok", ...payload });
          dataLayer.push({ event: "all_forms_send_ok", ...payload });
        }
        if (typeof gtag !== "undefined") {
          gtag("event", "conversion", {
            send_to: "AW-17416148778/aAZCCNeF9vsaEKqu1fBA",
          });
        }
        trackOpenAIConversion("book_now_send_ok", {
          userData: {
            name: submitName,
            phone: submitPhone,
          },
          customData: {
            form_type: "bookNow",
            source: "book-now-page",
          },
        });
        trackMetaLead({
          content_name: "Book Now Page",
          form_type: "bookNow",
          source: "book-now-page",
          city: location.city || "",
        });
        router.push("/see-you-soon");
      } else {
        const errorData = await response.json();
        console.error("Form submission error:", errorData);
        setSubmitError("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Failed to send form:", error);
      setSubmitError("Failed to send request. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && validatePhone(formData.phone);

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
        <div className={styles.formWrapper} data-form-name="book_now_page_form">
          <h1 className={styles.title}>Get a Quick Quote</h1>
          <p className={styles.subtitle}>
            Leave your number — we’ll call and give you the exact price
          </p>
          <TextField
            field={nameField}
            value={formData.name}
            onChange={handleChange("name")}
            className={styles.bookNowInput}
          />
          <TextField
            field={phoneField}
            value={formData.phone}
            onChange={handleChange("phone")}
            className={styles.bookNowInput}
          />
          <div className={styles.discountBanner}>
            <p className={styles.discountLabel}>Installing 2 or more TVs?</p>
            <p className={styles.discountText}>
              Let the manager know to receive a multi-TVs{" "}
              <span className={styles.discountPercent}>DISCOUNT</span>.
            </p>
          </div>

          <p
            className={styles.submitError}
            style={{ display: submitError ? "block" : "none" }}
          >
            {submitError}
          </p>

          <div className={styles.btnWrap}>
            <Checkbox label={<TermsText />} />
            <Button
              className={styles.button}
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
 
import { useModalState } from "@/providers/ModalProvider";
import Modal from "@/ui/Modal";
import React, { useState, useEffect } from "react";
import TextField from "@/ui/Form/components/fields/TextField";
import SelectField from "@/ui/Form/components/fields/SelectField";
import RadioQuestionField from "@/ui/Form/components/fields/RadioQuestionField";
import CheckboxGroupField from "@/ui/Form/components/fields/CheckboxGroupField";
import TextAreaField from "@/ui/Form/components/fields/TextAreaField";
import fieldStyles from "@/ui/Form/components/fields/TextField.module.css";
import { validatePhone } from "@/ui/Form/utils/phoneValidation";
import Button from "@/ui/Button";
import Checkbox from "@/ui/Checkbox";
import Radiobutton from "@/ui/Radiobutton/Radiobutton";
import FileUploadField from "@/ui/Form/components/fields/FileUploadField";
import styles from "./CareersModal.module.css";
import Breadcrumbs from "@/ui/Breadcrumbs";
import LogoSVG from "@/assets/logo.svg";

const scheduleOptions = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Weekends only", label: "Weekends only" },
  { value: "Flexible", label: "Flexible" }
];

const daysPerWeekOptions = [
  { value: "1-2 days", label: "1-2 days" },
  { value: "3-4 days", label: "3-4 days" },
  { value: "5-6 days", label: "5-6 days" },
  { value: "7 days", label: "7 days" }
];

const yesNoOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" }
];

const insuranceOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "I already have it", label: "I already have it" }
];

const languageOptions = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "Russian", label: "Russian" },
  { value: "Ukrainian", label: "Ukrainian" },
  { value: "Chinese (Mandarin)", label: "Chinese (Mandarin)" },
  { value: "Vietnamese", label: "Vietnamese" },
  { value: "Arabic", label: "Arabic" },
  { value: "French", label: "French" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Other", label: "Other" }
];

const experienceLevelOptions = [
  { value: "No experience", label: "No experience" },
  { value: "< 6 months", label: "< 6 months" },
  { value: "6-12 months", label: "6-12 months" },
  { value: "1-2 years", label: "1-2 years" },
  { value: "2+ years", label: "2+ years" },
  { value: "5+ years", label: "5+ years" }
];

const servicesOptions = [
  { value: "Drywall TV mounting", label: "Drywall TV mounting" },
  { value: "Brick / concrete mounting", label: "Brick / concrete mounting" },
  { value: "Fireplace TV mounting", label: "Fireplace TV mounting" },
  { value: "In-wall wire concealment", label: "In-wall wire concealment" },
  { value: "External wire concealment", label: "External wire concealment" },
  { value: "Soundbar installation", label: "Soundbar installation" },
  { value: "Frame TV installation", label: "Frame TV installation" },
  { value: "Full-motion mount", label: "Full-motion mount" },
  { value: "Recessed box install", label: "Recessed box install" },
  { value: "Shelves / floating shelves", label: "Shelves / floating shelves" },
  { value: "Mirrors / picture hanging", label: "Mirrors / picture hanging" },
  { value: "Ceiling mount", label: "Ceiling mount" },
  { value: "Projector installation", label: "Projector installation" }
];

const hasToolsOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "Some tools", label: "Some tools" }
];

const q1StudsOptions = [
  { value: "16 inches", label: "16 inches" },
  { value: "18 inches", label: "18 inches" },
  { value: "24 inches", label: "24 inches" },
  { value: "8-12 inches", label: "8-12 inches" }
];

const q2PowerOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No - proper in-wall power kit or outlet solution required", label: "No - proper in-wall power kit or outlet solution required" },
  { value: "Only if customer agrees", label: "Only if customer agrees" }
];
 
const stepsConfig = [
  { id: "step1", title: "Eligibility" },
  { id: "step2", title: "Skills" },
  { id: "step3", title: "Fit" }
];
 
export default function CareersModal() {
  const { isOpen, close } = useModalState("CareersForm");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [citiesList, setCitiesList] = useState([
    "Austin", "Charlotte", "Chicago", "Dallas", "Houston", "Jacksonville", "Kansas City", "Miami", "New York", "Philadelphia"
  ]);

  useEffect(() => {
    async function loadCities() {
      try {
        const response = await fetch("https://strapi-staging-bd62.up.railway.app/api/cities?filters[metro_city_slug][$null]=true&pagination[pageSize]=100");
        const json = await response.json();
        if (json?.data && Array.isArray(json.data)) {
          const names = json.data
            .map(item => item.attributes?.city_name || item.city_name)
            .filter(Boolean);
          if (names.length > 0) {
            const unique = Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
            setCitiesList(unique);
          }
        }
      } catch (e) {
        console.warn("Failed to dynamically load areas:", e);
      }
    }
    loadCities();
  }, []);

  useEffect(() => {
    const scrollableElements = document.querySelectorAll(`[class*="modalWrapper"], .${styles.container}`);
    scrollableElements.forEach(el => {
      el.scrollTop = 0;
    });
  }, [step]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    otherCity: "",
    workAuth: "",
    over18: "",
    driverLicense: "",
    languages: [],
    
    experienceLevel: "",
    previousWork: "",
    servicesPerformed: [],
    hasTools: "",
    q1Studs: "",
    q2Power: "",
    
    schedule: "",
    daysPerWeek: "",
    insurance: "",
    backgroundCheck: "",
    drivingRange: "",
    desiredIncome: "",
    file: null,
    about: "",
    strengths: "",
    weaknesses: ""
  });

  const handleChange = (field) => (value) => {
    const finalValue = value && value.target ? value.target.value : value;
    setFormData((prev) => ({ ...prev, [field]: finalValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (submitError) setSubmitError("");
  };

  const handleCheckboxChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Full Name is required";
      }
      if (!formData.phone) {
        newErrors.phone = "Phone Number is required";
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!formData.city) {
        newErrors.city = "Please select a city";
      }
      if (formData.city === "other" && !formData.otherCity.trim()) {
        newErrors.otherCity = "Please enter your city";
      }
      if (!formData.workAuth) {
        newErrors.workAuth = "Please select an answer";
      }
      if (!formData.over18) {
        newErrors.over18 = "Please select an answer";
      }
      if (!formData.driverLicense) {
        newErrors.driverLicense = "Please select an answer";
      }
      if (!formData.languages || formData.languages.length === 0) {
        newErrors.languages = "Please select at least one language";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      nextStep();
      return;
    }

    if (step === 2) {
      if (!formData.experienceLevel) {
        newErrors.experienceLevel = "Please select your experience level";
      }
      if (!formData.previousWork.trim()) {
        newErrors.previousWork = "Please answer where you have worked before";
      }
      if (!formData.servicesPerformed || formData.servicesPerformed.length === 0) {
        newErrors.servicesPerformed = "Please select at least one service";
      }
      if (!formData.hasTools) {
        newErrors.hasTools = "Please select if you have tools";
      }
      if (!formData.q1Studs) {
        newErrors.q1Studs = "Please select standard stud spacing";
      }
      if (!formData.q2Power) {
        newErrors.q2Power = "Please select if power cord can be hidden";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      nextStep();
      return;
    }

    if (step < 3) {
      nextStep();
      return;
    }

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone Number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.workAuth) {
      newErrors.workAuth = "Please select an answer";
    }
    if (!formData.over18) {
      newErrors.over18 = "Please select an answer";
    }
    if (!formData.driverLicense) {
      newErrors.driverLicense = "Please select an answer";
    }
    if (!formData.languages || formData.languages.length === 0) {
      newErrors.languages = "Please select at least one language";
    }

    if (!formData.schedule) {
      newErrors.schedule = "Please select a schedule";
    }
    if (!formData.daysPerWeek) {
      newErrors.daysPerWeek = "Please select days per week";
    }
    if (!formData.drivingRange) {
      newErrors.drivingRange = "Please select an answer";
    }
    if (!formData.desiredIncome.trim()) {
      newErrors.desiredIncome = "Please enter your desired income";
    }
    if (!formData.insurance) {
      newErrors.insurance = "Please select an answer";
    }
    if (!formData.backgroundCheck) {
      newErrors.backgroundCheck = "Please select an answer";
    }
    if (!formData.about.trim()) {
      newErrors.about = "Please tell us about yourself";
    }
    if (!formData.strengths.trim()) {
      newErrors.strengths = "Please enter your strengths";
    }
    if (!formData.weaknesses.trim()) {
      newErrors.weaknesses = "Please enter your weaknesses";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const submissionData = {
        ...formData,
        city: formData.city === "other" ? formData.otherCity : formData.city,
        languages: Array.isArray(formData.languages) ? formData.languages.join(", ") : formData.languages,
        servicesPerformed: Array.isArray(formData.servicesPerformed) ? formData.servicesPerformed.join(", ") : formData.servicesPerformed
      };

      // Remove file and otherCity fields as they are not needed in Strapi
      const { file, otherCity, ...postData } = submissionData;

      const apiUrl = process.env.NEXT_PUBLIC_SRTAPI_URL || "http://localhost:1337";

      const response = await fetch(`${apiUrl}/api/technician-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: postData
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setSubmitError("An error occurred. Please try again.");
      }
    } catch (error) {
      setSubmitError("Failed to send request. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (typeof window !== "undefined" && window.location.pathname.includes("/careers")) {
      window.location.href = "/";
      return;
    }
    close();
    setTimeout(() => {
      setStep(1);
      setIsSuccess(false);
      setErrors({});
      setSubmitError("");
    }, 300);
  };

  if (!isOpen) return null;

  const cityOptions = [
    ...citiesList.map((c) => ({ value: c, label: c })),
    { value: "other", label: "Other" }
  ];

  const formatPhoneSuccess = (phone) => {
    if (!phone) return "";
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      cleaned = cleaned.substring(1);
    }
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    }
    return phone;
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modal}>
      {isSuccess ? (
        <div className={styles.successScreen}>
          <div className={styles.successIconWrapper}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="30" fill="#DCFCE7" />
              <path d="M22 32L29 39L42 24" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className={styles.successTitle}>Thank You, {formData.name || "Applicant"}!</h3>
          <p className={styles.successMessage}>
            We&apos;ve received your application to become a TVPro Technician. A confirmation and next steps have been sent to <strong>{formData.email}</strong>.
          </p>
          <p className={styles.successSubmessage}>
            Our recruiting team will review your skills and contact you shortly at <strong>{formData.phone ? `+1 ${formatPhoneSuccess(formData.phone)}` : ""}</strong>.
          </p>
          <Button onClick={handleClose} className={styles.successCloseBtn}>Go to homepage</Button>
        </div>
      ) : (
        <>
          <header className={styles.header}>
            <LogoSVG width="82" height="40" role="img" />
          </header>
          <div className={styles.container}>
            <main className={styles.main}>
              <div className={styles.form}>
                <Breadcrumbs
                  steps={stepsConfig}
                  currentMainStep={step - 1}
                  onStepClick={(index) => setStep(index + 1)}
                  completedSteps={Array.from({ length: step }, (_, i) => i)}
                />
                
                <h3 className={styles.title}>Apply to Become a Technician</h3>

                <div className={styles.stepContainer}>
                  {step === 1 && (
                    <>
                      <h4>Step 1: Contact & Eligibility</h4>
                      <TextField field={{ name: "name", placeholder: "Full Name *", textLabel: "Full Name" }} value={formData.name} onChange={handleChange("name")} error={errors.name} />
                      <TextField field={{ name: "phone", type: "tel", placeholder: "Phone Number *", textLabel: "Phone Number" }} value={formData.phone} onChange={handleChange("phone")} error={errors.phone} />
                      <TextField field={{ name: "email", type: "email", placeholder: "Email *", textLabel: "Email" }} value={formData.email} onChange={handleChange("email")} error={errors.email} />
                      
                      <SelectField
                        label="City you want to work in *"
                        placeholder="City you want to work in *"
                        value={formData.city}
                        onChange={(val) => handleChange("city")(val)}
                        options={cityOptions}
                        error={errors.city}
                      />

                      {formData.city === "other" && (
                        <TextField
                          field={{ name: "otherCity", placeholder: "Enter your city *", textLabel: "Enter your city" }}
                          value={formData.otherCity || ""}
                          onChange={handleChange("otherCity")}
                          error={errors.otherCity}
                        />
                      )}

                      <RadioQuestionField
                        question="Legally authorized to work in the U.S.? *"
                        name="workAuth"
                        options={yesNoOptions}
                        value={formData.workAuth}
                        onChange={(val) => handleChange("workAuth")(val)}
                        error={errors.workAuth}
                      />

                      <RadioQuestionField
                        question="Are you over 18 years old? *"
                        name="over18"
                        options={yesNoOptions}
                        value={formData.over18}
                        onChange={(val) => handleChange("over18")(val)}
                        error={errors.over18}
                      />

                      <RadioQuestionField
                        question="Do you have a valid Driver's License and a vehicle? *"
                        name="driverLicense"
                        options={yesNoOptions}
                        value={formData.driverLicense}
                        onChange={(val) => handleChange("driverLicense")(val)}
                        error={errors.driverLicense}
                      />

                      <CheckboxGroupField
                        label="Which languages can you use with customers? *"
                        options={languageOptions}
                        value={formData.languages}
                        onChange={(val) => handleChange("languages")(val)}
                        error={errors.languages}
                      />
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <h4>Step 2: Experience & Skills</h4>
                      
                      <div className={styles.fieldGroup}>
                        <span className={styles.fieldGroupLabel}>How much experience do you have with TV mounting, handyman work, construction, or low-voltage work? *</span>
                        <div className={styles.experienceGrid}>
                          {experienceLevelOptions.map((opt) => (
                            <Radiobutton
                              key={opt.value}
                              checked={formData.experienceLevel === opt.value}
                              onChange={() => handleChange("experienceLevel")(opt.value)}
                              label={opt.label}
                            />
                          ))}
                        </div>
                        {errors.experienceLevel && (
                          <span className={fieldStyles.errorText}>{errors.experienceLevel}</span>
                        )}
                      </div>

                      <TextAreaField
                        label="Where have you worked before? *"
                        placeholder="Company names, platforms, construction jobs, handyman work, etc."
                        value={formData.previousWork}
                        onChange={(val) => handleChange("previousWork")(val)}
                        error={errors.previousWork}
                      />

                      <CheckboxGroupField
                        label="Services you can confidently perform"
                        options={servicesOptions}
                        value={formData.servicesPerformed}
                        onChange={(val) => handleChange("servicesPerformed")(val)}
                        error={errors.servicesPerformed}
                        columns={2}
                      />

                      <div className={styles.fieldGroup}>
                        <span className={styles.fieldGroupLabel}>Do you have your own basic tools for TV installation? *</span>
                        <div className={styles.toolsRow}>
                          {hasToolsOptions.map((opt) => (
                            <Radiobutton
                              key={opt.value}
                              checked={formData.hasTools === opt.value}
                              onChange={() => handleChange("hasTools")(opt.value)}
                              label={opt.label}
                            />
                          ))}
                        </div>
                        {errors.hasTools && (
                          <span className={fieldStyles.errorText}>{errors.hasTools}</span>
                        )}
                      </div>

                      <div className={styles.quizBox}>
                        <h4 className={styles.quizBoxTitle}>Quick technical checks</h4>
                        
                        <div className={styles.fieldGroup}>
                          <span className={styles.fieldGroupLabel}>1) Standard stud spacing in most U.S. homes: *</span>
                          <div className={styles.experienceGrid}>
                            {q1StudsOptions.map((opt) => (
                              <Radiobutton
                                key={opt.value}
                                checked={formData.q1Studs === opt.value}
                                onChange={() => handleChange("q1Studs")(opt.value)}
                                label={opt.label}
                              />
                            ))}
                          </div>
                          {errors.q1Studs && (
                            <span className={fieldStyles.errorText}>{errors.q1Studs}</span>
                          )}
                        </div>

                        <div className={styles.fieldGroup}>
                          <span className={styles.fieldGroupLabel}>2) Can a regular TV power cord be hidden inside the wall? *</span>
                          <div className={styles.fieldGroup} style={{ gap: '12px' }}>
                            {q2PowerOptions.map((opt) => (
                              <Radiobutton
                                key={opt.value}
                                checked={formData.q2Power === opt.value}
                                onChange={() => handleChange("q2Power")(opt.value)}
                                label={opt.label}
                              />
                            ))}
                          </div>
                          {errors.q2Power && (
                            <span className={fieldStyles.errorText}>{errors.q2Power}</span>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <h4>Step 3: Availability & Fit</h4>
                      
                      <div className={styles.twoColumnLayout}>
                        {/* Left Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <div className={styles.fieldGroup}>
                            <span className={styles.fieldGroupLabel}>What schedule are you looking for? *</span>
                            <div className={styles.fieldGroup} style={{ gap: '12px' }}>
                              {scheduleOptions.map((opt) => (
                                <Radiobutton
                                  key={opt.value}
                                  checked={formData.schedule === opt.value}
                                  onChange={() => handleChange("schedule")(opt.value)}
                                  label={opt.label}
                                />
                              ))}
                            </div>
                            {errors.schedule && (
                              <span className={fieldStyles.errorText}>{errors.schedule}</span>
                            )}
                          </div>

                          <div className={styles.fieldGroup}>
                            <span className={styles.fieldGroupLabel}>How many days per week can you work? *</span>
                            <div className={styles.fieldGroup} style={{ gap: '12px' }}>
                              {daysPerWeekOptions.map((opt) => (
                                <Radiobutton
                                  key={opt.value}
                                  checked={formData.daysPerWeek === opt.value}
                                  onChange={() => handleChange("daysPerWeek")(opt.value)}
                                  label={opt.label}
                                />
                              ))}
                            </div>
                            {errors.daysPerWeek && (
                              <span className={fieldStyles.errorText}>{errors.daysPerWeek}</span>
                            )}
                          </div>

                          <div className={styles.fieldGroup}>
                            <span className={styles.fieldGroupLabel}>Comfortable driving 30-40 miles to customers? *</span>
                            <div className={styles.toolsRow}>
                              {yesNoOptions.map((opt) => (
                                <Radiobutton
                                  key={opt.value}
                                  checked={formData.drivingRange === opt.value}
                                  onChange={() => handleChange("drivingRange")(opt.value)}
                                  label={opt.label}
                                />
                              ))}
                            </div>
                            {errors.drivingRange && (
                              <span className={fieldStyles.errorText}>{errors.drivingRange}</span>
                            )}
                          </div>

                           <TextField
                            field={{ name: "desiredIncome", placeholder: "Desired weekly income *", type: "number", textLabel: "Desired weekly income" }}
                            value={formData.desiredIncome}
                            onChange={handleChange("desiredIncome")}
                            error={errors.desiredIncome}
                            className={fieldStyles.desiredIncomeField}
                          />
                        </div>

                        {/* Right Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <div className={styles.fieldGroup}>
                            <span className={styles.fieldGroupLabel}>Willing to get liability insurance if required? *</span>
                            <div className={styles.fieldGroup} style={{ gap: '12px' }}>
                              {insuranceOptions.map((opt) => (
                                <Radiobutton
                                  key={opt.value}
                                  checked={formData.insurance === opt.value}
                                  onChange={() => handleChange("insurance")(opt.value)}
                                  label={opt.label}
                                />
                              ))}
                            </div>
                            {errors.insurance && (
                              <span className={fieldStyles.errorText}>{errors.insurance}</span>
                            )}
                          </div>

                          <div className={styles.fieldGroup}>
                            <span className={styles.fieldGroupLabel}>Willing to pass a background check? *</span>
                            <div className={styles.toolsRow}>
                              {yesNoOptions.map((opt) => (
                                <Radiobutton
                                  key={opt.value}
                                  checked={formData.backgroundCheck === opt.value}
                                  onChange={() => handleChange("backgroundCheck")(opt.value)}
                                  label={opt.label}
                                />
                              ))}
                            </div>
                            {errors.backgroundCheck && (
                              <span className={fieldStyles.errorText}>{errors.backgroundCheck}</span>
                            )}
                          </div>

                          <FileUploadField
                            label="Upload photos, resume, or tool setup"
                            value={formData.file}
                            onChange={(val) => handleChange("file")(val)}
                          />
                        </div>
                      </div>

                      <div className={styles.shortAnswersBox}>
                        <h4 className={styles.shortAnswersTitle}>Short written answers</h4>

                        <TextAreaField
                          label="Tell us about yourself *"
                          placeholder="Short introduction, background, what kind of work you like"
                          value={formData.about}
                          onChange={(val) => handleChange("about")(val)}
                          error={errors.about}
                        />

                        <TextAreaField
                          label="Your strengths *"
                          placeholder="Example: punctual, clean, fast, technical, customer-friendly"
                          value={formData.strengths}
                          onChange={(val) => handleChange("strengths")(val)}
                          error={errors.strengths}
                        />

                        <TextAreaField
                          label="Your weaknesses *"
                          placeholder="Be honest: what are you improving right now?"
                          value={formData.weaknesses}
                          onChange={(val) => handleChange("weaknesses")(val)}
                          error={errors.weaknesses}
                        />
                      </div>
                    </>
                  )}
                </div>

                {submitError && (
                  <div style={{ color: "#ff4d4f", fontSize: "14px", marginTop: "12px", textAlign: "center" }}>
                    {submitError}
                  </div>
                )}

                <div className={styles.buttons}>
                  {step > 1 && (
                    <Button variant="secondary" onClick={prevStep} type="button" className={styles.btnSecondary}>Back</Button>
                  )}
                  {step < 3 ? (
                    <Button variant="primary" type="button" onClick={handleSubmit} className={styles.btnPrimary}>Next Step</Button>
                  ) : (
                    <Button variant="primary" type="button" onClick={handleSubmit} disabled={isSubmitting} className={styles.btnPrimary}>
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  )}
                </div>
              </div>
            </main>
          </div>
          
          {step <= 3 && (
            <div className={styles.progressWrapper}>
              <div className={styles.progressFill} style={{ width: `${Math.round((step / 3) * 100)}%` }}>
                <span className={styles.progressPercent}>{Math.round((step / 3) * 100)}%</span>
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}

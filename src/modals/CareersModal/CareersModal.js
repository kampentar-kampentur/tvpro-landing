"use client";

import { useModalState } from "@/providers/ModalProvider";
import Modal from "@/ui/Modal";
import React, { useState } from "react";
import TextField from "@/ui/Form/components/fields/TextField";
import { validatePhone } from "@/ui/Form/utils/phoneValidation";
import Button from "@/ui/Button";
import Checkbox from "@/ui/Checkbox";
import styles from "./CareersModal.module.css";

export default function CareersModal() {
  const { isOpen, close } = useModalState("CareersForm");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Houston",
    workAuth: false,
    over18: false,
    driverLicense: false,
    languages: "",
    
    experienceLevel: "No experience",
    previousWork: "",
    servicesPerformed: "",
    hasTools: "No",
    q1Studs: "",
    q2Power: "",
    
    schedule: "Full time",
    daysPerWeek: "",
    insurance: false,
    backgroundCheck: false,
    drivingRange: false,
    desiredIncome: "",
    about: ""
  });

  const handleChange = (field) => (value) => {
    // some fields might send an event if they are raw inputs, but TextField sends value
    const finalValue = value && value.target ? value.target.value : value;
    setFormData((prev) => ({ ...prev, [field]: finalValue }));
  };

  const handleCheckboxChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step < 3) {
      nextStep();
      return;
    }

    if (!formData.name || !validatePhone(formData.phone)) {
      alert("Please provide a valid name and phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert("An error occurred. Please try again.");
      }
    } catch (error) {
      alert("Failed to send request. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    close();
    setTimeout(() => {
      setStep(1);
      setIsSuccess(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modal}>
      {isSuccess ? (
        <div className={styles.successScreen}>
          <h3>Thank You!</h3>
          <p>Your application has been received. If your experience and location fit our needs, we will contact you shortly.</p>
          <Button onClick={handleClose} className={styles.button}>Close</Button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.progress}>
            <div className={styles.progressBar} style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
          
          <h3 className={styles.title}>Apply to Become a Technician</h3>

          <div className={styles.stepContainer}>
            {step === 1 && (
              <>
                <h4>Step 1: Contact & Eligibility</h4>
                <TextField field={{ name: "name", placeholder: "Full Name *" }} value={formData.name} onChange={handleChange("name")} />
                <TextField field={{ name: "phone", type: "tel", placeholder: "Phone Number *" }} value={formData.phone} onChange={handleChange("phone")} />
                <TextField field={{ name: "email", type: "email", placeholder: "Email" }} value={formData.email} onChange={handleChange("email")} />
                
                <div className={styles.inputGroup}>
                  <label>City you want to work in *</label>
                  <select value={formData.city} onChange={(e) => handleChange("city")(e.target.value)} className={styles.select}>
                    <option value="Houston">Houston</option>
                    <option value="Dallas">Dallas</option>
                    <option value="Austin">Austin</option>
                    <option value="Miami">Miami</option>
                    <option value="New York">New York</option>
                    <option value="Chicago">Chicago</option>
                  </select>
                </div>
                <div className={styles.checkboxGroup}>
                  <Checkbox checked={formData.workAuth} onChange={handleCheckboxChange("workAuth")} label="I have authorization to work in the US" />
                  <Checkbox checked={formData.over18} onChange={handleCheckboxChange("over18")} label="I am over 18 years old" />
                  <Checkbox checked={formData.driverLicense} onChange={handleCheckboxChange("driverLicense")} label="I have a valid Driver's License and a vehicle" />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h4>Step 2: Experience & Skills</h4>
                <div className={styles.inputGroup}>
                  <label>Experience Level</label>
                  <select value={formData.experienceLevel} onChange={(e) => handleChange("experienceLevel")(e.target.value)} className={styles.select}>
                    <option value="No experience">No experience</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
                <TextField field={{ name: "previousWork", placeholder: "Previous related work?" }} value={formData.previousWork} onChange={handleChange("previousWork")} />
                <TextField field={{ name: "servicesPerformed", placeholder: "Services you can do (e.g. brick, fireplace)" }} value={formData.servicesPerformed} onChange={handleChange("servicesPerformed")} />
                
                <div className={styles.inputGroup}>
                  <label>Do you have basic tools?</label>
                  <select value={formData.hasTools} onChange={(e) => handleChange("hasTools")(e.target.value)} className={styles.select}>
                    <option value="Yes">Yes</option>
                    <option value="Some">Some</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <p className={styles.quizTitle}>Quick Technical Questions:</p>
                <TextField field={{ name: "q1Studs", placeholder: "What is the standard stud spacing in the US?" }} value={formData.q1Studs} onChange={handleChange("q1Studs")} />
                <TextField field={{ name: "q2Power", placeholder: "Can you hide a regular TV power cord inside a wall?" }} value={formData.q2Power} onChange={handleChange("q2Power")} />
              </>
            )}

            {step === 3 && (
              <>
                <h4>Step 3: Availability & Fit</h4>
                <div className={styles.inputGroup}>
                  <label>Schedule</label>
                  <select value={formData.schedule} onChange={(e) => handleChange("schedule")(e.target.value)} className={styles.select}>
                    <option value="Full time">Full time</option>
                    <option value="Part time">Part time</option>
                    <option value="Weekends only">Weekends only</option>
                  </select>
                </div>
                <TextField field={{ name: "daysPerWeek", placeholder: "How many days per week?" }} value={formData.daysPerWeek} onChange={handleChange("daysPerWeek")} />
                <TextField field={{ name: "desiredIncome", placeholder: "Desired income per week ($)" }} value={formData.desiredIncome} onChange={handleChange("desiredIncome")} />
                
                <div className={styles.checkboxGroup}>
                  <Checkbox checked={formData.insurance} onChange={handleCheckboxChange("insurance")} label="I am willing to get liability insurance" />
                  <Checkbox checked={formData.backgroundCheck} onChange={handleCheckboxChange("backgroundCheck")} label="I consent to a background check" />
                  <Checkbox checked={formData.drivingRange} onChange={handleCheckboxChange("drivingRange")} label="I am willing to drive 30-40 miles for a job" />
                </div>
              </>
            )}
          </div>

          <div className={styles.buttons}>
            {step > 1 && (
              <Button variant="secondary" onClick={prevStep} type="button" className={styles.btnSecondary}>Back</Button>
            )}
            {step < 3 ? (
              <Button variant="primary" type="submit" className={styles.btnPrimary}>Next Step</Button>
            ) : (
              <Button variant="primary" type="submit" disabled={isSubmitting} className={styles.btnPrimary}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </form>
      )}
    </Modal>
  );
}

"use client";
import React from "react";
import styles from "./CareersCTA.module.css";
import Button from "@/ui/Button";
import { useModalState } from "@/providers/ModalProvider";

export default function CareersCTA({ data }) {
  const { open } = useModalState("CareersForm");

  const title = data?.title || "Join Our Team of Expert Technicians";
  const subTitle =
    data?.subTitle ||
    "We are always looking for skilled, reliable professionals. Flexible schedule, competitive pay, and a supportive team. Complete our short 3-minute application.";
  const buttonText = data?.buttonText || "Apply Now";

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subTitle}>{subTitle}</p>
          <Button variant="primary" onClick={() => open()} className={styles.button}>
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}

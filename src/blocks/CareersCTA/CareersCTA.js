"use client";
import React from "react";
import styles from "./CareersCTA.module.css";
import Button from "@/ui/Button";
import { useModalState } from "@/providers/ModalProvider";
import Text from "@/ui/Text/Text";

export default function CareersCTA({ data, cityContext }) {
  const { open } = useModalState("CareersForm");

  const title = data?.title || "Join Our Team of Expert Technicians";
  const subTitle =
    data?.subTitle ||
    "We are always looking for skilled, reliable professionals. Flexible schedule, competitive pay, and a supportive team. Complete our short 3-minute application.";
  const buttonText = data?.buttonText || "Apply Now";

  return (
    <section className="block">
      <header className={styles.header}>
        <h2 className="blockHeading"><Text text={title} cityContext={cityContext} /></h2>
        <p className="subText"><Text text={subTitle} cityContext={cityContext} /></p>
      </header>
      <div className={styles.buttonWrapper}>
        <Button variant="primary" onClick={() => open()} size="big">
          {buttonText}
        </Button>
      </div>
    </section>
  );
}

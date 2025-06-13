"use client"

import { useModalState } from "@/providers/ModalProvider";
import styles from "./BestQuoteModal.module.css";
import Modal from "@/ui/Modal";
import ProgressSection from "./components/ProgressSection";
import FormOption from "./components/FormOption";

const BestQuoteModal = () => {
  const {isOpen, close} = useModalState('BestQuote');

  // Example state for progress
  const currentProgressStep = 2; // This would change based on user interaction

  return (
    <Modal isOpen={isOpen} onClose={close}>
        <div className={styles.bestQuote}>
            <aside className={styles.servicesContainer}>
                <div className={styles.banner}>
                    <p className={styles.saleText}>
                        Get $30 off when you book your TV mounting online
                    </p>
                    <p className={styles.saleSize}>
                        $30
                    </p>
                </div>
                <div className={styles.quoteSummary}>
                    <h3 className={styles.titleSummary}>TV Mounting</h3>
                </div>
                <div className={styles.footerSummary}>
                    <p>* Free TV dismount included with orders over $200</p>
                    <p>** Free Above-Fireplace TV Mounting</p>
                    <p className={styles.subSummaryText}>Prices shown are estimates. Final cost will be confirmed by your technician.</p>
                </div>
            </aside>
            <main className={styles.bestQuoteMain}>
                <h2 className={styles.bestQuoteTitle}>What size is your TV?</h2>
                <div className={styles.progressContainer}>
                    <ProgressSection
                        currentStep={currentProgressStep === 1 ? 1 : 0}
                        totalSteps={1}
                        status={currentProgressStep === 1 ? "current" : "completed"}
                        label="What size is your TV?"
                    />
                    <ProgressSection
                        currentStep={currentProgressStep >= 2 ? 1 : 0}
                        totalSteps={2}
                        status={currentProgressStep === 2 ? "current" : (currentProgressStep > 2 ? "completed" : "next")}
                        label="Mounting type"
                    />
                    <ProgressSection
                        currentStep={currentProgressStep === 3 ? 1 : 0}
                        totalSteps={1}
                        status={currentProgressStep === 3 ? "current" : (currentProgressStep > 3 ? "completed" : "next")}
                        label="Summary"
                    />
                </div>
                <div className={styles.formWrapper}>
                    <FormOption label="Up to 31”" subLabel="$69" enableCounter={true} checked onChange={() => 1}/>
                </div>
            </main>
        </div>
    </Modal>
  );
};

export default BestQuoteModal; 
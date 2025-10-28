import React from 'react';
import Link from 'next/link';
import styles from './PriceSummary.module.css';
import Button from '@/ui/Button';

const PriceSummary = ({ totalPrice, structuredCostBreakdown, currentStepIndex, isFormValid, onSubmit, darkMode = false }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderBreakdownItem = (item) => (
    <div key={item.label} className={styles.breakdownItem}>
      <span className={styles.itemLabel}><span className={styles.itemLabel1x}>1x</span>{item.label}</span>
      <span className={styles.itemCost}>{item.cost === 0 ? "Free" : formatCurrency(item.cost)}</span>
    </div>
  );

  return (
    <div className={`${styles.priceSummaryContainer} ${currentStepIndex === 3 ? styles.lastStep : ''} ${darkMode ? styles.darkMode : ''}`}>
      <div className={styles.scrollableContent}>
        {!structuredCostBreakdown.filter(({type}) => type !== "discount").length && 
          <div className={styles.tvSizeGroup}>
              <h4 className={styles.tvSizeTitle}>--</h4>
              <div className={styles.breakdownList}>
                  <div className={styles.breakdownItem}>
                      <span className={styles.itemLabel}>--</span>
                  </div>
              </div>
          </div>
        }
        {structuredCostBreakdown.map((group, index) => {
          if (group.type === "tvSize") {
            return (
              <div key={index} className={styles.tvSizeGroup}>
                <div className={styles.breakdownList}>
                  {group.items.map(item => renderBreakdownItem(item))}
                </div>
              </div>
            );
          } else if (group.type !== "tvSize" && group.type !== "discount") {
            return (
              <div key={index} className={styles.addonsGroup}>
                <div className={styles.breakdownList}>
                  {group.items.map(item => renderBreakdownItem(item))}
                </div>
              </div>
            );
          } else if (group.type === "discount") {
            return (
              <div key={index} className={styles.discountGroup}>
                <div className={styles.breakdownList}>
                  {group.items.map(item => (
                    <div key={item.label} className={styles.breakdownItem}>
                      <span className={styles.itemLabel}>{item.label}</span>
                      <span className={`${styles.itemCost} ${styles.discountCost}`}>{item.cost === 0 ? "Free" : formatCurrency(item.cost)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className={styles.estimatedTotal}>
        <span className={styles.estimatedLabel}>Subtotal</span>
        <span className={styles.totalAmount}>{formatCurrency(totalPrice)}</span>
      </div>
      {currentStepIndex === 3 && (
        <>
          <Button className={styles.bookBtn} disabled={!isFormValid} onClick={onSubmit} size="big">
            Book
          </Button>
          <p className={styles.termsText}>
            By booking an appointment you agree to the <br/><Link href="/terms">Terms of Service</Link> and the <Link href="/privacy-policy">Privacy Policy</Link>.
          </p>
        </>
      )}
    </div>
  );
};

export default PriceSummary; 
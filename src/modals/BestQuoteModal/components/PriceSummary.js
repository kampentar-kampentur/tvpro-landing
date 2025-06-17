import React from 'react';
import styles from './PriceSummary.module.css';

const PriceSummary = ({ totalPrice, structuredCostBreakdown }) => {
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
      <span className={styles.itemLabel}>{item.label}</span>
      <span className={styles.itemCost}>{item.cost === 0 ? "Free" : formatCurrency(item.cost)}</span>
    </div>
  );

  return (
    <div className={styles.priceSummaryContainer}>
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
                <h4 className={styles.tvSizeTitle}>{group.label}</h4>
                <div className={styles.breakdownList}>
                  {group.items.map(item => renderBreakdownItem(item))}
                </div>
              </div>
            );
          } else if (group.type !== "tvSize" && group.type !== "discount") {
            return (
              <div key={index} className={styles.addonsGroup}>
                <h4 className={styles.groupTitle}>{group.label}</h4>
                <div className={styles.breakdownList}>
                  {group.items.map(item => renderBreakdownItem(item))}
                </div>
              </div>
            );
          } else if (group.type === "discount") {
            return (
              <div key={index} className={styles.discountGroup}>
                <h4 className={styles.groupTitle}>{group.label}</h4>
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
        <span className={styles.estimatedLabel}>Estimated</span>
        <span className={styles.totalAmount}>{formatCurrency(totalPrice)}</span>
      </div>
    </div>
  );
};

export default PriceSummary; 
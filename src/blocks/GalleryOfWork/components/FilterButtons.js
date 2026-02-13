"use client"
import React, { useState } from "react";
import styles from "./FilterButtons.module.css";
import Button from "@/ui/Button";

const FilterButtons = ({ filters, onChange, activeFilter }) => {
  const handleFilterClick = (filter) => {
    onChange(filter);
  };

  return (
    <div className={styles.filterButtonsContainer}>
      {filters.map((filter) => (
        <Button
          key={filter.type}
          variant="secondary"
          size="small"
          className={`${styles.filterButton} ${activeFilter === filter.type ? styles.active : ''}`}
          onClick={() => handleFilterClick(filter.type)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default FilterButtons; 
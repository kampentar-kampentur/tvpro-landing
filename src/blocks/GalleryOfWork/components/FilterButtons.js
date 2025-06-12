import React, { useState } from "react";
import styles from "./FilterButtons.module.css";
import Button from "@/ui/Button";

const FilterButtons = () => {
  const filters = [
    "Frame TV",
    "Hide Wires",
    "Home Theater Systems",
    "Fireplace",
    "Soundbar",
    "Storm Shell",
    "Video Wall",
    "Hard Surface",
    "Commercial Projects",
  ];

  const [activeFilter, setActiveFilter] = useState(filters[0]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className={styles.filterButtonsContainer}>
      {filters.map((filter) => (
        <Button
          key={filter}
          variant="secondary"
          size="small"
          className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
          onClick={() => handleFilterClick(filter)}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
};

export default FilterButtons; 
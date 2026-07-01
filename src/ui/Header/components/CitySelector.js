"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCTA } from "@/providers/CTAProvider";
import styles from "./CitySelector.module.css";

function PinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}

export default function CitySelector() {
  const pathname = usePathname();
  const [cities, setCities] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const wrapperRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function loadCities() {
      try {
        const strapiUrl = process.env.NEXT_PUBLIC_SRTAPI_URL;
        if (!strapiUrl) {
          setLoading(false);
          return;
        }
        const response = await fetch(
          `${strapiUrl}/api/cities?filters[metro_city_slug][$null]=true&pagination[pageSize]=100`,
          { headers: { "Content-Type": "application/json" } },
        );
        if (!response.ok) {
          setLoading(false);
          return;
        }
        const json = await response.json();
        const list = (json.data || [])
          .map((item) => ({
            name: item.attributes?.city_name || item.city_name,
            state: item.attributes?.state_code || item.state_code,
            path: item.attributes?.path || item.path,
          }))
          .filter((c) => c.name && c.path);
        if (!cancelled) {
          setCities(list);
        }
      } catch (e) {
        console.warn("CitySelector: failed to load cities:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadCities();
    return () => {
      cancelled = true;
    };
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cta = useCTA();
  const currentCityName = cta?.cityName || "";
  const firstSegment = cta?.citySlug || "";

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select city"
      >
        <span className={styles.pinIcon} aria-hidden="true">
          <PinIcon />
        </span>
        <span className={styles.triggerLabel}>
          {currentCityName || "Select Location"}
        </span>
        <span
          className={`${styles.caret} ${open ? styles.caretOpen : ""}`}
          aria-hidden="true"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>

      {open && (
        <div className={styles.dropdown} role="listbox">
          {loading && <div className={styles.state}>Loading cities...</div>}
          {!loading && cities.length === 0 && (
            <div className={styles.state}>No cities available</div>
          )}
          {!loading && cities.length > 0 && (
            <ul className={styles.list}>
              {cities.map((city) => {
                const isActive = firstSegment === city.path;
                return (
                  <li key={city.path}>
                    <Link
                      href={`/${city.path}/`}
                      className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
                      onClick={() => setOpen(false)}
                    >
                      <span className={styles.itemPin} aria-hidden="true">
                        <PinIcon />
                      </span>
                      <span>
                        {city.name}
                        {city.state ? `, ${city.state}` : ""}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

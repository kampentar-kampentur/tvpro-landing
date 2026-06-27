"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCTA } from "@/providers/CTAProvider";
import { blogPosts } from "@/lib/blog-data";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const cta = useCTA();
  const pathname = usePathname();
  const isBlog = pathname && pathname.startsWith("/blog");
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [cities, setCities] = useState([]);

  const slugify = (text) => {
    return text.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
  };

  useEffect(() => {
    if (!isBlog) return;
    const fetchCategories = async () => {
      try {
        const strapiUrl = process.env.NEXT_PUBLIC_SRTAPI_URL;
        if (!strapiUrl) return;
        const res = await fetch(
          `${strapiUrl}/api/blog-posts?fields[0]=category&pagination[pageSize]=100`,
          {
            headers: { "Content-Type": "application/json" },
          },
        );
        if (res.ok) {
          const json = await res.json();
          // Flatten Strapi v4 response structure
          const cats = (json.data || [])
            .map((item) => {
              return item.attributes?.category || item.category;
            })
            .filter(Boolean);
          setDynamicCategories(cats);
        }
      } catch (e) {
        console.warn("Failed to fetch dynamic categories for navbar:", e);
      }
    };
    fetchCategories();
  }, [isBlog]);

  // Fetch main cities for the mobile "Our Locations" accordion
  useEffect(() => {
    if (isBlog) return;
    let cancelled = false;
    const fetchCities = async () => {
      try {
        const strapiUrl = process.env.NEXT_PUBLIC_SRTAPI_URL;
        if (!strapiUrl) return;
        const response = await fetch(
          `${strapiUrl}/api/cities?filters[metro_city_slug][$null]=true&pagination[pageSize]=100`,
          {
            headers: { "Content-Type": "application/json" },
          },
        );
        if (!response.ok) return;
        const json = await response.json();
        const list = (json.data || [])
          .map((item) => ({
            name: item.attributes?.city_name || item.city_name,
            state: item.attributes?.state_code || item.state_code,
            path: item.attributes?.path || item.path,
          }))
          .filter((c) => c.name && c.path);
        if (!cancelled) setCities(list);
      } catch (e) {
        console.warn("Failed to fetch cities for navbar:", e);
      }
    };
    fetchCities();
    return () => {
      cancelled = true;
    };
  }, [isBlog]);

  // Calculate dropdown categories
  const mainSlugs = ["news", "reviews", "tips-and-tricks"];

  // Combine mock categories and dynamic ones
  const allCategories = [
    ...new Set(
      [...blogPosts.map((p) => p.category), ...dynamicCategories].filter(
        Boolean,
      ),
    ),
  ];

  const dropdownCategories = allCategories.filter(
    (cat) => !mainSlugs.includes(slugify(cat)),
  );

  const getCategoryCount = (cat) => {
    const dynamicCount = dynamicCategories.filter((c) => c === cat).length;
    if (dynamicCount > 0) return dynamicCount;
    return blogPosts.filter((p) => p.category === cat).length;
  };

  if (isBlog) {
    return (
      <div className={styles.navbarWrapper}>
        <nav className={styles.navbar} aria-label="Blog Navigation">
          <ul className={styles.navLinks}>
            <li>
              <Link href="/">Main Site</Link>
            </li>
            <li>
              <Link href="/blog/">Blog Home</Link>
            </li>
            <li>
              <Link href="/blog/category/news/">News</Link>
            </li>
            <li>
              <Link href="/blog/category/reviews/">Reviews</Link>
            </li>
            <li>
              <Link href="/blog/category/tips-and-tricks/">Tips & Tricks</Link>
            </li>
            {dropdownCategories.length > 0 && (
              <li className={styles.dropdownLi}>
                <span
                  className={styles.dropdownTrigger}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileCategoriesOpen(!mobileCategoriesOpen);
                  }}
                >
                  Categories{" "}
                  <span
                    className={`${styles.arrow} ${mobileCategoriesOpen ? styles.arrowRotate : ""}`}
                  >
                    ▼
                  </span>
                </span>
                <div
                  className={`${styles.dropdownMenu} ${mobileCategoriesOpen ? styles.dropdownMenuMobileOpen : ""}`}
                >
                  {dropdownCategories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/blog/category/${slugify(cat)}/`}
                      className={styles.dropdownItem}
                    >
                      {cat}{" "}
                      <span className={styles.count}>
                        ({getCategoryCount(cat)})
                      </span>
                    </Link>
                  ))}
                </div>
              </li>
            )}
          </ul>
        </nav>
      </div>
    );
  }

  return (
    <div className={styles.navbarWrapper}>
      <nav className={styles.navbar} aria-label="Main Navigation">
        <ul className={styles.navLinks}>
          <li>
            <Link href={cta?.homeLink || "/"}>Home</Link>
          </li>
          <li>
            <Link href="/#services">Services</Link>
          </li>
          <li>
            <Link href="/#reviews">Reviews</Link>
          </li>
          <li>
            <Link href="/#gallery">Gallery</Link>
          </li>
          <li>
            <Link href="/#team">Our Team</Link>
          </li>
          <li>
            <Link href="/#about">About Us</Link>
          </li>
          <li>
            <Link href="/blog/">Blog</Link>
          </li>
          <li>
            <Link href="/#faq">FAQ</Link>
          </li>
          <li>
            <Link href="/#contact">Contact</Link>
          </li>
          {cities.length > 0 && (
            <li className={`${styles.dropdownLi} ${styles.locationsDropdown}`}>
              <span
                className={styles.dropdownTrigger}
                onClick={(e) => {
                  e.stopPropagation();
                  setCitiesOpen(!citiesOpen);
                }}
              >
                <span className={styles.cityPinIcon} aria-hidden="true">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </span>
                Our Locations{" "}
                <span
                  className={`${styles.arrow} ${citiesOpen ? styles.arrowRotate : ""}`}
                >
                  ▼
                </span>
              </span>
              <div
                className={`${styles.dropdownMenu} ${citiesOpen ? styles.dropdownMenuMobileOpen : ""}`}
              >
                {cities.map((city) => (
                  <Link
                    key={city.path}
                    href={`/${city.path}/`}
                    className={styles.dropdownItem}
                  >
                    {city.name}
                    {city.state ? `, ${city.state}` : ""}
                  </Link>
                ))}
              </div>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

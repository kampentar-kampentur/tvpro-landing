"use client";

import React, { useState } from "react";
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

  const slugify = (text) => {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
  };

  // Calculate dropdown categories
  const mainSlugs = ["news", "reviews", "tips-tricks"];
  const allCategories = [...new Set(blogPosts.map(p => p.category).filter(Boolean))];
  const dropdownCategories = allCategories.filter(cat => !mainSlugs.includes(slugify(cat)));

  const getCategoryCount = (cat) => {
    return blogPosts.filter(p => p.category === cat).length;
  };

  if (isBlog) {
    return (
      <div className={styles.navbarWrapper}>
        <nav className={styles.navbar} aria-label="Blog Navigation">
          <ul className={styles.navLinks}>
            <li><Link href="/">Main Site</Link></li>
            <li><Link href="/blog/">Blog Home</Link></li>
            <li><Link href="/blog/category/news/">News</Link></li>
            <li><Link href="/blog/category/reviews/">Reviews</Link></li>
            <li><Link href="/blog/category/tips-tricks/">Tips & Tricks</Link></li>
            {dropdownCategories.length > 0 && (
              <li className={styles.dropdownLi}>
                <span 
                  className={styles.dropdownTrigger}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileCategoriesOpen(!mobileCategoriesOpen);
                  }}
                >
                  Categories <span className={`${styles.arrow} ${mobileCategoriesOpen ? styles.arrowRotate : ""}`}>▼</span>
                </span>
                <div className={`${styles.dropdownMenu} ${mobileCategoriesOpen ? styles.dropdownMenuMobileOpen : ""}`}>
                  {dropdownCategories.map(cat => (
                    <Link 
                      key={cat} 
                      href={`/blog/category/${slugify(cat)}/`}
                      className={styles.dropdownItem}
                    >
                      {cat} <span className={styles.count}>({getCategoryCount(cat)})</span>
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
          <li><Link href={cta?.homeLink || "/"}>Home</Link></li>
          <li><Link href="/#services">Services</Link></li>
          <li><Link href="/#reviews">Reviews</Link></li>
          <li><Link href="/#gallery">Gallery</Link></li>
          <li><Link href="/#team">Our Team</Link></li>
          <li><Link href="/#about">About Us</Link></li>
          <li><Link href="/blog/">Blog</Link></li>
          <li><Link href="/#faq">FAQ</Link></li>
          <li><Link href="/#contact">Contact</Link></li>
        </ul>
      </nav>
    </div>
  );
}

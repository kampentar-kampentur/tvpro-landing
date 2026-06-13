"use client";

import React, { useState } from "react";
import Link from "next/link";
import { categories, blogPosts } from "@/lib/blog-data";
import Button from "@/ui/Button";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import SEOBreadcrumbs from "@/ui/SEOBreadcrumbs/SEOBreadcrumbs";
import styles from "./blog.module.css";

export default function BlogClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = activeCategory === "All"
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  // We consider the featured post to be the one marked featured.
  // We'll show the featured card layout only when the "All" category is selected and we have a featured post.
  const featuredPost = blogPosts.find(post => post.featured);
  const showFeatured = activeCategory === "All" && featuredPost;

  // The grid posts are either all posts except the featured one (if shown), or the filtered posts.
  const gridPosts = showFeatured
    ? filteredPosts.filter(post => post.id !== featuredPost.id)
    : filteredPosts;

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog/" }
  ];

  return (
    <div className={styles.blogPage}>
      {/* Breadcrumbs */}
      <SEOBreadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <header className={`block ${styles.blogHeader}`}>
        <h1 className={`blockHeading ${styles.title}`}>TVPro Handy Insights & Guides</h1>
        <p className={`subText ${styles.subtitle}`}>
          Expert tips, installation guides, and smart home advice from our certified technicians.
        </p>
      </header>

      {/* Categories Filter */}
      <div className={`block ${styles.filterContainer}`} style={{ paddingTop: 0, paddingBottom: 0 }}>
        {categories.map((category) => (
          <Button
            key={category}
            variant="secondary"
            size="small"
            onClick={() => setActiveCategory(category)}
            className={`${styles.filterChip} ${
              activeCategory === category ? styles.activeFilter : ""
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Featured Post */}
      {showFeatured && (
        <section className={`block ${styles.featuredSection}`}>
          <div className={styles.featuredCard}>
            <div className={styles.featuredImageWrapper}>
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className={styles.featuredImage}
                loading="eager"
              />
            </div>
            <div className={styles.featuredContent}>
              <div className={styles.meta}>
                <span className={styles.categoryBadge}>{featuredPost.category}</span>
                <span>&bull;</span>
                <span>{featuredPost.date}</span>
                <span>&bull;</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
              <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
              
              <div className={styles.authorContainer}>
                <img
                  src={featuredPost.author.avatar}
                  alt={featuredPost.author.name}
                  className={styles.authorAvatar}
                />
                <div>
                  <div className={styles.authorName}>{featuredPost.author.name}</div>
                  <div className={styles.authorRole}>{featuredPost.author.role}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid of Posts */}
      <section className={`block ${styles.gridSection}`}>
        {gridPosts.length > 0 ? (
          <div className={styles.grid}>
            {gridPosts.map((post) => (
              <article key={post.id} className={styles.card}>
                <div className={styles.cardImageWrapper}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className={styles.cardImage}
                    loading="lazy"
                  />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.meta}>
                    <span className={styles.categoryBadge}>{post.category}</span>
                    <span>&bull;</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  
                  <div className={styles.meta} style={{ marginTop: "auto", marginBottom: 0, paddingTop: "12px" }}>
                    <span>By {post.author.name}</span>
                    <span>&bull;</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--gray)" }}>
            No articles found in this category.
          </div>
        )}
      </section>

      {/* CTA Bottom Section */}
      <div className={styles.ctaWrapper}>
        <div className={styles.ctaBlock}>
          <h2 className={styles.ctaHeading}>Ready to Upgrade Your Home Theater?</h2>
          <p className={styles.ctaDescription}>
            Get professional mounting and setup services from our highly-rated technicians today.
          </p>
          <QuoteButton size="big" modalName="BookNow">
            Get The Best Quote
          </QuoteButton>
        </div>
      </div>
    </div>
  );
}

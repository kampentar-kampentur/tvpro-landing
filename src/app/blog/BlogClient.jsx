"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { categories, blogPosts } from "@/lib/blog-data";
import Button from "@/ui/Button";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import SEOBreadcrumbs from "@/ui/SEOBreadcrumbs/SEOBreadcrumbs";
import styles from "./blog.module.css";

export default function BlogClient({ initialPosts = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get("q") : "";

  const [activeCategory, setActiveCategory] = useState("All");
  const [reSearchVal, setReSearchVal] = useState("");

  // Update re-search input when query changes
  useEffect(() => {
    if (query) {
      setReSearchVal(query);
    }
  }, [query]);

  // Merge Strapi and Mock posts
  const posts = [...initialPosts];
  for (const mock of blogPosts) {
    if (!posts.find(p => p.slug === mock.slug)) {
      posts.push(mock);
    }
  }

  // Generate categories dynamically
  const categoriesList = ["All", ...new Set(posts.map(post => post.category).filter(Boolean))];

  // Filtering logic
  let filteredPosts = [];
  if (query) {
    const qLower = query.toLowerCase();
    filteredPosts = posts.filter(post => 
      post.title.toLowerCase().includes(qLower) || 
      post.excerpt.toLowerCase().includes(qLower)
    );
  } else {
    filteredPosts = activeCategory === "All"
      ? posts
      : posts.filter(post => post.category === activeCategory);
  }

  // Featured post logic (only when not searching and on "All" category)
  const featuredPost = posts.find(post => post.featured);
  const showFeatured = !query && activeCategory === "All" && featuredPost;

  const gridPosts = showFeatured
    ? filteredPosts.filter(post => post.id !== featuredPost.id)
    : filteredPosts;

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog/" }
  ];

  if (query) {
    breadcrumbItems.push({ name: `Search: ${query}`, url: `/blog/?q=${encodeURIComponent(query)}` });
  }

  const handleReSearchSubmit = (e) => {
    e.preventDefault();
    if (reSearchVal.trim()) {
      router.push(`/blog/?q=${encodeURIComponent(reSearchVal.trim())}`);
    }
  };

  // Fallback recommended articles (top 3 posts)
  const recommendedPosts = posts.slice(0, 3);

  return (
    <div className={styles.blogPage}>
      {/* Inject noindex dynamically when in search mode to prevent Google index bloating */}
      {query && <meta name="robots" content="noindex, follow" />}

      {/* Breadcrumbs */}
      <SEOBreadcrumbs items={breadcrumbItems} />

      {/* Header */}
      {query ? (
        <header className={`block ${styles.blogHeader}`}>
          <h1 className={`blockHeading ${styles.title}`}>Search Results for "{query}"</h1>
          <p className={`subText ${styles.subtitle}`}>
            Found {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"} matching your query.
          </p>
        </header>
      ) : (
        <header className={`block ${styles.blogHeader}`}>
          <h1 className={`blockHeading ${styles.title}`}>TVPro Handy Insights & Guides</h1>
          <p className={`subText ${styles.subtitle}`}>
            Expert tips, installation guides, and smart home advice from our certified technicians.
          </p>
        </header>
      )}

      {/* Categories Filter (Hidden during active search) */}
      {!query && (
        <div className={`block ${styles.filterContainer}`} style={{ paddingTop: 0, paddingBottom: 0 }}>
          {categoriesList.map((category) => (
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
      )}

      {/* Featured Post */}
      {showFeatured && (
        <section className={`block ${styles.featuredSection}`}>
          <Link href={`/blog/${featuredPost.slug}/`} className={styles.featuredCard}>
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
          </Link>
        </section>
      )}

      {/* Grid of Posts */}
      <section className={`block ${styles.gridSection}`}>
        {gridPosts.length > 0 ? (
          <div className={styles.grid}>
            {gridPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}/`}
                className={styles.card}
                aria-label={`Read article: ${post.title}`}
              >
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
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.noResultsContainer}>
            <p className={styles.noResultsText}>
              Sorry, we couldn't find any articles matching "{query}".
            </p>
            <form onSubmit={handleReSearchSubmit} className={styles.reSearchForm}>
              <input 
                type="text" 
                placeholder="Try search another term..." 
                value={reSearchVal}
                onChange={(e) => setReSearchVal(e.target.value)}
                className={styles.reSearchInput}
              />
              <Button type="submit" variant="primary">Search</Button>
            </form>
            
            {/* Recommended Articles Section */}
            <div className={styles.recommendedWrapper}>
              <h3 className={styles.recommendedTitle}>Recommended Articles</h3>
              <div className={styles.recommendedGrid}>
                {recommendedPosts.map((post) => (
                  <Link 
                    key={post.slug} 
                    href={`/blog/${post.slug}/`}
                    className={styles.recommendedCard}
                  >
                    <img src={post.image} alt={post.title} className={styles.recommendedImage} />
                    <div className={styles.recommendedCardContent}>
                      <span className={styles.categoryBadge}>{post.category}</span>
                      <h4 className={styles.recommendedCardTitle}>{post.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* CTA Bottom Section */}
      <div className={`block ${styles.ctaWrapper}`} style={{ paddingTop: 0 }}>
        <p className={styles.ctaText}>
          Ready to upgrade your home theater? Book your service with our certified specialists.
        </p>
        <QuoteButton size="big" modalName="BookNow">
          Get The Best Quote
        </QuoteButton>
      </div>
    </div>
  );
}

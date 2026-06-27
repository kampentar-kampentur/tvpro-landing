"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Header.module.css";
import Navbar from "./components/Navbar";
import Button from "@/ui/Button";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import buttonStyles from "@/ui/Button/Button.module.css";
import MenuAutoClose from "./MenuAutoClose";
import CitySelector from "./components/CitySelector";
import PhoneIcon from "@/assets/icons/phone.svg";
import { useCTA } from "@/providers/CTAProvider";
import { blogPosts } from "@/lib/blog-data";

export default function HeaderActions({ isBlog, isHome }) {
  const cta = useCTA();
  const router = useRouter();

  // Search & Autocomplete state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const searchRef = useRef(null);

  // Debounced autocomplete query directly to Strapi
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      setSearchLoading(false);
      setSearchError(null);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const strapiUrl = process.env.NEXT_PUBLIC_SRTAPI_URL;
        if (!strapiUrl) {
          throw new Error(
            "NEXT_PUBLIC_SRTAPI_URL environment variable is not defined",
          );
        }
        const qLower = searchQuery.trim();

        const queryParts = [
          `filters[$or][0][title][$containsi]=${encodeURIComponent(qLower)}`,
          `filters[$or][1][excerpt][$containsi]=${encodeURIComponent(qLower)}`,
          `filters[$or][2][content][$containsi]=${encodeURIComponent(qLower)}`,
          `filters[$or][3][category][$containsi]=${encodeURIComponent(qLower)}`,
          "populate[0]=cover&populate[1]=author",
          "pagination[pageSize]=5",
        ];

        const queryString = queryParts.join("&");
        const response = await fetch(
          `${strapiUrl}/api/blog-posts?${queryString}`,
          {
            headers: { "Content-Type": "application/json" },
          },
        );

        if (response.ok) {
          const resJson = await response.json();

          const flatten = (data) => {
            if (!data) return null;
            if (Array.isArray(data)) return data.map(flatten);
            const { id, attributes, ...rest } = data;
            return { id, ...attributes, ...rest };
          };

          const strapiPosts = flatten(resJson.data) || [];
          const normalized = strapiPosts.map((post) => {
            const formattedDate = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "";

            let imgUrl = "/blog-placeholder.jpg";
            if (post.cover?.url) {
              const url = post.cover.url;
              imgUrl = url.startsWith("http") ? url : `${strapiUrl}${url}`;
            }

            return {
              id: post.id || post.slug,
              slug: post.slug,
              title: post.title,
              excerpt: post.excerpt || "",
              category: post.category || "General",
              date: formattedDate || post.date || "",
              readTime: post.readTime
                ? `${post.readTime} min read`
                : "5 min read",
              image: imgUrl,
              author: {
                name: post.author?.name || "TVPro Specialist",
                role: post.author?.role || "Certified Installer",
              },
            };
          });

          setSuggestions(normalized);
        } else {
          throw new Error(`Search API returned status ${response.status}`);
        }
      } catch (err) {
        console.error("Autocomplete search fetch failed:", err);
        setSearchError(err.message || "Failed to load results");
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog/?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSuggestions([]);
      setSearchQuery("");
    }
  };

  return (
    <>
      <input type="checkbox" id="menu-toggle" className={styles.menuToggle} />
      <Navbar />
      <MenuAutoClose
        menuToggleId="menu-toggle"
        menuWrapperClass="navbarWrapper"
      />
      <div className={styles.cta}>
        {isBlog && (
          <div className={styles.blogWidgets}>
            {/* Search Bar Container */}
            <div
              ref={searchRef}
              className={`${styles.searchContainer} ${searchOpen ? styles.searchOpen : ""}`}
            >
              <form
                onSubmit={handleSearchSubmit}
                className={`${styles.searchForm} ${searchOpen ? styles.searchFormExpanded : ""}`}
              >
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  onFocus={() => setSearchOpen(true)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSuggestions([]);
                    }}
                    className={styles.searchClearBtn}
                    aria-label="Clear Search Input"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  className={styles.searchSubmitBtn}
                  aria-label="Submit Search"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </form>

              {!searchOpen && (
                <button
                  onClick={() => setSearchOpen(true)}
                  className={styles.searchIconBtn}
                  aria-label="Open Search"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              )}

              {/* Dropdown Suggestions Card */}
              {searchOpen && searchQuery.trim().length >= 3 && (
                <div className={styles.searchSuggestionsCard}>
                  {searchLoading && (
                    <div className={styles.suggestionsState}>
                      <div className={styles.suggestionsSpinner}></div>
                      <span>Searching articles...</span>
                    </div>
                  )}

                  {searchError && (
                    <div
                      className={`${styles.suggestionsState} ${styles.suggestionsStateError}`}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginBottom: "4px" }}
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <span>Connection to database failed</span>
                    </div>
                  )}

                  {!searchLoading &&
                    !searchError &&
                    suggestions.length === 0 && (
                      <div className={styles.suggestionsState}>
                        <span>
                          No articles found matching &quot;{searchQuery}&quot;
                        </span>
                      </div>
                    )}

                  {!searchLoading && !searchError && suggestions.length > 0 && (
                    <>
                      <div className={styles.suggestionsHeader}>
                        Suggestions
                      </div>
                      <ul className={styles.suggestionsList}>
                        {suggestions.map((post) => (
                          <li key={post.slug} className={styles.suggestionItem}>
                            <Link
                              href={`/blog/${post.slug}/`}
                              onClick={() => {
                                setSearchOpen(false);
                                setSearchQuery("");
                                setSuggestions([]);
                              }}
                              className={styles.suggestionLink}
                            >
                              <span className={styles.suggestionCategory}>
                                {post.category}
                              </span>
                              <span className={styles.suggestionTitle}>
                                {post.title}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className={styles.suggestionsFooter}>
                        <button
                          type="button"
                          onClick={(e) => {
                            handleSearchSubmit(e);
                          }}
                          className={styles.seeAllBtn}
                        >
                          See all results for &quot;{searchQuery}&quot;
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {isHome && <CitySelector />}
        <span className={styles.hours}>
          {cta?.workHours || "Mon-Sun 7:00 AM - 10:00 PM"}
        </span>
        <Button
          variant="secondary"
          size="small"
          href={`tel:${cta?.phone || "(877) 455-5535"}`}
          className={styles.phoneMobileHide}
        >
          {cta?.phoneLabel || "Call Us"}
        </Button>
        <QuoteButton size="small" modalName="BookNow">
          Book Now
        </QuoteButton>
        <label
          htmlFor="menu-toggle"
          className={`${styles.menuButton} ${styles.menuLabel} ${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.small}`}
        >
          <span className={styles.hamburger}>
            <span className={styles.line}></span>
            <span className={styles.line}></span>
            <span className={styles.line}></span>
          </span>
          <span className="sr-only">Menu</span>
        </label>
      </div>
      <Button
        className={styles.phoneButton}
        href={`tel:${cta?.phone || "(877) 455-5535"}`}
      >
        <PhoneIcon width="24" height="24" style={{ fill: "currentColor" }} />
        <span className="visually-hidden">
          Telephones to TVPro Handy Services
        </span>
      </Button>
    </>
  );
}

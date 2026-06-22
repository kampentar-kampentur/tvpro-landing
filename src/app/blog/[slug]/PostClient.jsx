"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SEOBreadcrumbs from "@/ui/SEOBreadcrumbs/SEOBreadcrumbs";
import RichTextRenderer from "@/ui/RichTextRenderer/RichTextRenderer";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import ImageWrapper from "@/ui/ImageWrapper/ImageWrapper";
import styles from "./post.module.css";

const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <svg 
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill={filled ? "var(--green)" : "none"}
        stroke={filled ? "var(--green)" : "var(--gray-light)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ cursor: "pointer", transition: "color 0.2s, fill 0.2s, transform 0.1s" }}
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

export default function PostClient({ post, coverUrl, coverMedia, avatarUrl, avatarMedia, relatedPosts, slug, cities = [] }) {
    const defaultCities = [
        { name: "Chicago", state: "IL", path: "chicago" },
        { name: "Houston", state: "TX", path: "houston" },
        { name: "Dallas", state: "TX", path: "dallas" },
        { name: "Miami", state: "FL", path: "miami" },
        { name: "Austin", state: "TX", path: "austin" },
        { name: "Charlotte", state: "NC", path: "charlotte" }
    ];
    const displayCities = cities && cities.length > 0 ? cities : defaultCities;
    const [scrollProgress, setScrollProgress] = useState(0);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedRating = localStorage.getItem(`blog_rated_${slug}`);
            if (savedRating) {
                setRating(parseInt(savedRating, 10));
                setHasVoted(true);
            }
        }
    }, [slug]);

    const handleRatingClick = (val) => {
        if (hasVoted) return;
        setRating(val);
        setHasVoted(true);
        if (typeof window !== "undefined") {
            localStorage.setItem(`blog_rated_${slug}`, val.toString());
            console.log(`User rated blog post "${slug}" with ${val} stars.`);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
            const clientHeight = document.documentElement.clientHeight || window.innerHeight || 0;

            const totalScroll = scrollHeight - clientHeight;
            if (totalScroll > 0) {
                const percentage = (scrollTop / totalScroll) * 100;
                setScrollProgress(Math.min(100, Math.max(0, percentage)));
            } else {
                setScrollProgress(0);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll, { passive: true });
        
        // Run once on load
        handleScroll();

        // Fallback to let dynamic heights render
        const timer = setTimeout(handleScroll, 200);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
            clearTimeout(timer);
        };
    }, []);

    const breadcrumbItems = [
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog/" },
        { name: post.title, url: `/blog/${slug}/` },
    ];

    // Parse H2 and H3 headings for the Table of Contents (TOC)
    const headings = React.useMemo(() => {
        const list = [];
        if (post && Array.isArray(post.content)) {
            post.content.forEach((node) => {
                if (node.type === "heading" && (node.level === 2 || node.level === 3)) {
                    const text = node.children?.map(c => c.text).join("") || "";
                    const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-")
                        .trim();
                    if (text && id) {
                        list.push({ id, text, level: node.level });
                    }
                }
            });
        }
        return list;
    }, [post]);

    const [activeId, setActiveId] = useState("");
    const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

    // Active heading tracking via IntersectionObserver
    useEffect(() => {
        if (headings.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: "-100px 0px -70% 0px",
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        }, observerOptions);

        headings.forEach((heading) => {
            const el = document.getElementById(heading.id);
            if (el) observer.observe(el);
        });

        return () => {
            headings.forEach((heading) => {
                const el = document.getElementById(heading.id);
                if (el) observer.unobserve(el);
            });
        };
    }, [headings]);

    const handleHeadingClick = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 90; // offset for sticky header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            
            window.history.pushState(null, "", `#${id}`);
            setActiveId(id);
        }
    };

    return (
        <div className={styles.postPage}>
            {/* Circular Scroll Progress Widget */}
            <div className={styles.scrollProgressCircle}>
                <svg width="58" height="58" viewBox="0 0 58 58">
                    {/* Background circle track */}
                    <circle 
                        cx="29" 
                        cy="29" 
                        r="25" 
                        stroke="var(--gray-extra-light)" 
                        strokeWidth="3" 
                        fill="var(--white)" 
                    />
                    {/* Foreground fill circle */}
                    <circle 
                        cx="29" 
                        cy="29" 
                        r="25" 
                        stroke="var(--green)" 
                        strokeWidth="3.5" 
                        fill="transparent"
                        strokeDasharray={157.08}
                        strokeDashoffset={157.08 - (157.08 * scrollProgress) / 100}
                        strokeLinecap="round"
                        transform="rotate(-90 29 29)"
                    />
                </svg>
                <div className={styles.scrollProgressPercent}>
                    {Math.round(scrollProgress)}%
                </div>
            </div>
            {/* Breadcrumbs */}
            <SEOBreadcrumbs items={breadcrumbItems} />

            {/* Cover Image */}
            {coverMedia && (
                <div className={`block ${styles.coverWrapper}`}>
                    <div className={styles.coverInner}>
                        <ImageWrapper
                            media={coverMedia}
                            defaultAlt={post.cover?.alternativeText || post.title}
                            className={styles.coverImage}
                            width={1200}
                            height={675}
                            priority={true}
                        />
                    </div>
                </div>
            )}

            {/* Article Layout */}
            <div className={`block ${styles.articleWrapper}`}>
                {/* Main content column */}
                <article className={styles.mainColumn}>
                    {/* Category + Meta */}
                    <div className={styles.topMeta}>
                        {post.category && (
                            <span className={styles.categoryBadge}>{post.category}</span>
                        )}
                    </div>

                    {/* Mobile Expanded TOC (before heading H1) */}
                    {headings.length > 0 && (
                        <div className={styles.mobileExpandedTocContainer}>
                            <div className={styles.mobileExpandedTocHeading}>Table of Contents</div>
                            <ul className={styles.mobileExpandedTocList}>
                                {headings.map((heading) => (
                                    <li 
                                        key={`exp-${heading.id}`} 
                                        className={`${styles.mobileExpandedTocItem} ${heading.level === 3 ? styles.mobileExpandedTocItemH3 : ""} ${activeId === heading.id ? styles.mobileExpandedTocActive : ""}`}
                                    >
                                        <a 
                                            href={`#${heading.id}`}
                                            onClick={(e) => handleHeadingClick(e, heading.id)}
                                        >
                                            {heading.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* H1 */}
                    <h1 className={styles.postTitle}>{post.title}</h1>

                    {/* Date + Read time + Author (below title) */}
                    <div className={styles.metaRow}>
                        {(post.publishedAt || post.date) && (
                            <span className={styles.metaItem}>
                                {post.publishedAt
                                    ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                                    : post.date}
                            </span>
                        )}
                        {(post.readTime || post.read_time) && (
                            <>
                                <span className={styles.dot}>·</span>
                                <span className={styles.metaItem}>
                                    {typeof (post.readTime || post.read_time) === "number"
                                        ? `${post.readTime || post.read_time} min read`
                                        : post.readTime || post.read_time}
                                </span>
                            </>
                        )}
                        {post.author?.name && (
                            <>
                                <span className={styles.dot}>·</span>
                                <span className={styles.metaItem}>By {post.author.name}</span>
                            </>
                        )}
                    </div>

                    {/* Excerpt (lead) */}
                    {post.excerpt && (
                        <p className={styles.lead}>{post.excerpt}</p>
                    )}

                    {/* Mobile TOC Accordion */}
                    {headings.length > 0 && (
                        <div className={styles.mobileTocContainer}>
                            <button 
                                className={styles.mobileTocButton}
                                onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                                aria-expanded={isMobileTocOpen}
                            >
                                <span>Table of Contents</span>
                                <span className={`${styles.chevron} ${isMobileTocOpen ? styles.chevronOpen : ""}`}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </button>
                            <div className={`${styles.mobileTocCollapse} ${isMobileTocOpen ? styles.mobileTocCollapseOpen : ""}`}>
                                <ul className={styles.mobileTocList}>
                                    {headings.map((heading) => (
                                        <li 
                                            key={heading.id} 
                                            className={`${styles.mobileTocItem} ${heading.level === 3 ? styles.mobileTocItemH3 : ""} ${activeId === heading.id ? styles.mobileTocActive : ""}`}
                                        >
                                            <a 
                                                href={`#${heading.id}`}
                                                onClick={(e) => {
                                                    handleHeadingClick(e, heading.id);
                                                    setIsMobileTocOpen(false);
                                                }}
                                            >
                                                {heading.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Rich Text Body */}
                    {post.content ? (
                        <RichTextRenderer content={post.content} category={post.category} />
                    ) : (
                        <p className={styles.noContent}>Content coming soon.</p>
                    )}

                    {/* Tags */}
                    {Array.isArray(post.tags) && post.tags.length > 0 && (
                        <div className={styles.tagsRow}>
                            {post.tags.map((tag) => (
                                <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                    )}

                    {/* Was This Article Helpful Widget */}
                    <div className={styles.ratingWidget}>
                        {hasVoted ? (
                            <div className={styles.ratingThanks}>
                                <div className={styles.thanksIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className={styles.thanksHeading}>Thank you for your feedback!</h4>
                                    <p className={styles.thanksSub}>You rated this article {rating} out of 5 stars.</p>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.ratingPrompt}>
                                <h4 className={styles.ratingHeading}>Was this article helpful?</h4>
                                <p className={styles.ratingSub}>Your rating helps us improve our content.</p>
                                <div className={styles.starRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <StarIcon 
                                            key={star}
                                            filled={hoverRating ? star <= hoverRating : star <= rating}
                                            onClick={() => handleRatingClick(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </article>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    {/* Sidebar TOC Widget */}
                    {headings.length > 0 && (
                        <div className={`${styles.sideCard} ${styles.tocCard}`}>
                            <div className={styles.tocHeading}>Table of Contents</div>
                            <ul className={styles.tocList}>
                                {headings.map((heading) => (
                                    <li 
                                        key={heading.id} 
                                        className={`${styles.tocItem} ${heading.level === 3 ? styles.tocItemH3 : ""} ${activeId === heading.id ? styles.tocActive : ""}`}
                                    >
                                        <a 
                                            href={`#${heading.id}`}
                                            onClick={(e) => handleHeadingClick(e, heading.id)}
                                        >
                                            {heading.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Author Card */}
                    {post.author && (
                        <div className={styles.sideCard}>
                            <div className={styles.authorHeader}>
                                {avatarMedia && (
                                    <ImageWrapper
                                        media={avatarMedia}
                                        defaultAlt={post.author.name}
                                        className={styles.authorAvatar}
                                        width={40}
                                        height={40}
                                    />
                                )}
                                <div>
                                    <div className={styles.authorName}>{post.author.name}</div>
                                    <div className={styles.authorRole}>{post.author.role}</div>
                                </div>
                            </div>
                            {post.author.bio && (
                                <p className={styles.authorBio}>{post.author.bio}</p>
                            )}
                        </div>
                    )}

                    {/* CTA Card */}
                    <div className={`${styles.sideCard} ${styles.ctaSideCard}`}>
                        <div className={styles.ctaSideHeading}>Need Professional Installation?</div>
                        <p className={styles.ctaSideText}>
                            Our certified technicians are available 7 days a week across the greater Houston area.
                        </p>
                        <QuoteButton size="big" modalName="BookNow">
                            Get a Free Quote
                        </QuoteButton>
                    </div>

                    {/* Locations Widget */}
                    {displayCities && displayCities.length > 0 && (
                        <div className={styles.sideCard}>
                            <div className={styles.tocHeading}>Our Service Locations</div>
                            <div className={styles.locationsList}>
                                {displayCities.map((city) => (
                                    <Link
                                        key={city.path}
                                        href={`/${city.path}/`}
                                        className={styles.locationLink}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.locationPinIcon}>
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        <span>{city.name}, {city.state || "US"}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>

            {/* Related Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
                <section className={`block ${styles.relatedSection}`}>
                    <h2 className={styles.relatedHeading}>Related Articles</h2>
                    <div className={styles.relatedGrid}>
                        {relatedPosts.map((related) => (
                            <Link key={related.slug} href={`/blog/${related.slug}/`} className={styles.relatedCard}>
                                {related.coverMedia && (
                                    <div className={styles.relatedImageWrapper}>
                                        <ImageWrapper
                                            media={related.coverMedia}
                                            defaultAlt={related.title}
                                            className={styles.relatedImage}
                                            width={400}
                                            height={250}
                                        />
                                    </div>
                                )}
                                <div className={styles.relatedContent}>
                                    <span className={styles.relatedCategory}>{related.category}</span>
                                    <h3 className={styles.relatedTitle}>{related.title}</h3>
                                    <span className={styles.relatedMeta}>{related.readTime}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Bottom CTA */}
            <div className={`block ${styles.ctaBottomWrapper}`} style={{ paddingTop: 0 }}>
                <p className={styles.ctaBottomText}>
                    Ready for a professional installation? Get a free, no-obligation quote today.
                </p>
                <QuoteButton size="big" modalName="BookNow">
                    Get The Best Quote
                </QuoteButton>
            </div>
        </div>
    );
}

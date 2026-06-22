"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SEOBreadcrumbs from "@/ui/SEOBreadcrumbs/SEOBreadcrumbs";
import RichTextRenderer from "@/ui/RichTextRenderer/RichTextRenderer";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import styles from "./post.module.css";

export default function PostClient({ post, coverUrl, avatarUrl, relatedPosts, slug }) {
    const [scrollProgress, setScrollProgress] = useState(0);

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
            {coverUrl && (
                <div className={`block ${styles.coverWrapper}`}>
                    <div className={styles.coverInner}>
                        <img
                            src={coverUrl}
                            alt={post.cover?.alternativeText || post.title}
                            className={styles.coverImage}
                            loading="eager"
                            fetchPriority="high"
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

                    {/* Rich Text Body */}
                    {post.content ? (
                        <RichTextRenderer content={post.content} />
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
                </article>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    {/* Author Card */}
                    {post.author && (
                        <div className={styles.sideCard}>
                            <div className={styles.authorHeader}>
                                {avatarUrl && (
                                    <img
                                        src={avatarUrl}
                                        alt={post.author.name}
                                        className={styles.authorAvatar}
                                    />
                                )}
                                <div>
                                    <div className={styles.authorName}>{post.author.name}</div>
                                    <div className={styles.authorRole}>{post.author.role}</div>
                                </div>
                            </div>
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
                </aside>
            </div>

            {/* Related Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
                <section className={`block ${styles.relatedSection}`}>
                    <h2 className={styles.relatedHeading}>Related Articles</h2>
                    <div className={styles.relatedGrid}>
                        {relatedPosts.map((related) => (
                            <Link key={related.slug} href={`/blog/${related.slug}/`} className={styles.relatedCard}>
                                {related.image && (
                                    <div className={styles.relatedImageWrapper}>
                                        <img
                                            src={related.image}
                                            alt={related.title}
                                            className={styles.relatedImage}
                                            loading="lazy"
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

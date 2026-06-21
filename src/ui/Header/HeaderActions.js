"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Header.module.css";
import Navbar from "./components/Navbar";
import Button from "@/ui/Button";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import buttonStyles from "@/ui/Button/Button.module.css";
import MenuAutoClose from "./MenuAutoClose";
import PhoneIcon from "@/assets/icons/phone.svg";
import { useCTA } from "@/providers/CTAProvider";

export default function HeaderActions({ isBlog }) {
    const cta = useCTA();
    const router = useRouter();

    // Search state
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/blog/?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery("");
        }
    };

    return (
        <>
            <input type="checkbox" id="menu-toggle" className={styles.menuToggle} />
            <Navbar />
            <MenuAutoClose menuToggleId="menu-toggle" menuWrapperClass="navbarWrapper" />
            <div className={styles.cta}>
                {isBlog && (
                    <div className={styles.blogWidgets}>
                        {/* Search Bar Toggle */}
                        <div className={styles.searchContainer}>
                            {searchOpen ? (
                                <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                                    <input 
                                        type="text" 
                                        placeholder="Search articles..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={styles.searchInput}
                                        autoFocus
                                    />
                                    <button type="submit" className={styles.searchSubmitBtn} aria-label="Submit Search">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setSearchOpen(false)}
                                        className={styles.searchCloseBtn}
                                        aria-label="Close Search"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </form>
                            ) : (
                                <button 
                                    onClick={() => setSearchOpen(true)} 
                                    className={styles.searchIconBtn}
                                    aria-label="Open Search"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <span className={styles.hours}>{cta?.workHours || 'Mon-Sun 7:00 AM - 10:00 PM'}</span>
                <Button variant="secondary" size="small" href={`tel:${cta?.phone || '(877) 455-5535'}`} className={styles.phoneMobileHide}>{cta?.phoneLabel || 'Call Us'}</Button>
                <QuoteButton size="small" modalName="BookNow">Book Now</QuoteButton>
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
                href={`tel:${cta?.phone || '(877) 455-5535'}`}
            >
                <PhoneIcon width="24" height="24" style={{ fill: "currentColor" }} />
                <span className="visually-hidden">Telephones to TVPro Handy Services</span>
            </Button>
        </>
    );
} 
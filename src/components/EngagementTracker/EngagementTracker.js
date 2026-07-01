"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useModal } from "@/providers/ModalProvider";

const EngagementTracker = () => {
    const { openModal, modals } = useModal();
    const hasTriggered = useRef(false);
    const hasRealInteraction = useRef(false); // Track real human interactions
    const idleTimer = useRef(null);
    const lastScrollPos = useRef(0);
    const isAnyModalOpen = useRef(false);

    // Update ref when modals change
    useEffect(() => {
        isAnyModalOpen.current = modals && modals.length > 0;
    }, [modals]);

    const triggerPopup = useCallback(() => {
        // Prevent triggering if no real human interaction has occurred yet (blocks bots/Lighthouse)
        if (!hasRealInteraction.current) {
            console.log("Exit intent blocked: No real user interaction detected.");
            return;
        }

        // Prevent triggering on speed test agents, headless browsers, and crawlers
        if (typeof window !== 'undefined') {
            const ua = window.navigator.userAgent || "";
            const isBot = /lighthouse|chrome-lighthouse|speedinsights|googlebot|headless/i.test(ua) || navigator.webdriver;
            if (isBot) {
                return;
            }
        }

        // Capping: One per session or if form already submitted
        if (
            hasTriggered.current || 
            sessionStorage.getItem('exit_popup_triggered') || 
            sessionStorage.getItem('form_submitted')
        ) return;

        // Don't trigger if any modal is already open
        if (isAnyModalOpen.current) return;

        openModal('ExitIntentModal');
        hasTriggered.current = true;
        sessionStorage.setItem('exit_popup_triggered', 'true');
    }, [openModal]);

    useEffect(() => {
        // Mark real human interaction on first physical action
        const markInteraction = () => {
            hasRealInteraction.current = true;
            // Clean up interaction listeners since we only need to detect the first interaction
            interactionEvents.forEach(event => {
                document.removeEventListener(event, markInteraction);
            });
        };

        const interactionEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
        interactionEvents.forEach(event => {
            document.addEventListener(event, markInteraction, { passive: true });
        });

        // --- 1. Exit Intent (Desktop) ---
        const handleMouseOut = (e) => {
            if (e.clientY <= 0) {
                triggerPopup();
            }
        };

        // --- 2. Inactivity (Hybrid) ---
        const resetIdleTimer = () => {
            if (idleTimer.current) clearTimeout(idleTimer.current);
            idleTimer.current = setTimeout(triggerPopup, 40000); // 40 seconds
        };

        // Track mount time to prevent scroll triggers during initial load/reflow
        const mountTime = Date.now();

        // --- 3. Scroll Depth & Behavior (Mobile) ---
        const handleScroll = () => {
            resetIdleTimer();

            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const clientHeight = document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;

            // Prevent triggering during the first 2 seconds of mount to avoid layout reflows/hash scrolling issues
            const isInitialReflow = Date.now() - mountTime < 2000;

            // Trigger if scrolled deep (>70%) and scrolls UP (searching for navigation/exit)
            if (!isInitialReflow && scrollPercent > 70 && scrollTop < lastScrollPos.current) {
                triggerPopup();
            }
            lastScrollPos.current = scrollTop;
        };

        // --- 4. Visibility Change (Hybrid) ---
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                triggerPopup();
            }
        };

        // Events for inactivity
        const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

        document.addEventListener('mouseout', handleMouseOut);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('scroll', handleScroll);

        activityEvents.forEach(event => {
            document.addEventListener(event, resetIdleTimer, { passive: true });
        });

        resetIdleTimer();

        return () => {
            interactionEvents.forEach(event => {
                document.removeEventListener(event, markInteraction);
            });
            document.removeEventListener('mouseout', handleMouseOut);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('scroll', handleScroll);
            if (idleTimer.current) clearTimeout(idleTimer.current);
            activityEvents.forEach(event => {
                document.removeEventListener(event, resetIdleTimer);
            });
        };
    }, [triggerPopup]);

    return null; // Side-effect only component
};

export default EngagementTracker;

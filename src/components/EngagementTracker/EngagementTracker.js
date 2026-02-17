"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useModal } from "@/providers/ModalProvider";

const EngagementTracker = () => {
    const { openModal, modals } = useModal();
    const hasTriggered = useRef(false);
    const idleTimer = useRef(null);
    const lastScrollPos = useRef(0);
    const isAnyModalOpen = useRef(false);

    // Update ref when modals change
    useEffect(() => {
        isAnyModalOpen.current = modals && modals.length > 0;
    }, [modals]);

    const triggerPopup = useCallback(() => {
        // Capping: One per session
        if (hasTriggered.current || sessionStorage.getItem('exit_popup_triggered')) return;

        // Don't trigger if any modal is already open
        if (isAnyModalOpen.current) return;

        openModal('ExitIntentModal');
        hasTriggered.current = true;
        sessionStorage.setItem('exit_popup_triggered', 'true');
    }, [openModal]);

    useEffect(() => {
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

        // --- 3. Scroll Depth & Behavior (Mobile) ---
        const handleScroll = () => {
            resetIdleTimer();

            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const clientHeight = document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;

            // Trigger if scrolled deep (>70%) and scrolls UP (searching for navigation/exit)
            if (scrollPercent > 70 && scrollTop < lastScrollPos.current) {
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
            document.addEventListener(event, resetIdleTimer);
        });

        resetIdleTimer();

        return () => {
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

"use client";

import { useEffect, useRef } from 'react';
import { useModal } from "@/providers/ModalProvider";

const EngagementTracker = () => {
    const { openModal, isModalOpen } = useModal();
    const hasTriggered = useRef(false);
    const idleTimer = useRef(null);
    const lastScrollPos = useRef(0);

    const triggerPopup = () => {
        // Capping: One per session
        if (hasTriggered.current || sessionStorage.getItem('exit_popup_triggered')) return;

        // Don't trigger if any other modal is already open
        // (Optional check: we might want to override, but usually better not to interrupt)
        // if (activeModalName) return;

        openModal('ExitIntentModal');
        hasTriggered.current = true;
        sessionStorage.setItem('exit_popup_triggered', 'true');
    };

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
    }, [openModal]);

    return null; // Side-effect only component
};

export default EngagementTracker;

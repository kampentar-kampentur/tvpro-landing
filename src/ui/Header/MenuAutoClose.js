"use client";
import { useEffect } from "react";

export default function MenuAutoClose({ menuToggleId = "menu-toggle", menuWrapperClass = "navbarWrapper" }) {
  useEffect(() => {
    const menuToggle = document.getElementById(menuToggleId);
    // Find the wrapper using a partial selector to match CSS modules hashed class names
    const menuWrapper = document.querySelector(`[class*="${menuWrapperClass}"]`);

    function closeMenu() {
      if (menuToggle) menuToggle.checked = false;
    }

    function onMenuClick(e) {
      if (e.target.tagName === "A") {
        closeMenu();
      }
    }

    function onDocumentClick(e) {
      if (!menuToggle || e.target.getAttribute("for") === menuToggleId || e.target.getAttribute("id") === menuToggleId) return;
      // Do not close when clicking inside the menu container itself
      if (menuWrapper && menuWrapper.contains(e.target)) return;
      if (menuToggle.checked) {
        closeMenu();
      }
    }

    if (menuWrapper) menuWrapper.addEventListener("click", onMenuClick);
    document.addEventListener("click", onDocumentClick);
    return () => {
      if (menuWrapper) menuWrapper.removeEventListener("click", onMenuClick);
      document.removeEventListener("click", onDocumentClick);
    };
  }, [menuToggleId, menuWrapperClass]);

  return null;
} 
"use client";
import { useEffect } from "react";

export default function MenuAutoClose({ menuToggleId = "menu-toggle", menuWrapperClass = "navbarWrapper" }) {
  useEffect(() => {
    const menuToggle = document.getElementById(menuToggleId);
    const menuWrapper = document.querySelector(`.${menuWrapperClass}`);

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
      if (
        menuToggle.checked
      ) {
        closeMenu();
      }
    }

    if (menuWrapper) menuWrapper.addEventListener("click", onMenuClick);
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("touchmove", closeMenu);
    return () => {
      if (menuWrapper) menuWrapper.removeEventListener("click", onMenuClick);
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("touchmove", closeMenu);
    };
  }, [menuToggleId, menuWrapperClass]);

  return null;
} 
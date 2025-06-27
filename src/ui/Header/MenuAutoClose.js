"use client";
import { useEffect } from "react";

export default function MenuAutoClose({ menuToggleId = "menu-toggle", menuWrapperClass = "navbarWrapper" }) {
  useEffect(() => {
    const menuToggle = document.getElementById(menuToggleId);
    const menuWrapper = document.querySelector(`.${menuWrapperClass}`);

    function closeMenu() {
      if (menuToggle) menuToggle.checked = false;
    }

    // Клик по ссылке внутри меню
    function onMenuClick(e) {
      if (e.target.tagName === "A") {
        closeMenu();
      }
    }

    // Клик вне меню
    function onDocumentClick(e) {
      if (!menuToggle) return;
      if (
        menuToggle.checked
      ) {
        closeMenu();
      }
    }

    if (menuWrapper) menuWrapper.addEventListener("click", onMenuClick);
    document.addEventListener("mouseup", onDocumentClick);

    return () => {
      if (menuWrapper) menuWrapper.removeEventListener("click", onMenuClick);
      document.removeEventListener("mouseup", onDocumentClick);
    };
  }, [menuToggleId, menuWrapperClass]);

  return null;
} 
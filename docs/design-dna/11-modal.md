# 11 — Modal

**Источник:** [`src/ui/Modal/`](../../src/ui/Modal/)

---

## Структура

```
Вся страница затемняется:
┌────────────────────────────────────────────────┐
│ rgba(14, 14, 19, 0.6)  ← overlay              │
│                                                │
│   ┌──────────────────────────────────────┐    │
│   │  [×]                                 │    │
│   │                                      │    │
│   │   Modal content (Form / Quiz)        │    │
│   │                                      │    │
│   └──────────────────────────────────────┘    │
└────────────────────────────────────────────────┘
```

---

## Ключевые стили

```css
.modalOverlay {
  position: fixed;
  inset: 0;
  background-color: rgba(14, 14, 19, 0.6);   /* --foreground с 60% opacity */
  z-index: 100000000;
  animation: modalOverlayFadeIn 0.3s ease-out;
}

.modalContent {
  background-color: var(--background);    /* #f6f6f8 */
  border-radius: 40px;
  padding: 20px;
  max-width: 1392px;
}

/* Mobile — полноэкранный */
@media (max-width: 980px) {
  .modalContent {
    border-radius: 0;
    height: 100% !important;
    width: 100% !important;
    overflow: auto;
  }
}
```

---

## Кнопка закрытия

```css
button.closeButton {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 99999px;       /* круглая */
  background: var(--background);
}
```

---

## Как открыть модалку

```jsx
import { useModal } from "@/providers/ModalProvider";

const { openModal } = useModal();

// Открыть форму с квотой:
openModal("BestQuote");

// Или через QuoteButton (рекомендуется):
<QuoteButton size="big" modalName="BestQuote">Get The Best Quote</QuoteButton>
```

---

## z-index иерархия

```
Header          z-index: 999
Phone FAB       z-index: 1000
Modal overlay   z-index: 100000000
```

---

## Правила

```
✅ Фон overlay: rgba(14, 14, 19, 0.6) — темнее для контраста
✅ Desktop: border-radius: 40px; mobile: border-radius: 0 (полный экран)
✅ Закрытие через ModalProvider — не управляй модалкой вручную
✅ Анимация появления: fadeIn 0.3s
❌ НЕ делай модалки вне системы ModalProvider
❌ НЕ используй z-index выше 100000000
```

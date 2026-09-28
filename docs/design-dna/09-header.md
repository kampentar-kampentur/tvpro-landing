# 09 — Header

**Источник:** [`src/ui/Header/`](../../src/ui/Header/)

---

## Структура

Header фиксированный, поверх всего контента.

```
Desktop:
┌──────────────────────────────────────────────────────┐
│  [Logo]   [Nav links]                  [Phone] [CTA] │
└──────────────────────────────────────────────────────┘

Mobile:
┌──────────────────────────────────────────────────────┐
│  [Logo]                             [CTA] [☰ Burger]  │
└──────────────────────────────────────────────────────┘
                                         ↓ (fixed bottom-right)
                                      [📞 Phone FAB]
```

---

## Ключевые стили

```css
.header {
  position: fixed;
  z-index: 999;
  background: var(--background);   /* #f6f6f8 — совпадает с фоном страницы */
  width: 100%;
}

.headerWrapper {
  max-width: 1440px;
  padding: 20px 40px;      /* desktop */
  min-height: 80px;        /* резервируем высоту чтобы избежать CLS */
}

/* mobile */
@media (max-width: 1024px) {
  .headerWrapper { padding: 20px 16px; }
}
```

---

## Мобильная FAB телефонная кнопка

На мобильном появляется круглая кнопка-звонок `fixed` внизу справа.

```css
.phoneButton {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background-color: var(--green);    /* #0d64a0 */
  color: var(--white);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  /* Кнопка анимируется — wiggle + bounce + tada по циклу 30s */
  animation: phone-sequence 30s infinite;
  animation-delay: -15s;
}
```

> ⚠️ Эта кнопка — единственное место на мобильном где фоновый круг `var(--green)`.

---

## Бургер-меню (CSS-only accordion)

Бургер реализован через `<input type="checkbox">` + CSS `~` селектор — **без JS**.

```css
/* Открытое состояние */
.menuToggle:checked ~ div[class*="navbarWrapper"] {
  display: block;
}

/* Анимация линий гамбургера */
.menuToggle:checked ~ .cta .menuLabel .hamburger .line:first-child {
  transform: translateY(7px) rotate(45deg);
}
```

---

## Scroll padding (из globals.css)

```css
html {
  scroll-padding-top: 90px;  /* Компенсируем высоту фиксированного хедера */
}
```

Когда добавляешь якорный `id` к блоку — учитывай этот отступ.

---

## Правила

```
✅ Header = position: fixed, z-index: 999
✅ scroll-padding-top: 90px уже настроен — не меняй
✅ Мобильная FAB кнопка — var(--green), border-radius: 50%
✅ Бургер без JS — через checkbox trick
❌ НЕ добавляй в header другие цвета фона кроме var(--background)
❌ НЕ меняй z-index хедера — он должен быть ниже модалки (z-index: 100000000)
```

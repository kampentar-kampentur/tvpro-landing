# 04 — Buttons

---

## Компоненты

| Компонент | Путь | Когда использовать |
|---|---|---|
| `Button` | [`src/ui/Button/Button.js`](../../src/ui/Button/Button.js) | Базовый — принимает `variant`, `size` |
| `QuoteButton` | [`src/ui/QuoteButton/QuoteButton.js`](../../src/ui/QuoteButton/QuoteButton.js) | CTA «Get The Best Quote» — открывает модалку |

---

## Button — базовый компонент

### API

```jsx
<Button
  variant="primary"   // "primary" | "secondary"
  size="big"          // "big" | "small"
  disabled={false}
  onClick={...}
  href="..."          // если указать — рендерится как <a>
>
  Label text
</Button>
```

### Варианты

#### Primary (основной CTA)

```css
background: var(--green);        /* #0d64a0 */
color: var(--white);
font-weight: 700;
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
border-radius: 36px;

/* hover */
background: var(--green-hover);  /* #0a4d7d */
box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
transform: translateY(-3px);

/* disabled */
background: var(--gray-extra-light);
color: var(--foreground);
cursor: not-allowed;
```

#### Secondary (вторичный)

```css
background: transparent;
color: var(--foreground);
border: 2px solid var(--gray-light);   /* #dbdbdf */
border-radius: 36px;

/* hover */
border-color: var(--gray-extra-light);

/* disabled */
background: var(--gray-extra-light);
```

### Размеры

```css
.big   { height: 52px; font-size: 16px; padding: 0 24px; }
.small { height: 40px; font-size: 14px; padding: 0 24px; }
```

---

## QuoteButton — главный CTA сайта

```jsx
import QuoteButton from "@/ui/QuoteButton/QuoteButton";

// Открывает модалку BestQuote по умолчанию:
<QuoteButton size="big" />

// Можно изменить модалку:
<QuoteButton size="big" modalName="BookNow">
  Book Now
</QuoteButton>
```

**QuoteButton** — это обёртка над `Button` с primary variant по умолчанию.  
Всегда используй его для CTA в блоках, а не голый `<button>`.

---

## Chip / Pill (не кнопки, а теги)

Используются для тегов, статус-пилюль, дополнительных опций.

```css
/* OptionalAddons.module.css */
.button {
  background-color: rgba(14, 14, 19, 0.05);
  border: 1px solid rgba(14, 14, 19, 0.1);
  border-radius: 36px;
  padding: 12px 24px;
  font-weight: 500;
  font-size: 14px;
  color: var(--foreground);
}
```

Маленький chip (теги на карточках):
```css
padding: 6px 14px;
font-size: 12px;
```

---

## Правила

```
✅ Используй QuoteButton для любого «Записаться / Get Quote / Book Now»
✅ Variant primary — для главных CTA (один per секция)
✅ Variant secondary — для второстепенных действий
✅ Chips — для тегов, фильтров, дополнительных опций (не для действий)
✅ border-radius: 36px — для всех кнопок и chip-элементов

❌ НЕ делай кнопку другого цвета, кроме var(--green) для primary
❌ НЕ используй border-radius < 36px на кнопках
❌ НЕ создавай голые <button> — используй компонент Button
```

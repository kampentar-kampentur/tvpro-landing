# 05 — Layout & Spacing

---

## Глобальные контейнеры

Эти классы объявлены в [`globals.css`](../../src/app/globals.css) и применяются напрямую в JSX.

### `.block` — ограничивающий контейнер блока

```css
width: 100%;
max-width: 1220px;
margin: 0 auto;
padding: 60px 20px;   /* desktop */

/* mobile (<= 1024px) */
padding: 40px 16px;
```

**Использование:** добавляй к корневому тегу каждого блока вместе с именем блока:
```jsx
<section className={`block ${styles.myBlock}`} id="myblock">
```

### `.blockContainer` — flex-колонка внутри блока

```css
max-width: 100%;
margin: 0 auto;
display: flex;
flex-direction: column;
```

---

## Стандартные отступы

| Элемент | Значение |
|---|---|
| Padding секции (desktop) | `60px 20px` |
| Padding секции (mobile) | `40px 16px` |
| Padding карточки (desktop) | `30–40px` |
| Padding карточки (mobile) | `24px 20px` |
| Gap между карточками (desktop grid) | `20–32px` |
| Gap между карточками (mobile) | `8–12px` |
| Отступ grid от заголовка | `margin-top: 40px` |
| Отступ CTA от контента | `margin-top: 60px` |
| Отступ subText под heading | `margin-top: 20px` |

---

## Сетки карточек

### 3-колонная сетка (стандарт для большинства блоков)

```css
/* WhyCustomersTrustUs, OurTeam */
display: grid;
gap: 32px;

grid-template-columns: repeat(2, 1fr);     /* mobile */

@media (min-width: 1024px) {
  grid-template-columns: repeat(3, 1fr);   /* desktop */
}
```

### 2-колонная сетка

```css
grid-template-columns: repeat(2, 1fr);
gap: 20px;
```

### Мобильный горизонтальный swipe (карусель)

Используется в OurTeam и может использоваться в любом блоке с картами на мобильном.

```css
/* Mobile */
display: flex;
overflow-x: auto;
scroll-snap-type: x mandatory;
-webkit-overflow-scrolling: touch;
gap: 12px;
padding-bottom: 16px;

/* Карточка в swipe */
flex: 0 0 85%;     /* карточка занимает 85% ширины */
scroll-snap-align: start;

/* Desktop >= 1024px — обычный grid */
display: grid;
grid-template-columns: repeat(3, 1fr);
overflow-x: visible;
```

---

## Breakpoints

| Breakpoint | Значение | Применение |
|---|---|---|
| Mobile | `<= 1024px` | Основной трафик — проектируй сначала для него |
| Desktop | `>= 1024px` | Расширение раскладки |
| Tablet (когда нужно) | `>= 768px` | Промежуточные сетки |

> ⚠️ **Основной трафик — мобильный.** Всегда сначала проектируй мобильную версию.

---

## Scrollbar (в swipe-карусели)

```css
/* Скрыть scrollbar визуально, но оставить функциональность */
.grid::-webkit-scrollbar { display: none; }
.grid { -ms-overflow-style: none; scrollbar-width: none; }
```

---

## Scroll padding

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 90px;  /* учитываем высоту хедера */
}
```

---

## ID для якорных ссылок

Каждый блок имеет `id` для навигации:

```
Hero         — нет id (верх страницы)
AboutUs      — id="about"
CustomerReviews — id="reviews"
WhyCustomersTrustUs — id="trustus"
FAQ          — id="faq"
```

Когда создаёшь новый блок — добавь уникальный `id`.

# 02 — Typography

---

## Глобальные CSS-классы (из globals.css)

Эти классы объявлены глобально и используются **напрямую в JSX без CSS Modules**.

### `.blockHeading` — заголовок блока

```css
font-size: 44px;
font-weight: 700;
line-height: 60px;
color: var(--foreground);

/* mobile (<= 1024px) */
font-size: 28px;
line-height: 36px;
text-align: center;
```

**Когда использовать:** `<h2>` на каждом блоке страницы (не Hero).

```jsx
<h2 className="blockHeading">{title}</h2>
```

---

### `.subText` — подзаголовок блока

```css
font-size: 16px;
font-weight: 500;
line-height: 24px;
color: var(--foreground);
margin-top: 20px;

/* mobile (<= 1024px) */
font-weight: 400;
text-align: center;
```

**Когда использовать:** `<p>` сразу под `h2` заголовком блока.

```jsx
<p className="subText">{subTitle}</p>
```

---

## Заголовки внутри карточек

### Заголовок карточки (card title)

```css
font-weight: 500;
font-size: 20px;
line-height: 28px;
color: var(--foreground);

/* mobile (<= 1024px) */
font-size: 16px;
line-height: 20px;
font-weight: 600; /* увеличивается на мобильном */
```

### Описание карточки (card description)

```css
font-weight: 400;
font-size: 16px;
line-height: 20px;
color: var(--gray); /* #91929c */

/* mobile (<= 1024px) */
font-size: 14px;
```

---

## Hero H1

```css
/* Уникальный стиль, только в Hero.module.css */
/* Крупный, адаптивный, font-weight: 700 */
```

Hero заголовок — это единственный `<h1>` на всей странице.  
Все остальные заголовки блоков — `<h2>`.  
Заголовки внутри карточек — `<h3>`.

---

## Иерархия заголовков

```
h1 — Hero block (один на странице)
h2 — Заголовок каждого section-блока → className="blockHeading"
h3 — Название карточки (TrustCard, TechCard, etc.)
p   — Описание, биография → color: var(--gray)
```

---

## Chip / Pill теги

```css
/* Из OptionalAddons и TechCard */
font-size: 12–14px;
font-weight: 500;
color: var(--foreground);
background: rgba(14, 14, 19, 0.05);
border: 1px solid rgba(14, 14, 19, 0.1);
border-radius: 36px;
padding: 6–12px 14–24px;
```

---

## Что НЕ делать с типографикой

```
❌ Не красить body-текст в var(--green) — это цвет только для кнопок
❌ Не использовать serif-шрифты или другие font-family
❌ Не создавать новые размеры шрифтов произвольно — держись в рамках 12/14/16/20/28/44px
❌ Не забывать мобильный text-align: center для blockHeading и subText
```

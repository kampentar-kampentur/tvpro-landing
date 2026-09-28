# 13 — Hero Block

**Источник:** [`src/blocks/Hero/`](../../src/blocks/Hero/)

---

## Особенности Hero

Hero — первый и уникальный блок страницы. Его стили отличаются от остальных блоков.

---

## Заголовок H1

Только здесь используется `<h1>`. Все остальные заголовки блоков — `<h2>`.

```css
.mainHeading {
  font-size: 56px;
  font-weight: 700;
  line-height: 64px;
  color: var(--foreground);
  text-align: center;
}

@media (max-width: 1024px) {
  .mainHeading {
    font-size: 36px;
    line-height: 44px;
    font-weight: 800;
  }
}
```

---

## CTA кнопка в Hero

В Hero CTA-кнопка стилизована особо — крупнее и заметнее:

```css
.heroButton {
  font-weight: 700 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

/* Mobile — другой border-radius */
@media (max-width: 1024px) {
  .heroButton {
    height: 52px !important;
    font-size: 18px !important;
    padding: 0 32px !important;
    border-radius: 12px !important;   /* ← ИСКЛЮЧЕНИЕ: только в Hero на mobile */
  }
}
```

> ⚠️ `border-radius: 12px` в Hero CTA на мобильном — это **единственное исключение** из правила `36px` для кнопок.

---

## Running Text Line

Над Hero идёт бегущая строка с промо-сообщениями.

```jsx
// Компонент:
import RunningTextLine from "./components/RunningTextLine";

// Данные — массив строк из Strapi (api/hero-text-lines)
<RunningTextLine textLines={heroLinesData} />
```

---

## SEOBreadcrumbs

Унифицированный компонент хлебных крошек для всего проекта. Наследует правильные стили переходов и шрифтов, автоматически генерирует разметку JSON-LD для поисковых систем (SEO).

Компонент работает в двух режимах:

### 1. Автоматический (для городских страниц по `cityContext`)
Используется в `BlockRenderer.jsx` сразу после Hero-блока:
```jsx
<SEOBreadcrumbs cityContext={cityContext} />
```

### 2. Вручную (для статических/кастомных страниц по массиву `items`)
Используется на обычных страницах (например, `/blog`):
```jsx
const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Blog", url: "/blog/" }
];

<SEOBreadcrumbs items={breadcrumbItems} />
```

---

## Данные из Strapi

```
GET /api/hero?populate=*          — основные данные (title, subTitle)
GET /api/hero-text-lines          — строки бегущей строки
```

---

## Порядок рендера Hero

```
1. <RunningTextLine />   — бегущая строка (вне .block контейнера)
2. <div.block>           — .hero контейнер с h1 + subText + CTA
3. <HeroClientContainer> — клиентская часть (видео-карусель)
```

---

## Правила

```
✅ h1 — только в Hero, один на странице
✅ Hero CTA = QuoteButton с text-transform: uppercase
✅ Мобильная Hero CTA — border-radius: 12px (исключение)
✅ padding-bottom: 0 — Hero не имеет нижнего отступа (видео идёт вплотную)
❌ НЕ ставь h1 ни в каком другом блоке
❌ НЕ добавляй scroll-padding в Hero — это для хедера
```

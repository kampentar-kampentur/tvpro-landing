# 🔍 SEO Технический Аудит — TVPro Blog
> Проверено: 22 июня 2026 | Аудитор: Senior SEO Specialist (Agent)

---

## 🚨 КРИТИЧЕСКИЕ ПРОБЛЕМЫ (немедленное исправление)

### 1. `robots.txt` блокирует индексацию на dev-домене → ПРОВАЛ SEO score 69

**Диагноз:** PageSpeed проверялся на `dev.tvpro-landing.pages.dev`. Lighthouse показал:
> _"Page is blocked from indexing"_

Это значит либо:
- На staging/dev домене стоит `X-Robots-Tag: noindex` в HTTP-заголовках, **ИЛИ**
- `<meta name="robots" content="noindex">` инджектится через код

**Реальная проблема в коде** — [`BlogClient.jsx` L241](file:///Users/kampentar/dev/tvpro-landing/src/app/blog/BlogClient.jsx#L241-L241):
```jsx
{query && <meta name="robots" content="noindex, follow" />}
```
Это клиентский `<meta>` — он НЕ работает так как ожидается в Next.js App Router (рендерится **после** первого HTML). Google может его проигнорировать. Для search-страниц нужно использовать серверную генерацию метаданных.

**Также:** `_headers` не содержит `X-Robots-Tag: noindex` для dev-домена Cloudflare Pages — это хорошо для прода, но нужно убедиться что на dev крутится с ограничением.

**Фикс:** Добавить `X-Robots-Tag: noindex` через `_headers` только для dev-домена (или через переменную окружения).

---

### 2. CLS = 0.374 (blog index) и 0.969 (article) — КАТАСТРОФА

CLS выше 0.1 — Google это наказывает напрямую в Core Web Vitals. На статье 0.969 — это один из худших показателей вообще.

**Причины:**
- Изображения в BlogClient.jsx и PostClient.jsx используют **`<img>` без явных `width`/`height` атрибутов**:

```jsx
// BlogClient.jsx L363-369 — нет width/height → браузер не резервирует место
<img src={post.image} alt={post.title} className={styles.cardImage} loading="lazy" />

// PostClient.jsx L204-210 — cover без dimensions
<img src={coverUrl} alt={...} className={styles.coverImage} loading="eager" fetchPriority="high" />

// PostClient.jsx L401-405 — avatar без dimensions
<img src={avatarUrl} alt={post.author.name} className={styles.authorAvatar} />
```

- **Sidebar + контент** рендерятся клиентски (BlogClient и PostClient — `"use client"`), что означает **layout shift** при гидрации

- **Шрифты:** `font-display: swap` установлен в Next.js font loader, но web font ещё не применён при первом рендере → текст перерисовывается

**Фикс:** Добавить `width` и `height` на все `<img>` теги. Использовать `next/image` с `fill` или явными размерами. Вынести критические части (hero cover, featured post) в Server Components.

---

### 3. LCP = 5.3s (blog index) и 3.2s (article) — Красная зона

Целевой показатель Google: **< 2.5s**. 5.3 секунды — это критично.

**Причины:**
- **Изображения не оптимизированы:** Lighthouse сообщает "Improve image delivery Est savings of 202 KiB" (blog) и 82 KiB (article). Изображения с Strapi не проходят через `next/image` — используется кастомный `<img>`.
- **Preload LCP image в layout.js указывает на неправильный файл:**
```js
// layout.js L146 — preload для главной страницы, не для блога!
href="/videoplaceholder-392.webp"
```
На блог-страницах LCP элемент — это cover image поста или featured post image, а не видео-плейсхолдер главной.

- **Нет preload для blog cover image** — первое изображение не preload'ится
- **Отложенные маркетинговые скрипты** (GTM, FB Pixel, WhatConverts, LeadConnector) всё равно блокируют main thread

**Фикс:**
```jsx
// В layout.js — добавить условный preload только для главной
// В PostClient.jsx — добавить preload для coverUrl через generateMetadata
// В blog/page.jsx — добавить preload для featured post image
```

---

## ⚠️ СЕРЬЁЗНЫЕ ПРОБЛЕМЫ (исправить в течение недели)

### 4. Heading Structure нарушена — SEO + Accessibility

PageSpeed на `/blog/perfect-tv-mounting-height/` прямо говорит:
> _"Heading elements are not in a sequentially-descending order"_

**Диагноз в PostClient.jsx:**
- TOC рендерится ДО `<h1>` (L227-246), и внутри TOC есть `<div className={styles.mobileExpandedTocHeading}>Table of Contents</div>` — это НЕ heading-тег, но визуально выглядит как заголовок
- Более серьёзная проблема: если статья начинается с `### H3` без предшествующего `## H2`, Google видит нарушение иерархии
- В `RichTextRenderer` нужно убедиться что H1 всегда один, H2 → H3, а не H4/H5 вне порядка

**Фикс:** Аудит всех постов в Strapi на корректность heading-иерархии. Добавить валидацию при рендере.

---

### 5. Article Schema — неполная и с ошибками

В [`[slug]/page.jsx` L143-170](file:///Users/kampentar/dev/tvpro-landing/src/app/blog/%5Bslug%5D/page.jsx#L143-L170):

```js
// ПРОБЛЕМА 1: Используется тип "Article" вместо "BlogPosting"
"@type": "Article",  // ← Google предпочитает BlogPosting для блогов

// ПРОБЛЕМА 2: publisher.logo указывает на /logo.png — файл не существует!
url: `${SITE_URL}/logo.png`  // ← В public/ есть logo.svg, нет logo.png

// ПРОБЛЕМА 3: Нет поля "url" в корне schema
// ПРОБЛЕМА 4: Нет "wordCount" — Google использует это для rich results
// ПРОБЛЕМА 5: Нет "articleSection" (категория)
```

**Фикс:**
```js
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",  // ← правильный тип
  "headline": post.title,
  "description": post.excerpt,
  "url": `${SITE_URL}/blog/${slug}/`,  // ← добавить
  "articleSection": post.category,     // ← добавить
  "wordCount": estimatedWordCount,     // ← добавить
  "image": coverUrl ? [{ "@type": "ImageObject", "url": coverUrl, "width": 1200, "height": 630 }] : undefined,
  "datePublished": post.publishedAt || post.date,
  "dateModified": post.updatedAt || post.publishedAt || post.date,
  "author": {
    "@type": "Person",
    "name": post.author?.name || ORG_NAME,
    "url": `${SITE_URL}/our-team/`  // ← добавить author URL
  },
  "publisher": {
    "@type": "Organization",
    "name": ORG_NAME,
    "logo": {
      "@type": "ImageObject",
      "url": `${SITE_URL}/og-image.png`,  // ← файл который СУЩЕСТВУЕТ
      "width": 1200,
      "height": 630
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `${SITE_URL}/blog/${slug}/`
  }
}
```

---

### 6. Sitemap — ВЫПОЛНЕНО

В [`sitemap.js`](file:///Users/kampentar/dev/tvpro-landing/src/app/sitemap.js):

```js
// ПРОБЛЕМА 1: Все города имеют priority: 1 — это неправильно.
// Только homepage должна иметь priority 1.
priority: 1  // ← для городских страниц

// ПРОБЛЕМА 2: lastModified всегда new Date() — Google игнорирует реальные даты
lastModified: new Date()  // ← всегда "сегодня"

// ПРОБЛЕМА 3: Категории блога не включены в sitemap!
// /blog/category/tv-mounting/ — нет в sitemap

// ПРОБЛЕМА 4: blog priority = 0.7, хотя это важный контент
priority: 0.7  // ← можно повысить до 0.8

// ПРОБЛЕМА 5: chicago в static с priority 1 — дублирует логику
{ url: `${baseUrl}/chicago/`, priority: 1 }  // ← может дублироваться с cityEntries
```

**Фикс sitemap.js:**
```js
// 1. Реальные даты модификации
lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),

// 2. Добавить категории
const categoryEntries = uniqueCategories.map(cat => ({
  url: `${baseUrl}/blog/category/${slugify(cat)}/`,
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 0.7,
}));

// 3. Корректные приоритеты
// Homepage: 1.0
// Cities: 0.9
// Blog index: 0.8
// Blog posts: 0.7
// Categories: 0.6
// Legal/static: 0.3-0.5
```

---

### 7. robots.txt — неполный и ссылается на несуществующий sitemap

```txt
# Текущий robots.txt:
User-agent: *
Allow: /
Sitemap: https://tvprousa.com/sitemap.xml
Sitemap: https://tvprousa.com/chicago/sitemap.xml
```

**Проблемы:**
- `https://tvprousa.com/chicago/sitemap.xml` — этот файл существует или нет?
- Нет запрета на индексацию мусорных URL: `/quiz/`, `/sandbox/`, `/see-you-soon/`, `/book-now/`, `/booking-success/`, `/api/`
- Нет запрета на search query pages (`/blog/?q=...`)

**Фикс:**
```txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /sandbox/
Disallow: /quiz/
Disallow: /see-you-soon/
Disallow: /booking-success/
Disallow: /book-now/
Disallow: /blog/?q=
Disallow: /variants/

User-agent: Googlebot
Allow: /

Sitemap: https://tvprousa.com/sitemap.xml
```

---

### 8. Canonical URLs — trailing slash несогласованность

В [`layout.js` L89](file:///Users/kampentar/dev/tvpro-landing/src/app/layout.js#L89):
```js
canonical: 'https://tvprousa.com/'  // ← со слешем
```

В `openGraph.url` L94:
```js
url: 'https://tvprousa.com'  // ← без слеша
```

`next.config.mjs` имеет `trailingSlash: true` — это правильно, но OG url должен соответствовать canonical. Каждый `<meta property="og:url">` должен точно совпадать с canonical.

**Фикс:** Везде использовать trailing slash: `https://tvprousa.com/`

---

## 📊 УМЕРЕННЫЕ ПРОБЛЕМЫ (исправить в течение месяца)

### 9. Open Graph — Blog Index страница неполная

В [`blog/page.jsx`](file:///Users/kampentar/dev/tvpro-landing/src/app/blog/page.jsx):
```js
export const metadata = {
  title: "TV Mounting & Home Theater Blog | TVPro",
  description: "...",
  alternates: { canonical: "https://tvprousa.com/blog/" },
  // ❌ НЕТ openGraph
  // ❌ НЕТ twitter card
  // ❌ НЕТ og:image
};
```

При шаринге /blog/ в соцсетях — нет превью. Google использует OG для понимания контента.

**Фикс:**
```js
openGraph: {
  title: "TV Mounting & Home Theater Blog | TVPro",
  description: "...",
  type: "website",
  url: "https://tvprousa.com/blog/",
  images: [{ url: "https://tvprousa.com/og-image.png", width: 1200, height: 630, alt: "TVPro Blog" }],
},
twitter: {
  card: "summary_large_image",
  title: "TV Mounting & Home Theater Blog | TVPro",
  images: ["https://tvprousa.com/og-image.png"],
},
```

---

### 10. BlogPosting Schema отсутствует на категорийных страницах

На `/blog/category/[slug]/page.jsx` — нет JSON-LD вообще. Как минимум нужна `CollectionPage` schema:

```js
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": `${categoryName} Articles | TVPro Blog`,
  "url": `${SITE_URL}/blog/category/${slug}/`,
  "description": `Expert ${categoryName} tips and guides`,
  "breadcrumb": { ... }
}
```

---

### 11. Breadcrumb Schema — не проверяем реализацию

Компонент `SEOBreadcrumbs` используется, но нужно убедиться что он генерирует правильный `BreadcrumbList` JSON-LD. Если он только визуальный — Google не получает structured data для breadcrumbs.

**Нужно проверить:** `/src/ui/SEOBreadcrumbs/SEOBreadcrumbs.jsx`

---

### 12. Нет `dateModified` в реальном времени

В `generateMetadata` для blog posts:
```js
// Нет явного updatedAt в openGraph
openGraph: {
  publishedTime: post.publishedAt || post.date,
  // ❌ НЕТ modifiedTime!
}
```

Google использует `article:modified_time` для определения свежести контента.

**Фикс:**
```js
openGraph: {
  type: "article",
  publishedTime: post.publishedAt || post.date,
  modifiedTime: post.updatedAt || post.publishedAt || post.date,  // ← добавить
  section: post.category,  // ← добавить
  tags: Array.isArray(post.tags) ? post.tags : [],  // ← добавить
}
```

---

### 13. Cache-Control для HTML страниц отсутствует

В `_headers` настроены только статик-ассеты. HTML-страницы не имеют кэш-заголовков. Lighthouse сообщает "Use efficient cache lifetimes Est savings of 193 KiB".

Cloudflare Pages по умолчанию не кэширует HTML. Нужно добавить:

```txt
# В _headers
/blog/*
  Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
  X-Content-Type-Options: nosniff

/
  Cache-Control: public, s-maxage=600, stale-while-revalidate=3600
```

---

### 14. Безопасность — CSP, HSTS, COOP, XFO отсутствуют

PageSpeed Best Practices = 77 именно из-за отсутствия security headers. Google не учитывает это в ранжировании напрямую, но это влияет на trust signals.

**Добавить в `_headers`:**
```txt
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(self)
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://www.clarity.ms https://s.ksrndkehqnwntyxlhgto.com https://ob.sornavellon.com https://beta.leadconnectorhq.com; ...
  Cross-Origin-Opener-Policy: same-origin-allow-popups
```

---

### 15. Deprecated API — консольные ошибки

PageSpeed Best Practices: "Uses deprecated APIs 1 warning found" и "Browser errors were logged to the console".

Скорее всего это `window.pageYOffset` в PostClient.jsx L153:
```js
const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
```
`window.pageYOffset` — deprecated, нужно `window.scrollY`.

**Фикс:**
```js
const offsetPosition = elementPosition + window.scrollY - headerOffset;
```

---

### 16. Touch targets слишком мелкие

PageSpeed Accessibility: "Touch targets do not have sufficient size or spacing"

Категорийные бейджи, теги, кнопки пагинации — менее 44x44px (требование Google для мобильных). Проверить в CSS:
- `.categoryBadge` 
- `.tag`
- `.sortSelect`

---

## 💡 РЕКОМЕНДАЦИИ ПО УЛУЧШЕНИЮ (быстрые победы)

### 17. Нет `next/image` в блоге — большая потеря

Весь блог использует нативный `<img>`. `next/image` даёт:
- Автоматический WebP/AVIF
- Lazy loading с placeholder
- Srcset для разных экранов
- Предотвращение CLS через width/height

```jsx
// Вместо:
<img src={post.image} alt={post.title} loading="lazy" />

// Использовать:
import Image from 'next/image';
<Image
  src={post.image}
  alt={post.title}
  width={400}
  height={225}
  style={{ objectFit: 'cover' }}
/>
```

> ⚠️ Внимание: у вас кастомный image loader (`./src/lib/image-loader.js`). Убедиться что он совместим с next/image.

---

### 18. Нет Pagination для SEO

Страница `/blog/` показывает 6 постов через JS (Load More). Поисковик видит только 6 постов, остальные недоступны краулеру.

**Решение:** Добавить серверный пагинатор:
- `/blog/` — первые 12 постов
- `/blog/page/2/` — следующие 12
- `rel="next"` / `rel="prev"` в метаданных
- Или использовать `generateStaticParams` для всех страниц пагинации

---

### 19. Нет Internal Linking Strategy

В BlogClient.jsx sidebar показывает "Trending Articles" — это хорошо. Но:
- Нет ссылок на services pages (`/[city]/`)
- Нет ссылок из постов на релевантные city pages
- Нет footer links на блог-категории

Внутренняя перелинковка — один из главных SEO-факторов для блога сервисной компании.

---

### 20. Нет `<link rel="alternate" hreflang>` проверить

Если сайт только EN — нужно убедиться что нет дублей с www/non-www или http/https.

---

### 21. Отсутствует `lastModified` в Article schema

В PostClient нет даты обновления в видимом месте страницы. Google ценит свежий контент. Добавить видимую дату "Updated: [date]" в метаданные статьи.

---

### 22. OG Image для постов — нет реального размера

```js
images: [{ url: coverUrl, width: 1200, height: 630, alt: title }]
```

Если `coverUrl` приходит с Strapi без ресайза — изображение может быть любого размера. Нужно убедиться что Strapi отдаёт `width` и `height` или использовать отдельный `og-image` endpoint.

---

## 📋 ПЛАН ПРИОРИТЕТОВ

| Приоритет | Задача | Ожидаемый эффект |
|-----------|--------|-----------------|
| 🔴 P0 | [ВЫПОЛНЕНО] Убрать noindex с prod/staging, оставить только на dev | SEO score 69→90+ |
| 🔴 P0 | [ВЫПОЛНЕНО] Исправить CLS: добавить width/height на все img | CLS 0.969→<0.1 |
| 🔴 P0 | [ВЫПОЛНЕНО] Исправить publisher.logo в Article schema (logo.png→og-image.png) | Schema validity |
| 🟠 P1 | [ВЫПОЛНЕНО] Добавить preload для blog cover/featured image | LCP -1-2s |
| 🟠 P1 | [ВЫПОЛНЕНО] Исправить Article → BlogPosting + добавить недостающие поля | Rich results |
| 🟠 P1 | [ВЫПОЛНЕНО] Добавить OG теги на blog/index и category pages | Social sharing |
| 🟠 P1 | [ВЫПОЛНЕНО] Исправить sitemap: приоритеты, реальные даты, + категории | Crawl efficiency |
| 🟠 P1 | [ВЫПОЛНЕНО] Обновить robots.txt: запретить /api/, /quiz/, /sandbox/ и search queries | Crawl budget |
| 🟠 P1 | [ВЫПОЛНЕНО] Усилить LocalBusiness schema для [city]/page.jsx (areaServed, sameAs, working hours) | SERP enhancements |
| 🟡 P2 | [ВЫПОЛНЕНО] Добавить security headers в _headers | Best Practices 77→90+ |
| 🟡 P2 | [ВЫПОЛНЕНО] Заменить img на next/image в блоге | LCP, image delivery |
| 🟡 P2 | [ВЫПОЛНЕНО] Исправить canonical OG url trailing slash | Consistency |
| 🟡 P2 | [ВЫПОЛНЕНО] Добавить article:modified_time в OG | Content freshness |
| 🟡 P2 | [ВЫПОЛНЕНО] Breadcrumb Schema в SEOBreadcrumbs проверить/добавить JSON-LD | Breadcrumbs в SERP |
| 🟢 P3 | [ВЫПОЛНЕНО] Серверная пагинация блога | Crawlability |
| 🟢 P3 | [ВЫПОЛНЕНО] Internal linking: посты → city pages | Authority distribution |
| 🟢 P3 | [ВЫПОЛНЕНО] CollectionPage schema на категорийных страницах | Schema coverage |
| 🟢 P3 | [ВЫПОЛНЕНО] window.pageYOffset → window.scrollY | Deprecated API fix |
| 🟢 P3 | [ВЫПОЛНЕНО] Touch targets минимум 44x44px | Accessibility |

---

## 🔬 ЧТО ПРОВЕРИТЬ ВРУЧНУЮ (вне Lighthouse)

1. **Google Search Console** → Coverage → посмотреть сколько blog URLs проиндексировано vs submitted
2. **Rich Results Test** (`search.google.com/test/rich-results`) → проверить Article + FAQ + Breadcrumb schemas
3. **Schema.org Validator** (`validator.schema.org`) → проверить JSON-LD на ошибки
4. **Mobile-Friendly Test** (`search.google.com/test/mobile-friendly`) → проверить blog pages
5. **Core Web Vitals** в GSC → реальные данные (не lab), сравнить с Lighthouse
6. **Screaming Frog** → краулинг сайта, найти 404, redirect chains, duplicate titles
7. **Ahrefs/SEMrush** → orphan pages (страницы без внутренних ссылок)

---

*Аудит проведён на основе: PageSpeed Insights данных, анализа исходного кода Next.js 14 App Router, best practices Google Search Central 2025.*

# 14 — Blog: Strapi CMS Setup

## Content Type: `blog-post`

Создаётся в Strapi Admin Panel → Content-Type Builder → Create new collection type.

| Поле | Тип | Настройки |
|---|---|---|
| `title` | Short text | Required |
| `slug` | UID | Target field: `title`, Required |
| `excerpt` | Long text | Required, Max 200 chars |
| `cover` | Media | Single media, Images only |
| `content` | Rich text (Blocks) | - |
| `category` | Short text | - |
| `tags` | JSON | - |
| `readTime` | Number (integer) | Min: 1 |
| `featured` | Boolean | Default: false |
| `seo_title` | Short text | Max 70 chars |
| `seo_description` | Long text | Max 160 chars |

## Author (отдельный Content Type)

Если нужны авторы — создай `author` Content Type:

| Поле | Тип |
|---|---|
| `name` | Short text |
| `role` | Short text |
| `avatar` | Media (single, image) |

Затем в `blog-post` добавь поле `author` → Relation → `blog-post has one author`.

## API Permissions (обязательно!)

Strapi Admin → Settings → Roles → Public → `blog-post`:
- [x] `find`
- [x] `findOne`

Иначе API вернёт 403 Forbidden.

## Страницы

- `/blog` — список постов. Данные из Strapi через `getAllBlogPosts()`.
  Fallback: `src/lib/blog-data.js` (mock данные, если Strapi недоступен).
- `/blog/[slug]` — страница поста. Данные через `getBlogPost(slug)`.
  Fallback: тот же `blog-data.js` + `mockBlogContent`.

## Rich Text в Strapi

Используется тип **Rich Text (Blocks)** — не устаревший Markdown.
Blocks позволяет:
- Вставлять картинки в любое место текста
- Задавать alt text и caption прямо в редакторе
- Использовать h2-h4 для структуры
- Добавлять blockquote, code-блоки, списки

Рендер на фронте (вместо ручной вёрстки, обязательно используйте этот компонент для всех Rich Text полей Strapi): `src/ui/RichTextRenderer/RichTextRenderer.jsx`

## SEO для постов

Каждый пост автоматически получает:
- `<title>`: `seo_title || title` + ` | TVPro Blog`
- `<meta description>`: `seo_description || excerpt`
- `<link rel="canonical">`: `https://tvprousa.com/blog/[slug]/`
- OpenGraph: title, description, image (cover), publishedTime
- JSON-LD: Article schema + BreadcrumbList

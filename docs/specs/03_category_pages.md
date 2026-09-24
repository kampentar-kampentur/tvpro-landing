# Спецификация 03: Страницы категорий (`/blog/category/[slug]/`)

Эта страница группирует статьи по определенной тематике. Это ключевая страница для привлечения категорийного SEO-трафика.

## 1. URL Структура и Описания

Каждая категория имеет свой уникальный URL и SEO-метаданные:

| Категория | URL | Заголовок (Meta Title) | Meta Description (SEO) |
|---|---|---|---|
| **TV Mounting** | `/blog/category/tv-mounting/` | TV Mounting Tips & Installation Guides | Expert guides on how to safely mount any size TV. From choosing brackets to wall types. |
| **Home Theater** | `/blog/category/home-theater/` | Home Theater & Sound System Setup | Build the perfect home theater. Projectors, surround sound, screen placement, and reviews. |
| **Smart Home** | `/blog/category/smart-home/` | Smart Home Installation & Device Guides | Set up and automate your smart home devices. Reviews and setup guides from certified pros. |
| **Cable Management** | `/blog/category/cable-management/` | TV Cable Management & Hiding Guides | Clean up your cable clutter. Learn how to hide TV cables in walls or use raceways. |
| **How-To Guides** | `/blog/category/how-to-guides/` | Step-by-Step Installation Guides | Detailed DIY installation and setup guides written by certified technicians. |
| **Product Reviews** | `/blog/category/product-reviews/` | Expert TV & Gear Reviews | Honest reviews of TV mounts, soundbars, projectors, and smart home devices. |

---

## 2. Структура макета

Макет делится на 2 колонки на десктопе (70% контент, 30% сайдбар):

### 2.1 Левая колонка (Контентная часть)
- **Хлебные крошки (Breadcrumbs):** `Home > Blog > [Category Name]`
- **Заголовок страницы (H1):** Название категории (например, `Smart Home`).
- **Описание категории:** Текст под заголовком (2-3 предложения для SEO).
- **Панель фильтров и сортировки:**
  - `[ Subcategory: All ▼ ]` (если есть подкатегории).
  - `[ Sort by: Latest ▼ ]` (варианты: Latest / Oldest / A-Z).
- **Сетка статей:**
  - Горизонтальные карточки (изображение слева 16:9, справа — категория, название статьи, дата, время чтения и короткий анонс).
  - Лимит: 12 статей на страницу.
- **Пагинация или Infinite Scroll:**
  - Предпочтительно: кнопка `[ Load More ]` для сохранения производительности страницы + стандартная SEO пагинация в тегах (`rel="next"` / `rel="prev"` в `head` документа) для роботов Google.
  - Альтернатива: Числовой блок пагинации: `Page 1 of 5  [ 1 ] [ 2 ] [ 3 ] [ > ] [ >> ]`.

### 2.2 Правая колонка
- Компонент **Сайдбар** (см. Спецификацию 02).
- **Важно:** Сайдбар должен содержать **промо-блок, релевантный этой категории** (например, для категории Smart Home показывать промо по установке умного дома).

---

## 3. Требования к SEO и разметке

- **Канонический URL:** Каждая страница должна содержать `<link rel="canonical" href="https://tvprousa.com/blog/category/[slug]/" />`.
- **Schema.org:** Разметка типа `CollectionPage` (список статей). Пример:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Smart Home Articles & Guides | TVPro",
    "description": "Expert tips and installation guides for smart home devices.",
    "url": "https://tvprousa.com/blog/category/smart-home/"
  }
  ```

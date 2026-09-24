# 🗂 Декомпозиция дисдока блога TVPro

Этот документ разделяет общую «Библию блога» на 6 изолированных модулей (технических спецификаций). Каждая спецификация самодостаточна и содержит все требования, макеты и SEO-параметры для конкретного типа страниц или функционального блока.

Вы можете использовать эти файлы для независимой реализации задач разными разработчиками или ИИ-агентами.

---

## 📂 Спецификации:

1. [01_blog_main_page.md](file:///Users/kampentar/dev/tvpro-landing/docs/specs/01_blog_main_page.md) — **Главная страница листинга (`/blog/`)**
   - *Промо-баннер, навигация с дропдауном категорий, Featured + The Latest, секции категорий.*
2. [02_sidebar_and_trending.md](file:///Users/kampentar/dev/tvpro-landing/docs/specs/02_sidebar_and_trending.md) — **Сайдбар: Trending + Promo-блок**
   - *Виджет трендовых статей, рекламный Ad-блок (дизайн, логика подбора офферов по категориям).*
3. [03_category_pages.md](file:///Users/kampentar/dev/tvpro-landing/docs/specs/03_category_pages.md) — **Страницы категорий (`/blog/category/[slug]/`)**
   - *Сетка статей с бесконечной прокруткой / пагинацией, фильтры, сортировка, мета-описания.*
4. [04_article_page.md](file:///Users/kampentar/dev/tvpro-landing/docs/specs/04_article_page.md) — **Анатомия статьи (`/blog/[slug]/`)**
   - *Breadcrumbs, Table of Contents, Lead, Inline CTA, авторский блок, рейтинг полезности, Related Articles.*
5. [05_search_and_navigation.md](file:///Users/kampentar/dev/tvpro-landing/docs/specs/05_search_and_navigation.md) — **Live-поиск и страница результатов (`/blog/search/`)**
   - *Интерактивная кнопка поиска, выпадающий список (autocomplete), страница результатов.*
6. [06_seo_schemas_exit_popup.md](file:///Users/kampentar/dev/tvpro-landing/docs/specs/06_seo_schemas_exit_popup.md) — **SEO, разметка Schema и Exit-Intent Popup**
   - *Схемы JSON-LD (Article, FAQ, CollectionPage), метатеги, логика и дизайн триггера ухода.*

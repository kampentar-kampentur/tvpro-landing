# TVPro Design DNA

Это документация дизайн-системы сайта **tvprousa.com**.

Читай её **перед тем как писать любой UI-код** для этого проекта.  
Здесь описаны все правила: цвета, типографика, карточки, кнопки, сетки, анимации и паттерны блоков.

---

## Структура

| Файл | Что внутри |
|---|---|
| [`01-tokens.md`](./01-tokens.md) | CSS-переменные: цвета, шрифты, border-radius, тени, transitions |
| [`02-typography.md`](./02-typography.md) | Заголовки, параграфы, глобальные классы `.blockHeading` / `.subText` |
| [`03-cards.md`](./03-cards.md) | DNA карточки — TrustCard, ServiceCard, TechCard, chip-теги |
| [`04-buttons.md`](./04-buttons.md) | Button API, Primary/Secondary варианты, QuoteButton, chips |
| [`05-layout.md`](./05-layout.md) | Сетки, контейнеры `.block`, spacing, breakpoints, swipe-карусель |
| [`06-blocks.md`](./06-blocks.md) | Паттерн блока: структура папки, JSX шаблон, Strapi data, BlockRenderer |
| [`07-interactions.md`](./07-interactions.md) | Hover rules, pulse-анимации, swipe, transitions |
| [`08-anti-patterns.md`](./08-anti-patterns.md) | Что НЕЛЬЗЯ делать — типичные ошибки + чеклист перед PR |
| [`09-header.md`](./09-header.md) | Header: fixed, мобильная FAB-кнопка, бургер CSS-only |
| [`10-footer.md`](./10-footer.md) | Footer: структура, CTAProvider, динамические данные |
| [`11-modal.md`](./11-modal.md) | Modal: overlay, стили, ModalProvider API, z-index иерархия |
| [`12-form-and-selection.md`](./12-form-and-selection.md) | Квиз-форма, SelectionCard (default/selected/hover), прогресс-бар |
| [`13-hero.md`](./13-hero.md) | Hero: единственный h1, RunningTextLine, CTA-исключения, SEOBreadcrumbs |


---

## Главные принципы в трёх строках

1. **Белые плоские карточки** — `#fff`, `border: 1px solid #e7e7eb`, `border-radius: 20px`. Никаких glassmorphism, gradient-overlay, тёмных фонов на карточках.
2. **Один акцентный цвет** — `var(--green)` = `#0d64a0`. Он идёт только на CTA-кнопки и единичные акценты. Не красить им обычный текст.
3. **Mobile-first** — основной трафик мобильный. Все компоненты сначала проектируются для 375–430px.

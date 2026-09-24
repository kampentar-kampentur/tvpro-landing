# Спецификация 06: SEO, разметка Schema и Exit-Intent Popup

Спецификация описывает два ключевых фактора для повышения конверсии и видимости блога в Google: разметку структурированных данных (Schema Markup) и триггер возврата уходящих пользователей (Exit-Intent Popup).

## 1. Структурированные данные (Schema.org JSON-LD)

Каждый тип страниц блога должен снабжаться соответствующим скриптом разметки в формате JSON-LD.

### 1.1 Разметка статьи (Article Schema)
Размещается на странице `/blog/[slug]/`.
```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle", // Или "Article" / "BlogPosting"
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://tvprousa.com/blog/how-to-mount-tv-drywall/"
  },
  "headline": "How to Mount a TV on Drywall Safely",
  "image": [
    "https://tvprousa.com/images/covers/drywall-tv-mount.jpg"
  ],
  "datePublished": "2026-06-17T08:00:00+08:00",
  "dateModified": "2026-06-18T10:20:00+08:00",
  "author": {
    "@type": "Person",
    "name": "Alex M.",
    "jobTitle": "Lead Certified Installer",
    "image": "https://tvprousa.com/images/team/alex-m.jpg"
  },
  "publisher": {
    "@type": "Organization",
    "name": "TVPro",
    "logo": {
      "@type": "ImageObject",
      "url": "https://tvprousa.com/logo.png"
    }
  },
  "description": "Learn the safe way to mount heavy TVs on drywall without damaging your walls..."
}
```

### 1.2 Разметка вопросов и ответов (FAQ Schema)
Если в статье есть блок FAQ, он размечается отдельно для отображения расширенных сниппетов (Rich Snippets) в выдаче Google:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Can you mount a TV on drywall without a stud finder?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "It is highly recommended to use a stud finder. If mounting without studs, you must use heavy-duty toggle bolts."
    }
  }]
}
```

---

## 2. Exit-Intent Popup (Попап при попытке ухода)

Окно всплывает, когда поведение пользователя указывает на намерение покинуть сайт.

### 2.1 Логика триггеров
- **Desktop (Мышь):**
  - Срабатывает, когда курсор мыши выходит за верхнюю границу документа (`clientY < 20` в событии `mouseleave` на объекте `document`).
- **Mobile (Скролл и действия):**
  - Триггер 1: Быстрый скролл вверх (пользователь тянется к адресной строке для ввода нового URL).
  - Триггер 2: Прошло более 45 секунд на странице, при этом прокручено более 50% статьи, и пользователь не совершил никаких кликов.
- **Ограничение частоты показов (Capping):**
  - При закрытии попапа или отправке формы записывается метка в `localStorage.setItem('exit_popup_shown_at', new Date().getTime())`.
  - Попап не показывается повторно в течение следующих 7 дней.

### 2.2 Дизайн и структура попапа
- **Задний фон:** Полупрозрачный темный блюр (`backdrop-filter: blur(8px) bg-black/60`).
- **Заголовок:** Увлекающий заголовок, например: `Wait! Don't leave your TV on the floor...`
- **Оффер:** Конкретная выгода: `Get $15 OFF your first TV mounting service. Claim your coupon code now.`
- **Форма ввода:** Поле для ввода Email или телефона + Кнопка `[ Claim $15 Discount → ]`.
- **Кнопка закрытия:** Крестик в углу + мелкая ссылка внизу `No thanks, I'll pay full price`.
- При успешной отправке формы показывается промокод на экране и отправляется на почту/в CRM.

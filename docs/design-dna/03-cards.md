# 03 — Cards

Карточки — основной UI-элемент сайта. Они используются повсюду.

> **Главный принцип:** Все карточки — **белые плоские прямоугольники** с тонкой границей.  
> Никаких тёмных фонов, никаких glassmorphism, никаких градиентных overlay поверх фото.

---

## Базовая DNA карточки

Каждая карточка на сайте наследует эти стили:

```css
.card {
  background-color: var(--white);      /* #ffffff */
  border: 1px solid #e7e7eb;           /* var(--gray-extra-light) */
  border-radius: 20px;
  padding: 30px–40px;
  display: flex;
  flex-direction: column;
  gap: 12–16px;
  position: relative;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}
```

### Hover-эффект карточки (desktop only)

```css
@media (hover: hover) {
  .card:hover {
    background-color: #fff;
    border-color: #fff;
    box-shadow:
      0px 5px 11px 0px #0000001f,
      0px 19px 19px 0px #00000017,
      0px 44px 26px 0px #00000014,
      0px 78px 31px 0px #0000000a,
      0px 121px 34px 0px #00000005;
  }
}
```

---

## TrustCard — эталонная карточка

**Источник:** [`src/blocks/WhyCustomersTrustUs/components/TrustCard.module.css`](../../src/blocks/WhyCustomersTrustUs/components/TrustCard.module.css)

Самая простая карточка на сайте. **Используй её как шаблон** для всего нового.

```
┌─────────────────────────┐
│  [icon]                 │
│  Title                  │  ← font-weight: 500, 20px, --foreground
│  Description text       │  ← font-weight: 400, 16px, --gray
└─────────────────────────┘
padding: 40px (desktop) / 24px 20px (mobile)
```

**Мобильный вариант:** description скрыт, заголовок уменьшается до 16px.

---

## ServiceCard

**Источник:** [`src/ui/ServiceCardWithMobile/ServiceCard.module.css`](../../src/ui/ServiceCardWithMobile/ServiceCard.module.css)

Карточка для услуг. Центрированный контент, иконка + название.

```
Desktop:                     Mobile:
┌─────────────┐              ┌─────────────┐
│             │              │ [title]     │
│  [icon]     │  →           │             │
│  Title      │              └─────────────┘
│  Description│  (скрывается на hover)
│  [CTA btn]  │  (появляется на hover)
└─────────────┘
```

- Desktop: `min-height: 280px`, центрированный, `padding: 30px`
- Mobile: `height: 120px`, `border-radius: 12px`, `padding: 16px`, выравнивание по левому краю

---


```css
.photoWrapper {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}
/* mobile: 56px */
```

### Активная точка (primary pulse dot)

```css
.pulse {
  width: 8px;
  height: 8px;
  background-color: var(--green);
  border-radius: 50%;
}
.pulse::after {
  /* кольцо пульсации — расширяется и исчезает */
  animation: dotPulse 2s infinite ease-in-out;
}
```

---

## Chip / Pill элементы

Используются как теги и статус-пилюли. **Источник:** `OptionalAddons.module.css`

```css
.chip {
  background-color: rgba(14, 14, 19, 0.05);
  border: 1px solid rgba(14, 14, 19, 0.1);
  border-radius: 36px;
  padding: 6px 14px;         /* маленький */
  /* или: 12px 24px          /* большой (OptionalAddons) */
  font-weight: 500;
  font-size: 12–14px;
  color: var(--foreground);
  white-space: nowrap;
}
```

---

## Правила создания новых карточек

```
✅ Наследуй базовую DNA: белый фон, 1px #e7e7eb граница, 20px радиус
✅ Для контентных карточек используй padding: 30–40px desktop / 24px 20px mobile
✅ Для медиа-карточек используй padding: 8px (со скруглением медиа-файла 12px)
✅ Текст заголовка: --foreground, 20px, font-weight 500–700
✅ Текст описания: --gray, 16px, font-weight 400
✅ Chip-теги: rgba(14,14,19,.05) фон, rgba(14,14,19,.1) граница, border-radius 36px
✅ Hover только через @media (hover: hover) — не трогать мобильных

❌ НЕ делай тёмные карточки (dark background)
❌ НЕ добавляй градиенты или glassmorphism на контент карточек
❌ НЕ используй другой border-radius кроме 20px для карточек (все карточки на десктопе и мобильном имеют радиус 20px)
❌ НЕ ставь цветной border (только #e7e7eb или белый)
```

---

## 3. Семейства карточек

Карточки на сайте делятся на две основные категории: **Контентные карточки** и **Медиа-карточки**.

### А. Контентные карточки (Текст, иконки, CTA)
Используются для текстовой информации и простых интерфейсных элементов.
* **Примеры:** `TrustCard` (блоки отзывов/преимуществ), `ServiceCard` (услуги), `SelectionCard` (выбор в квизах).
* **Специфика:** Большие внутренние отступы (`padding: 30–40px`), фокус на тексте и небольших иконках/аватарах.

### Б. Медиа-карточки (Крупные фото и видео)
Используются везде, где во главе угла стоит графический контент (видео, фотографии работ, блоги, сертификаты, портреты мастеров).
* **Примеры:**
  1. `VideoCard` (`src/blocks/WorkVideoGallery`) — превью видеоотчетов.
  2. `BlogCard` (`src/app/blog`) — карточки статей в блоге.
  3. `CertificateCard` (`src/blocks/Certificates`) — карточки сертификатов и лицензий.
  4. `PhotoCard` (`src/blocks/GalleryOfWork`) — примеры выполненных работ.
  5. `TechCard` (`src/blocks/OurTeam`) — карточки мастеров/сотрудников.
* **DNA Медиа-карточек:**
  * **Отступы:** `padding: 8px` на десктопе (на мобильных может уменьшаться до `6px` или `0` для экономии места).
  * **Медиа-область:** Изображение или превью видео занимает верхнюю часть карточки и имеет внутренний радиус скругления `12px` (на мобильных допускается до `14px`), чтобы гармонично вписываться в общую рамку.
  * **Контентная область:** Заголовки, описания и кнопки располагаются под медиа-файлом в контейнере со стандартными внутренними отступами (`padding: 24px` на десктопе / `16px-20px` на мобильных).
  * **Hover-эффекты:** При наведении карточка получает тень, а изображение внутри плавно масштабируется (`transform: scale(1.03)` или `scale(1.05)`) с мягким переходом (`transition: transform 0.4s ease`).


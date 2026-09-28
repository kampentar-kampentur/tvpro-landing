# 08 — Anti-Patterns (Чего НЕ делать)

Это список конкретных ошибок, которые **нарушают дизайн-систему** сайта.  
Проверяй этот список перед каждым PR.

---

## ❌ Цвета

### Не красить текст в primary-цвет

```css
/* ❌ Неправильно */
.role { color: var(--green); }

/* ✅ Правильно — вторичный текст всегда серый */
.role { color: var(--gray); }
```

`var(--green)` — только для CTA-кнопок и единичных accent-элементов (активная точка).

### Не вводить посторонние цвета

```css
/* ❌ Запрещено — цвета не из дизайн-системы */
color: #2ec4b6;     /* чужой teal */
color: #22c55e;     /* чужой зелёный */
color: #f43f5e;     /* чужой красный */
background: linear-gradient(135deg, ...);  /* на карточках */
```

---

## ❌ Карточки

### Не делать тёмные карточки

```css
/* ❌ Неправильно */
.card {
  background: #1a1a2e;
  color: white;
}

/* ✅ Правильно */
.card {
  background: var(--white);
  border: 1px solid #e7e7eb;
}
```

### Не копировать паттерны WorkVideoGallery для контентных карточек

`WorkVideoGallery` — это видео-плитка с затемнёнными оверлеями.  
Для карточек с людьми, услугами, доверием — это **чужеродная ДНК**.

```
❌ imageWrapper с position: absolute overlay
❌ glassmorphism поверх фото
❌ gradient-to-bottom на фото
```

### Не менять border-radius произвольно

```css
/* ❌ Неправильно */
border-radius: 8px;   /* слишком мало для карточки */
border-radius: 24px;  /* нестандартно */

/* ✅ Правильно */
border-radius: 20px;  /* Карточки (все: десктоп и мобильный) */
border-radius: 12px;  /* Внутренние элементы карточек (картинки, слайдеры) */
border-radius: 36px;  /* Кнопки (все) и chip-теги */
```

---

## ❌ Типографика

### Не использовать другие шрифты

```css
/* ❌ */
font-family: 'Montserrat', sans-serif;
font-family: 'Inter', sans-serif;

/* ✅ */
/* Не указывай font-family вообще — наследуется от body */
```

### Не создавать новые размеры шрифтов

Допустимый набор: `12px / 14px / 16px / 20px / 28px / 44px`

```css
/* ❌ */
font-size: 18px;
font-size: 22px;
font-size: 36px;
```

### Не забывать мобильные стили для заголовков

```css
/* ❌ Только desktop */
.blockHeading { font-size: 44px; }

/* ✅ Правильно — через глобальный класс в globals.css */
/* .blockHeading уже адаптивный — используй просто className="blockHeading" */
```

---

## ❌ Hover и анимации

### Hover без media query

```css
/* ❌ Сломает тач-устройства */
.card:hover { box-shadow: ...; }

/* ✅ Правильно */
@media (hover: hover) {
  .card:hover { box-shadow: ...; }
}
```

### Анимации не из дизайн-системы

```css
/* ❌ Слишком быстро/медленно */
transition: all 0.05s;
transition: all 1s;

/* ✅ Стандарт */
transition: background-color 0.3s ease;
transition: transform 0.4s ease;
```

---

## ❌ Архитектура

### Не создавать inline-стили

```jsx
/* ❌ */
<div style={{ color: '#0d64a0', padding: '30px' }}>

/* ✅ */
<div className={styles.myElement}>
```

### Не дублировать стили — переиспользуй существующее

```
✅ Карточка нужна? → Наследуй DNA TrustCard
✅ Кнопка нужна? → Используй <Button> или <QuoteButton>
✅ Chip-тег нужен? → Скопируй стиль из OptionalAddons
❌ Не изобретай новое — сначала проверь что уже есть в /ui и /blocks
```

### Не создавать голые `<button>` элементы

```jsx
/* ❌ */
<button onClick={...}>Get Quote</button>

/* ✅ */
<QuoteButton size="big">Get Quote</QuoteButton>
```

---

## ❌ Mobile First

### Не проектировать только desktop

```
✅ Порядок написания CSS:
  1. Base styles (mobile)
  2. @media (min-width: 1024px) { /* desktop overrides */ }

❌ Не делай наоборот:
  1. Desktop styles
  2. @media (max-width: 1024px) { /* mobile fixes */ }
```

Основной трафик — мобильный. Mobile — это базовый кейс, не исключение.

---

## Чеклист перед PR

```
□ Все цвета из var(--*) токенов?
□ Карточки белые с border: 1px solid #e7e7eb?
□ Hover только через @media (hover: hover)?
□ Используется QuoteButton вместо голого button для CTA?
□ Заголовок блока — className="blockHeading" (глобальный класс)?
□ Субтайтл блока — className="subText" (глобальный класс)?
□ Блок зарегистрирован в BlockRenderer и page.jsx?
□ Есть мобильная версия (mobile-first)?
□ Нет посторонних font-family?
□ Нет border-radius отличного от 20px/12px/36px?
```

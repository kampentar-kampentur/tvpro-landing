# 01 — Design Tokens (CSS Variables)

Все токены объявлены в [`src/app/globals.css`](../../src/app/globals.css) в `:root`.

---

## Цвета

| Переменная | Hex | Применение |
|---|---|---|
| `--background` | `#f6f6f8` | Фон всего сайта (страница) |
| `--white` | `#ffffff` | Фон карточек, кнопок |
| `--foreground` | `#0e0e13` | Основной текст, заголовки, иконки |
| `--green` | `#0d64a0` | **Primary / Brand** — CTA-кнопки, пульсирующие точки |
| `--green-hover` | `#0a4d7d` | Hover-состояние primary-кнопки |
| `--gray` | `#91929c` | Вторичный текст (описания, подписи) |
| `--gray-medium` | `#6B6A73` | Средний серый, промежуточные тексты |
| `--gray-light` | `#dbdbdf` | Светлые рамки, разделители |
| `--gray-extra-light` | `#e7e7eb` | **Ключевая граница карточек** (`border: 1px solid #e7e7eb`) |
| `--text-secondary` | = `--gray` | Алиас для вторичного текста |

### Правила использования цветов

```
✅ var(--green)       — только CTA-кнопки и единичные accent-элементы
✅ var(--foreground)  — заголовки, названия, основной текст
✅ var(--gray)        — описания, биографии, подписи карточек
❌ НЕ использовать var(--green) для обычных параграфов и подзаголовков
❌ НЕ вводить новые цвета без обоснования
❌ НЕ использовать teal (#2ec4b6), зелёный (#22c55e) или любой другой brand-цвет не из этого списка
```

---

## Шрифт

```css
font-family: 'Red Hat Display', var(--font-red-hat-display), Arial, Helvetica, sans-serif;
```

- Загружается через `next/font/google` (`Red_Hat_Display`) в [`src/app/layout.js`](../../src/app/layout.js)
- `font-display: swap` — обязательно
- Весь сайт использует **один шрифт**, вариации только по `font-weight`

### Веса шрифта

| Weight | Применение |
|---|---|
| `400` | Обычный текст, описания |
| `500` | Подзаголовки карточек, chip-теги |
| `600` | Мобильный заголовок карточки |
| `700` | Главные заголовки (`h1`, `h2`), CTA-кнопки |

---

## Скругления (border-radius)

| `20px` | Карточки (все: десктоп и мобильный) |
| `12px` | Внутренние элементы карточек (изображения, обертки) |
| `36px` | Кнопки (все), chip-теги |
| `50%` | Аватары, круглые иконки |
| `4px` | Мелкие бейджи (цена, ярлыки) |

---

## Тени (box-shadow)

Используется **один стандартный shadow** для hover-состояний карточек:

```css
box-shadow:
  0px 5px 11px 0px #0000001f,
  0px 19px 19px 0px #00000017,
  0px 44px 26px 0px #00000014,
  0px 78px 31px 0px #0000000a,
  0px 121px 34px 0px #00000005;
```

Для primary-кнопки:
```css
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
/* на hover: */
box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
```

---

## Переходы (transitions)

```css
/* Карточки */
transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

/* Кнопки */
transition: background 0.2s, color 0.2s, border 0.2s;

/* Изображения в карточках */
transition: transform 0.4s ease;
```

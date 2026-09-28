# 07 — Interactions & Animations

---

## Ключевое правило: hover только на pointer-устройствах

```css
/* ✅ Правильно — hover только там где есть мышь */
@media (hover: hover) {
  .card:hover {
    box-shadow: ...;
    border-color: #fff;
  }
}

/* ❌ Неправильно — сломается на мобильном */
.card:hover { ... }
```

На мобильных устройствах hover-состояния заменяются tap-логикой через JS (если нужно).

---

## Стандартный hover карточки

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

## Стандартный hover кнопки Primary

```css
.primary:hover:not(.disabled) {
  background: var(--green-hover);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
  transform: translateY(-3px);
}

.primary:active:not(.disabled) {
  filter: brightness(0.92);
}
```

---

## Hover изображения внутри карточки

```css
.photo {
  transition: transform 0.4s ease;
}

@media (hover: hover) {
  .card:hover .photo {
    transform: scale(1.04);
  }
}
```

---

## Pulse-анимация (активная точка)

Используется в TechCard для обозначения «онлайн» специалиста.

```css
.pulse {
  background-color: var(--green);
  border-radius: 50%;
  position: relative;
}

.pulse::after {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  border-radius: 50%;
  background-color: var(--green);
  animation: dotPulse 2s infinite ease-in-out;
}

@keyframes dotPulse {
  0%   { transform: scale(1);   opacity: 0.8; }
  100% { transform: scale(2.8); opacity: 0;   }
}
```

---

## Горизонтальный swipe на мобильном

Для списков карточек на мобильном используется горизонтальный скролл.

```css
.grid {
  /* Mobile */
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 12px;
  padding-bottom: 16px;
  scrollbar-width: none;
}

.grid::-webkit-scrollbar { display: none; }

.card {
  flex: 0 0 85%;       /* 85% ширины экрана */
  scroll-snap-align: start;
}

/* Desktop — переключаемся на grid */
@media (min-width: 1024px) {
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    overflow-x: visible;
  }
  .card {
    flex: none;
  }
}
```

---

## Переходы (transitions) — стандартные значения

```css
/* Карточки (фон, тень, граница) */
transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

/* Кнопки */
transition: background 0.2s, color 0.2s, border 0.2s;

/* Изображение zoom */
transition: transform 0.4s ease;

/* Позиция (lift эффект кнопки) */
transition: transform 0.2s;
```

---

## Running text line (Hero)

Анимированная бегущая строка в Hero использует CSS animation.  
Смотри [`src/blocks/Hero/components/RunningTextLine.js`](../../src/blocks/Hero/components/RunningTextLine.js).

---

## Мобильный tap — показ скрытого контента

На мобильных (при `pointer: coarse`) карточки могут открывать контент по тапу.

```css
@media (pointer: coarse) {
  .invisibleButton {
    display: block;
    visibility: visible;
  }
}
```

```css
/* В ServiceCard: открытое состояние */
.isShowInfo {
  background-color: white;
  height: fit-content;
  z-index: 10;
  box-shadow: /* стандартная тень */;
}
.isShowInfo .description { display: inline; }
```

---

## Что НЕ делать с анимациями

```
❌ НЕ используй hover без @media (hover: hover) — ломает мобильные
❌ НЕ добавляй тяжёлые анимации (parallax, сложные 3D) без согласования
❌ НЕ используй нестандартные цвета для пульса/точек — только var(--green)
❌ НЕ делай анимации которые блокируют контент (animation-fill-mode forwards без reset)
```

# 12 — Form & SelectionCard

Формы используются внутри модалок (квиз для получения квоты).

---

## Form

**Источник:** [`src/ui/Form/`](../../src/ui/Form/)

### Структура квиза

Форма — это пошаговый квиз (multi-step form). Каждый шаг:
```
[Заголовок шага]
[Сетка SelectionCard — варианты выбора]
[← Back]   [Next →]
```

### Заголовок шага

```css
.fieldLabel {
  font-weight: 800;
  font-size: 28px;
  line-height: 40px;
}
```

### Сетка вариантов

```css
.optionsGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  grid-auto-rows: 120px;
  max-width: 736px;
}

@media (max-width: 980px) {
  .optionsGrid {
    grid-template-columns: repeat(auto-fit, minmax(135px, 0.5fr));
  }
}
```

### Прогресс-бар (мобильный)

На мобильном внизу экрана показывается прогресс прохождения квиза:

```css
.progressWrapper {
  position: fixed;
  bottom: 12px;
  left: 16px; right: 16px;
  height: 18px;
  background-color: var(--gray-extra-light);
  border-radius: 9px;
}

.progressFill {
  background-color: var(--green);   /* заполнение прогресса */
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 9px;
}
```

---

## SelectionCard — карточка выбора в квизе

**Источник:** [`src/ui/SelectionCard/SelectionCard.module.css`](../../src/ui/SelectionCard/SelectionCard.module.css)

SelectionCard — это **кликабельная карточка-вариант** в форме квиза. Отличается от обычных карточек тем, что имеет **selected-состояние**.

### Размеры

```css
.card {
  height: 120px;
  padding: 16px;
  border-radius: 12px;    /* ← мобильный радиус (меньше чем у контентных карточек) */
  border: 1px solid var(--gray-light);
  background-color: transparent;
}
```

### Состояния

```css
/* Default — прозрачный с серой рамкой */
.card {
  background: transparent;
  border: 1px solid var(--gray-light);
  color: var(--foreground);
}

/* Selected — тёмный инвертированный */
.selected {
  background-color: var(--foreground);   /* #0e0e13 */
  color: var(--white);
  border: none;
  padding: 17px;   /* +1px чтобы компенсировать border */
}

/* Hover (desktop only) */
@media (hover: hover) {
  .card:hover {
    background-color: white;
    box-shadow: /* стандартная тень */;
    border: white;
  }
  .card.selected:hover {
    background-color: var(--foreground);  /* остаётся тёмным */
  }
}
```

### Ценник на карточке

```css
.price {
  position: absolute;
  bottom: 17px;
  right: 0;
  background-color: #E7E7EB;
  color: var(--foreground);
  border-radius: 4px 0 0 4px;  /* скруглён только слева */
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
}

.selected .price {
  background-color: #353535;   /* тёмный вариант для выбранной карточки */
  color: #fff;
}
```

---

## Главный заголовок квиза

```css
.bestQuoteTitle {
  font-weight: 500;
  font-size: 44px;
  line-height: 60px;
  margin-bottom: 40px;
}
```

---

## Правила

```
✅ SelectionCard selected = var(--foreground) фон (инверсия) — НЕ var(--green)
✅ Прогресс-бар = var(--green) на мобильном внизу экрана
✅ Hover квиза-карточки только через @media (hover: hover)
✅ Ценник на карточке: border-radius: 4px 0 0 4px — "висит" на правом крае
❌ НЕ используй другие цвета для selected состояния
❌ НЕ показывай прогресс-бар на desktop (display: none при min-width: 981px)
```

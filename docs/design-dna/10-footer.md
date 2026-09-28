# 10 — Footer

**Источник:** [`src/blocks/Footer/Footer.js`](../../src/blocks/Footer/Footer.js)

---

## Структура

```
┌──────────────────────────────────────────────────────┐
│  [Logo]                    Phone: (877) 455-5535     │
│  © 2025 TV PRO Handy       Email: tvpro...@gmail.com │
│  Sitemap • Privacy • Terms • Cookie Policy           │
└──────────────────────────────────────────────────────┘
```

Footer — `"use client"` компонент (использует `useCTA()` хук для динамических данных).

---

## CTA Provider

Footer и Header используют хук `useCTA()` из `CTAProvider`:

```jsx
import { useCTA } from "@/providers/CTAProvider";

const cta = useCTA();
// cta.phone, cta.phoneLabel, cta.email, cta.workHours, cta.homeLink
```

Данные CTA могут переопределяться для конкретного города через `cta_override` в Strapi.

---

## Правила

```
✅ Footer — client component ("use client")
✅ Телефон и email берутся из useCTA() — не хардкоди
✅ Ссылки на /privacy-policy/, /terms/, /cookie-policy/ — обязательны
❌ НЕ добавляй в футер новые секции без дизайн-ревью
```

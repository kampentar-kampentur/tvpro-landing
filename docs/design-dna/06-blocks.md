# 06 — Block Patterns

Каждый блок на сайте строится по единому шаблону.  
Если делаешь новый блок — следуй этому паттерну.

---

## Стандартная структура блока

```
BlockName/
├── BlockName.js          ← Основной компонент (server component)
├── BlockName.module.css  ← Стили блока
├── index.js              ← re-export: export { default } from './BlockName'
└── components/           ← Дочерние компоненты
    ├── SubCard.js
    └── SubCard.module.css
```

---

## Паттерн JSX (эталон из CustomerReviews / AboutUs)

```jsx
export default async function MyBlock({ data = {}, cityContext }) {
  // 1. Загрузка дефолтных данных из Strapi
  const defaultData = await getMyBlockData();

  // 2. Мёрж: пропс имеет приоритет над дефолтными данными
  const blockData = {
    ...defaultData,
    ...data,
    title: data?.title || defaultData.title,
    subTitle: data?.subTitle || defaultData.subTitle,
  };

  return (
    // 3. section = семантика, block = глобальный контейнер, id = якорь
    <section className={`block ${styles.myBlock}`} id="myblock">

      {/* 4. header = заголовочная часть */}
      <header className={styles.myBlockHeader}>
        <h2 className="blockHeading">{blockData.title}</h2>
        <p className="subText">{blockData.subTitle}</p>
      </header>

      {/* 5. Основной контент */}
      <div className={styles.cardsContainer}>
        {/* карточки, списки, и т.д. */}
      </div>

      {/* 6. CTA (если нужен) — как в CustomerReviews */}
      <div className={styles.ctaContainer}>
        <p className={styles.ctaText}>Ready to book? Fast, easy, professional.</p>
        <div className={styles.ctaButtons}>
          <QuoteButton size="big" />
        </div>
      </div>

    </section>
  );
}
```

---

## Данные из Strapi

Каждый блок умеет работать в двух режимах:

### 1. Standalone (без пропсов) — для `page.jsx` главной страницы
```jsx
// Блок сам загружает данные из Strapi
<MyBlock />
```

### 2. С данными от BlockRenderer — для динамических страниц городов
```jsx
// BlockRenderer передаёт данные из Strapi layout
<MyBlock data={blockData} cityContext={cityContext} />
```

Поэтому всегда делай:
```js
export default async function MyBlock({ data = {}, cityContext }) {
  const defaultData = await fetchFromStrapi();
  const finalData = { ...defaultData, ...data };  // props override defaults
  // ...
}
```

---

## CTA-секция блока

CTA — стандартный блок в конце секции (пример: CustomerReviews, OurTeam).

```css
/* .ctaContainer */
display: flex;
flex-wrap: wrap;
align-items: center;
justify-content: center;
margin-top: 60px;
gap: 20px;

/* .ctaText */
font-weight: 500;
font-size: 16px;
line-height: 24px;
color: var(--foreground);
text-align: center;
```

```jsx
<div className={styles.ctaContainer}>
  <p className={styles.ctaText}>
    Ready to mount your TV? Book your service now.
  </p>
  <div className={styles.ctaButtons}>
    <QuoteButton size="big" />
  </div>
</div>
```

---

## Блок в BlockRenderer

После создания блока — зарегистрируй его в двух местах:

### 1. [`src/components/BlockRenderer.jsx`](../../src/components/BlockRenderer.jsx)

```jsx
import MyBlock from '@/blocks/MyBlock/MyBlock';

const blockMap = {
  // ...
  'blocks.my-block': MyBlock,
};
```

### 2. [`src/app/page.jsx`](../../src/app/page.jsx) (главная страница)

```jsx
import MyBlock from "@/blocks/MyBlock/MyBlock";

export default async function Home() {
  return (
    <div className={styles.tvproMain}>
      {/* ... */}
      <MyBlock />
      {/* ... */}
    </div>
  );
}
```

---

## Порядок блоков на странице

Текущий порядок (как на `page.jsx`):

```
1. Hero
2. WorkVideoGallery
3. CustomerReviews
4. GalleryOfWork
5. Certificates
6. AboutUs
7. MountingTypes
8. WhyCustomersTrustUs
9. OurTeam          ← авто-инжектируется в BlockRenderer если нет в Strapi
10. FAQ
11. Contacts
12. AreasWeServe
```

---

## Текстовый компонент Text

Strapi возвращает rich text в специальном формате.  
Для вывода текста из Strapi — используй компонент `Text`:

```jsx
import Text from "@/ui/Text/Text";

<h2 className="blockHeading">
  <Text text={blockData.title} cityContext={cityContext} />
</h2>

<p className="subText">
  <Text text={blockData.subTitle} cityContext={cityContext} />
</p>
```

`cityContext` используется для подстановки названия города в текст.

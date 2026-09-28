# 🏙️ Руководство по управлению городами и пригородными кластерами (City Clusters Handbook)

Данный документ является **исчерпывающей технической спецификацией и пошаговой инструкцией** по заведению новых городов (Метрополий) и связанных с ними пригородных кластеров (Suburbs) в экосистеме **TVPro** (Strapi CMS + Next.js Frontend).

---

## 📑 Содержание
1. [Архитектура: Метро-город vs Пригород](#1-архитектура-метро-город-vs-пригород)
2. [SEO-стратегия и индексация (Canonical, Robots, Sitemap)](#2-seo-стратегия-и-индексация)
3. [Как собирать и формировать список пригородов](#3-как-собирать-и-формировать-список-пригородов)
4. [Генерация и уникализация текста (Копирайтинг и SEO)](#4-генерация-и-уникализация-текста)
5. [Работа с медиа-файлами, картинками и видео (Критически важно!)](#5-работа-с-медиа-файлами-картинками-и-видео)
6. [Телефония и контакты (`cta_override`)](#6-телефония-и-контакты-cta_override)
7. [Пошаговый регламент развертывания нового города](#7-пошаговый-регламент-развертывания)
8. [Универсальный скрипт автоматизации](#8-универсальный-скрипт-автоматизации)

---

## 1. Архитектура: Метро-город vs Пригород

Вся система локальных страниц построена на принципе **«Золотого стандарта» (Golden Standard) и динамического наследования макетов**.

```mermaid
flowchart TD
    A[Пользователь открывает URL] --> B{Роут /[city]/}
    B -->|Запрос в Strapi| C[Коллекция cities]
    C --> D{metro_city_slug?}
    
    D -->|null / пустой| E[Главный Метро-город e.g. Houston, Las Vegas]
    E --> E1[Рендерит собственный массив page]
    E --> E2[SEO: robots index, follow]
    E --> E3[Canonical: /city-slug/]
    
    D -->|Указан e.g. houston, las-vegas| F[Пригород e.g. Katy, Henderson]
    F --> F1[page пуст? -> Берет page у Метро-города]
    F --> F2[Подставляет {{city}} и {{state}} на лету]
    F --> F3[SEO: robots noindex, follow]
    F --> F4[Canonical: /metro-city-slug/]
```

### Схема данных в Strapi (`api::city.city`):
* **`city_name`** *(Text)*: Человекочитаемое название города (например, `Las Vegas`, `Henderson`).
* **`path`** *(Text)*: URL-слаг (например, `las-vegas`, `henderson`). Всегда строчные буквы через дефис (kebab-case).
* **`state_code`** *(Text)*: Двухбуквенный код штата в верхнем регистре (например, `NV`, `TX`, `FL`).
* **`metro_city_slug`** *(String)*: 
  * Для **Главного города**: `null` (или пустое).
  * Для **Пригорода**: слаг родительского метро-города (например, `"las-vegas"` для Хендерсона).
* **`page`** *(Dynamic Zone)*: Массив блоков страницы (Hero, Mounting Types, Our Services, FAQ и т.д.).
  * У Метро-города: содержит полный массив из 16+ блоков с привязанными медиа.
  * У Пригородов: **пустой массив `[]`** (макет автоматически наследуется от Метро-города).
* **`seo`** *(Component)*: `metaTitle`, `metaDescription`, `shareImage`.
* **`cta_override`** *(Component)*: `phone` (формат `+1XXXXXXXXXX`), `phoneLabel` (формат `(XXX) XXX-XXXX`).

---

## 2. SEO-стратегия и индексация

Для защиты от санкций поисковых систем за дублирование контента (Duplicate Content Penalty) действует строгое разделение:

| Параметр | Главный город (`metro_city_slug = null`) | Пригород (`metro_city_slug = "metro"`) |
| :--- | :--- | :--- |
| **Robots Meta Tag** | `<meta name="robots" content="index, follow">` | `<meta name="robots" content="noindex, follow">` |
| **Canonical URL** | `https://tvprousa.com/[city]/` (на самого себя) | `https://tvprousa.com/[metro_city_slug]/` (на Метро-город) |
| **Sitemap.xml** | Включен в генерацию | **Исключен** (фильтруется в `sitemap.js`) |
| **HTML Sitemap** | Отображается | **Исключен** (фильтруется в `html-sitemap`) |
| **Блок Areas We Serve** | Отображается в сетке ссылок | Скрыт из общей сетки |
| **Header/Footer Selector** | Отображается в списке выбора городов | Скрыт |
| **Schema.org LocalBusiness** | `areaServed: "City Name, State"` | `areaServed: "Metro City Name"` |

> [!IMPORTANT]
> Пригороды служат для посадки платного трафика (Google Ads, Local Ads) и точного гео-таргетинга клиентов в радиусе обслуживания, передавая весь органический вес и канонический авторитет на главный Метро-город.

---

## 3. Что необходимо на вход и как отбирать города

### 📋 Чек-лист входных данных (Что нужно от бизнеса для запуска региона):
Для развертывания нового региона требуется ровно **3 вещи**:
1. **Название главного Метро-города и штат** (например: `Tampa, FL` или `Irvine, CA`).
2. **Выделенный номер телефона** в формате `+1 XXX-XXX-XXXX` (например: `+1 813-328-6687`), привязанный к CRM/коллтрекингу.
3. **Радиус покрытия на карте или список районов** (например: скриншот Google Maps с радиусом 25–55 миль вокруг центра, либо готовый перечень ключевых населенных пунктов).

---

### 🗺️ Алгоритм отбора городов:

#### А. Выбор Главного Метро-города (Metro Core)
* **Принцип**: Метро-городом всегда выбирается **основной экономический и поисковый центр агломерации** (MSA — Metropolitan Statistical Area), по которому идет наибольший объем органического спроса в Google (например: `tv mounting tampa`, `tv mounting irvine`).
* **Сложные / биполярные агломерации (как Тампа + Сент-Пит или Даллас + Форт-Уэрт)**:
  * В качестве технического ядра (`metro_city_slug = null`) берется город с максимальным населением и известностью (`Tampa`).
  * Второй равнозначный центр (`St. Petersburg`) регистрируется как **флагманский пригород** в кластере (`metro_city_slug = "tampa"`).
  * В текстах главной страницы Метрополии прямо прописывается охват обоих городов (*"Serving Tampa, St. Petersburg & the entire Tampa Bay area"*), а на странице пригорода `/st-petersburg/` клиент видит персональный лендинг Сент-Пита.

#### Б. Правила сбора и отбора пригородов (Suburbs)
Оптимальный размер кластера — **12–18 пригородов**. Это гарантирует плотное покрытие рекламного таргетинга без размытия структуры.

1. **Инструмент**: Открываем Google Maps, центрируемся на главном городе и очерчиваем круг радиусом **25–55 миль** (фактическая зона выезда мастеров).
2. **Платежеспособность и плотность застройки (Household Income & Housing Type)**:
   * Приоритет спальным районам с высокой долей частных домов (Single Family Homes) и современных кондоминиумов.
   * Именно здесь максимальный чек: монтаж телевизоров больших диагоналей (65"-85"+), установка на камины, скрытая проводка в стенах и навеска Samsung The Frame.
3. **Статус и порог населения**:
   * Включаются официальные инкорпорированные города (Cities / Towns) и крупные статистические центры (CDP — Census Designated Places) с населением от **15 000+** жителей.
   * Не включать крошечные деревни или безымянные развязки (по ним нет поискового спроса).
4. **Географическая равномерность**:
   * Пригороды распределяются по всем направлениям (север, юг, восток, запад, побережье), закрывая все секторы вокруг метро-ядра.

---

### Примеры сформированных кластеров:
* **Houston, TX** (13 пригородов): Katy, Sugar Land, The Woodlands, Spring, Cypress, Pearland, Humble, Tomball, Friendswood, League City, Richmond, Missouri City, Conroe.
* **Las Vegas, NV** (13 пригородов): Henderson, North Las Vegas, Summerlin, Enterprise, Spring Valley, Paradise, Sunrise Manor, Winchester, Whitney, Centennial Hills, Southwest Las Vegas, Green Valley, Boulder City.
* **San Antonio, TX** (15 пригородов): New Braunfels, Schertz, Cibolo, Boerne, Universal City, Converse, Live Oak, Selma, Helotes, Alamo Heights, Leon Valley, Fair Oaks Ranch, Timberwood Park, Bulverde, Canyon Lake.
* **Irvine, CA** (15 пригородов): Newport Beach, Costa Mesa, Lake Forest, Tustin, Mission Viejo, Laguna Niguel, Laguna Hills, Aliso Viejo, Huntington Beach, Santa Ana, Orange, Anaheim, Foothill Ranch, San Clemente, Dana Point.
* **Tampa, FL** (18 пригородов): St. Petersburg, Clearwater, Largo, Dunedin, Tarpon Springs, Indian Rocks Beach, Madeira Beach, St. Pete Beach, Pinellas Park, Seminole, Safety Harbor, Palm Harbor, Brandon, Riverview, Wesley Chapel, Lutz, Temple Terrace, Carrollwood.

---

### Правила форматирования записей:
```json
{
  "path": "st-petersburg",
  "city_name": "St. Petersburg",
  "state_code": "FL",
  "metro_city_slug": "tampa"
}
```
* `path` — только строчные буквы и дефисы (kebab-case), без пробелов.
* `city_name` — чистое название города без приписки штата (`St. Petersburg`, а не `St. Petersburg, FL`).
* `state_code` — двухбуквенный код штата заглавными (`FL`, `CA`, `TX`, `NV`).

---

## 4. Генерация и уникализация текста

Тексты для нового города создаются на базе структуры Хьюстона с адаптацией под локальные особенности и интеграцией обязательных SEO-кластеров.

### Динамические переменные (Placeholders):
В шаблонах текстов и заголовков **обязательно** используются переменные:
* `{{city}}` — автоматически подменяется на `Las Vegas` на странице города и на `Henderson` на странице пригорода.
* `{{state}}` — подменяется на код штата (`NV`).

### Spintax (Вариативность текста):
Для автоматической рандомизации фраз при генерации страниц используется Spintax-синтаксис:
```text
{TV Mounting|TV Installation|Television Wall Mounting} in {{city}}, {{state}}
```
Функция `resolveSpintax()` в коде фронтенда случайным образом выбирает один из вариантов для каждого запроса.

### Обязательные SEO-кластеры ключевых слов:
Каждый текстовый пакет нового города **обязан** содержать упоминания следующих групп запросов:

1. **Типы поверхностей**:
   * `mounting a tv on brick`, `wall mount tv brick wall`
   * `mounting tv on sheetrock`, `drywall studs`
   * `mounting a tv to concrete wall`, `masonry anchors`
   * `hanging tv on plaster wall`
2. **Камины и ниши**:
   * `mounting a tv over a gas fireplace`, `mount tv over brick fireplace`
   * `tv above fireplace`, `mounting a tv to a stone fireplace`
   * `tv over mantle`, `pull-down fireplace tv mount`
3. **Samsung The Frame и Flush-монтаж**:
   * `the frame tv installation`, `samsung the frame installation`
   * `mounting frame tv`, `flush-to-wall mounting`
4. **Скрытие проводки**:
   * `wall mount hide wires`, `hiding cables in walls`, `hide wires on wall`
   * `in-wall wire concealment`, `recessed media box installation`
5. **Саундбары и аудио**:
   * `attach soundbar to tv`, `sound bar for wall mounted tv`
   * `install soundbar on wall`, `home theater setup`
6. **Демонтаж и переезд**:
   * `tv dismounting service`, `tv mount removal service`, `unmount my tv`
7. **Same-Day и Handyman**:
   * `same day tv mounting service near me`, `tv mounting near me same day`
   * `handyman to mount tv on wall`, `hire someone to hang tv`
8. **Цены и стоимость**:
   * `tv mounting price`, `tv mount installation cost`, `cost to mount 65 inch tv`

---

## 5. Работа с медиа-файлами, картинками и видео

> [!CAUTION]
> **Критическое правило Strapi v5**: В Strapi v5 при сохранении или обновлении компонентов через ORM (`strapi.documents(...)`) или REST API, поля медиа-файлов (`image`, `video`, `badges`, `certificates`) должны передаваться **СТРОГО в виде числовых ID файлов** (`image: 98` или `badges: [12, 14]`), а **НЕ в виде объектов `{ url: "..." }`**!

### Почему возникает баг «пропавших картинок»:
Если при клонировании объекта блока запустить наивную очистку полей (`delete val.id`), объект медиа-файла превращается в `{ name: "...", url: "..." }` без `id`. Strapi v5 не может сопоставить такой объект с существующим файлом в Media Library и **записывает `null`**, из-за чего на фронтенде карточки рендерятся пустыми без картинок.

### Функция безопасного клонирования медиа:
```javascript
function processMediaAndClean(val) {
  if (val === null || val === undefined) return val;
  if (Array.isArray(val)) {
    return val.map(processMediaAndClean);
  }
  if (typeof val === 'object') {
    // Если это объект медиа-файла Strapi — возвращаем его числовой ID!
    if (val.mime || val.ext || val.hash || val.provider || (val.url && val.id && !val.__component)) {
      return val.id;
    }
    const res = {};
    for (const key of Object.keys(val)) {
      // Удаляем ID компонентов, но сохраняем ID медиа-файлов
      if (['id', 'createdAt', 'updatedAt', 'publishedAt', 'documentId'].includes(key)) {
        continue;
      }
      res[key] = processMediaAndClean(val[key]);
    }
    return res;
  }
  return val;
}
```

### Стандартные ID системных изображений в Strapi:
* **Кронштейны (`blocks.tv-mounting-types`)**:
  * Fixed Mount: `id: 98` (`Property_1_Fixed_Color_Light_31f5a6b404.svg`)
  * Tilting Mount: `id: 95` (`Property_1_Tilting_Color_Light_443023703d.svg`)
  * Full-Motion Mount: `id: 97` (`Property_1_Full_Motion_Color_Light_585132ff23.svg`)
  * Specialty Mount: `id: 96` (`Property_1_Special_Mount_Color_Light_b9d06946e6.svg`)

---

## 6. Телефония и контакты (`cta_override`)

Каждый кластер городов имеет свой выделенный телефонный номер для отслеживания конверсий в CRM/Workiz.

### Структура объекта:
```json
"cta_override": {
  "phone": "+17252524163",
  "phoneLabel": "(725) 252-4163"
}
```
* `phone` — формат E.164 без пробелов и скобок (используется в ссылках `tel:+17252524163`).
* `phoneLabel` — человекочитаемый формат с кодом зоны в скобках.

---

## 7. Пошаговый регламент развертывания

### Шаг 1: Подготовка JSON-пакета города
Создайте файл `[city-slug]-parsed.json` в корне репозитория `strapi` по образцу [`las-vegas-parsed.json`](file:///Users/kampentar/dev/strapi/las-vegas-parsed.json).

### Шаг 2: Запуск развертывания
Запустите универсальный скрипт развертывания (см. Раздел 8) через Railway CLI:
```bash
cd /Users/kampentar/dev/strapi
railway run node deploy-city-cluster.js --city=las-vegas
```

### Шаг 3: Верификация в базе данных
Проверьте, что REST API бэкенда возвращает все 16 блоков и картинки:
```bash
node -e '
const qs = require("qs");
async function test() {
  const query = qs.stringify({
    filters: { path: { $eq: "las-vegas" } },
    populate: { page: { on: { "blocks.tv-mounting-types": { populate: { mountingTypes: { populate: { image: { populate: "*" } } } } } } } }
  });
  const res = await fetch("https://strapi-production-20d6.up.railway.app/api/cities?" + query);
  const json = await res.json();
  console.log(JSON.stringify(json.data?.[0]?.page, null, 2));
}
test();
'
```

### Шаг 4: Пересборка фронтенда (Next.js SSG Cache)
Так как Next.js статически генерирует страницы городов на этапе сборки (`force-cache`), необходимо:
1. Запустить пересборку на Vercel (Redeploy) или сделать пуш в ветку `main`.
2. Проверить отображение страниц `https://tvprousa.com/[city-slug]/` и `https://tvprousa.com/[suburb-slug]/`.

---

## 8. Универсальный скрипт автоматизации

Скрипт [`deploy-city-cluster.js`](file:///Users/kampentar/dev/strapi/deploy-city-cluster.js) полностью автоматизирует процесс для любого нового города:

```javascript
require('dotenv').config();
const fs = require('fs');
const path = require('path');

function processMediaAndClean(val, cityName, stateCode, citySlug) {
  if (val === null || val === undefined) return val;
  if (Array.isArray(val)) {
    return val.map(v => processMediaAndClean(v, cityName, stateCode, citySlug));
  }
  if (typeof val === 'object') {
    if (val.mime || val.ext || val.hash || val.provider || (val.url && val.id && !val.__component)) {
      return val.id;
    }
    const res = {};
    for (const key of Object.keys(val)) {
      if (['id', 'createdAt', 'updatedAt', 'publishedAt', 'documentId'].includes(key)) continue;
      res[key] = processMediaAndClean(val[key], cityName, stateCode, citySlug);
    }
    return res;
  }
  if (typeof val === 'string') {
    return val
      .replace(/Houston/g, cityName)
      .replace(/houston/g, citySlug)
      .replace(/TX/g, stateCode);
  }
  return val;
}

async function deployCityCluster({ cityConfig, suburbsList }) {
  const { createStrapi } = require('@strapi/strapi');
  const app = createStrapi();
  await app.load();

  console.log(`[1/4] Fetching Houston base template from Strapi ORM...`);
  const houston = await app.documents('api::city.city').findFirst({
    filters: { path: 'houston' },
    populate: {
      page: {
        on: {
          'blocks.hero': { populate: ['video', 'badges'] },
          'blocks.see-our-work-in-action': { populate: { videoItem: { populate: { selfHostedVideo: { populate: { thumbnail: { populate: '*' } } } } } } },
          'blocks.customer-reviews': { populate: '*' },
          'blocks.gallery-of-work': { populate: { types: { populate: '*' } } },
          'blocks.tv-mounting-types': { populate: { mountingTypes: { populate: { image: { populate: '*' } } }, addons: { populate: '*' } } },
          'blocks.certificate': { populate: ['certificates'] },
          'blocks.why-customers-choose-us': { populate: { cards: { populate: { image: { populate: '*' } } } } },
          'blocks.our-services': { populate: { services: { populate: { image: { populate: '*' } } } } },
          'blocks.tv-sizes': { populate: { tvsizes: { populate: { image: { populate: '*' } } } } },
          'blocks.about-us': { populate: '*' },
          'blocks.faq': { populate: ['faqs'] },
          'blocks.contact-us': { populate: '*' },
          'blocks.areas-we-serve': { populate: '*' },
          'blocks.our-team': { populate: '*' },
          'blocks.careers-cta': { populate: '*' },
          'blocks.utp-bar': { populate: '*' },
          'blocks.tv-count-picker': { populate: '*' },
          'blocks.brief-services': { populate: '*' }
        }
      }
    }
  });

  const clonedPage = processMediaAndClean(
    houston.page || [], 
    cityConfig.city_name, 
    cityConfig.state_code, 
    cityConfig.path
  );

  // Overlay custom texts if provided
  if (cityConfig.page) {
    cityConfig.page.forEach(customBlock => {
      const target = clonedPage.find(b => b.__component === customBlock.__component);
      if (target) {
        if (customBlock.title) target.title = customBlock.title;
        if (customBlock.subTitle) target.subTitle = customBlock.subTitle;
        if (customBlock.mountingTypes && target.mountingTypes) {
          customBlock.mountingTypes.forEach((m, idx) => {
            if (target.mountingTypes[idx]) {
              target.mountingTypes[idx].title = m.title;
              target.mountingTypes[idx].description = m.description;
            }
          });
        }
        if (customBlock.services && target.services) {
          customBlock.services.forEach((s, idx) => {
            if (target.services[idx]) {
              target.services[idx].title = s.title;
              target.services[idx].description = s.description;
            }
          });
        }
      }
    });
  }

  console.log(`[2/4] Saving and publishing Main City: ${cityConfig.city_name}...`);
  const existingCity = await app.documents('api::city.city').findFirst({
    filters: { path: cityConfig.path }
  });

  const payload = {
    city_name: cityConfig.city_name,
    path: cityConfig.path,
    state_code: cityConfig.state_code,
    metro_city_slug: null,
    seo: cityConfig.seo,
    cta_override: cityConfig.cta_override,
    page: clonedPage
  };

  if (existingCity) {
    await app.documents('api::city.city').update({ documentId: existingCity.documentId, data: payload });
    await app.documents('api::city.city').publish({ documentId: existingCity.documentId });
  } else {
    const created = await app.documents('api::city.city').create({ data: payload });
    await app.documents('api::city.city').publish({ documentId: created.documentId });
  }

  console.log(`[3/4] Deploying ${suburbsList.length} Suburbs...`);
  for (const suburb of suburbsList) {
    const existingSub = await app.documents('api::city.city').findFirst({
      filters: { path: suburb.path }
    });

    const subPayload = {
      city_name: suburb.city_name,
      path: suburb.path,
      state_code: suburb.state_code || cityConfig.state_code,
      metro_city_slug: cityConfig.path,
      seo: {
        metaTitle: `TV Mounting in ${suburb.city_name}, ${cityConfig.state_code} | Same-Day Service`,
        metaDescription: `Professional TV mounting service in ${suburb.city_name}, ${cityConfig.state_code}. Expert TV wall mounting, Frame TV setup & wire hiding. Call ${cityConfig.cta_override.phoneLabel}!`
      },
      cta_override: cityConfig.cta_override,
      page: []
    };

    if (existingSub) {
      await app.documents('api::city.city').update({ documentId: existingSub.documentId, data: subPayload });
      await app.documents('api::city.city').publish({ documentId: existingSub.documentId });
    } else {
      const createdSub = await app.documents('api::city.city').create({ data: subPayload });
      await app.documents('api::city.city').publish({ documentId: createdSub.documentId });
    }
  }

  console.log(`[4/4] Done! Cluster ${cityConfig.city_name} is fully deployed and published.`);
  process.exit(0);
}

module.exports = { deployCityCluster };
```

---

## 9. 🗺️ Интерактивная карта покрытия (Coverage Map Service)

Для наглядного контроля всех запущенных городов, проверки пригородных кластеров и отрисовки 25–55 мильных радиусов обслуживания создан локальный сервис на базе **OpenStreetMap + Leaflet.js**.

### Быстрый запуск сервиса:
```bash
cd /Users/kampentar/dev/tvpro-landing
npm run map
```
После запуска откройте в браузере: **`http://localhost:4040`**

### Что умеет сервис:
1. **Подтягивает все города из Strapi** (все 166 городов и 15 метрополий).
2. **Рисует радиусы выезда мастеров** вокруг каждого метро-города с переключателем (`25 mi`, `35 mi`, `45 mi`, `55 mi` — в точности как на скриншоте выезда мастеров).
3. **Группирует пригороды по цветным кластерам**: Метро-города отображаются крупными метками, а пригорода — аккуратными точками внутри зоны покрытия.
4. **Боковая панель навигации (Sidebar)**:
   * Быстрый поиск по названию города или коду штата.
   * Список всех 15 регионов с количеством пригородов.
   * При клике на регион (например, `Tampa, FL` или `Irvine, CA`) карта мгновенно центрируется и зумится на этот кластер.
   * В карточке каждого города отображается закрепленный телефон `cta_override` и прямая ссылка на страницу сайта `tvprousa.com/[path]`.


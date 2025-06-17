# Архитектура динамической формы-калькулятора

## Обзор

Система динамической формы-калькулятора предназначена для создания многоэтапных форм с условной логикой, динамическим генерированием шагов и расчетом стоимости в реальном времени. Основной кейс использования - калькулятор для услуг установки телевизоров.

## Ключевые принципы

### 1. Конфигурационный подход
- Вся логика формы описывается в JSON конфигурации
- Возможность изменения через CMS (Strapi) без изменения кода
- Валидация конфигурации на уровне схемы

### 2. Динамическое поведение
- Шаги могут генерироваться на основе предыдущих выборов
- Поля показываются/скрываются по условиям
- При изменении предыдущих шагов все последующие сбрасываются

### 3. Реактивные вычисления
- Автоматический пересчет стоимости при изменениях
- Динамическое обновление доступных опций

## Структура конфигурации

### Корневой объект
```json
{
  "steps": [...],           // Массив шагов формы
  "priceCalculation": {...} // Настройки расчета цены
}
```

### Шаг формы
```json
{
  "id": "unique-step-id",
  "title": "Заголовок шага",
  "type": "static|dynamic",    // Опционально, по умолчанию static
  "fields": [...],             // Для статических шагов
  "generateFrom": "field.path", // Для динамических шагов
  "template": {...}            // Шаблон для динамических шагов
}
```

## Типы шагов

### Статический шаг
Обычный шаг с фиксированным набором полей.

```json
{
  "id": "tv-size",
  "title": "What size is your TV?",
  "fields": [...]
}
```

### Динамический шаг
Шаг, который генерирует подшаги на основе данных из предыдущих шагов.

```json
{
  "id": "mounting",
  "type": "dynamic",
  "title": "Mounting Options",
  "generateFrom": "tv-size.tvSelection",
  "template": {
    "title": "TV #{index} ({size})",
    "fields": [...]
  }
}
```

**Параметры динамического шага:**
- `generateFrom` - путь к полю, из которого берутся данные для генерации
- `template` - шаблон для каждого сгенерированного подшага
- `#{index}` - подставляется порядковый номер (1, 2, 3...)
- `{size}` - подставляется значение из исходного поля

## Типы полей

### checkboxWithCounter
Чекбокс с возможностью указать количество.

```json
{
  "name": "tvSelection",
  "type": "checkboxWithCounter",
  "options": [
    { 
      "value": "60-80", 
      "label": "60-80\"", 
      "cost": 59,
      "minCount": 0,
      "maxCount": 10
    }
  ]
}
```

### radio
Выбор одного варианта из списка.

```json
{
  "name": "mountType",
  "type": "radio",
  "label": "Mount type",
  "options": [
    { 
      "value": "fixed", 
      "label": "Fixed Mount", 
      "cost": 0,
      "description": "TV stays in one position"
    }
  ]
}
```

### checkbox
Одиночный чекбокс (да/нет).

```json
{
  "name": "cableManagement",
  "type": "checkbox",
  "label": "Hide cables in wall",
  "cost": 50
}
```

### checkboxGroup
Множественный выбор из списка опций.

```json
{
  "name": "streaming",
  "type": "checkboxGroup",
  "label": "Streaming device setup",
  "options": [
    { "value": "roku", "label": "Roku", "cost": 15 }
  ]
}
```

### text
Текстовое поле.

```json
{
  "name": "customRoom",
  "type": "text",
  "label": "Specify room type"
}
```

### counter
Числовое поле с кнопками +/-.

```json
{
  "name": "height",
  "type": "counter",
  "label": "Height from floor (inches)",
  "defaultValue": 60,
  "min": 40,
  "max": 120,
  "step": 6
}
```

### date
Поле выбора даты.

```json
{
  "name": "preferredDate",
  "type": "date",
  "label": "Preferred date"
}
```

## Система условий (showIf)

Поля могут показываться/скрываться на основе значений других полей.

### Структура условия
```json
{
  "showIf": {
    "field": "fieldName",     // Имя поля для проверки
    "condition": "equals",    // Тип условия
    "value": "targetValue"    // Целевое значение (для одиночных условий)
    "values": ["val1", "val2"] // Целевые значения (для множественных условий)
  }
}
```

### Типы условий

#### equals
Точное совпадение значения.
```json
{
  "showIf": {
    "field": "roomType",
    "condition": "equals",
    "value": "other"
  }
}
```

#### notEquals
Значение не равно указанному.
```json
{
  "showIf": {
    "field": "mountType",
    "condition": "notEquals",
    "value": "full-motion"
  }
}
```

#### hasAny
Имеет любое из указанных значений (для множественного выбора).
```json
{
  "showIf": {
    "field": "tvSelection",
    "condition": "hasAny",
    "values": ["60-80", "over-81"]
  }
}
```

#### isToday
Специальное условие для полей типа date.
```json
{
  "showIf": {
    "field": "preferredDate",
    "condition": "isToday"
  }
}
```

## Расчет стоимости

### Конфигурация
```json
{
  "priceCalculation": {
    "baseCost": 0,
    "dynamicCosts": [
      "tv-size.tvSelection",
      "tv-size.needHelper",
      "mounting.*.mountType",
      "additional-services.soundbar"
    ]
  }
}
```

### Пути к полям
- `stepId.fieldName` - поле в статическом шаге
- `stepId.*.fieldName` - поле в динамических подшагах
- Система автоматически суммирует все cost значения из выбранных опций

## Обработка данных

### Структура данных формы
```javascript
{
  "tv-size": {
    "tvSelection": [
      { "value": "60-80", "count": 2 },
      { "value": "over-81", "count": 1 }
    ],
    "needHelper": "yes"
  },
  "mounting-1": {
    "mountType": "tilt",
    "cableManagement": true
  },
  "mounting-2": {
    "mountType": "fixed",
    "cableManagement": false
  },
  "mounting-3": {
    "mountType": "full-motion"
  }
}
```

### Правила сброса данных
При изменении любого поля:
1. Найти текущий шаг
2. Удалить данные всех последующих шагов
3. Пересоздать динамические шаги если необходимо
4. Пересчитать стоимость

## Интеграция с CMS (Strapi)

### Модель Step
```javascript
{
  id: String,
  title: String,
  type: Enum["static", "dynamic"],
  generateFrom: String,
  template: JSON,
  fields: Component[Field],
  order: Number
}
```

### Модель Field
```javascript
{
  name: String,
  type: Enum[...],
  label: String,
  options: Component[Option],
  showIf: Component[Condition],
  defaultValue: Mixed,
  validation: JSON
}
```

### Модель Option
```javascript
{
  value: String,
  label: String,
  cost: Number,
  description: String
}
```

## Примеры использования

### Простая условная логика
Показать поле "Помощник" только если выбраны большие телевизоры:

```json
{
  "name": "needHelper",
  "type": "radio",
  "showIf": {
    "field": "tvSelection",
    "condition": "hasAny",
    "values": ["60-80", "over-81"]
  }
}
```

### Динамическая генерация шагов
Создать отдельный шаг настройки монтажа для каждого выбранного ТВ:

```json
{
  "id": "mounting",
  "type": "dynamic",
  "generateFrom": "tv-size.tvSelection",
  "template": {
    "title": "TV #{index} ({size}) - Choose mounting type"
  }
}
```

### Каскадные условия
Показать опцию установки розетки только если выбрано скрытие проводов:

```json
{
  "name": "powerOutlet",
  "showIf": {
    "field": "cableManagement",
    "condition": "equals",
    "value": true
  }
}
```

## Рекомендации по разработке

### Компонент формы
1. Используйте React Context для передачи данных между шагами
2. Реализуйте централизованное состояние для данных формы
3. Создайте универсальные компоненты для каждого типа поля
4. Используйте React.memo для оптимизации рендера больших форм

### Валидация
1. Валидируйте конфигурацию при загрузке из CMS
2. Проверяйте существование полей в showIf условиях
3. Валидируйте пути в generateFrom для динамических шагов

### Производительность
1. Дебаунсите пересчет стоимости
2. Ленивая загрузка больших конфигураций
3. Виртуализация для форм с большим количеством динамических шагов

## Ограничения и известные проблемы

1. **Глубокая вложенность условий**: Текущая система не поддерживает AND/OR логику в условиях
2. **Циклические зависимости**: Необходимо следить за тем, чтобы поля не ссылались друг на друга циклически  
3. **Производительность**: При большом количестве динамических шагов (100+) возможны задержки рендера
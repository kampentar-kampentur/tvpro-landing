/**
 * Spintax resolver — разворачивает {A|B|C} в случайно выбранный вариант.
 *
 * ВАЖНО: Вызывать ТОЛЬКО в Server Components или build-скриптах.
 * НЕ использовать в "use client" компонентах — будет hydration mismatch,
 * потому что сервер и клиент выберут разные варианты.
 *
 * При SSG каждая страница города получает свой вариант → уникализация HTML.
 */

/**
 * Разворачивает все {A|B|C} плейсхолдеры в строке.
 * @param {string} text
 * @returns {string}
 */
export function resolveSpintax(text) {
  if (!text || typeof text !== 'string') return text;
  
  // Mask double curly braces to prevent spintax regex from breaking variables like {{city}}
  let masked = text
    .replace(/\{\{/g, '__TEMP_DBL_OPEN__')
    .replace(/\}\}/g, '__TEMP_DBL_CLOSE__');
    
  // Resolve standard spintax {option1|option2}
  let resolved = masked.replace(/\{([^{}]+)\}/g, (_, group) => {
    const options = group.split('|');
    return options[Math.floor(Math.random() * options.length)].trim();
  });
  
  // Unmask double curly braces back to their original form
  return resolved
    .replace(/__TEMP_DBL_OPEN__/g, '{{')
    .replace(/__TEMP_DBL_CLOSE__/g, '}}');
}

/**
 * Применяет resolveSpintax к объекту строки бегущей строки { main, sub? }.
 * Совместимо со структурой данных из Strapi /api/hero-text-lines.
 *
 * @param {{ main: string, sub?: string }} lineObj
 * @returns {{ main: string, sub?: string }}
 */
export function resolveSpintaxLine(lineObj) {
  if (!lineObj || typeof lineObj !== 'object') return lineObj;
  return {
    ...lineObj,
    main: resolveSpintax(lineObj.main),
    sub: lineObj.sub ? resolveSpintax(lineObj.sub) : lineObj.sub,
  };
}

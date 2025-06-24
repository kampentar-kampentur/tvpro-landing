/** @type {import('next').NextConfig} */
const nextConfig = {
    // Статическая генерация
    output: 'export',
    trailingSlash: true,
    
    // Настройки изображений
    images: {
      unoptimized: true,
      domains: ['res.cloudinary.com'],
    },
    
    // Переменные окружения
    env: {
      BROWSERSLIST_ENV: 'modern'
    },
    
    // Оптимизация для production
    swcMinify: true,
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
    
    // Настройки для GitHub Pages (можно убрать если не используется)
    assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
    basePath: process.env.NODE_ENV === 'production' ? '' : '',
    
    // Webpack конфигурация (для обычной сборки)
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
      return config;
    },
    
    // Turbopack конфигурация (для Turbo режима)
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    },
  };
  
  export default nextConfig;
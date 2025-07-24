/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true,
      domains: ['res.cloudinary.com'],
    },
    env: {
      BROWSERSLIST_ENV: 'modern'
    },
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
    assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
    basePath: process.env.NODE_ENV === 'production' ? '' : '',
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: 'prefixIds',
                    params: {
                      prefixIds: true,
                      prefixClassNames: false,
                    },
                  },
                ],
              },
            },
          },
        ],
      });
      return config;
    },
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
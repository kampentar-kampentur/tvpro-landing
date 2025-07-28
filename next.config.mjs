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
    experimental: {
      optimizeCss: true,
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
                      prefix: () => Math.random().toString(36).substr(2, 9)
                    }
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
    module: {
      rules: [
        {
          test: /\.module\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  mode: 'local',
                  localIdentName: '[hash:base64:5]'
                }
              }
            }
          ]
        }
      ]
    },
    experimental: {
      legacyBrowsers: false,
      browsersListForSwc: true,
    },
    swcMinify: true,
  };
  
  export default nextConfig;
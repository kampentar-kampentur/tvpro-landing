/** @type {import('next').NextConfig} */
import bundleAnalyzer from "@next/bundle-analyzer"

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = withBundleAnalyzer({
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
      cssMinify: true,
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
                      prefix: () => "id-" + Math.random().toString(36).substr(2, 9)
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
  });
  
  export default nextConfig;
/** @type {import('next').NextConfig} */
import bundleAnalyzer from "@next/bundle-analyzer"

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = withBundleAnalyzer({
  output: 'export',
  trailingSlash: true,
  images: {
    loader: 'custom',
    loaderFile: './src/lib/image-loader.js',
    imageSizes: [156, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // unoptimized: true,
    // domains: ['res.cloudinary.com'],
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
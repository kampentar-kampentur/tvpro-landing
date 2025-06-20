/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
    env: {
        BROWSERSLIST_ENV: 'modern'
    },
    webpack(config) {
        config.module.rules.push({
          test: /\.svg$/,
          use: ['@svgr/webpack'],
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

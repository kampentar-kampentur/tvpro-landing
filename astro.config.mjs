import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import svgr from "vite-plugin-svgr";

// https://astro.build/config
export default defineConfig({
    site: 'https://tvprousa.com',
    integrations: [react(), sitemap()],
    srcDir: './src', // Astro will look for pages in src/pages
    outDir: './dist-astro', // Keep it separate from Next.js build
    vite: {
        plugins: [
            {
                name: 'auto-svg-react',
                enforce: 'pre',
                async resolveId(id, importer) {
                    if (id.endsWith('.svg') && !id.includes('?')) {
                        // Check if it's imported from a JS/JSX/TS/TSX file
                        if (importer && (importer.endsWith('.js') || importer.endsWith('.jsx') || importer.endsWith('.tsx') || importer.endsWith('.ts'))) {
                            const resolved = await this.resolve(id, importer, { skipSelf: true });
                            if (resolved) {
                                return resolved.id + '?react';
                            }
                        }
                    }
                    return null;
                },
            },
            svgr(),
        ],
        resolve: {
            alias: {
                '@': '/src',
            },
        },
        esbuild: {
            loader: 'jsx',
            include: /src\/.*\.[tj]sx?$/,
            exclude: [],
        },
        optimizeDeps: {
            esbuildOptions: {
                loader: {
                    '.js': 'jsx',
                    '.jsx': 'jsx',
                },
            },
        },
    },
});

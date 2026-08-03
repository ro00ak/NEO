import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',

    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '');

        return path.resolve(
          __dirname,
          'src/assets',
          filename,
        );
      }
    },
  };
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),

    react(),

    tailwindcss(),

    legacy({
      targets: [
        'defaults',
        'Safari >= 13',
        'iOS >= 13',
        'not IE 11',
      ],
      modernPolyfills: true,
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    target: 'es2015',
    minify: 'terser',
  },
});

/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';

// See: https://github.com/storybookjs/storybook/issues/32462
const isStorybookProcess = process.env.npm_lifecycle_event === 'storybook';

// https://vite.dev/config/
export default defineConfig({
  base: '/cubemap-converter/',
  plugins: [vue(), !isStorybookProcess && vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
  },
});

/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['html', 'text'],
    },
    setupFiles: './tests/setup.ts',
    include: ['**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
  },
});

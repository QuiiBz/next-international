/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { vitestTypescriptAssertPlugin } from 'vite-plugin-vitest-typescript-assert';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vitestTypescriptAssertPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['html', 'text'],
    },
    setupFiles: './tests/setup.ts',
  },
});

import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'JestArch',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: [
        'typescript',
        'jest',
        '@jest/globals',
        'path',
        'fs',
        'node:path',
        'node:fs',
        '@archest/core',
      ],
    },
    sourcemap: true,
  },
  test: {
    server: {
      deps: {
        external: [/@archest\/core/],
      },
    },
  },
  plugins: [dts()],
});

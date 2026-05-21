import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VitestArch',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['typescript', 'vitest', 'path', 'fs', 'node:path', 'node:fs', '@archest/core'],
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

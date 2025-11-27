import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      outDir: 'dist/types',
      include: ['src/**/*.ts'],
    }),
  ],
  resolve: {
    extensions: ['.ts'],
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    lib: {
      entry: 'src/plugin.ts',
      name: 'yearSelectPlugin',
      formats: ['es', 'umd', 'cjs'],
      fileName: (format) => {
        if (format === 'es') return 'flatpickr-year-select-plugin.mjs';
        if (format === 'umd') return 'flatpickr-year-select-plugin.umd.js';
        return 'flatpickr-year-select-plugin.js';
      },
    },
    rollupOptions: {
      external: ['flatpickr'],
      output: {
        exports: 'default',
        globals: {
          flatpickr: 'flatpickr',
        },
      },
    },
    outDir: 'dist',
  },
});

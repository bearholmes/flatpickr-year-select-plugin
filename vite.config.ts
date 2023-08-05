// vite.config.js
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      outputDir: 'dist/types', // 원하는 폴더로 변경하세요
    }),
  ],
  resolve: {
    extensions: ['.ts'],
  },
  build: {
    target: 'esnext',
    lib: {
      entry: 'src/plugin.ts', // TypeScript 파일의 경로를 지정해주어야 합니다.
      name: 'plugin',
    },
    rollupOptions: {
      output: {
        exports: 'named',
        format: 'es',
        sourcemap: true,
      },
    },
    outDir: 'dist',
  },
});

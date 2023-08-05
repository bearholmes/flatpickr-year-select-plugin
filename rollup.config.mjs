import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const plugins = [
  resolve(),
  commonjs(),
  terser(),
  typescript(),
];

const tasks = [
  {
    input: 'src/plugin.ts',
    output: {
      name: 'flatpickr-year-select-plugin',
      file: 'dist/flatpickr-year-select-plugin.js',
      sourcemap: true,
      format: 'cjs',
      exports: 'named',
    },
    plugins,
  },
];

export default tasks;

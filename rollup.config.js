import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import swc from '@rollup/plugin-swc';
import alias from '@rollup/plugin-alias';
import path from 'path';

import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  input: './src/main.ts',
  output: {
    file: './dist/main.js',
    format: 'cjs',
  },
  plugins: [
    json(),
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        {
          find: 'prisma/clients',
          replacement: path.resolve(__dirname, 'prisma/clients'),
        },
      ],
    }),
    resolve({
      preferBuiltins: true,
      extensions: ['.ts', '.js'],
    }),
    commonjs(),
    terser(),
    swc(),
  ],
  external: (id) => /node_modules/.test(id),
  onwarn: (warning, warn) => {
    if (['PLUGIN_WARNING', 'UNRESOLVED_IMPORT'].includes(warning.code)) return;

    if (warning.code === 'EVAL' && warning.id.includes('prisma/clients'))
      return;

    warn(warning);
  },
};

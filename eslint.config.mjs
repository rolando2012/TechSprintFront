// eslint.config.js
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // 1) Aplica las reglas base de Next.js
  ...compat.extends(
    'next',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended'
  ),

  // 2) Tus overrides personalizados
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      // …otras reglas tuyas…
    },
  },
];

// eslint.config.mjs
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const compat     = new FlatCompat({ baseDirectory: __dirname });

export default [
  // 1) Extiende las reglas de Next.js
  ...compat.extends(
    'next',                   // config base de Next.js :contentReference[oaicite:1]{index=1}
    'next/core-web-vitals',   // recomendaciones de Web Vitals :contentReference[oaicite:2]{index=2}
    'plugin:@typescript-eslint/recommended'  // reglas TS :contentReference[oaicite:3]{index=3}
  ),

  // 2) tus overrides personalizados
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      // …otras reglas que necesites…
    },
  },
];

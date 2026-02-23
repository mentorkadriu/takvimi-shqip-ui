import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Ignore generated / non-app files
  {
    ignores: [
      'public/sw.js',
      'public/workbox-*.js',
      'public/fallback-*.js',
      'scripts/',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // Must be last: disables ESLint rules that conflict with Prettier formatting
  eslintConfigPrettier,
];

export default eslintConfig;

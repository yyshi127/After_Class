import js from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const config = [
  js.configs.recommended,
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'generated/**',
      'ui-design/**',
      'tailwind.config.js',
      'postcss.config.js',
    ],
  },
];

export default config;

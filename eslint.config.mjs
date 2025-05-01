import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: {
      js,
      prettier: prettierPlugin,
    },
    extends: ['plugin:prettier/recommended'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'warn',
    },
  },

  // TypeScript config
  {
    files: ['**/*.ts'],
    ...tseslint.configs.recommended,
  },
]);

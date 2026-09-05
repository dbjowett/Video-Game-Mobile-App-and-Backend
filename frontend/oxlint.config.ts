import { coreConfig } from '@vg/config/oxlint.core';
import { tsConfig } from '@vg/config/oxlint.typescript';
import { unicornConfig } from '@vg/config/oxlint.unicorn';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [coreConfig, unicornConfig, tsConfig],
  plugins: [],
  ignorePatterns: ['**/routeTree.gen.ts'],
  rules: {
    // Vite/React use the automatic JSX runtime; React need not be in scope.
    'react/react-in-jsx-scope': 'off',
    'unicorn/filename-case': [
      'warn',
      { cases: { camelCase: true, pascalCase: true }, ignore: [String.raw`^vite-env\.d\.ts$`] },
    ],
  },
});

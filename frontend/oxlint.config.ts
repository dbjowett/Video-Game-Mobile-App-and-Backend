import { baseOxlintConfig } from '@vg/config/oxlint.base';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [baseOxlintConfig],
  plugins: ['typescript'],
  ignorePatterns: ['**/routeTree.gen.ts'],
  rules: {
    'unicorn/filename-case': [
      'warn',
      { cases: { camelCase: true, pascalCase: true }, ignore: [String.raw`^vite-env\.d\.ts$`] },
    ],
  },
});

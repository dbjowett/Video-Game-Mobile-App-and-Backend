import { coreConfig } from '@vg/config/oxlint.core';
import { tsConfig } from '@vg/config/oxlint.typescript';
import { unicornConfig } from '@vg/config/oxlint.unicorn';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [coreConfig, unicornConfig, tsConfig],
  plugins: [],
  rules: {
    // strictNullChecks is off in tsconfig.json, so these rules fire on every file.
    'typescript/no-useless-default-assignment': 'off',
    'typescript/no-unnecessary-boolean-literal-compare': 'off',
    // NestJS @Module() classes are intentionally empty; the decorator carries the metadata.
    'typescript/no-extraneous-class': ['warn', { allowWithDecorator: true }],
    // Prisma's aggregate() API shape uses these names; they can't be renamed.
    'no-underscore-dangle': ['warn', { allow: ['_max', '_min', '_avg', '_sum', '_count'] }],
    // main.ts compiles as CommonJS (no "type": "module"); top-level await isn't valid there.
    'unicorn/prefer-top-level-await': 'off',
  },
});

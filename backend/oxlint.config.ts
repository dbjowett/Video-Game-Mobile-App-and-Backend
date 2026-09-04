import { baseOxlintConfig } from '@vg/config/oxlint.base';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [baseOxlintConfig],
  plugins: ['typescript', 'import'],
  rules: {
    // strictNullChecks is intentionally off in tsconfig.json; these rules
    // can't function correctly without it and fire on every file.
    'typescript/no-useless-default-assignment': 'off',
    'typescript/no-unnecessary-boolean-literal-compare': 'off',
    // main.ts compiles as CommonJS (no "type": "module"); top-level await isn't valid there.
    'unicorn/prefer-top-level-await': 'off',
    // tsconfig's target (ES2021) doesn't type Array#toSorted(); confirmed via a real build failure.
    'unicorn/no-array-sort': 'off',
  },
});

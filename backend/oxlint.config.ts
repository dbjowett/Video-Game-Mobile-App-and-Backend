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
  },
});

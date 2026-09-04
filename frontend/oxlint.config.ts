import { baseOxlintConfig } from '@vg/config/oxlint.base';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [baseOxlintConfig],
  plugins: ['typescript'],
});

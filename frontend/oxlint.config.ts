import { defineConfig } from 'oxlint';
import { baseOxlintConfig } from '@vg/config/oxlint.base';

export default defineConfig({
  extends: [baseOxlintConfig],
  plugins: ['typescript'],
});

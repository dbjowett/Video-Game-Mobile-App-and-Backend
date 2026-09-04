import { baseOxlintConfig } from '@vg/config/oxlint.base';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [baseOxlintConfig],
  plugins: ['typescript', 'react', 'import'],
  rules: {
    // Expo/RN use the automatic JSX runtime; React need not be in scope.
    'react/react-in-jsx-scope': 'off',
    'react/no-children-prop': 'off',
    // Flags LucideIcons[iconName] dynamic icon lookup, which cant be statically validated
    'import/namespace': 'off',
    'react/capitalized-calls': 'off',
    'react/refs': 'off',
    'unicorn/filename-case': [
      'warn',
      { cases: { camelCase: true, pascalCase: true }, ignore: [String.raw`^\+not-found\.tsx$`] },
    ],
    // Array#toSorted() crashes on Hermes at runtime; confirmed via an actual device crash.
    'unicorn/no-array-sort': 'off',
    // metro.config.js is loaded via require() before any ESM pipeline exists; must stay CommonJS.
    'unicorn/prefer-module': 'off',
  },
});

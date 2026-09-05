import { coreConfig } from '@vg/config/oxlint.core';
import { tsConfig } from '@vg/config/oxlint.typescript';
import { unicornConfig } from '@vg/config/oxlint.unicorn';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [coreConfig, unicornConfig, tsConfig],
  plugins: [],
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
    // react-navigation render props (tabBarIcon, headerRight, etc.) require inline functions.
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
    // metro.config.js is loaded via require() before any ESM pipeline exists; must stay CommonJS.
    'unicorn/prefer-module': 'off',
    // oxlint can't resolve reanimated's Animated export type; confirmed harmless via tsc.
    'typescript/no-unsafe-member-access': 'off',
    'typescript/no-unsafe-assignment': 'off',
    'typescript/no-unsafe-call': 'off',
  },
});

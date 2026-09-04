import { defineConfig } from 'oxlint';
import { baseOxlintConfig } from '@vg/config/oxlint.base';

export default defineConfig({
  extends: [baseOxlintConfig],
  plugins: ['typescript', 'react', 'import'],
  rules: {
    // Expo/RN use the automatic JSX runtime; React need not be in scope.
    'react/react-in-jsx-scope': 'off',
    'react/no-children-prop': 'off',
    // Flags LucideIcons[iconName] dynamic icon lookup, which cant be statically validated
    'import/namespace': 'off',
  },
});

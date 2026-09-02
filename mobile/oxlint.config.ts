import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['typescript', 'react', 'import'],
  options: {
    typeAware: true,
  },
  categories: {
    correctness: 'error',
    suspicious: 'warn',
    pedantic: 'off',
  },
  rules: {
    // Expo/RN use the automatic JSX runtime; React need not be in scope.
    'react/react-in-jsx-scope': 'off',
  },
});

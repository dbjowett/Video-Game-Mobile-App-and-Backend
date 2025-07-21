import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import pluginImportX from 'eslint-plugin-import-x';

export default [
  {
    plugins: {
      'import-x': pluginImportX,
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: './tsconfig.json',
        }),
      ],
    },
    rules: {
      'import-x/no-unresolved': 'error',
    },
  },
];

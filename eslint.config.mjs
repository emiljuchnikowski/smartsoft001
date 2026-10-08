// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import nx from '@nx/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    // Migrated from `.eslintignore`, which ESLint v9 no longer supports.
    ignores: [
      '**/dist',
      '**/node_modules',
      '**/tailwind.config.js',
      'docs/site/.next',
      'docs/site/out',
    ],
  },
  {
    plugins: {
      import: importPlugin,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['external', 'builtin', 'internal'],
          pathGroups: [
            {
              pattern: '@smartsoft001/**',
              group: 'external',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: [],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
  {
    // The React libraries: hooks have to be called unconditionally and list
    // what they read, or a component renders stale state.
    files: [
      'packages/shared/react/**/*.ts',
      'packages/shared/react/**/*.tsx',
      'packages/crud/shell/react/**/*.ts',
      'packages/crud/shell/react/**/*.tsx',
    ],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  ...storybook.configs['flat/recommended'],
  ...storybook.configs['flat/recommended'],
];

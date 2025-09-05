import type { Config } from 'jest';

const config: Config = {
  globals: {},
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  transform: {
    '^.+\\.(ts|js|mjs|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  displayName: 'crud-shell-angular',
  coverageDirectory: '../../../../coverage/packages/crud/shell/angular',
  preset: 'jest-preset-angular',
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  transformIgnorePatterns: ['node_modules/(?!(@angular|@ngrx)/)'],
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
  moduleNameMapper: {
    '^@smartsoft001/angular$':
      '<rootDir>/../../../../packages/shared/angular/src/index.ts',
    '^@smartsoft001/angular/(.*)$':
      '<rootDir>/../../../../packages/shared/angular/src/$1',
    '^@smartsoft001/models$':
      '<rootDir>/../../../../packages/shared/models/src/index.ts',
    '^@smartsoft001/models/(.*)$':
      '<rootDir>/../../../../packages/shared/models/src/$1',
  },
};

export default config;

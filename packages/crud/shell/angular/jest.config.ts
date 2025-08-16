/* eslint-disable */
export default {
  globals: {},
  transform: { '^.+\\.(ts|js|html)$': 'jest-preset-angular' },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  displayName: 'crud-shell-angular',
  coverageDirectory: '../../../../coverage/packages/crud/shell/angular',
  preset: 'jest-preset-angular',
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  transformIgnorePatterns: ['node_modules/(?!(@angular|@ngrx|@smartsoft001)/)'],
  moduleNameMapping: {
    '^@angular/(.*)$': '<rootDir>/node_modules/@angular/$1',
  },
  /* TODO: Update to latest Jest snapshotFormat
   * By default Nx has kept the older style of Jest Snapshot formats
   * to prevent breaking of any existing tests with snapshots.
   * It's recommend you update to the latest format.
   * You can do this by removing snapshotFormat property
   * and running tests with --update-snapshot flag.
   * Example: From within the project directory, run "nx test --update-snapshot"
   * More info: https://jestjs.io/docs/upgrading-to-jest29#snapshot-format
   */
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
};

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { compareVersions, selectMigrations } from './verify-example-app.mjs';

describe('compareVersions', () => {
  test('compares each part as a number, not as text', () => {
    assert.equal(compareVersions('2.10.0', '2.9.0'), 1);
    assert.equal(compareVersions('2.9.0', '2.10.0'), -1);
    assert.equal(compareVersions('10.0.0', '9.99.99'), 1);
  });

  test('treats equal versions as equal', () => {
    assert.equal(compareVersions('2.157.0', '2.157.0'), 0);
  });

  test('sorts a prerelease below the release it precedes', () => {
    assert.equal(compareVersions('3.0.0-beta.1', '3.0.0'), -1);
    assert.equal(compareVersions('3.0.0', '3.0.0-beta.1'), 1);
    assert.equal(compareVersions('3.0.0-beta.1', '2.157.0'), 1);
  });
});

describe('selectMigrations', () => {
  const entries = {
    'rename-fields': {
      cli: 'nx',
      version: '2.170.0',
      factory: './src/migrations/rename-fields/rename-fields',
    },
    'use-stack-packages': {
      cli: 'nx',
      version: '2.145.0',
      factory: './src/migrations/use-stack-packages/use-stack-packages',
    },
    'split-package': {
      version: '2.160.0',
      factory: './src/migrations/split-package/split-package',
    },
  };

  test('keeps the migrations above the previous version, oldest first', () => {
    assert.deepEqual(
      selectMigrations(entries, '2.150.0').map((entry) => entry.name),
      ['split-package', 'rename-fields'],
    );
  });

  test('writes each entry in the shape nx migrate --run-migrations reads', () => {
    assert.deepEqual(selectMigrations(entries, '2.165.0'), [
      {
        package: '@smartsoft001/core',
        name: 'rename-fields',
        version: '2.170.0',
        cli: 'nx',
      },
    ]);
  });

  test('defaults the cli to nx', () => {
    const [entry] = selectMigrations(entries, '2.159.0');

    assert.equal(entry.name, 'split-package');
    assert.equal(entry.cli, 'nx');
  });

  test('skips a migration at the previous version itself, which already ran', () => {
    assert.deepEqual(
      selectMigrations(entries, '2.160.0').map((entry) => entry.name),
      ['rename-fields'],
    );
  });

  test('is empty when nothing applies', () => {
    assert.deepEqual(selectMigrations(entries, '2.170.0'), []);
    assert.deepEqual(selectMigrations({}, '2.100.0'), []);
  });
});

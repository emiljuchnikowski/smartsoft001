import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);

const CORE = '@smartsoft001/core';

function readJson(relative) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relative), 'utf8'));
}

/**
 * Every publishable `@smartsoft001/*` package, worked out here rather than
 * imported, so this checks the checked-in list instead of restating whatever
 * produced it.
 *
 * `nx release` declares no project filter and no groups, so it versions and
 * publishes one fixed group over the whole workspace: a package is published
 * exactly when it has a scoped manifest under `packages/`. Deliberately not
 * `packageInventory()` from `docs/site/tools/check-rules.mjs`, which drops
 * `claude-plugins` for want of a documentation page - it is published all the
 * same, and it is one of the packages that drifts today.
 */
function publishablePackages() {
  const names = new Set();

  for (const file of fs.globSync('packages/**/package.json', {
    cwd: repoRoot,
    exclude: (name) => name === 'node_modules',
  })) {
    const manifest = readJson(file);

    if (!manifest.name?.startsWith('@smartsoft001/')) continue;

    names.add(manifest.name);
  }

  return [...names].sort();
}

/**
 * `nx migrate @smartsoft001/core@latest` used to rewrite the version of `core`
 * alone: a consumer on 2.144.0 ended up with `core` at 2.146.0 and
 * `@smartsoft001/angular` still on ^2.144.0. The `use-stack-packages`
 * migration hides that for packages a stack pins, but `fb`, `google` and
 * `claude-plugins` belong to no stack and drift for good - against a
 * documented promise that the packages are pinned to each other exactly.
 *
 * The fix is the `ng-update.packageGroup` of `@smartsoft001/core`. Nx turns a
 * bare array into `{ package, version: '*' }`
 * (`nx/src/utils/package-json.js`, `normalizePackageGroup`) and then, in
 * `nx/src/command-line/migrate/migrate.js`
 * (`getPackageJsonUpdatesFromPackageGroup`), synthesises a `packageJsonUpdates`
 * group at the version being migrated to, with every member at
 * `alwaysAddToPackageJson: false`. The version is resolved in the consumer's
 * workspace, so nothing here can go stale between releases.
 */
describe('@smartsoft001/core: the package group moves the whole framework', () => {
  const manifest = readJson('packages/meta/core/package.json');
  const group = manifest['ng-update']?.packageGroup;

  it('should declare a package group of names only', () => {
    // A bare name means `'*'`, which nx resolves to the target version. A
    // pinned version here would be a second place to bump on every release.
    assert.ok(Array.isArray(group), 'ng-update.packageGroup must be an array');
    assert.deepEqual(
      group.filter((entry) => typeof entry !== 'string'),
      [],
      'every entry must be a bare package name',
    );
  });

  it('should list every publishable package but core itself', () => {
    // `resolveRequiredPackages` seeds the required closure with the migrated
    // package, and the synthesised entry for `core` is dropped anyway by the
    // `collectedVersions` guard in `shouldApplyPackageUpdate`, because `core`
    // is collected before its own group is expanded. Listing it would be a
    // package pinning itself, to no effect.
    assert.deepEqual(
      [...group].sort(),
      publishablePackages().filter((name) => name !== CORE),
      'the package group must name every publishable package except core',
    );
  });

  it('should not name a package that is not published', () => {
    const published = new Set(publishablePackages());
    const offenders = group.filter((name) => !published.has(name));

    assert.deepEqual(
      offenders,
      [],
      'a package group entry that is not published would fail to resolve at migrate time',
    );
  });

  it('should not name core, which migrates itself', () => {
    assert.ok(
      !group.includes(CORE),
      'core is the migrated package, not a member of its own group',
    );
  });

  it('should keep the list sorted, so entries are appended in one place', () => {
    assert.deepEqual([...group], [...group].sort());
  });

  it('should keep pointing at the hand-written migrations', () => {
    assert.equal(manifest['ng-update'].migrations, './migrations.json');
    assert.ok(
      readJson('packages/meta/core/migrations.json').generators?.[
        'use-stack-packages'
      ],
      'migrations.json must keep declaring the use-stack-packages migration',
    );
  });
});

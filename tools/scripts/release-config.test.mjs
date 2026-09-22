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

function readJson(relative) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relative), 'utf8'));
}

function manifestPaths(config) {
  return (config?.manifestRootsToUpdate ?? []).map((entry) =>
    typeof entry === 'string' ? entry : entry.path,
  );
}

/**
 * `nx release version` bumps manifests, but the packages are published from
 * `dist` (every project sets `packageRoot: dist/{projectRoot}`), and the build
 * that produces `dist` runs *before* the bump as the `preVersionCommand`. A
 * project whose `dist` manifest is not in the list therefore ships the previous
 * version: releases 2.132.0 through 2.140.0 published every package except
 * `angular` one version behind the tag they were cut from.
 */
describe('nx release: versioning reaches the published manifests', () => {
  const nxJson = readJson('nx.json');
  const paths = manifestPaths(nxJson.release?.version);

  it('should update the dist manifest, which is what gets published', () => {
    assert.ok(
      paths.includes('dist/{projectRoot}'),
      'nx.json release.version.manifestRootsToUpdate must include "dist/{projectRoot}"',
    );
  });

  it('should keep updating the source manifest as well', () => {
    assert.ok(
      paths.includes('{projectRoot}'),
      'nx.json release.version.manifestRootsToUpdate must include "{projectRoot}"',
    );
  });

  it('should mark every package as publicly published', () => {
    // `nx-release-publish` does not pass `--access public`, and npm creates a
    // brand-new scoped package as private, which the registry then hides behind
    // a 404. The first three meta packages shipped that way. The older packages
    // are public only because they were first published through the `deploy`
    // target, which passes the flag.
    const offenders = [];

    for (const file of fs.globSync('packages/**/package.json', {
      cwd: repoRoot,
      exclude: (name) => name === 'node_modules',
    })) {
      const manifest = readJson(file);

      if (!manifest.name?.startsWith('@smartsoft001/')) continue;
      if (manifest.publishConfig?.access === 'public') continue;

      offenders.push(file);
    }

    assert.deepEqual(
      offenders,
      [],
      'every published manifest needs "publishConfig": { "access": "public" }',
    );
  });

  it('should keep every package manifest on one version', () => {
    // `nx release version` rewrites a dependent's pin only when the pin matches
    // the version in the dependency's own manifest. `@smartsoft001/angular` sat
    // at 2.105.0 for dozens of releases (its manifest was excluded from the
    // bump), so every pin on it silently stopped being updated.
    const versions = new Map();

    for (const file of fs.globSync('packages/**/package.json', {
      cwd: repoRoot,
      exclude: (name) => name === 'node_modules',
    })) {
      const manifest = readJson(file);

      if (!manifest.name?.startsWith('@smartsoft001/')) continue;

      versions.set(file, manifest.version);
    }

    const distinct = [...new Set(versions.values())];

    assert.equal(
      distinct.length,
      1,
      `every package manifest must carry the same version, found ${distinct.join(', ')} in ${[...versions].map(([file, version]) => `${file}@${version}`).join(', ')}`,
    );
  });

  it('should not let a project narrow the list back to one manifest', () => {
    const offenders = [];

    for (const file of fs.globSync('packages/**/project.json', {
      cwd: repoRoot,
    })) {
      const project = readJson(file);
      const own = manifestPaths(project.release?.version);

      if (own.length && own.length < paths.length) {
        offenders.push(`${file}: ${own.join(', ')}`);
      }
    }

    assert.deepEqual(
      offenders,
      [],
      'a project overriding manifestRootsToUpdate must list every root the workspace lists',
    );
  });
});

/**
 * The version used to come from the manifests, and the manifests were kept
 * current by a commit pushed back to `main` at the end of every release. That
 * push is rejected whenever `main` moved during the ten minutes the run takes,
 * and then the next run computes a version that is already on npm and dies on
 * a tag that already exists. It happened twice (v2.141.0, v2.148.0), and each
 * time every manifest had to be edited by hand to step over the burnt number.
 *
 * Reading the current version from the latest release tag removes the
 * dependency: a tag push is never rejected as non-fast-forward, so the tag is
 * always there, and with all branches considered an orphaned tag still counts.
 */
describe('nx release: the current version comes from git, not from a write-back', () => {
  const nxJson = readJson('nx.json');
  const version = nxJson.release?.version ?? {};
  const workflow = fs.readFileSync(
    path.join(repoRoot, '.github/workflows/publish.yml'),
    'utf8',
  );

  it('should resolve the current version from the latest release tag', () => {
    assert.equal(version.currentVersionResolver, 'git-tag');
  });

  it('should fall back to the manifests only when there is no tag at all', () => {
    assert.equal(version.fallbackCurrentVersionResolver, 'disk');
  });

  it('should consider tags on every branch, because a burnt tag is an orphan', () => {
    // A release whose write-back was rejected leaves its tag on a commit that
    // is on no branch. nx lists only tags reachable from HEAD unless told
    // otherwise, and would then reuse the burnt number.
    assert.equal(nxJson.release?.releaseTag?.checkAllBranchesWhen, true);
  });

  it('should not bump the root manifest on its own', () => {
    // `npm version minor` reads the root manifest, which is exactly the file a
    // failed write-back leaves stale; the root has to follow what nx computed.
    assert.ok(
      !/npm version minor/.test(workflow),
      'publish.yml must not run "npm version minor"; set the root version to the one nx resolved',
    );
  });

  it('should push the release tag before the write-back to main', () => {
    const tagPush = workflow.indexOf('name: Push the release tag');
    const publish = workflow.indexOf('name: Publish to NPM');
    const commit = workflow.indexOf('name: Commit');

    assert.ok(tagPush > 0, 'publish.yml needs a "Push the release tag" step');
    assert.ok(
      publish < tagPush && tagPush < commit,
      'the tag is pushed after the packages are on npm and before the branch write-back',
    );
  });
});

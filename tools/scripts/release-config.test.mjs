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

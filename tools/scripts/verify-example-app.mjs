#!/usr/bin/env node
/**
 * Runs the example application on the packages of the release being cut, as
 * the release's first consumer.
 *
 * `verify:dist` proves every package can be loaded. A package can load and
 * still not work in an application: a peer that no manifest declares, an
 * export the bundle does not carry, a migration that leaves the project
 * broken. Two checks, each in a throwaway standalone copy of
 * `docs/examples/app`:
 *
 * A. Install from the artefact. The copy installs `@smartsoft001` from the
 *    tarballs packed out of `dist/packages/**`, then builds and tests.
 *
 * B. Migrate from the previous version. The copy installs the previous
 *    release from the registry, switches to the tarballs the way
 *    `nx migrate @smartsoft001/core@<new>` does it for a consumer (bump the
 *    manifest, install, `nx migrate --run-migrations`), then builds and tests.
 *
 * Run it after `nx run-many -t build`. The Publish workflow runs it after
 * `verify:dist` and before anything reaches npm.
 *
 * Usage: node tools/scripts/verify-example-app.mjs [--previous <version>]
 *        (the default is the version of @smartsoft001/core on the registry)
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  createStandaloneApp,
  writeStandaloneManifest,
} from './example-app-standalone.mjs';
import {
  builtPackages,
  missingBuilds,
  notBuiltMessage,
  packTarballs,
} from './lib/dist-tarballs.mjs';

const CORE = '@smartsoft001/core';
const MIGRATIONS = path.join('packages', 'meta', 'core', 'migrations.json');

/**
 * The child environment: no daemon, no cloud and no distribution, because the
 * copy is a workspace of its own that exists for one run, and `CI` so that
 * nothing waits for a terminal.
 */
const CHILD_ENV = {
  ...process.env,
  NX_DAEMON: 'false',
  NX_NO_CLOUD: 'true',
  NX_CLOUD_DISTRIBUTED_EXECUTION: 'false',
  CI: 'true',
};

/**
 * Compares two versions numerically, part by part, so that `2.10.0` is above
 * `2.9.0`. A prerelease sorts below the release it precedes. This is the whole
 * of semver the release needs, and it keeps the script free of dependencies
 * the way the other release checks are.
 */
export function compareVersions(a, b) {
  const parse = (version) => {
    const [core, prerelease] = version.trim().split('-', 2);

    return { numbers: core.split('.').map(Number), prerelease };
  };
  const left = parse(a);
  const right = parse(b);

  for (let index = 0; index < 3; index++) {
    const difference = (left.numbers[index] ?? 0) - (right.numbers[index] ?? 0);

    if (difference !== 0) return Math.sign(difference);
  }

  if (left.prerelease && !right.prerelease) return -1;
  if (!left.prerelease && right.prerelease) return 1;

  return 0;
}

/**
 * The migrations a consumer on `previous` still has to run, in the shape
 * `nx migrate --run-migrations` reads: the `generators` of
 * `packages/meta/core/migrations.json` whose `version` is above `previous`,
 * oldest first, each attributed to the package that carries them.
 */
export function selectMigrations(entries, previous) {
  return Object.entries(entries)
    .filter(([, entry]) => compareVersions(entry.version, previous) > 0)
    .sort(([, a], [, b]) => compareVersions(a.version, b.version))
    .map(([name, entry]) => ({
      package: CORE,
      name,
      version: entry.version,
      cli: entry.cli ?? 'nx',
    }));
}

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, env: CHILD_ENV, stdio: 'inherit' });
}

function install(target) {
  run('npm', ['install', '--no-audit', '--no-fund'], target);
}

function buildAndTest(target) {
  run(
    'npx',
    ['nx', 'run-many', '-t', 'build', 'test', '--skip-nx-cache'],
    target,
  );
}

function heading(text) {
  console.log(`\n=== ${text}`);
}

function parseArgs(argv) {
  const index = argv.indexOf('--previous');

  if (index === -1) return { previous: null };

  const previous = argv[index + 1];

  if (!previous) throw new Error('--previous needs a version');

  return { previous };
}

function registryVersion() {
  return execFileSync('npm', ['view', CORE, 'version'], { stdio: 'pipe' })
    .toString()
    .trim();
}

function main(argv) {
  const repoRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    '..',
  );
  const packages = builtPackages(repoRoot);
  const missing = missingBuilds(packages);

  if (missing.length) {
    console.error(notBuiltMessage(missing));
    return 1;
  }

  const previous = parseArgs(argv).previous ?? registryVersion();
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'example-app-'));
  const fresh = path.join(workspace, 'fresh');
  const migrated = path.join(workspace, 'migrated');
  let step = 'pack the built packages';

  try {
    heading(`Packing the built packages`);

    const tarballs = packTarballs(packages, path.join(workspace, 'tarballs'));

    console.log(`${tarballs.size} tarballs`);

    step = 'A: install the example application from the tarballs';
    heading(step);
    createStandaloneApp({ repoRoot, target: fresh, packages: { tarballs } });
    install(fresh);

    step = 'A: build and test the example application';
    heading(step);
    buildAndTest(fresh);

    step = `B: install the example application at ${previous} from the registry`;
    heading(step);
    createStandaloneApp({
      repoRoot,
      target: migrated,
      packages: { version: previous },
    });
    install(migrated);

    step = 'B: switch the manifest to the tarballs and install';
    heading(step);
    writeStandaloneManifest({
      repoRoot,
      target: migrated,
      packages: { tarballs },
    });
    install(migrated);

    step = `B: run the migrations above ${previous}`;
    heading(step);

    const migrations = selectMigrations(
      JSON.parse(fs.readFileSync(path.join(repoRoot, MIGRATIONS), 'utf8'))
        .generators ?? {},
      previous,
    );

    if (migrations.length === 0) {
      console.log(`no migration applies between ${previous} and this release`);
    } else {
      console.log(migrations.map((entry) => entry.name).join(', '));
      fs.writeFileSync(
        path.join(migrated, 'migrations.json'),
        `${JSON.stringify({ migrations }, null, 2)}\n`,
      );
      run(
        'npx',
        ['nx', 'migrate', '--run-migrations=migrations.json', '--if-exists'],
        migrated,
      );
    }

    step = 'B: build and test the migrated example application';
    heading(step);
    buildAndTest(migrated);

    heading(
      'The example application builds, tests and migrates on this release',
    );
    return 0;
  } catch (error) {
    console.error(`\nFAILED: ${step}`);
    console.error(error.message);
    return 1;
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}

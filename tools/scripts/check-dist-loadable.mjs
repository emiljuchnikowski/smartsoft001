#!/usr/bin/env node
/**
 * Loads every built package the way a consumer would, and fails if one of them
 * cannot be loaded at all.
 *
 * The unit tests compile the sources with ts-jest and never look at `dist`, so
 * a package can be green in every suite and still be impossible to install.
 * Five packages shipped for months emitting `export` statements from a manifest
 * that declared CommonJS, and `@smartsoft001/crud-shell-dtos` shipped the
 * mirror image. Nothing caught either, because nothing loaded the artefact.
 *
 * Run it after `nx run-many -t build`. It copies each `dist/packages/**` into a
 * throwaway `node_modules/@smartsoft001/<name>` so that the packages resolve
 * each other exactly as they would once installed. Symlinks would not do:
 * Node resolves a symlinked module's own requires from the link's real path,
 * which is inside `dist`, where the siblings are not reachable by name.
 *
 * Usage: node tools/scripts/check-dist-loadable.mjs
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  builtPackages,
  missingBuilds,
  notBuiltMessage,
  packTarballs,
} from './lib/dist-tarballs.mjs';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);

/**
 * Packages that are known not to load, each with the issue that tracks it. A
 * package on this list is allowed to fail, and the check fails if it starts
 * working, so the list cannot quietly go stale.
 */
const KNOWN_BROKEN = new Map();

/**
 * Decorated classes whose constructor metadata has to survive the build.
 *
 * Loading a package proves the module system is satisfied. It does not prove
 * the package is usable: NestJS resolves a class provider's constructor from
 * the `design:paramtypes` TypeScript emits under `emitDecoratorMetadata`, and
 * typeorm reads `design:type` for a column with no explicit type. Eighteen
 * packages spent months built by esbuild, which does not implement that
 * option, so every decorated class shipped without its metadata. The suites
 * stayed green throughout, because ts-jest compiles the sources and does emit
 * it, and the entry points still imported, so a load check alone would have
 * said nothing.
 *
 * Each entry names a class the framework itself injects, and the parameter
 * types Nest has to see to construct it.
 */
const DECORATED_CLASSES = [
  {
    package: '@smartsoft001/crud-shell-app-services',
    export: 'CrudService',
    // The fourth parameter is the CRUD config carrying the model type the
    // service validates request bodies against (FRA-386).
    paramTypes: [
      'PermissionService',
      'IItemRepository',
      'IAttachmentRepository',
      'SharedConfig',
    ],
  },
];

function main() {
  const packages = builtPackages(repoRoot);

  assert.ok(
    packages.length > 0,
    'found no publishable package; this check has drifted from the workspace',
  );

  const missing = missingBuilds(packages);

  if (missing.length) {
    console.error(notBuiltMessage(missing));
    process.exit(1);
  }

  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-loadable-'));
  const tarballs = path.join(workspace, 'tarballs');

  try {
    fs.writeFileSync(
      path.join(workspace, 'package.json'),
      `${JSON.stringify({ name: 'dist-loadable-probe', private: true, type: 'commonjs' }, null, 2)}\n`,
    );

    // Pack each build and let npm install the tarballs, which is what a
    // consumer does. An earlier version of this check copied the builds into
    // `node_modules` and symlinked the repository's own installed packages
    // beside them. That resolved everything, declared or not, so it could not
    // see a manifest missing a dependency the code imports. Four packages went
    // to npm unloadable while it reported them fine. Here npm resolves only
    // what the manifests declare, which is the whole point.
    execFileSync(
      'npm',
      [
        'install',
        '--no-audit',
        '--no-fund',
        '--silent',
        ...packTarballs(packages, tarballs).values(),
      ],
      { cwd: workspace, stdio: 'pipe' },
    );

    const unexpectedFailures = [];
    const unexpectedPasses = [];

    let checked = 0;

    for (const entry of packages) {
      if (entry.mode === 'skip') {
        console.log(`skip  ${entry.name} (no code of its own)`);
        continue;
      }

      const expression =
        entry.mode === 'resolve'
          ? `require.resolve(${JSON.stringify(entry.name)})`
          : `require(${JSON.stringify(entry.name)})`;

      let error = null;
      checked += 1;

      try {
        execFileSync(process.execPath, ['-e', expression], {
          cwd: workspace,
          stdio: 'pipe',
        });
      } catch (caught) {
        error = String(caught.stderr ?? caught.message)
          .split('\n')
          .find((line) => /Error/.test(line))
          ?.trim();
      }

      const known = KNOWN_BROKEN.get(entry.name);

      if (error && !known) {
        unexpectedFailures.push(`${entry.name}: ${error}`);
      } else if (!error && known) {
        unexpectedPasses.push(`${entry.name} (${known})`);
      }

      const verdict = error ? (known ? 'known' : 'FAIL ') : 'ok   ';

      console.log(`${verdict} ${entry.name} (${entry.mode})`);
    }

    if (unexpectedPasses.length) {
      console.error(
        '\nThese packages load now and are still on the known-broken list. ' +
          'Remove them from KNOWN_BROKEN:\n  ' +
          unexpectedPasses.join('\n  '),
      );
      process.exit(1);
    }

    if (unexpectedFailures.length) {
      console.error(
        '\nThese packages cannot be loaded from what the build produced:\n  ' +
          unexpectedFailures.join('\n  '),
      );
      process.exit(1);
    }

    console.log(
      `\n${checked - KNOWN_BROKEN.size} of ${checked} checked packages load` +
        (KNOWN_BROKEN.size
          ? `; ${KNOWN_BROKEN.size} are known broken and tracked.`
          : '.'),
    );

    checkDecoratorMetadata(workspace);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
}

/**
 * Reads the constructor metadata off each class in `DECORATED_CLASSES`, in a
 * child process so that `reflect-metadata` is loaded the way a consumer loads
 * it, and fails when a class lost the types Nest needs.
 */
function checkDecoratorMetadata(workspace) {
  const offenders = [];

  for (const entry of DECORATED_CLASSES) {
    const program = `
      require('reflect-metadata');
      const mod = require(${JSON.stringify(entry.package)});
      const target = mod[${JSON.stringify(entry.export)}];
      if (!target) throw new Error('export not found');
      const types = Reflect.getMetadata('design:paramtypes', target);
      process.stdout.write(JSON.stringify(types ? types.map((t) => (t ? t.name : null)) : null));
    `;

    let actual = null;

    try {
      actual = JSON.parse(
        execFileSync(process.execPath, ['-e', program], {
          cwd: workspace,
          stdio: 'pipe',
        }).toString(),
      );
    } catch (caught) {
      offenders.push(
        `${entry.package} ${entry.export}: ${String(caught.stderr ?? caught.message).split('\n')[0]}`,
      );
      continue;
    }

    const label = `${entry.package} ${entry.export}`;

    if (actual === null) {
      offenders.push(
        `${label}: no design:paramtypes at all, so Nest cannot construct it`,
      );
    } else if (actual.join() !== entry.paramTypes.join()) {
      offenders.push(
        `${label}: expected [${entry.paramTypes.join(', ')}], got [${actual.join(', ')}]`,
      );
    } else {
      console.log(`ok    ${label} (metadata)`);
    }
  }

  if (offenders.length) {
    console.error(
      '\nDecorator metadata did not survive the build:\n  ' +
        offenders.join('\n  ') +
        '\n\nThe build has to emit "emitDecoratorMetadata". esbuild does not implement it.',
    );
    process.exit(1);
  }
}

main();

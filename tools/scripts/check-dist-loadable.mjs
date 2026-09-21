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
    paramTypes: [
      'PermissionService',
      'IItemRepository',
      'IAttachmentRepository',
    ],
  },
];

function readJson(absolute) {
  return JSON.parse(fs.readFileSync(absolute, 'utf8'));
}

/**
 * How a package has to be checked. Not every package is a Node module:
 *
 * - `load`   a Node library. Requiring it has to work, because that is how a
 *            NestJS application or a script consumes it.
 * - `resolve` an Angular library. Its entry points are ESM bundles meant for a
 *            bundler and executing one in bare Node proves nothing. Resolving
 *            the entry still proves the package is installable and complete.
 * - `skip`   a meta package. It carries dependencies and no code of its own,
 *            so it declares no entry point and there is nothing to load.
 */
function classify(project) {
  const executor = project?.targets?.build?.executor;

  if (executor === '@nx/angular:package') return 'resolve';
  if (executor === 'nx:run-commands') return 'skip';

  return 'load';
}

/** Every publishable package, paired with the directory its build produced. */
function builtPackages() {
  const result = [];

  for (const file of fs.globSync('packages/**/package.json', {
    cwd: repoRoot,
    exclude: (name) => name === 'node_modules',
  })) {
    const manifest = readJson(path.join(repoRoot, file));

    if (!manifest.name?.startsWith('@smartsoft001/')) continue;

    const projectRoot = path.dirname(file);
    const projectFile = path.join(repoRoot, projectRoot, 'project.json');
    const project = fs.existsSync(projectFile) ? readJson(projectFile) : null;

    result.push({
      name: manifest.name,
      projectRoot,
      distRoot: path.join(repoRoot, 'dist', projectRoot),
      mode: classify(project),
    });
  }

  return result.sort((a, b) => a.name.localeCompare(b.name));
}

function main() {
  const packages = builtPackages();

  assert.ok(
    packages.length > 0,
    'found no publishable package; this check has drifted from the workspace',
  );

  const missing = packages.filter((entry) => !fs.existsSync(entry.distRoot));

  if (missing.length) {
    console.error(
      `Not built: ${missing.map((entry) => entry.name).join(', ')}\n` +
        'Run "npx nx run-many -t build" before this check.',
    );
    process.exit(1);
  }

  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-loadable-'));
  const scope = path.join(workspace, 'node_modules', '@smartsoft001');

  try {
    fs.mkdirSync(scope, { recursive: true });
    fs.writeFileSync(
      path.join(workspace, 'package.json'),
      `${JSON.stringify({ name: 'dist-loadable-probe', private: true, type: 'commonjs' }, null, 2)}\n`,
    );

    // The third-party dependencies come from the repository's own install.
    for (const entry of fs.readdirSync(path.join(repoRoot, 'node_modules'))) {
      if (entry === '@smartsoft001') continue;

      fs.symlinkSync(
        path.join(repoRoot, 'node_modules', entry),
        path.join(workspace, 'node_modules', entry),
      );
    }

    for (const entry of packages) {
      const short = entry.name.slice('@smartsoft001/'.length);

      fs.cpSync(entry.distRoot, path.join(scope, short), { recursive: true });
    }

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

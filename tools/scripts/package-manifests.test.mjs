import assert from 'node:assert/strict';
import fs from 'node:fs';
import { isBuiltin } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);

/** Nx writes this sentence into every generated library manifest. */
const NX_PLACEHOLDER_DESCRIPTION =
  'This library was generated with [Nx](https://nx.dev).';

/**
 * Imports that are written in the sources and are deliberately not declared,
 * because nothing the package ships ever resolves them.
 *
 * `@smartsoft001/core`'s migration takes the `Tree` Nx hands it. The type is
 * erased at compile time on purpose: the migration has to run in a workspace
 * that installs the framework and not the devkit, so requiring `@nx/devkit`
 * there would fail. Declaring it would install a whole Nx toolchain into every
 * consumer to satisfy an import that is not in the JavaScript.
 */
const ERASED_IMPORTS = {
  '@smartsoft001/core': ['@nx/devkit'],
};

function readJson(relative) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relative), 'utf8'));
}

/** Every `@smartsoft001/*` manifest under `packages`, with its directory. */
function publishedPackages() {
  const files = fs.globSync('packages/**/package.json', {
    cwd: repoRoot,
    exclude: (name) => name === 'node_modules',
  });

  return files
    .map((file) => ({ file, manifest: readJson(file) }))
    .filter(({ manifest }) => manifest.name?.startsWith('@smartsoft001/'))
    .map((entry) => ({ ...entry, dir: path.dirname(entry.file) }));
}

/**
 * The names of every package a project's shipped sources import.
 *
 * Reading this out of the sources rather than out of a list kept here means a
 * new import shows up in the check on the commit that adds it. Specs, stories
 * and tests are excluded, and so is `test-setup.ts`: none of them is built
 * into the package, so what they import is a workspace concern rather than
 * something a consumer installs.
 *
 * A subpath import is credited to the package it comes from, so `rxjs/operators`
 * counts as `rxjs` and `@nestjs/common/x` as `@nestjs/common`.
 */
function importedNames(dir) {
  const sourceRoot = path.join(repoRoot, dir, 'src');

  if (!fs.existsSync(sourceRoot)) return null;

  const sources = fs
    .globSync('**/*.ts', {
      cwd: sourceRoot,
      exclude: (name) => name === 'node_modules',
    })
    .filter((file) => !/\.(spec|stories|test)\.ts$/.test(file))
    .filter((file) => path.basename(file) !== 'test-setup.ts');

  const found = new Set();

  for (const file of sources) {
    const text = fs.readFileSync(path.join(sourceRoot, file), 'utf8');

    // `from 'x'` covers imports, re-exports and `import type`; the second
    // pattern covers a bare side-effect `import 'x'`. A leading `.` marks a
    // relative path, which resolves inside the package.
    for (const match of text.matchAll(/\bfrom\s+['"]([^'".][^'"]*)['"]/g)) {
      found.add(match[1]);
    }

    for (const match of text.matchAll(/\bimport\s+['"]([^'".][^'"]*)['"]/g)) {
      found.add(match[1]);
    }
  }

  return new Set(
    [...found].map((name) =>
      name.startsWith('@')
        ? name.split('/').slice(0, 2).join('/')
        : name.split('/')[0],
    ),
  );
}

function declaredPackages(manifest) {
  return {
    ...(manifest.dependencies ?? {}),
    ...(manifest.peerDependencies ?? {}),
  };
}

describe('package manifests: what a project imports, it declares', () => {
  const packages = publishedPackages();

  it('should find the published packages', () => {
    // A glob that silently matched nothing would make every check below pass.
    assert.ok(
      packages.length > 20,
      `expected to read the published manifests, found ${packages.length}`,
    );
  });

  it('should declare every package its sources import', () => {
    // An undeclared import installs nothing: the consumer gets a
    // module-not-found at import time, or a type error with no hint of which
    // package is missing, and no package manager warns about either. This
    // check used to look at `@smartsoft001/*` specifiers only, which is why
    // eighteen packages reached npm importing ninety-six third-party
    // libraries between them that none of their manifests named. esbuild had
    // been inlining those libraries into the bundle; `@nx/js:tsc` leaves the
    // require in place, and it resolves to nothing.
    const offenders = [];

    for (const { file, dir, manifest } of packages) {
      const declared = declaredPackages(manifest);
      const imported = importedNames(dir);

      if (imported === null) continue;

      for (const name of [...imported].sort()) {
        // Node ships these, in both spellings; nothing declares them.
        if (name.startsWith('node:') || isBuiltin(name)) continue;
        // A package importing its own entry point through the path alias
        // declares nothing: the code is already there.
        if (name === manifest.name) continue;
        if (ERASED_IMPORTS[manifest.name]?.includes(name)) continue;
        if (name in declared) continue;

        offenders.push(`${file}: ${name}`);
      }
    }

    assert.deepEqual(
      offenders,
      [],
      'every package a project imports must appear in its "dependencies" or "peerDependencies"',
    );
  });

  it('should not declare a package it never imports', () => {
    // The same defect in the other direction: a dependency nothing imports is
    // installed into every consumer for nothing, and it misleads whoever reads
    // the manifest to work out what the package actually needs.
    const offenders = [];

    for (const { file, dir, manifest } of packages) {
      const used = importedNames(dir);

      // The meta packages ship no entry point of their own. Their whole
      // purpose is the dependency list, so nothing there can import it.
      if (
        used === null ||
        !fs.existsSync(path.join(repoRoot, dir, 'src/index.ts'))
      )
        continue;

      for (const name of Object.keys(declaredPackages(manifest))) {
        // `importHelpers` emits the tslib calls, they are never written as an
        // import, so no source file ever names it.
        if (name === 'tslib') continue;
        if (name === manifest.name) continue;
        if (used.has(name)) continue;

        offenders.push(`${file}: ${name}`);
      }
    }

    assert.deepEqual(
      offenders,
      [],
      'a declared dependency must be imported by the sources the package ships',
    );
  });

  it('should pin every workspace package to the version it ships with', () => {
    // The family is released in lockstep, and `nx release version` only
    // rewrites a pin that matches the dependency's current version. A range or
    // a stale pin drops out of that rewrite and silently stops being updated.
    const offenders = [];

    for (const { file, manifest } of packages) {
      for (const [name, range] of Object.entries(declaredPackages(manifest))) {
        if (!name.startsWith('@smartsoft001/')) continue;
        if (range === manifest.version) continue;

        offenders.push(`${file}: ${name}@${range}`);
      }
    }

    assert.deepEqual(
      offenders,
      [],
      'a @smartsoft001 dependency must be pinned to the exact version of the package declaring it',
    );
  });
});

describe('package manifests: npm metadata', () => {
  const packages = publishedPackages();

  it('should give every package a description of its own', () => {
    // The description is the one line npm and the registry search show. The
    // generated placeholder says nothing, and a missing one leaves the listing
    // blank.
    const offenders = [];

    for (const { file, manifest } of packages) {
      const description = manifest.description?.trim();

      if (!description) {
        offenders.push(`${file}: no description`);
        continue;
      }

      if (description === NX_PLACEHOLDER_DESCRIPTION) {
        offenders.push(`${file}: generated placeholder`);
      }
    }

    assert.deepEqual(
      offenders,
      [],
      'every published manifest needs a real "description"',
    );
  });
});

describe('@smartsoft001/models: the imports a consumer has to resolve', () => {
  const manifest = readJson('packages/shared/models/package.json');

  it('should depend on what the decorators call at runtime', () => {
    // `@Model` and `@Field` call `Reflect.defineMetadata`, which only exists
    // once `reflect-metadata` has been loaded, and the field decorator calls
    // `ObjectService.createByType` whenever a field declares a `classType`.
    // Both survive compilation, so both are ordinary dependencies.
    assert.ok(
      manifest.dependencies?.['reflect-metadata'],
      'models loads reflect-metadata for its side effect',
    );
    assert.equal(
      manifest.dependencies?.['@smartsoft001/utils'],
      manifest.version,
    );
  });

  it('should declare the Angular types its declarations expose', () => {
    // `IModelFilter.possibilities` is a `Signal`, so the emitted `.d.ts`
    // imports `@angular/core` and a consumer cannot type-check without it.
    // The import is erased from the JavaScript, and the package works in a
    // NestJS process with no Angular anywhere, so the peer is optional.
    assert.ok(
      manifest.peerDependencies?.['@angular/core'],
      'models exposes Signal in its public types',
    );
    assert.equal(
      manifest.peerDependenciesMeta?.['@angular/core']?.optional,
      true,
      'the Angular import is type-only, so it must not be required at install time',
    );
  });
});

describe('@smartsoft001/mongo: where the published types live', () => {
  const manifest = readJson('packages/shared/mongo/package.json');

  it('should point at the declarations the build emits', () => {
    // The build writes `src/index.d.ts` next to the bundle, the same place the
    // `@nx/js:tsc` siblings put theirs, but nothing in the manifest says so.
    // Without `typings` the published package resolves to `any` for every
    // consumer, and a `MongoConfig` typo only shows up at runtime.
    assert.equal(manifest.typings, './src/index.d.ts');
  });

  it('should name the entry the build emits', () => {
    // This package used to be bundled into a single `index.cjs`, and left
    // `main` to the executor that wrote the bundle. It is compiled file by
    // file by `@nx/js:tsc` now, for the decorator metadata esbuild does not
    // emit, so the entry is the same `src/index.js` every sibling declares.
    assert.equal(manifest.main, './src/index.js');
  });
});

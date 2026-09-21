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

function readJson(absolute) {
  return JSON.parse(fs.readFileSync(absolute, 'utf8'));
}

/**
 * Resolves a tsconfig through its `extends` chain and returns the compiler
 * options as TypeScript would see them: the nearest file wins.
 */
function resolveCompilerOptions(absolute, seen = new Set()) {
  if (seen.has(absolute) || !fs.existsSync(absolute)) return {};
  seen.add(absolute);

  const config = readJson(absolute);
  const inherited = config.extends
    ? resolveCompilerOptions(
        path.resolve(path.dirname(absolute), config.extends),
        seen,
      )
    : {};

  return { ...inherited, ...(config.compilerOptions ?? {}) };
}

/**
 * Every publishable package, paired with the project that builds it. A package
 * is published exactly when it carries a scoped manifest under `packages/`:
 * `nx.json` names no projects and no groups in its release config, so the
 * default fixed group covers them all.
 */
function publishableProjects() {
  const result = [];

  for (const file of fs.globSync('packages/**/project.json', {
    cwd: repoRoot,
    exclude: (name) => name === 'node_modules',
  })) {
    const projectRoot = path.dirname(path.join(repoRoot, file));
    const manifestPath = path.join(projectRoot, 'package.json');

    if (!fs.existsSync(manifestPath)) continue;

    const manifest = readJson(manifestPath);

    if (!manifest.name?.startsWith('@smartsoft001/')) continue;

    result.push({
      relativeRoot: path.relative(repoRoot, projectRoot),
      project: readJson(path.join(repoRoot, file)),
      manifest,
      manifestPath,
    });
  }

  return result;
}

/**
 * A package whose manifest says `"type": "commonjs"` while its build emits
 * `export` statements cannot be loaded at all, by `require` or by `import`:
 *
 *     SyntaxError: Unexpected token 'export'
 *       .../node_modules/@smartsoft001/utils/src/index.js:1
 *
 * Five packages shipped that way for months because `tsconfig.base.json` sets
 * `"module": "es2022"` and nothing overrode it for the Node libraries, while
 * their manifests were written by hand as CommonJS. The mirror image is just as
 * broken: `@smartsoft001/crud-shell-dtos` let nx infer `"type": "module"` from
 * the same base, and `tsc` leaves relative imports without a file extension,
 * which ESM refuses to resolve.
 *
 * The invariant these tests hold is the one that was missing: for a package
 * built with `@nx/js:tsc`, the module format the compiler emits and the format
 * the manifest declares have to be the same one.
 */
describe('published packages: the build format matches the manifest', () => {
  const tscProjects = publishableProjects().filter(
    (entry) => entry.project.targets?.build?.executor === '@nx/js:tsc',
  );

  it('should find the packages built with @nx/js:tsc', () => {
    assert.ok(
      tscProjects.length > 0,
      'no project builds with @nx/js:tsc; this test has drifted from the build setup',
    );
  });

  it('should emit CommonJS from every @nx/js:tsc build', () => {
    const offenders = [];

    for (const entry of tscProjects) {
      const tsConfig = entry.project.targets.build.options?.tsConfig;

      if (!tsConfig) {
        offenders.push(
          `${entry.relativeRoot}: build target declares no tsConfig`,
        );
        continue;
      }

      const options = resolveCompilerOptions(path.join(repoRoot, tsConfig));
      const module = String(options.module ?? '').toLowerCase();

      if (module !== 'commonjs') {
        offenders.push(`${entry.relativeRoot}: module is "${options.module}"`);
      }
    }

    assert.deepEqual(
      offenders,
      [],
      'a Node package has to compile to CommonJS, because its manifest declares CommonJS',
    );
  });

  it('should not resolve modules the way a bundler does', () => {
    // `"moduleResolution": "bundler"` is only valid alongside `module: esnext`
    // or `preserve`. Left inherited from the base config it makes the build
    // fail outright once `module` becomes `commonjs`.
    const offenders = [];

    for (const entry of tscProjects) {
      const tsConfig = entry.project.targets.build.options?.tsConfig;

      if (!tsConfig) continue;

      const options = resolveCompilerOptions(path.join(repoRoot, tsConfig));
      const resolution = String(options.moduleResolution ?? '').toLowerCase();

      if (resolution === 'bundler') {
        offenders.push(entry.relativeRoot);
      }
    }

    assert.deepEqual(
      offenders,
      [],
      'a CommonJS build needs "moduleResolution": "node"',
    );
  });

  it('should not declare a module type the build does not produce', () => {
    const offenders = [];

    for (const entry of tscProjects) {
      const declared = entry.manifest.type;

      if (declared && declared !== 'commonjs') {
        offenders.push(
          `${path.relative(repoRoot, entry.manifestPath)}: "type": "${declared}"`,
        );
      }
    }

    assert.deepEqual(
      offenders,
      [],
      'a package compiled to CommonJS must not declare itself an ES module',
    );
  });
});

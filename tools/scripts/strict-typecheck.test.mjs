import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { after, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..');
const cli = path.join(here, 'strict-typecheck.mjs');
const strictConfig = path.join(repoRoot, 'tools', 'tsconfig.strict.json');

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

function run(...args) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

/**
 * Writes a one-file TypeScript project that inherits the strict flags and
 * returns the path of its tsconfig. The `include` of the child replaces the
 * parent's, so only the fixture file is checked.
 */
function fixtureProject(name, source) {
  // Under the repository root, so that the inherited `rootDir` (".") and
  // `types: ["node"]` resolve exactly as they do for the package sources.
  const tmp = path.join(repoRoot, 'tmp');

  fs.mkdirSync(tmp, { recursive: true });

  const dir = fs.mkdtempSync(path.join(tmp, `strict-typecheck-${name}-`));

  after(() => fs.rmSync(dir, { recursive: true, force: true }));

  fs.writeFileSync(path.join(dir, 'fixture.ts'), source);
  fs.writeFileSync(
    path.join(dir, 'tsconfig.json'),
    JSON.stringify({
      extends: strictConfig,
      include: ['./fixture.ts'],
      exclude: [],
    }),
  );

  return path.join(dir, 'tsconfig.json');
}

/**
 * The published packages are the ones the consumer's compiler sees through
 * the path aliases, so each of them has to be inside the checked set.
 */
function publishedEntryPoints() {
  const result = [];

  for (const file of fs.globSync('packages/**/package.json', {
    cwd: repoRoot,
    exclude: (entry) => entry === 'node_modules',
  })) {
    const manifest = readJson(path.join(repoRoot, file));

    if (!manifest.name?.startsWith('@smartsoft001/')) continue;

    const entry = path.join(repoRoot, path.dirname(file), 'src', 'index.ts');

    if (fs.existsSync(entry)) result.push(entry);
  }

  return result;
}

/**
 * A fresh Nx workspace compiles with `strict` and `isolatedModules`, and an
 * application built in this repository against the path aliases compiles the
 * framework sources with that tsconfig, not with the packages' own lenient
 * ones. 262 diagnostics hid behind that gap until the example app tried to
 * build (FRA-383). The guard checks the sources the way the consumer does.
 */
describe('strict-typecheck: the sources compile under a consumer tsconfig', () => {
  it('should enable the flags a new Nx workspace enables', () => {
    const options = resolveCompilerOptions(strictConfig);

    assert.equal(options.strict, true, 'strict must be on');
    assert.equal(options.noImplicitAny, true, 'noImplicitAny must be on');
    assert.equal(options.isolatedModules, true, 'isolatedModules must be on');
    assert.equal(options.noEmit, true, 'the guard must not write output');
  });

  it('should cover the entry point of every published package', () => {
    const listed = spawnSync(
      process.execPath,
      [
        path.join(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc'),
        '-p',
        strictConfig,
        '--listFilesOnly',
      ],
      { cwd: repoRoot, encoding: 'utf8' },
    );
    const files = new Set(
      listed.stdout
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((file) => path.resolve(file)),
    );
    const entryPoints = publishedEntryPoints();

    assert.ok(entryPoints.length > 0, 'no published package with src/index.ts');

    const missing = entryPoints
      .filter((entry) => !files.has(entry))
      .map((entry) => path.relative(repoRoot, entry));

    assert.deepEqual(
      missing,
      [],
      'tools/tsconfig.strict.json does not include these packages',
    );
  });

  it('should fail on a source that only breaks under the strict flags', () => {
    const project = fixtureProject(
      'red',
      [
        '// TS2322 under strictNullChecks, TS7006 under noImplicitAny',
        'export const name: string = null;',
        'export function identity(value) {',
        '  return value;',
        '}',
        '',
      ].join('\n'),
    );

    const result = run('--project', project);

    assert.notEqual(result.status, 0, 'a strict violation must fail the run');
    assert.match(result.stdout, /error TS2322/);
    assert.match(result.stdout, /error TS7006/);
    assert.match(result.stdout, /strict-typecheck: 2 error\(s\)/);
  });

  it('should pass on a source that is strict-clean', () => {
    const project = fixtureProject(
      'green',
      [
        'export const name: string | null = null;',
        'export function identity(value: string): string {',
        '  return value;',
        '}',
        '',
      ].join('\n'),
    );

    const result = run('--project', project);

    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /strict-typecheck: 0 error\(s\)/);
  });

  it('should report zero errors for every package source', () => {
    const result = run();

    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /strict-typecheck: 0 error\(s\)/);
  });

  it('should run as its own step in the pull request workflow', () => {
    // The check is a few seconds and its output is the diagnostic list; buried
    // inside the Jest run of thirty projects it would be unreadable, and
    // `docs:test` is cached on inputs that do not cover `packages/**`.
    const workflow = fs.readFileSync(
      path.join(repoRoot, '.github', 'workflows', 'pull-request.yml'),
      'utf8',
    );

    assert.match(workflow, /npx nx run smartsoft001:strict-typecheck/);
  });
});

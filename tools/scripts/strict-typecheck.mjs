#!/usr/bin/env node
/**
 * Type-checks every package's sources the way a consumer's compiler does.
 *
 * The packages are built with their own, lenient tsconfigs (`strict: false`
 * comes from `tsconfig.base.json`). An application built in this repository
 * against the `@smartsoft001/*` path aliases does not use those: it compiles
 * the framework sources with its own tsconfig, and a fresh Nx workspace
 * enables `strict` and `isolatedModules` by default. The example app (FRA-376)
 * could not build its API or its frontend because 262 diagnostics only showed
 * up under those flags.
 *
 * `tools/tsconfig.strict.json` holds the consumer's flags and includes every
 * `packages/*\/**\/src/**\/*.ts` that is not a spec, a story or a test setup.
 * This script runs `tsc` on it and exits with tsc's status, so it is the
 * guard: `nx run smartsoft001:strict-typecheck`.
 *
 * Usage: node tools/scripts/strict-typecheck.mjs [--project <tsconfig>]
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);

const DEFAULT_PROJECT = path.join('tools', 'tsconfig.strict.json');

function parseArgs(argv) {
  const projectIndex = argv.indexOf('--project');

  if (projectIndex === -1) return { project: DEFAULT_PROJECT };

  const project = argv[projectIndex + 1];

  if (!project) {
    throw new Error('--project needs a path to a tsconfig');
  }

  return { project };
}

const { project } = parseArgs(process.argv.slice(2));
const tsc = path.join(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc');

const result = spawnSync(
  process.execPath,
  [tsc, '-p', project, '--noEmit', '--pretty', 'false'],
  { cwd: repoRoot, encoding: 'utf8' },
);

if (result.error) {
  throw result.error;
}

process.stdout.write(result.stdout);
process.stderr.write(result.stderr);

const errors = result.stdout
  .split('\n')
  .filter((line) => /\berror TS\d+:/.test(line)).length;

console.log(
  `strict-typecheck: ${errors} error(s) under ${path.relative(repoRoot, path.resolve(repoRoot, project))}`,
);

process.exit(result.status ?? 1);

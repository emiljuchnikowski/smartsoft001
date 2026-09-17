#!/usr/bin/env node
/**
 * Builds the published tarball of `@smartsoft001/core`.
 *
 * The package exists to pin dependencies, so most of it is copied rather than
 * compiled. The exception is `src/migrations`, which `nx migrate` runs from a
 * consumer's workspace: those files have to ship as JavaScript, next to the
 * `migrations.json` that names them and the markdown each entry documents
 * itself with. A migration that stays behind in the repository fails at the
 * consumer, not here, which is why this script copies by walking the tree
 * rather than by naming files one at a time.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(projectRoot, '..', '..', '..');
const outDir = path.join(workspaceRoot, 'dist', 'packages', 'meta', 'core');

function copy(relative) {
  const target = path.join(outDir, relative);

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(projectRoot, relative), target);
}

/** Every file below `dir` matching `extension`, as project-relative paths. */
function filesIn(dir, extension) {
  const absolute = path.join(projectRoot, dir);

  if (!fs.existsSync(absolute)) return [];

  return fs
    .readdirSync(absolute, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) =>
      path.relative(projectRoot, path.join(entry.parentPath, entry.name)),
    );
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const file of ['package.json', 'README.md', 'migrations.json']) {
  copy(file);
}

execFileSync(
  'npx',
  ['tsc', '-p', path.join(projectRoot, 'tsconfig.migrations.json')],
  { cwd: workspaceRoot, stdio: 'inherit' },
);

for (const doc of filesIn('src/migrations', '.md')) {
  copy(doc);
}

console.log(`core: ${path.relative(workspaceRoot, outDir)}`);

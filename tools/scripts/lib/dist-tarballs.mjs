/**
 * The publishable packages and the tarballs `npm pack` makes of their builds.
 *
 * Shared by the checks that run on `dist` before a release: loading every
 * package (`check-dist-loadable.mjs`) and installing the example application
 * from the same tarballs (`verify-example-app.mjs`). Both have to agree on
 * what a package is and on what a consumer receives, so both read it here.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

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

/**
 * Every publishable package, paired with the directory its build produced,
 * sorted by name. A package is published exactly when it has a scoped
 * manifest under `packages/`, which is also how `nx release` sees it.
 */
export function builtPackages(repoRoot) {
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

/**
 * The packages whose build is missing, so that a check can refuse to run
 * against a stale or partial `dist` instead of reporting on it.
 */
export function missingBuilds(packages) {
  return packages.filter((entry) => !fs.existsSync(entry.distRoot));
}

/**
 * The message every dist check prints when the build is not there. One text,
 * so that a contributor recognises it whichever check fails first.
 */
export function notBuiltMessage(missing) {
  return (
    `Not built: ${missing.map((entry) => entry.name).join(', ')}\n` +
    'Run "npx nx run-many -t build" before this check.'
  );
}

/**
 * Packs each build into `dir` and returns the package name mapped to the
 * absolute path of its tarball.
 *
 * Packing is what a consumer receives: `npm pack` applies `files`, drops what
 * `.npmignore` excludes and rewrites nothing else, so a manifest missing a
 * dependency the code imports, or an entry point that is not in the tarball,
 * fails from here on exactly as it would from the registry.
 */
export function packTarballs(packages, dir) {
  const tarballs = new Map();

  fs.mkdirSync(dir, { recursive: true });

  for (const entry of packages) {
    const [packed] = JSON.parse(
      execFileSync('npm', ['pack', entry.distRoot, '--json'], {
        cwd: dir,
        stdio: 'pipe',
      }).toString(),
    );

    tarballs.set(entry.name, path.join(dir, packed.filename));
  }

  return tarballs;
}

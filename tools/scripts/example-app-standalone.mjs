#!/usr/bin/env node
/**
 * Writes a standalone copy of the example application (`docs/examples/app`)
 * into a directory of its own: an Nx workspace that installs `@smartsoft001`
 * from npm, or from the tarballs of a release being cut, instead of resolving
 * the framework through the monorepo's path aliases.
 *
 * Inside the monorepo the app sits five directories deep and every config
 * points back at the root: `extends`, `preset`, `$schema`, and every path in
 * a `project.json` starts with `docs/examples/app/`. The copy puts the app at
 * the root of its own workspace, so those references are rewritten, and the
 * workspace files the monorepo provides (`nx.json`, `tsconfig.base.json`,
 * `jest.preset.js`) are written fresh from the root ones.
 *
 * The web project's `styles` target compiles the framework's stylesheets from
 * the package sources, which a copy does not have. The published UI packages
 * ship the compiled `styles.css` instead, so the copy drops the target and
 * points the build at `node_modules/@smartsoft001/<package>/styles.css`.
 *
 * Usage: node tools/scripts/example-app-standalone.mjs --target <dir>
 *          --packages tarballs:<dir>|registry:<version>
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_ROOT = path.join('docs', 'examples', 'app');
const STACK = '@smartsoft001/full-stack';

/** What the copy leaves behind: local state, never the app. */
const SKIPPED = new Set(['node_modules', 'dist', '.env']);

/**
 * Files whose paths are rewritten: the workspace configuration, never the
 * sources. Nothing under `src/` refers to the workspace root.
 */
const CONFIG_EXTENSIONS = new Set(['.json', '.ts', '.js', '.mjs']);

/**
 * The compiled stylesheets the UI packages publish, in the order the
 * monorepo's `styles` target produced them, followed by the app's own.
 */
const STANDALONE_STYLES = [
  'node_modules/@smartsoft001/angular/styles.css',
  'node_modules/@smartsoft001/crud-shell-angular/styles.css',
  'apps/web/src/styles.scss',
];

function readJson(absolute) {
  return JSON.parse(fs.readFileSync(absolute, 'utf8'));
}

function writeJson(absolute, value) {
  fs.writeFileSync(absolute, `${JSON.stringify(value, null, 2)}\n`);
}

/**
 * Moves a reference from five directories deep to the workspace root, and
 * drops the monorepo prefix from a workspace-relative path. `../../../../..`
 * is matched without a trailing slash so that `resolve(__dirname, '../../../../..')`
 * in the Playwright config is rewritten too.
 */
export function rewritePaths(text) {
  return text
    .replaceAll('../../../../..', '../..')
    .replaceAll(`${APP_ROOT}/`, '');
}

function isConfigFile(absolute) {
  return (
    CONFIG_EXTENSIONS.has(path.extname(absolute)) &&
    !absolute.split(path.sep).includes('src')
  );
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!SKIPPED.has(entry.name)) yield* walk(absolute);
    } else {
      yield absolute;
    }
  }
}

/**
 * Replaces the monorepo's `styles` target with the published stylesheets.
 * The target and the `dependsOn` that waited for it go; the build's `styles`
 * become the files the installed packages ship.
 */
export function standaloneProject(project) {
  if (!project.targets?.styles) return project;

  const targets = {};

  for (const [name, target] of Object.entries(project.targets)) {
    if (name === 'styles') continue;

    const dependsOn = target.dependsOn?.filter(
      (dependency) =>
        (typeof dependency === 'string' ? dependency : dependency.target) !==
        'styles',
    );
    const next = { ...target };

    if (dependsOn?.length) {
      next.dependsOn = dependsOn;
    } else {
      delete next.dependsOn;
    }

    if (name === 'build' && next.options?.styles) {
      next.options = { ...next.options, styles: [...STANDALONE_STYLES] };
    }

    targets[name] = next;
  }

  return { ...project, targets };
}

/**
 * The copy's manifest. The tarball form installs the stack package from the
 * release being cut and overrides every `@smartsoft001` package with its own
 * tarball, because the tarballs pin each other at a version that is not on
 * the registry yet: without the overrides npm would look for it there and
 * fail, or worse, find the previous release. The registry form installs the
 * stack at one exact version and lets npm resolve the rest.
 */
export function standaloneManifest(manifest, packages) {
  const next = { ...manifest, dependencies: { ...manifest.dependencies } };

  delete next.overrides;

  if (packages.tarballs) {
    const overrides = {};

    for (const [name, tarball] of packages.tarballs) {
      overrides[name] = `file:${tarball}`;
    }

    next.dependencies[STACK] = overrides[STACK];
    next.overrides = overrides;
  } else {
    next.dependencies[STACK] = packages.version;
  }

  return next;
}

/** The root `tsconfig.base.json` minus the aliases into `packages/`. */
export function standaloneTsconfig(base) {
  const compilerOptions = { ...base.compilerOptions };

  delete compilerOptions.paths;

  return {
    compileOnSave: false,
    compilerOptions: {
      ...compilerOptions,
      paths: { '@app/model': ['libs/model/src/index.ts'] },
    },
    exclude: ['node_modules', 'tmp'],
  };
}

/**
 * Writes the copy's `package.json` for `packages`: `{ tarballs }`, a map of
 * package name to tarball path, or `{ version }` for the registry. Called on
 * its own to switch an installed copy from one form to the other.
 */
export function writeStandaloneManifest({ repoRoot, target, packages }) {
  const manifest = readJson(path.join(repoRoot, APP_ROOT, 'package.json'));

  writeJson(
    path.join(target, 'package.json'),
    standaloneManifest(manifest, packages),
  );
}

export function createStandaloneApp({ repoRoot, target, packages }) {
  const source = path.join(repoRoot, APP_ROOT);

  fs.mkdirSync(target, { recursive: true });
  fs.cpSync(source, target, {
    recursive: true,
    filter: (entry) => !SKIPPED.has(path.basename(entry)),
  });

  for (const file of walk(target)) {
    if (!isConfigFile(file)) continue;

    const text = fs.readFileSync(file, 'utf8');
    const rewritten = rewritePaths(text);

    if (rewritten !== text) fs.writeFileSync(file, rewritten);

    if (path.basename(file) === 'project.json') {
      writeJson(file, standaloneProject(readJson(file)));
    }
  }

  writeJson(path.join(target, 'nx.json'), {
    $schema: './node_modules/nx/schemas/nx-schema.json',
    extends: 'nx/presets/npm.json',
    useInferencePlugins: false,
    targetDefaults: {
      build: { cache: true },
      '@nx/jest:jest': {
        cache: true,
        options: { passWithNoTests: true },
      },
    },
  });
  writeJson(
    path.join(target, 'tsconfig.base.json'),
    standaloneTsconfig(readJson(path.join(repoRoot, 'tsconfig.base.json'))),
  );
  fs.copyFileSync(
    path.join(repoRoot, 'jest.preset.js'),
    path.join(target, 'jest.preset.js'),
  );
  fs.writeFileSync(
    path.join(target, '.gitignore'),
    ['node_modules', 'dist', '.nx', 'coverage', ''].join('\n'),
  );
  writeStandaloneManifest({ repoRoot, target, packages });
}

/**
 * `tarballs:<dir>` names the packages by their tarballs: `npm pack` names
 * one `smartsoft001-<name>-<version>.tgz`, which is enough to get the
 * scoped name back.
 */
export function parsePackages(spec) {
  const [kind, value] = spec.split(/:(.*)/s);

  if (kind === 'registry' && value) return { version: value };

  if (kind === 'tarballs' && value) {
    const dir = path.resolve(value);
    const tarballs = new Map();

    for (const file of fs.readdirSync(dir)) {
      const match = /^smartsoft001-(.+)-\d+\.\d+\.\d+[\w.-]*\.tgz$/.exec(file);

      if (match)
        tarballs.set(`@smartsoft001/${match[1]}`, path.join(dir, file));
    }

    if (!tarballs.size) throw new Error(`no @smartsoft001 tarball in ${dir}`);

    return { tarballs };
  }

  throw new Error(
    `--packages expects tarballs:<dir> or registry:<version>, got "${spec}"`,
  );
}

export function parseArgs(argv) {
  const value = (flag) => {
    const index = argv.indexOf(flag);

    if (index === -1 || !argv[index + 1]) {
      throw new Error(`${flag} is required`);
    }

    return argv[index + 1];
  };

  return {
    target: path.resolve(value('--target')),
    packages: parsePackages(value('--packages')),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const repoRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    '..',
  );
  const { target, packages } = parseArgs(process.argv.slice(2));

  createStandaloneApp({ repoRoot, target, packages });
  console.log(`standalone example application written to ${target}`);
}

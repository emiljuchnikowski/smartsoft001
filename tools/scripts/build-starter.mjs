#!/usr/bin/env node
/**
 * Generates the starter repository from the example application.
 *
 * A newcomer wants something to clone, not a folder five directories deep in
 * a monorepo. A starter maintained by hand drifts from the framework within a
 * couple of releases, so the starter is generated instead: the `Publish`
 * workflow runs this script on every release and pushes the result to the
 * starter repository as one commit per release.
 *
 * The script starts from `createStandaloneApp`, which already moves the app to
 * the root of a workspace of its own and installs `@smartsoft001` from npm at
 * the version just released. On top of that copy it applies the starter layer:
 *
 * - The projects lose the `docs-examples-app-` prefix they carry inside the
 *   monorepo, so the starter has `web`, `api`, `model` and `web-e2e`.
 * - The `#region` markers the documentation site cuts its snippets from are
 *   removed. They mean nothing outside the docs.
 * - The Docker files build with the starter root as context instead of the
 *   monorepo root, and `run.sh` runs from its own directory.
 * - The `lint` targets are dropped. The app's manifest installs neither
 *   `typescript-eslint` nor `@typescript-eslint/parser` (both are optional
 *   peers of `@nx/eslint-plugin`), so no root ESLint config could parse the
 *   sources, and a target that cannot pass is worse than no target.
 * - A CI workflow, a README written for the starter, a merged `.gitignore`
 *   and a lockfile are added, and the result is committed on `main` so that
 *   `verify-starter.mjs` can clone it and the workflow can push it.
 *
 * Usage: node tools/scripts/build-starter.mjs --version <v> --target <dir>
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createStandaloneApp } from './example-app-standalone.mjs';

const APP_ROOT = 'docs/examples/app';
const PROJECT_PREFIX = 'docs-examples-app-';
const DOCS_PAGE =
  'https://emiljuchnikowski.github.io/smartsoft001/docs/example-app';

/** The identity of the release commits, the same one the workflow pushes with. */
export const RELEASE_IDENTITY = {
  name: 'smartsoft001 release',
  email: 'noreply@github.com',
};

/** What the walk never enters: not part of the app, or produced by this script. */
const SKIPPED = new Set(['node_modules', 'dist', '.git']);

/** The files whose `#region` markers feed the documentation site. */
const REGION_EXTENSIONS = new Set(['.ts', '.sh', '.yml']);

/**
 * Files that name the monorepo on purpose: the README says where the starter
 * comes from and the manifest description says the same. Every other file
 * that still mentions the monorepo after the rewrite is a bug.
 */
const ORIGIN_MENTIONED_IN = new Set(['README.md', 'package.json']);

function readJson(absolute) {
  return JSON.parse(fs.readFileSync(absolute, 'utf8'));
}

function writeJson(absolute, value) {
  fs.writeFileSync(absolute, `${JSON.stringify(value, null, 2)}\n`);
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

/** A NUL byte is the one thing a text file never contains; the favicon has many. */
function isText(buffer) {
  return !buffer.includes(0);
}

/**
 * Replaces exactly what it was asked to and refuses to pretend otherwise. A
 * change to the example application that moves a line this layer rewrites
 * must fail the release, not ship a starter that still says "monorepo".
 */
function replaceOnce(text, pattern, replacement) {
  const next = text.replace(pattern, replacement);

  if (next === text) {
    throw new Error(`nothing matched ${pattern} in the text to rewrite`);
  }

  return next;
}

/**
 * `docs-examples-app-web` becomes `web`, and the same for `api`, `model` and
 * `web-e2e`. Every project name is the prefix plus the directory name, so
 * dropping the prefix is the whole rename and covers the name, the
 * `implicitDependencies`, every `buildTarget` and the `displayName`.
 */
export function renameProjects(text) {
  return text.replaceAll(PROJECT_PREFIX, '');
}

/**
 * The paths `createStandaloneApp` left alone because they sit in sources or
 * in files it does not treat as configuration: a doc comment on the API config
 * and the hint in the Playwright runner. The bare form appears once, in prose.
 */
export function stripMonorepoPaths(text) {
  return text
    .replaceAll(`${APP_ROOT}/`, '')
    .replaceAll(APP_ROOT, 'the starter root');
}

/**
 * Drops the lines that are only a snippet marker. Indented markers count: the
 * seed's region sits inside a method. Anything else on the line keeps it.
 */
export function stripRegions(text) {
  return text.replace(/^[ \t]*(\/\/|#) #(region\b.*|endregion\b.*)\r?\n/gm, '');
}

/** The starter has no ESLint parser for its sources, so it has no lint target. */
export function starterProject(project) {
  if (!project.targets?.lint) return project;

  const targets = { ...project.targets };

  delete targets.lint;

  return { ...project, targets };
}

/**
 * The compose file built the image from the monorepo root because the API
 * compiled the framework from its sources. The starter installs the framework
 * from npm, so its own root is the whole context.
 */
export function starterCompose(yaml) {
  const header = replaceOnce(
    stripMonorepoPaths(renameProjects(yaml)),
    /^# Brings up MongoDB and the API\.[\s\S]*?\n#\n/,
    [
      '# Brings up MongoDB and the API. The frontend runs on the host with',
      '# `npx nx serve web` and reaches the API through its dev-server proxy',
      '# (apps/web/proxy.conf.json).',
      '#',
      '',
    ].join('\n'),
  );

  return replaceOnce(
    header,
    /[ \t]*# The build context is the repository root:[\s\S]*?\n([ \t]*)context: \.\.\/\.\.\/\.\.\n[ \t]*dockerfile: Dockerfile\n/,
    (_match, indent) =>
      [
        `${indent}# The build context is the starter root: the image installs the`,
        `${indent}# workspace and compiles the API from the sources \`nx serve\` runs.`,
        `${indent}context: .`,
        `${indent}dockerfile: Dockerfile`,
        '',
      ].join('\n'),
  );
}

const DOCKERFILE_HEADER = [
  '# Builds the API image of the starter.',
  '#',
  '# Build context: the starter root (see docker-compose.yml). The first stage',
  '# installs the workspace and runs the Nx build, which bundles the app together',
  '# with the @smartsoft001/* packages it imports and writes a package.json',
  '# listing only the third-party runtime dependencies. The second stage installs',
  '# exactly those and runs the bundle.',
  '#',
  '# Requires BuildKit (the default in Docker Desktop and Docker Engine 23+), which',
  '# reads the Dockerfile.dockerignore next to this file.',
  '',
].join('\n');

/**
 * The header explained a build from the monorepo sources; the instructions
 * only need the project name and the output path moved to the starter root.
 */
export function starterDockerfile(text) {
  const rewritten = stripMonorepoPaths(renameProjects(text));
  const from = rewritten.indexOf('\nFROM ');

  if (from === -1) throw new Error('the Dockerfile has no FROM instruction');

  return DOCKERFILE_HEADER + rewritten.slice(from);
}

/** The entries of the ignore file that exist only in the monorepo. */
const MONOREPO_IGNORES = new Set([
  'docs/site',
  'docs/superpowers',
  '**/.claude',
  '**/.playwright-mcp',
]);

/**
 * The ignore file keeps its list minus the monorepo directories that do not
 * exist in the starter, under a header that names the starter root.
 */
export function starterDockerignore(text) {
  const entries = stripMonorepoPaths(text)
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .filter((line) => !MONOREPO_IGNORES.has(line));

  return [
    '# Applied to the build context of the Dockerfile, the starter root.',
    '# Everything the API build does not need stays out of the image.',
    ...entries,
    '',
  ].join('\n');
}

/**
 * `run.sh` is the starter's front door, so it runs from its own directory
 * instead of three levels up, and it stops explaining snippet regions it no
 * longer has.
 */
export function starterRunScript(text) {
  let script = stripMonorepoPaths(renameProjects(text));

  script = replaceOnce(
    script,
    /#\n# The `# #region <name>` blocks[\s\S]*?the same lines\.\n/,
    '',
  );
  script = replaceOnce(
    script,
    'REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"',
    'REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"',
  );

  return stripRegions(script);
}

/**
 * The manifest is the standalone one with the starter's name. The scripts
 * were renamed with everything else; the description said where a standalone
 * copy comes from, which is now the README's job.
 */
export function starterManifest(manifest, version) {
  return {
    ...manifest,
    name: 'smartsoft001-starter',
    description: `One entity, end to end, on @smartsoft001/full-stack ${version}. Generated from ${APP_ROOT} of the framework repository on every release.`,
  };
}

/** The standalone ignore list plus what the app ignores on its own. */
export function starterIgnore() {
  return [
    'node_modules',
    'dist',
    '.nx',
    '.angular',
    'coverage',
    '',
    '# Local configuration, copied from .env.example',
    '.env',
    '',
    '# Playwright output',
    'test-results',
    'playwright-report',
    '',
  ].join('\n');
}

export function starterWorkflow() {
  return [
    'name: CI',
    'on:',
    '  push:',
    '    branches:',
    '      - main',
    '  pull_request:',
    '',
    'jobs:',
    '  main:',
    '    runs-on: ubuntu-24.04',
    '    # The Playwright suite drives the real stack: the API against this MongoDB',
    '    # and the dev server, both started by Playwright. It is opt-in through',
    '    # RUN_EXAMPLE_APP_E2E so that `nx run-many -t test` stays runnable on a',
    '    # machine without MongoDB.',
    '    services:',
    '      mongo:',
    '        image: mongo:8',
    '        ports:',
    '          - 27017:27017',
    '    steps:',
    '      - uses: actions/checkout@v7',
    '      - uses: actions/setup-node@v7',
    '        with:',
    '          node-version: 26',
    '          cache: npm',
    '      - run: npm ci --no-audit --no-fund',
    '      - run: npx nx run-many -t build',
    '      - name: Install Chromium for the Playwright suite',
    '        run: npx playwright install --with-deps chromium',
    '      - run: npx nx run-many -t test',
    '        env:',
    "          RUN_EXAMPLE_APP_E2E: '1'",
    '',
  ].join('\n');
}

export function starterReadme(version) {
  return [
    '# smartsoft001 starter',
    '',
    `One entity, the whole loop, on \`@smartsoft001/full-stack@${version}\`: an Angular frontend on`,
    '`@smartsoft001/crud-shell-angular` with a list page, an item page and a login, and a NestJS API on',
    '`@smartsoft001/crud-shell-nestjs`, `@smartsoft001/mongo` and `@smartsoft001/auth-shell-nestjs`. It',
    'is the smallest application that still uses the framework end to end, as a workspace of its own.',
    '',
    'This repository is generated. The `Publish` workflow of the framework repository writes it from',
    `\`${APP_ROOT}\` on every release, pins it to the packages of that release, installs, builds and`,
    'tests the result from a clean clone, and pushes one commit per release. Fix the application in the',
    'framework repository and the next release regenerates the starter; a change made here is',
    'overwritten. The application is explained line by line on the Example application page:',
    DOCS_PAGE,
    '',
    '## Prerequisites',
    '',
    '- Node.js 22.12 or newer (26 is what CI uses) and npm 10 or newer',
    '- Docker with Compose (`docker compose version`)',
    '',
    '## Run it',
    '',
    '```bash',
    'npm install',
    '',
    '# 1. MongoDB and the API on http://localhost:3000/api',
    './run.sh up',
    '',
    '# 2. The frontend on http://localhost:4200 (proxies /api to the container)',
    './run.sh web',
    '```',
    '',
    '3. Open http://localhost:4200 and sign in with `admin@example.com` / `change-me`, the user the API',
    '   seeds on its first start.',
    '',
    'What you will see: the login page, then an empty **Notes** list. **Add** opens the generated form',
    '(a required title and a rich-text body), **Add** on that page saves the note and returns to the',
    'list, and the arrow on a row opens the note read-only, where **Edit** turns it into the form again',
    'and **Save** writes the change. **Remove** on a row deletes it. Every screen is generated from the',
    '`@Field` decorators on the model and the `CrudFullConfig` object; the app itself is two pages of',
    'code.',
    '',
    'The API needs no configuration to start. To change ports, the database name, the JWT secret or the',
    'seeded user, copy `.env.example` to `.env` next to `docker-compose.yml`; Compose reads it and passes',
    'the values to the container. Without Docker, start MongoDB yourself and run the API with the same',
    'variables in the shell: `npx nx serve api`.',
    '',
    '## Tests',
    '',
    '```bash',
    '# Jest: the model, the API services, the Angular services and pages',
    './run.sh test',
    '',
    '# Playwright, against MongoDB on localhost:27017 (the API and the frontend are started for you)',
    './run.sh e2e',
    '```',
    '',
    'The Playwright suite sits behind `RUN_EXAMPLE_APP_E2E` so that a plain `nx run-many -t test` does',
    'not require MongoDB; `./run.sh e2e` sets the variable, and the CI workflow in',
    '`.github/workflows/ci.yml` sets it and provides the database. `npx nx e2e web-e2e` runs the suite',
    'unconditionally.',
    '',
    '## What is where',
    '',
    '| Path                                     | What it is                                                                                                                |',
    '| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |',
    '| `libs/model/src/lib/note.model.ts`       | The entity, decorated with `@Model` and `@Field`. Shared by both apps through the `@app/model` alias.                     |',
    '| `apps/api/src/app/app.module.ts`         | The whole backend: TypeORM for the users, the auth module (`POST /api/token`), the CRUD module mounted under `/api/notes`. |',
    '| `apps/api/src/app/users.seed.ts`         | Inserts the one user at startup so that login works at once.                                                              |',
    '| `apps/api/src/config.ts`                 | The environment variables the API reads, with the defaults from `.env.example`.                                           |',
    '| `apps/web/src/app/app.config.ts`         | The root providers the CRUD screens need: NgRx, `SharedModule`, `NgrxSharedModule`, translations and the JWT interceptor. |',
    '| `apps/web/src/app/notes/notes.config.ts` | The `CrudFullConfig` that says what the notes screens can do.                                                             |',
    '| `apps/web/src/app/notes/notes.module.ts` | `CrudModule.forFeature({ routing: true })`: the list, add and item routes.                                                |',
    '| `apps/web/src/app/auth/`                 | The login page on `<smart-sign-in-form>`, the login service, the route guard and the interceptor that sends the token.    |',
    '| `apps/web-e2e/src/`                      | Playwright: login, list, item page, against the running stack.                                                            |',
    '| `docker-compose.yml`, `Dockerfile`       | MongoDB plus the API built from this repository.                                                                          |',
    '| `run.sh`                                 | `up`, `web`, `test` and `e2e`: the commands above, in one script.                                                         |',
    '| `.github/workflows/ci.yml`               | Build, Jest and the Playwright suite against a MongoDB service, on every push and pull request.                           |',
    '',
    '## Upgrade',
    '',
    'The framework ships its migrations with `@smartsoft001/core`, so an upgrade is the Nx one:',
    '',
    '```bash',
    'npx nx migrate @smartsoft001/core@<next>',
    'npm install',
    'npx nx migrate --run-migrations',
    '```',
    '',
    'The first command bumps every `@smartsoft001` package in `package.json` and writes',
    '`migrations.json`, the second installs them, the third applies the migrations to the workspace.',
    '',
    '## How the pieces fit',
    '',
    '- The frontend calls `/api/...`; in development the dev server proxies that to port 3000',
    '  (`apps/web/proxy.conf.json`), so there is no environment file on the frontend.',
    '- Login is the OAuth password grant of `@smartsoft001/auth-shell-nestjs`: `POST /api/token` with the',
    '  seeded username, the password and the `client_id` the API accepts. The returned JWT is stored by',
    '  `AuthService` from `@smartsoft001/angular` and attached to every request by `AuthInterceptor`.',
    '- The interceptor is registered under `HTTP_INTERCEPTORS`, not with `withInterceptors`.',
    '  `CrudModule.forFeature` imports `SharedModule`, which re-exports `HttpClientModule`, so the lazily',
    '  loaded notes route gets its own `HttpClient`; a functional interceptor at the root never reaches',
    '  it, a DI one does.',
    '- `MODEL_VALIDATORS_PROVIDER` has to be provided, even when the app adds no validators of its own:',
    '  the form factory injects it without a default, and without it the generated form never renders.',
    "- The CRUD routes come from one `@Controller('')` in `@smartsoft001/crud-shell-nestjs`; the API mounts",
    "  it with NestJS's `RouterModule` under `notes`, which is why `apiUrl` in the frontend is `/api/notes`.",
    '- Writes require the `admin` permission, reads `admin` or `user`; the seeded user has `admin`.',
    "- The framework's stylesheets (Tailwind utilities under the `smart:` prefix) are the `styles.css` each",
    '  UI package publishes: `node_modules/@smartsoft001/angular/styles.css` and',
    '  `node_modules/@smartsoft001/crud-shell-angular/styles.css`, listed under `styles` of the web',
    "  project's build in `apps/web/project.json`.",
    '',
  ].join('\n');
}

/**
 * The starter must not mention the monorepo anywhere a newcomer would not
 * expect it: a project name, a path into `docs/examples/app`, a snippet
 * marker. The README and the manifest say where the starter comes from, and
 * are the only files allowed to.
 */
export function leftovers(target) {
  const found = [];

  for (const file of walk(target)) {
    const buffer = fs.readFileSync(file);

    if (!isText(buffer)) continue;

    const text = buffer.toString('utf8');
    const relative = path.relative(target, file);
    const reasons = [];

    if (text.includes(PROJECT_PREFIX.slice(0, -1)))
      reasons.push('project name');
    if (text.includes(APP_ROOT) && !ORIGIN_MENTIONED_IN.has(relative)) {
      reasons.push('monorepo path');
    }
    if (/^[ \t]*(\/\/|#) #(region|endregion)\b/m.test(text)) {
      reasons.push('snippet region');
    }

    if (reasons.length) found.push(`${relative}: ${reasons.join(', ')}`);
  }

  return found;
}

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: 'inherit' });
}

/**
 * One commit on `main` with the release identity, so that a clone of the
 * directory is a clone of the starter and the workflow can push it. Signing
 * is off because the identity is not a person with a key.
 */
function commit(target, version) {
  const git = (...args) =>
    run(
      'git',
      [
        '-c',
        `user.name=${RELEASE_IDENTITY.name}`,
        '-c',
        `user.email=${RELEASE_IDENTITY.email}`,
        '-c',
        'commit.gpgsign=false',
        ...args,
      ],
      target,
    );

  git('init', '--quiet', '-b', 'main');
  git('add', '-A');
  git('commit', '--quiet', '-m', `chore: release ${version}`);
}

/**
 * Writes the starter for `version` into `target`. `install` and `git` are on
 * by default and off in the tests, which need neither the network nor a
 * repository to check what the layer rewrites.
 */
export function buildStarter({
  repoRoot,
  version,
  target,
  install = true,
  git = true,
}) {
  createStandaloneApp({ repoRoot, target, packages: { version } });

  for (const file of walk(target)) {
    const base = path.basename(file);

    // The project configs import a root ESLint config the starter does not
    // have, and the lint targets that would load them go with them.
    if (base === 'eslint.config.mjs') {
      fs.rmSync(file);
      continue;
    }

    const buffer = fs.readFileSync(file);

    if (!isText(buffer)) continue;

    const text = buffer.toString('utf8');
    let next = stripMonorepoPaths(renameProjects(text));

    if (REGION_EXTENSIONS.has(path.extname(file))) next = stripRegions(next);
    if (next !== text) fs.writeFileSync(file, next);
    if (base === 'project.json')
      writeJson(file, starterProject(readJson(file)));
  }

  const rewrite = (relative, transform) => {
    const absolute = path.join(target, relative);

    fs.writeFileSync(absolute, transform(fs.readFileSync(absolute, 'utf8')));
  };

  rewrite('docker-compose.yml', starterCompose);
  rewrite('Dockerfile', starterDockerfile);
  rewrite('Dockerfile.dockerignore', starterDockerignore);
  rewrite('run.sh', starterRunScript);
  writeJson(
    path.join(target, 'package.json'),
    starterManifest(readJson(path.join(target, 'package.json')), version),
  );
  fs.writeFileSync(path.join(target, '.gitignore'), starterIgnore());
  fs.writeFileSync(path.join(target, 'README.md'), starterReadme(version));
  fs.mkdirSync(path.join(target, '.github', 'workflows'), { recursive: true });
  fs.writeFileSync(
    path.join(target, '.github', 'workflows', 'ci.yml'),
    starterWorkflow(),
  );

  const left = leftovers(target);

  if (left.length) {
    throw new Error(
      `the starter still mentions the monorepo:\n  ${left.join('\n  ')}`,
    );
  }

  if (install) run('npm', ['install', '--no-audit', '--no-fund'], target);
  if (git) commit(target, version);
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
    version: value('--version'),
    target: path.resolve(value('--target')),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const repoRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    '..',
  );
  const { version, target } = parseArgs(process.argv.slice(2));

  buildStarter({ repoRoot, version, target });
  console.log(`starter for ${version} written to ${target}`);
}

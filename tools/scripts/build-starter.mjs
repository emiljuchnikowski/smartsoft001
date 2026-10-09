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
 * The example application has two frontends over one API, an Angular one and
 * a React one; a starter has one of them, picked with `--frontend`. The
 * Angular starter (the default) is `smartsoft001-starter`, the React one
 * `smartsoft001-starter-react`, and each is generated, verified and pushed on
 * every release.
 *
 * The script starts from `createStandaloneApp`, which already moves the app to
 * the root of a workspace of its own and installs `@smartsoft001` from npm at
 * the version just released. On top of that copy it applies the starter layer:
 *
 * - The other frontend goes: its app, its e2e project, its commands in
 *   `run.sh` and `package.json` and its dependencies. The React app moves
 *   from apps/web-react to apps/web, and the shared Playwright suite drives
 *   the one frontend that is left instead of choosing one with `E2E_FRONTEND`.
 * - The projects lose the `docs-examples-app-` prefix they carry inside the
 *   monorepo (and the React app its `-react`, which only told the two
 *   frontends apart), so either starter has `web`, `api`, `model` and
 *   `web-e2e`.
 * - The `#region` markers the documentation site cuts its snippets from are
 *   removed. They mean nothing outside the docs.
 * - The Docker files build with the starter root as context instead of the
 *   monorepo root, and `run.sh` runs from its own directory.
 * - The project ESLint configs extend the monorepo's root config, which
 *   also loads Storybook. The starter gets a root config of its own with the
 *   same rules and nothing it does not install.
 * - A CI workflow, a README written for the starter, a merged `.gitignore`
 *   and a lockfile are added, and the result is committed on `main` so that
 *   `verify-starter.mjs` can clone it and the workflow can push it.
 *
 * Usage: node tools/scripts/build-starter.mjs --version <v> --target <dir>
 *          [--frontend angular|react]
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  createStandaloneApp,
  frameworkDependencies,
} from './example-app-standalone.mjs';

const APP_ROOT = 'docs/examples/app';
const PROJECT_PREFIX = 'docs-examples-app-';
const DOCS_PAGE = 'https://framework.smartflow.biz.pl/docs/example-app';

/** The identity of the release commits, the same one the workflow pushes with. */
export const RELEASE_IDENTITY = {
  name: 'smartsoft001 release',
  email: 'noreply@github.com',
};

/** What the walk never enters: not part of the app, or produced by this script. */
const SKIPPED = new Set(['node_modules', 'dist', '.git']);

/** The files whose `#region` markers feed the documentation site. */
const REGION_EXTENSIONS = new Set(['.ts', '.tsx', '.sh', '.yml']);

/**
 * What tells the two frontends apart in the example application: the React
 * app is apps/web-react (project `docs-examples-app-web-react`) and its e2e
 * project apps/web-react-e2e, and the commands that differ per frontend come
 * in pairs, the React one carrying a `react` suffix (`web` and `web-react` in
 * `run.sh`, `start` and `start:react` in `package.json`). A starter keeps one
 * of each pair under the plain name.
 */
export const FRONTENDS = {
  angular: {
    label: 'Angular',
    name: 'smartsoft001-starter',
    project: 'web',
    dropped: ['apps/web-react', 'apps/web-react-e2e'],
    moved: null,
  },
  react: {
    label: 'React',
    name: 'smartsoft001-starter-react',
    project: 'web-react',
    dropped: ['apps/web', 'apps/web-react-e2e'],
    moved: ['apps/web-react', 'apps/web'],
  },
};

function frontendSpec(frontend) {
  const spec = FRONTENDS[frontend];

  if (!spec) {
    throw new Error(
      `unknown frontend "${frontend}"; expected one of ${Object.keys(FRONTENDS).join(', ')}`,
    );
  }

  return spec;
}

function otherFrontend(frontend) {
  return frontend === 'react' ? 'angular' : 'react';
}

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
 * The React starter's frontend is `web`, as the Angular starter's is: the
 * project, its directory, its output paths and the e2e project that drives it
 * lose the `-react` the monorepo needs to tell the two frontends apart, and
 * `web-react-e2e` becomes the `web-e2e` it then is. The Angular starter keeps
 * its names.
 */
export function renameFrontend(text, frontend) {
  return frontend === 'react' ? text.replaceAll('web-react', 'web') : text;
}

/**
 * Drops the other frontend's project from every `-p` list of a command, so
 * that `nx run-many -t test -p model api web web-react` names the projects
 * the starter has. Runs after `renameProjects`.
 */
export function selectProjects(text, frontend) {
  const dropped = FRONTENDS[otherFrontend(frontend)].project;

  return text.replace(
    /(-p )([\w -]+)/g,
    (_match, flag, list) =>
      flag +
      list
        .split(' ')
        .filter((name) => name !== dropped)
        .join(' '),
  );
}

/**
 * Picks one command of each per-frontend pair from `entries` (`[name,
 * value]`, in order): the plain one for Angular, the one named with `suffix`
 * for React, which takes the plain name and position. Commands without a
 * React twin are shared and stay.
 */
export function selectVariants(entries, frontend, suffix) {
  const byName = new Map(entries);

  return entries
    .filter(([name]) => !name.endsWith(suffix))
    .map(([name, value]) => [
      name,
      frontend === 'react' && byName.has(`${name}${suffix}`)
        ? byName.get(`${name}${suffix}`)
        : value,
    ]);
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

/**
 * The monorepo's root ESLint config without Storybook: the Nx flat configs
 * and the import order every package follows. The web and API projects extend
 * it and add the app's own `@app/**` alias.
 */
export function starterEslintConfig() {
  return [
    "import nx from '@nx/eslint-plugin';",
    "import importPlugin from 'eslint-plugin-import';",
    '',
    'export default [',
    "  ...nx.configs['flat/base'],",
    "  ...nx.configs['flat/typescript'],",
    "  ...nx.configs['flat/javascript'],",
    '  {',
    "    ignores: ['**/dist', '**/node_modules'],",
    '  },',
    '  {',
    '    plugins: {',
    '      import: importPlugin,',
    '    },',
    '  },',
    '  {',
    "    files: ['**/*.ts', '**/*.js'],",
    '    rules: {',
    "      'import/order': [",
    "        'error',",
    '        {',
    "          'newlines-between': 'always',",
    "          groups: ['external', 'builtin', 'internal'],",
    '          pathGroups: [',
    '            {',
    "              pattern: '@smartsoft001/**',",
    "              group: 'external',",
    "              position: 'after',",
    '            },',
    '          ],',
    '          pathGroupsExcludedImportTypes: [],',
    '          alphabetize: {',
    "            order: 'asc',",
    '            caseInsensitive: true,',
    '          },',
    '        },',
    '      ],',
    '    },',
    '  },',
    '];',
    '',
  ].join('\n');
}

/** Where each frontend's dev server sends `/api`, as the compose header says it. */
const COMPOSE_PROXY = {
  angular: [
    '# `npx nx serve web` and reaches the API through its dev-server proxy',
    '# (apps/web/proxy.conf.json).',
  ],
  react: [
    '# `npx nx serve web` and reaches the API through the proxy of its Vite',
    '# dev server (`server.proxy` in apps/web/vite.config.ts).',
  ],
};

/**
 * The compose file built the image from the monorepo root because the API
 * compiled the framework from its sources. The starter installs the framework
 * from npm, so its own root is the whole context. The header names the one
 * frontend the starter has.
 */
export function starterCompose(yaml, frontend = 'angular') {
  frontendSpec(frontend);

  const header = replaceOnce(
    stripMonorepoPaths(renameProjects(yaml)),
    /^# Brings up MongoDB and the API\.[\s\S]*?\n#\n/,
    [
      '# Brings up MongoDB and the API. The frontend runs on the host with',
      ...COMPOSE_PROXY[frontend],
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
 * exist in the starter, under a header that names the starter root. The
 * React starter has no Angular cache to keep out either.
 */
export function starterDockerignore(text, frontend = 'angular') {
  const entries = stripMonorepoPaths(text)
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .filter((line) => !MONOREPO_IGNORES.has(line))
    .filter((line) => frontend !== 'react' || line !== '**/.angular');

  return [
    '# Applied to the build context of the Dockerfile, the starter root.',
    '# Everything the API build does not need stays out of the image.',
    ...entries,
    '',
  ].join('\n');
}

/** The functions of a shell script, by name: `name() {` to the `}` that closes it. */
function shellFunctions(script) {
  const functions = new Map();

  for (const [, name, body] of script.matchAll(
    /^(\w+)\(\) \{\n([\s\S]*?)^\}\n/gm,
  )) {
    functions.set(name, body);
  }

  return functions;
}

/** The commands of the script's `case`, as `[label, function]` in order. */
function shellCommands(script) {
  const block = /^case "\$\{1:-\}" in\n([\s\S]*?)^esac\n/m.exec(script);

  if (!block) throw new Error('run.sh has no case statement to read');

  return [...block[1].matchAll(/^ {2}([\w-]+)\) (\w+) ;;$/gm)].map(
    ([, label, name]) => [label, name],
  );
}

/**
 * `run.sh` is the starter's front door. The app's script runs both frontends
 * (`web` and `web-react`, `e2e` and `e2e-react`); the starter's runs one, so
 * it is put together again from the app's: the same function bodies, so the
 * commands cannot drift, for the commands of the starter's frontend under the
 * plain names, and a header and a `case` that list only those. It runs from
 * its own directory instead of three levels up and has no snippet regions.
 */
export function starterRunScript(text, frontend = 'angular') {
  const spec = frontendSpec(frontend);
  const script = stripRegions(stripMonorepoPaths(renameProjects(text)));
  const functions = shellFunctions(script);
  const commands = selectVariants(shellCommands(script), frontend, '-react');
  const firstFunction = script.search(/^\w+\(\) \{$/m);
  const preamble = replaceOnce(
    script.slice(script.indexOf('set -Eeuo pipefail'), firstFunction),
    'REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"',
    'REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"',
  );
  const name = (fn) => fn.replace(/_react$/, '');
  const bodies = commands.map(([label, fn]) => {
    if (!functions.has(fn)) {
      throw new Error(
        `run.sh runs ${fn} for ${label} and has no such function`,
      );
    }

    return `${name(fn)}() {\n${functions.get(fn)}}\n`;
  });

  const assembled = [
    '#!/usr/bin/env bash',
    '#',
    '# Runs the example application. `./run.sh up` starts MongoDB and the API,',
    `# \`./run.sh web\` the ${spec.label} frontend, \`./run.sh test\` the Jest suites and`,
    '# `./run.sh e2e` the Playwright suite against the running stack.',
    preamble + bodies.join('\n'),
    'case "${1:-}" in',
    ...commands.map(([label, fn]) => `  ${label}) ${name(fn)} ;;`),
    '  *)',
    `    echo "usage: $0 ${commands.map(([label]) => label).join('|')}" >&2`,
    '    exit 64',
    '    ;;',
    'esac',
    '',
  ].join('\n');

  return renameFrontend(
    selectProjects(
      replaceOnce(
        assembled,
        'the Angular and React services and pages',
        `the ${spec.label} services and pages`,
      ),
      frontend,
    ),
    frontend,
  );
}

/**
 * What only one frontend installs. The app's manifest lists the dependencies
 * of both; a starter keeps the shared ones (the API, the model, Nx, Jest,
 * ESLint, Playwright) and those of its own frontend.
 */
const FRONTEND_DEPENDENCIES = {
  angular: [
    /^@angular\//,
    /^@ngrx\//,
    /^@ngx-translate\//,
    /^ngx?-/,
    /^jest-preset-angular$/,
    /^@smartsoft001\/full-stack$/,
  ],
  react: [
    /^react(-dom)?$/,
    /^@types\/react(-dom)?$/,
    /^@testing-library\//,
    /^eslint-plugin-react-hooks$/,
    /^vite$/,
    /^@smartsoft001\/react-stack$/,
  ],
};

const FULL_STACK = '@smartsoft001/full-stack';
const NESTJS_STACK = '@smartsoft001/nestjs-stack';

/**
 * The starter's half of `dependencies` or `devDependencies`. `full-stack` is
 * the Angular stack plus the NestJS one, so the React starter installs
 * `nestjs-stack` in its place, at the release's version, next to
 * `react-stack`.
 */
export function starterDependencies(dependencies, version, frontend) {
  if (!dependencies) return dependencies;

  const others = FRONTEND_DEPENDENCIES[otherFrontend(frontend)];
  const result = {};

  for (const [name, range] of Object.entries(dependencies)) {
    if (frontend === 'react' && name === FULL_STACK) {
      result[NESTJS_STACK] = version;
    } else if (!others.some((pattern) => pattern.test(name))) {
      result[name] = range;
    }
  }

  return result;
}

const MANIFEST_DESCRIPTION = {
  angular: (version) =>
    `One entity, end to end, on @smartsoft001/full-stack ${version}.`,
  react: (version) =>
    `One entity, end to end, on @smartsoft001/react-stack and @smartsoft001/nestjs-stack ${version}: a React frontend and a NestJS API.`,
};

/**
 * The manifest is the standalone one with the starter's name, the scripts and
 * the dependencies of its frontend. The description said where a standalone
 * copy comes from, which is now the README's job.
 */
export function starterManifest(manifest, version, frontend = 'angular') {
  const spec = frontendSpec(frontend);
  const scripts = manifest.scripts && {
    scripts: Object.fromEntries(
      selectVariants(Object.entries(manifest.scripts), frontend, ':react').map(
        ([name, command]) => [
          name,
          renameFrontend(
            selectProjects(renameProjects(command), frontend),
            frontend,
          ),
        ],
      ),
    ),
  };

  return {
    ...manifest,
    name: spec.name,
    description: `${MANIFEST_DESCRIPTION[frontend](version)} Generated from ${APP_ROOT} of the framework repository on every release.`,
    ...scripts,
    ...(manifest.dependencies && {
      dependencies: starterDependencies(
        manifest.dependencies,
        version,
        frontend,
      ),
    }),
    ...(manifest.devDependencies && {
      devDependencies: starterDependencies(
        manifest.devDependencies,
        version,
        frontend,
      ),
    }),
  };
}

/**
 * The suite's config picks the frontend to start from `E2E_FRONTEND`, because
 * the monorepo runs it for both, and keeps each one's output apart. A starter
 * has one: the table, the switch and the per-frontend folder become that
 * frontend's dev server, served by the `web` project, and one output folder.
 */
export function starterPlaywrightConfig(text, frontend = 'angular') {
  frontendSpec(frontend);

  const entry = [
    ...text.matchAll(
      /\{\n\s*name: '(\w+)',\n\s*serve: '([^']+)',\n\s*url: '([^']+)',\n\s*\}/g,
    ),
  ].find(([, name]) => name === frontend);

  if (!entry) {
    throw new Error(`the Playwright config has no ${frontend} frontend`);
  }

  const [, , serve, url] = entry;

  return replaceOnce(
    text,
    /^interface IFrontend \{[\s\S]*?^const frontend = selectFrontend\([^\n]*\);\n\n(?:\/\/[^\n]*\n)*const outputDir = resolve\(\s*workspaceRoot,\s*('[^']+'),\s*frontend\.name,\s*\);\n/m,
    (_match, outputDir) =>
      [
        '/** The frontend the suite drives: the dev server of the `web` project. */',
        'const frontend = {',
        `  serve: '${renameFrontend(renameProjects(serve), frontend)}',`,
        `  url: '${url}',`,
        '};',
        '',
        `const outputDir = resolve(workspaceRoot, ${outputDir});`,
        '',
      ].join('\n'),
  );
}

/**
 * The monorepo's Jest preset maps Angular's testing entry points to their
 * ESM bundles. The React starter has no Angular, so its preset is the Nx one
 * with the same export conditions and nothing else.
 */
export function starterReactJestPreset() {
  return [
    "const nxPreset = require('@nx/jest/preset').default;",
    '',
    'module.exports = {',
    '  ...nxPreset,',
    '  testEnvironmentOptions: {',
    "    customExportConditions: ['node', 'require', 'default'],",
    '  },',
    '};',
    '',
  ].join('\n');
}

/** The standalone ignore list plus what the app ignores on its own. */
export function starterIgnore(frontend = 'angular') {
  return [
    'node_modules',
    'dist',
    '.nx',
    ...(frontend === 'react' ? [] : ['.angular']),
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
    '      - run: npx nx run-many -t lint',
    '      - run: npx nx run-many -t build',
    '      - name: Install Chromium for the Playwright suite',
    '        run: npx playwright install --with-deps chromium',
    '      - run: npx nx run-many -t test',
    '        env:',
    "          RUN_EXAMPLE_APP_E2E: '1'",
    '',
  ].join('\n');
}

/** The README of a starter, written for its frontend. */
export function starterReadme(version, frontend = 'angular') {
  frontendSpec(frontend);

  return frontend === 'react'
    ? reactStarterReadme(version)
    : angularStarterReadme(version);
}

function angularStarterReadme(version) {
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
    '`npx nx run-many -t lint` runs ESLint on every project, with the rules in `eslint.config.mjs`.',
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
    '| `eslint.config.mjs`                      | The ESLint rules every project extends: the Nx configs and the import order.                                              |',
    '| `.github/workflows/ci.yml`               | Lint, build, Jest and the Playwright suite against a MongoDB service, on every push and pull request.                     |',
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

function reactStarterReadme(version) {
  return [
    '# smartsoft001 React starter',
    '',
    `One entity, the whole loop, on \`@smartsoft001/react-stack@${version}\` and`,
    `\`@smartsoft001/nestjs-stack@${version}\`: a React frontend on \`@smartsoft001/crud-shell-react\` with a`,
    'list page, an item page and a login, and a NestJS API on `@smartsoft001/crud-shell-nestjs`,',
    '`@smartsoft001/mongo` and `@smartsoft001/auth-shell-nestjs`. It is the smallest application that',
    'still uses the framework end to end, as a workspace of its own.',
    '',
    'This repository is generated. The `Publish` workflow of the framework repository writes it from',
    `\`${APP_ROOT}\` on every release, with the React frontend of that application, pins it to the`,
    'packages of that release, installs, builds and tests the result from a clean clone, and pushes',
    'one commit per release. Fix the application in the framework repository and the next release',
    'regenerates the starter; a change made here is overwritten. The application is explained line by',
    'line on the Example application page:',
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
    '# 2. The frontend on http://localhost:4300 (proxies /api to the container)',
    './run.sh web',
    '```',
    '',
    '3. Open http://localhost:4300 and sign in with `admin@example.com` / `change-me`, the user the API',
    '   seeds on its first start.',
    '',
    'What you will see: the login page, then an empty **Notes** list. **Add** opens the generated form',
    '(a required title and a rich-text body), **Add** on that page saves the note and returns to the',
    'list, and the arrow on a row opens the note read-only, where **Edit** turns it into the form again',
    'and **Save** writes the change. **Remove** on a row deletes it. Every screen is generated from the',
    '`@Field` decorators on the model and the `CrudFullConfig` object; the app itself is a handful of',
    'small components.',
    '',
    'The API needs no configuration to start. To change ports, the database name, the JWT secret or the',
    'seeded user, copy `.env.example` to `.env` next to `docker-compose.yml`; Compose reads it and passes',
    'the values to the container. Without Docker, start MongoDB yourself and run the API with the same',
    'variables in the shell: `npx nx serve api`.',
    '',
    '## Tests',
    '',
    '```bash',
    '# Jest: the model, the API services, the React services and pages',
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
    '`npx nx run-many -t lint` runs ESLint on every project, with the rules in `eslint.config.mjs`.',
    '',
    '## What is where',
    '',
    '| Path                                       | What it is                                                                                                                       |',
    '| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |',
    '| `libs/model/src/lib/note.model.ts`         | The entity, decorated with `@Model` and `@Field`. Shared by both apps through the `@app/model` alias.                            |',
    '| `apps/api/src/app/app.module.ts`           | The whole backend: TypeORM for the users, the auth module (`POST /api/token`), the CRUD module mounted under `/api/notes`.        |',
    '| `apps/api/src/app/users.seed.ts`           | Inserts the one user at startup so that login works at once.                                                                     |',
    '| `apps/api/src/config.ts`                   | The environment variables the API reads, with the defaults from `.env.example`.                                                  |',
    '| `apps/web/src/main.tsx`                    | The entry point: `reflect-metadata`, the framework stylesheets, then the app inside `AppProviders`.                              |',
    '| `apps/web/src/app/app.providers.tsx`       | One `SmartProvider`: the translations, the navigation, and the HTTP client and `AuthService` the screens use.                    |',
    '| `apps/web/src/app/app.routes.tsx`          | The routes without a router: the login page, and the notes pages behind the guard.                                               |',
    '| `apps/web/src/app/notes/notes.config.ts`   | The `CrudFullConfig` that says what the notes screens can do.                                                                    |',
    '| `apps/web/src/app/notes/notes.feature.tsx` | `CrudProvider` and `SmartCrudPages`: the list, add and item pages.                                                               |',
    '| `apps/web/src/app/auth/`                   | The login page on `SmartSignInForm`, the login service and the guard.                                                            |',
    '| `apps/web/vite.config.ts`                  | Vite: the dev server on port 4300 and its `/api` proxy, the build, and the `demo` mode on an in-memory double of the API.        |',
    '| `apps/web-e2e/src/`                        | Playwright: login, list, item page, against the running stack.                                                                   |',
    '| `docker-compose.yml`, `Dockerfile`         | MongoDB plus the API built from this repository.                                                                                 |',
    '| `run.sh`                                   | `up`, `web`, `test` and `e2e`: the commands above, in one script.                                                                |',
    '| `eslint.config.mjs`                        | The ESLint rules every project extends: the Nx configs and the import order.                                                     |',
    '| `.github/workflows/ci.yml`                 | Lint, build, Jest and the Playwright suite against a MongoDB service, on every push and pull request.                            |',
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
    '- The frontend calls `/api/...`; in development the Vite dev server proxies that to port 3000',
    '  (`server.proxy` in `apps/web/vite.config.ts`), so there is no environment file on the frontend.',
    '- Login is the OAuth password grant of `@smartsoft001/auth-shell-nestjs`: `POST /api/token` with the',
    '  seeded username, the password and the `client_id` the API accepts. The returned JWT is stored by',
    '  `AuthService` from `@smartsoft001/react`, and the HTTP client of `SmartProvider` sends it as a',
    '  bearer header with every request.',
    '- There is no router: `AppRoutes` reads the URL of the navigation adapter, `matchCrudRoute` matches',
    '  `/notes`, `/notes/add` and `/notes/:id`, and `SmartCrudPages` renders the page for it.',
    "- `reflect-metadata` is imported first in `main.tsx`: the model's decorators store their metadata",
    '  with `Reflect`. Vite compiles the TSX and the decorators from the tsconfig, with no plugin.',
    "- The CRUD routes come from one `@Controller('')` in `@smartsoft001/crud-shell-nestjs`; the API mounts",
    "  it with NestJS's `RouterModule` under `notes`, which is why `apiUrl` in the frontend is `/api/notes`.",
    '- Writes require the `admin` permission, reads `admin` or `user`; the seeded user has `admin`.',
    "- The framework's stylesheets (Tailwind utilities under the `smart:` prefix) are the `styles.css` each",
    '  UI package publishes: `main.tsx` imports `@smartsoft001/react/styles.css` and',
    "  `@smartsoft001/crud-shell-react/styles.css`, then the app's own `styles.css`.",
    '',
  ].join('\n');
}

/**
 * What betrays the other frontend in a starter: the React app's name and
 * packages in the Angular starter, Angular's packages in the React one.
 */
const OTHER_FRONTEND_MARKERS = {
  angular: ['web-react', '@smartsoft001/react', 'react-dom'],
  react: ['@angular/', '@smartsoft001/angular', '@smartsoft001/full-stack'],
};

/**
 * The starter must not mention the monorepo anywhere a newcomer would not
 * expect it: a project name, a path into `docs/examples/app`, a snippet
 * marker. The README and the manifest say where the starter comes from, and
 * are the only files allowed to. Nor may it carry a piece of the frontend it
 * does not have.
 */
export function leftovers(target, frontend = 'angular') {
  const markers = OTHER_FRONTEND_MARKERS[frontend];
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
    if (markers.some((marker) => text.includes(marker))) {
      reasons.push(`${FRONTENDS[otherFrontend(frontend)].label} frontend`);
    }

    if (reasons.length) found.push(`${relative}: ${reasons.join(', ')}`);
  }

  return found;
}

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: 'inherit' });
}

/** `npm view <spec> <field>`, parsed; throws when the registry has no such version. */
function npmView(spec, field) {
  const output = execFileSync('npm', ['view', spec, field, '--json'], {
    stdio: 'pipe',
  }).toString();

  return output.trim() ? JSON.parse(output) : undefined;
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

const SCOPE = '@smartsoft001/';

/**
 * The framework packages the starter installs, read from the registry's own
 * manifests: the stacks its manifest names (`roots`: `full-stack` for the
 * Angular starter, `nestjs-stack` and `react-stack` for the React one) and
 * everything under them, transitively, through both
 * `dependencies` and `peerDependencies`. The packages reach each other mostly
 * as peers (auth-domain peers google, fb, users, ...), and npm installs peers,
 * so a closure over `dependencies` alone missed them: on 2.179.0 the wait saw
 * everything it checked and the install still hit `@smartsoft001/google@undefined`.
 * Throws when a manifest is not there yet, which is how the wait below detects
 * a release that has not finished propagating.
 */
export function releasePackages(version, view = npmView, roots = [FULL_STACK]) {
  const names = new Set();
  const pending = [...roots];

  while (pending.length) {
    const name = pending.pop();

    if (names.has(name)) continue;
    names.add(name);

    const spec = `${name}@${version}`;
    const dependencies = {
      ...(view(spec, 'dependencies') ?? {}),
      ...(view(spec, 'peerDependencies') ?? {}),
    };

    for (const dependency of Object.keys(dependencies)) {
      if (dependency.startsWith(SCOPE)) pending.push(dependency);
    }
  }

  return [...names].sort();
}

/**
 * Waits until every package of the release resolves from the registry.
 *
 * The starter job runs seconds after `nx-release-publish`, and the registry
 * is not consistent that quickly: on 2.165.0 the install saw
 * `@smartsoft001/angular@undefined` and failed, although the version was on
 * npm a minute later. Polling the manifests first turns that into a wait
 * instead of a red release.
 */
export function waitForRelease(
  version,
  {
    attempts = 30,
    delayMs = 20_000,
    view = npmView,
    sleep = sleepSync,
    roots = [FULL_STACK],
  } = {},
) {
  let missing = [...roots];

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      missing = releasePackages(version, view, roots).filter(
        (name) => view(`${name}@${version}`, 'version') !== version,
      );
    } catch (error) {
      missing = [`${roots.join(', ')} (${error.message.split('\n')[0]})`];
    }

    if (!missing.length) return;

    console.log(
      `waiting for ${version} on the registry (${attempt}/${attempts}): ${missing.join(', ')}`,
    );
    sleep(delayMs);
  }

  throw new Error(
    `${version} did not reach the registry in time; still missing: ${missing.join(', ')}`,
  );
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
 * Writes the starter of `frontend` for `version` into `target`. `install` and
 * `git` are on by default and off in the tests, which need neither the
 * network nor a repository to check what the layer rewrites.
 *
 * The files that list both frontends side by side (`run.sh`, `package.json`,
 * the Playwright config, the compose header) are rewritten first, while the
 * React app still has its own name; the walk that renames everything else
 * comes after, and changes nothing in them again.
 */
export function buildStarter({
  repoRoot,
  version,
  target,
  frontend = 'angular',
  install = true,
  git = true,
}) {
  const spec = frontendSpec(frontend);

  createStandaloneApp({ repoRoot, target, packages: { version } });

  for (const dropped of spec.dropped) {
    fs.rmSync(path.join(target, dropped), { recursive: true, force: true });
  }

  const rewrite = (relative, transform) => {
    const absolute = path.join(target, relative);

    fs.writeFileSync(absolute, transform(fs.readFileSync(absolute, 'utf8')));
  };

  rewrite('docker-compose.yml', (text) => starterCompose(text, frontend));
  rewrite('Dockerfile', starterDockerfile);
  rewrite('Dockerfile.dockerignore', (text) =>
    starterDockerignore(text, frontend),
  );
  rewrite('run.sh', (text) => starterRunScript(text, frontend));
  rewrite('apps/web-e2e/playwright.config.ts', (text) =>
    starterPlaywrightConfig(text, frontend),
  );
  // Written after the walk, which would otherwise take the description's
  // mention of where the starter comes from for a monorepo path.
  const manifest = starterManifest(
    readJson(path.join(target, 'package.json')),
    version,
    frontend,
  );

  if (spec.moved) {
    const [from, to] = spec.moved;

    fs.renameSync(path.join(target, from), path.join(target, to));
  }

  for (const file of walk(target)) {
    const buffer = fs.readFileSync(file);

    if (!isText(buffer)) continue;

    const text = buffer.toString('utf8');
    let next = renameFrontend(
      stripMonorepoPaths(renameProjects(text)),
      frontend,
    );

    if (REGION_EXTENSIONS.has(path.extname(file))) next = stripRegions(next);
    if (next !== text) fs.writeFileSync(file, next);
  }

  writeJson(path.join(target, 'package.json'), manifest);
  fs.writeFileSync(path.join(target, '.gitignore'), starterIgnore(frontend));
  fs.writeFileSync(
    path.join(target, 'eslint.config.mjs'),
    starterEslintConfig(),
  );
  if (frontend === 'react') {
    fs.writeFileSync(
      path.join(target, 'jest.preset.js'),
      starterReactJestPreset(),
    );
  }
  fs.writeFileSync(
    path.join(target, 'README.md'),
    starterReadme(version, frontend),
  );
  fs.mkdirSync(path.join(target, '.github', 'workflows'), { recursive: true });
  fs.writeFileSync(
    path.join(target, '.github', 'workflows', 'ci.yml'),
    starterWorkflow(),
  );

  const left = leftovers(target, frontend);

  if (left.length) {
    throw new Error(
      `the starter still mentions the monorepo:\n  ${left.join('\n  ')}`,
    );
  }

  if (install) {
    waitForRelease(version, { roots: frameworkDependencies(manifest) });
    run('npm', ['install', '--no-audit', '--no-fund'], target);
  }
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

  const frontendIndex = argv.indexOf('--frontend');
  const frontend =
    frontendIndex === -1 ? 'angular' : (argv[frontendIndex + 1] ?? '');

  frontendSpec(frontend);

  return {
    version: value('--version'),
    target: path.resolve(value('--target')),
    frontend,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const repoRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    '..',
  );
  const { version, target, frontend } = parseArgs(process.argv.slice(2));

  buildStarter({ repoRoot, version, target, frontend });
  console.log(`${frontend} starter for ${version} written to ${target}`);
}

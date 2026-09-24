import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  buildStarter,
  leftovers,
  parseArgs,
  renameProjects,
  starterCompose,
  starterDockerfile,
  starterDockerignore,
  starterManifest,
  starterProject,
  starterReadme,
  starterRunScript,
  starterWorkflow,
  stripMonorepoPaths,
  stripRegions,
} from './build-starter.mjs';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);

const APP = path.join('docs', 'examples', 'app');

function readJson(absolute) {
  return JSON.parse(fs.readFileSync(absolute, 'utf8'));
}

function readApp(relative) {
  return fs.readFileSync(path.join(repoRoot, APP, relative), 'utf8');
}

/** A repository with the real example application in it, like the standalone test. */
function fixtureRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'starter-fixture-'));

  fs.cpSync(path.join(repoRoot, APP), path.join(root, APP), {
    recursive: true,
  });
  fs.copyFileSync(
    path.join(repoRoot, 'tsconfig.base.json'),
    path.join(root, 'tsconfig.base.json'),
  );
  fs.copyFileSync(
    path.join(repoRoot, 'jest.preset.js'),
    path.join(root, 'jest.preset.js'),
  );

  return root;
}

describe('renameProjects', () => {
  test('drops the monorepo prefix from every project name', () => {
    assert.equal(
      renameProjects(
        '"implicitDependencies": ["docs-examples-app-web", "docs-examples-app-api"]',
      ),
      '"implicitDependencies": ["web", "api"]',
    );
    assert.equal(
      renameProjects('nx run docs-examples-app-web-e2e:e2e'),
      'nx run web-e2e:e2e',
    );
    assert.equal(
      renameProjects("displayName: 'docs-examples-app-model'"),
      "displayName: 'model'",
    );
  });

  test('leaves the environment variable that shares the wording alone', () => {
    assert.equal(
      renameProjects('RUN_EXAMPLE_APP_E2E=1'),
      'RUN_EXAMPLE_APP_E2E=1',
    );
  });
});

describe('stripMonorepoPaths', () => {
  test('drops the prefix from a path into the app', () => {
    assert.equal(
      stripMonorepoPaths('see docs/examples/app/.env.example'),
      'see .env.example',
    );
  });

  test('names the starter root where the prose named the directory', () => {
    assert.equal(
      stripMonorepoPaths('start `docker compose up` in docs/examples/app and'),
      'start `docker compose up` in the starter root and',
    );
  });
});

describe('stripRegions', () => {
  test('removes the marker lines and nothing else', () => {
    assert.equal(
      stripRegions(
        [
          '// #region model',
          '@Model({})',
          '// #endregion',
          'export class Note {}',
          '',
        ].join('\n'),
      ),
      ['@Model({})', 'export class Note {}', ''].join('\n'),
    );
  });

  test('removes the shell form and an indented marker', () => {
    assert.equal(
      stripRegions(
        [
          'up() {',
          '  # #region up',
          '  docker compose up',
          '  # #endregion',
          '}',
          '',
        ].join('\n'),
      ),
      ['up() {', '  docker compose up', '}', ''].join('\n'),
    );
  });

  test('keeps a line that mentions a region in prose', () => {
    const prose = '# The `# #region <name>` blocks are inlined\n';

    assert.equal(stripRegions(prose), prose);
  });
});

describe('starterProject', () => {
  test('drops the lint target and keeps the rest', () => {
    const project = starterProject({
      name: 'api',
      targets: { build: {}, lint: {}, test: {} },
    });

    assert.deepEqual(Object.keys(project.targets), ['build', 'test']);
  });

  test('leaves a project without a lint target alone', () => {
    const project = { name: 'x', targets: { build: {} } };

    assert.equal(starterProject(project), project);
  });
});

describe('starterCompose', () => {
  const compose = starterCompose(readApp('docker-compose.yml'));

  test('builds from the starter root', () => {
    assert.match(compose, /\n {6}context: \.\n {6}dockerfile: Dockerfile\n/);
    assert.ok(!compose.includes('../../..'));
    assert.ok(!compose.includes('docs/examples/app'));
  });

  test('explains the context in terms of the starter', () => {
    assert.match(compose, /# The build context is the starter root/);
    assert.ok(!compose.includes('monorepo'));
    assert.ok(!compose.includes('repository root'));
  });

  test('names the renamed frontend project', () => {
    assert.match(compose, /`npx nx serve web`/);
  });

  test('keeps the services and their environment', () => {
    assert.match(compose, /image: mongo:8/);
    assert.match(
      compose,
      /ADMIN_USERNAME: \$\{ADMIN_USERNAME:-admin@example\.com\}/,
    );
  });
});

describe('starterDockerfile', () => {
  const dockerfile = starterDockerfile(readApp('Dockerfile'));

  test('runs the renamed project and copies from the starter output path', () => {
    assert.match(dockerfile, /npx nx run api:build:production/);
    assert.match(dockerfile, /npx nx run api:prune-lockfile/);
    assert.match(
      dockerfile,
      /COPY --from=build \/workspace\/dist\/apps\/api \.\//,
    );
  });

  test('describes the starter root as the context', () => {
    assert.match(dockerfile, /^# Builds the API image of the starter\./);
    assert.match(dockerfile, /Build context: the starter root/);
    assert.ok(!dockerfile.includes('monorepo'));
    assert.ok(!dockerfile.includes('docs/examples/app'));
  });

  test('keeps the stages', () => {
    assert.equal(dockerfile.match(/^FROM node:26-alpine/gm).length, 2);
    assert.match(dockerfile, /CMD \["node", "main\.js"\]/);
  });
});

describe('starterDockerignore', () => {
  const ignore = starterDockerignore(readApp('Dockerfile.dockerignore'));

  test('drops the entries that exist only in the monorepo', () => {
    assert.ok(!ignore.includes('docs/site'));
    assert.ok(!ignore.includes('docs/superpowers'));
    assert.ok(!ignore.includes('.claude'));
    assert.ok(!ignore.includes('docs/examples/app'));
  });

  test('keeps the build noise out and ignores the local .env at the root', () => {
    assert.match(ignore, /^\*\*\/node_modules$/m);
    assert.match(ignore, /^\*\*\/dist$/m);
    assert.match(ignore, /^\.env$/m);
  });
});

describe('starterRunScript', () => {
  const script = starterRunScript(readApp('run.sh'));

  test('runs from its own directory', () => {
    assert.match(script, /REPO_ROOT="\$\(cd "\$\(dirname "\$0"\)" && pwd\)"/);
    assert.ok(!script.includes('../../..'));
  });

  test('runs compose and the renamed projects from the starter root', () => {
    assert.match(script, /docker compose -f docker-compose\.yml up/);
    assert.match(script, /npx nx serve web$/m);
    assert.match(script, /npx nx run-many -t test -p model api web$/m);
    assert.match(script, /RUN_EXAMPLE_APP_E2E=1 npx nx test web-e2e$/m);
  });

  test('has neither the regions nor the paragraph that explained them', () => {
    assert.ok(!script.includes('#region'));
    assert.ok(!script.includes('#endregion'));
    assert.ok(!script.includes('snippets.mjs'));
    assert.match(script, /the running stack\.\nset -Eeuo pipefail\n/);
  });
});

describe('starterManifest', () => {
  test('names the starter and says what version it is on', () => {
    const manifest = starterManifest(
      { name: 'smartsoft001-example-app', scripts: { start: 'nx serve web' } },
      '2.161.0',
    );

    assert.equal(manifest.name, 'smartsoft001-starter');
    assert.match(manifest.description, /2\.161\.0/);
    assert.deepEqual(manifest.scripts, { start: 'nx serve web' });
  });
});

describe('starterReadme', () => {
  const readme = starterReadme('2.161.0');

  test('pins the version, says where the starter comes from and links the docs', () => {
    assert.match(readme, /`@smartsoft001\/full-stack@2\.161\.0`/);
    assert.match(readme, /generated/);
    assert.match(readme, /docs\/examples\/app/);
    assert.match(
      readme,
      /https:\/\/emiljuchnikowski\.github\.io\/smartsoft001\/docs\/example-app/,
    );
  });

  test('documents the renamed commands and paths', () => {
    assert.match(readme, /npx nx serve api/);
    assert.match(readme, /npx nx e2e web-e2e/);
    assert.match(readme, /`apps\/web\/src\/app\/notes\/notes\.config\.ts`/);
    assert.ok(!readme.includes('docs-examples-app'));
  });

  test('says how to upgrade', () => {
    assert.match(readme, /npx nx migrate @smartsoft001\/core@<next>/);
    assert.match(readme, /npx nx migrate --run-migrations/);
  });
});

describe('starterWorkflow', () => {
  const workflow = starterWorkflow();

  test('installs from the lockfile, builds and tests', () => {
    assert.match(workflow, /npm ci/);
    assert.match(workflow, /npx nx run-many -t build/);
    assert.match(workflow, /npx nx run-many -t test/);
  });

  test('runs the Playwright suite against a MongoDB service', () => {
    assert.match(workflow, /image: mongo:8/);
    assert.match(workflow, /RUN_EXAMPLE_APP_E2E: '1'/);
    assert.match(workflow, /npx playwright install --with-deps chromium/);
  });

  test('runs on push and on pull requests', () => {
    assert.match(
      workflow,
      /^on:\n {2}push:\n {4}branches:\n {6}- main\n {2}pull_request:\n/m,
    );
  });
});

describe('parseArgs', () => {
  test('reads the version and the target', () => {
    const args = parseArgs(['--version', '2.161.0', '--target', 'out']);

    assert.equal(args.version, '2.161.0');
    assert.equal(args.target, path.resolve('out'));
  });

  test('insists on both', () => {
    assert.throws(
      () => parseArgs(['--target', 'out']),
      /--version is required/,
    );
    assert.throws(
      () => parseArgs(['--version', '2.161.0']),
      /--target is required/,
    );
  });
});

describe('buildStarter', () => {
  const root = fixtureRepo();
  const target = path.join(root, 'starter');

  buildStarter({
    repoRoot: root,
    version: '2.161.0',
    target,
    install: false,
    git: false,
  });

  const read = (relative) =>
    fs.readFileSync(path.join(target, relative), 'utf8');

  test('renames the projects everywhere', () => {
    assert.equal(
      readJson(path.join(target, 'apps/web/project.json')).name,
      'web',
    );
    assert.equal(
      readJson(path.join(target, 'apps/api/project.json')).name,
      'api',
    );
    assert.equal(
      readJson(path.join(target, 'libs/model/project.json')).name,
      'model',
    );

    const e2e = readJson(path.join(target, 'apps/web-e2e/project.json'));

    assert.equal(e2e.name, 'web-e2e');
    assert.deepEqual(e2e.implicitDependencies, ['web', 'api']);
    assert.match(read('apps/web/jest.config.ts'), /displayName: 'web'/);
    assert.match(
      read('apps/web-e2e/playwright.config.ts'),
      /npx nx run api:build:development && node dist\/apps\/api\/main\.js/,
    );
    assert.match(read('package.json'), /"start": "nx serve web"/);
  });

  test('leaves no trace of the monorepo behind', () => {
    assert.deepEqual(leftovers(target), []);
  });

  test('strips the snippet regions from the sources', () => {
    const model = read('libs/model/src/lib/note.model.ts');

    assert.ok(!model.includes('#region'));
    assert.match(model, /@Model\(/);
    assert.ok(!read('apps/api/src/app/users.seed.ts').includes('#region'));
  });

  test('has no lint target and no project ESLint config', () => {
    for (const file of [
      'apps/web/project.json',
      'apps/api/project.json',
      'apps/web-e2e/project.json',
      'libs/model/project.json',
    ]) {
      assert.equal(
        readJson(path.join(target, file)).targets.lint,
        undefined,
        `${file} still has a lint target`,
      );
    }

    assert.ok(!fs.existsSync(path.join(target, 'apps/web/eslint.config.mjs')));
    assert.ok(!fs.existsSync(path.join(target, 'apps/api/eslint.config.mjs')));
  });

  test('keeps what the standalone copy already had', () => {
    const web = readJson(path.join(target, 'apps/web/project.json'));
    const manifest = readJson(path.join(target, 'package.json'));

    assert.equal(web.targets.styles, undefined);
    assert.equal(
      web.targets.build.options.styles[0],
      'node_modules/@smartsoft001/angular/styles.css',
    );
    assert.equal(manifest.dependencies['@smartsoft001/full-stack'], '2.161.0');
    assert.equal(manifest.name, 'smartsoft001-starter');
    assert.ok(fs.existsSync(path.join(target, 'nx.json')));
    assert.ok(fs.existsSync(path.join(target, 'tsconfig.base.json')));
    assert.ok(fs.existsSync(path.join(target, 'jest.preset.js')));
    assert.ok(fs.existsSync(path.join(target, '.env.example')));
  });

  test('writes the starter files', () => {
    assert.match(read('README.md'), /^# smartsoft001 starter/);
    assert.match(read('.github/workflows/ci.yml'), /^name: CI/);
    assert.match(read('docker-compose.yml'), /context: \./);
    assert.match(read('Dockerfile'), /nx run api:build:production/);
    assert.match(read('run.sh'), /npx nx serve web/);

    const ignore = read('.gitignore');

    for (const entry of [
      'node_modules',
      'dist',
      '.nx',
      '.env',
      'test-results',
    ]) {
      assert.match(ignore, new RegExp(`^${entry.replace('.', '\\.')}$`, 'm'));
    }
  });

  test('skips the install and the commit when told to', () => {
    assert.ok(!fs.existsSync(path.join(target, 'node_modules')));
    assert.ok(!fs.existsSync(path.join(target, 'package-lock.json')));
    assert.ok(!fs.existsSync(path.join(target, '.git')));
  });

  after(() => fs.rmSync(root, { recursive: true, force: true }));
});

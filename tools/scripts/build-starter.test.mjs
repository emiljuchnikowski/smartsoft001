import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, describe, it, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  buildStarter,
  FRONTENDS,
  leftovers,
  parseArgs,
  releasePackages,
  renameFrontend,
  renameProjects,
  selectProjects,
  selectVariants,
  starterCompose,
  starterDependencies,
  starterDockerfile,
  starterDockerignore,
  starterIgnore,
  starterManifest,
  starterEslintConfig,
  starterPlaywrightConfig,
  starterReactJestPreset,
  starterReadme,
  starterRunScript,
  starterWorkflow,
  stripMonorepoPaths,
  stripRegions,
  waitForRelease,
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

describe('renameFrontend', () => {
  test('drops the -react of the React app, its paths and its e2e project', () => {
    assert.equal(
      renameFrontend(
        'nx serve web-react; apps/web-react/vite.config.ts; dist/apps/web-react-demo; nx e2e web-react-e2e',
        'react',
      ),
      'nx serve web; apps/web/vite.config.ts; dist/apps/web-demo; nx e2e web-e2e',
    );
  });

  test('keeps the demo path the React build is served from', () => {
    assert.equal(
      renameFrontend("base: demo ? '/demo-react/' : '/'", 'react'),
      "base: demo ? '/demo-react/' : '/'",
    );
  });

  test('changes nothing for the Angular starter', () => {
    assert.equal(
      renameFrontend('nx serve web-react', 'angular'),
      'nx serve web-react',
    );
  });
});

describe('selectProjects', () => {
  const command = 'nx run-many -t test -p model api web web-react';

  test("drops the other frontend's project from a -p list", () => {
    assert.equal(
      selectProjects(command, 'angular'),
      'nx run-many -t test -p model api web',
    );
    assert.equal(
      selectProjects(command, 'react'),
      'nx run-many -t test -p model api web-react',
    );
  });

  test('leaves a command without a project list alone', () => {
    assert.equal(selectProjects('nx serve web', 'react'), 'nx serve web');
  });
});

describe('selectVariants', () => {
  const entries = [
    ['start', 'nx serve web'],
    ['start:react', 'nx serve web-react'],
    ['start:api', 'nx serve api'],
  ];

  test('keeps the plain command of each pair for Angular', () => {
    assert.deepEqual(selectVariants(entries, 'angular', ':react'), [
      ['start', 'nx serve web'],
      ['start:api', 'nx serve api'],
    ]);
  });

  test('puts the React command under the plain name, in its place, for React', () => {
    assert.deepEqual(selectVariants(entries, 'react', ':react'), [
      ['start', 'nx serve web-react'],
      ['start:api', 'nx serve api'],
    ]);
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

describe('starterEslintConfig', () => {
  const config = starterEslintConfig();

  test('builds on the Nx flat configs and the import plugin', () => {
    assert.match(config, /import nx from '@nx\/eslint-plugin';/);
    assert.match(config, /import importPlugin from 'eslint-plugin-import';/);
    assert.match(config, /\.\.\.nx\.configs\['flat\/typescript'\]/);
  });

  test('orders the framework imports after the external ones', () => {
    assert.match(config, /pattern: '@smartsoft001\/\*\*'/);
  });

  test('loads nothing the starter does not install', () => {
    assert.ok(!config.includes('storybook'));
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
    assert.match(compose, /\(apps\/web\/proxy\.conf\.json\)/);
    assert.ok(!compose.includes('web-react'));
  });

  test("names the React starter's Vite proxy instead", () => {
    const react = starterCompose(readApp('docker-compose.yml'), 'react');

    assert.match(react, /`npx nx serve web`/);
    assert.match(react, /`server\.proxy` in apps\/web\/vite\.config\.ts/);
    assert.ok(!react.includes('proxy.conf.json'));
    assert.ok(!react.includes('Angular'));
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
    assert.match(ignore, /^\*\*\/\.angular$/m);
  });

  test('has no Angular cache to ignore in the React starter', () => {
    const react = starterDockerignore(
      readApp('Dockerfile.dockerignore'),
      'react',
    );

    assert.ok(!react.includes('.angular'));
    assert.match(react, /^\*\*\/node_modules$/m);
  });
});

describe('starterIgnore', () => {
  test('ignores the Angular cache in the Angular starter only', () => {
    assert.match(starterIgnore(), /^\.angular$/m);
    assert.ok(!starterIgnore('react').includes('.angular'));
    assert.match(starterIgnore('react'), /^\.env$/m);
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

  test('runs only the Angular frontend', () => {
    assert.ok(!script.includes('react'));
    assert.match(script, /`\.\/run\.sh web` the Angular frontend/);
    assert.match(
      script,
      /# Jest: the model, the API services, the Angular services and pages/,
    );
    assert.match(script, /echo "usage: \$0 up\|web\|test\|e2e" >&2/);
    assert.match(script, /^ {2}web\) web ;;$/m);
    assert.match(script, /^ {2}e2e\) e2e ;;$/m);
  });

  test('keeps the bodies of the commands it runs', () => {
    assert.match(
      script,
      /^web\(\) \{\n {2}# The frontend on http:\/\/localhost:4200/m,
    );
    assert.match(script, /^unit\(\) \{$/m);
    assert.match(script, /^ {2}test\) unit ;;$/m);
  });
});

describe('starterRunScript for the React starter', () => {
  const script = starterRunScript(readApp('run.sh'), 'react');

  test('runs the React app and its suite under the plain names', () => {
    assert.match(
      script,
      /^web\(\) \{\n {2}# The React frontend on http:\/\/localhost:4300/m,
    );
    assert.match(script, /npx nx serve web$/m);
    assert.match(script, /npx nx run-many -t test -p model api web$/m);
    assert.match(script, /RUN_EXAMPLE_APP_E2E=1 npx nx test web-e2e$/m);
    assert.match(
      script,
      /# Jest: the model, the API services, the React services and pages/,
    );
  });

  test('has no Angular command and no -react name left', () => {
    assert.ok(!script.includes('web-react'));
    assert.ok(!script.includes('_react'));
    assert.ok(!script.includes('4200'));
    assert.equal(script.match(/^web\(\) \{$/gm).length, 1);
    assert.equal(script.match(/^e2e\(\) \{$/gm).length, 1);
    assert.match(script, /echo "usage: \$0 up\|web\|test\|e2e" >&2/);
  });

  test('runs from its own directory like the Angular one', () => {
    assert.match(script, /REPO_ROOT="\$\(cd "\$\(dirname "\$0"\)" && pwd\)"/);
    assert.match(script, /`\.\/run\.sh web` the React frontend/);
    assert.match(script, /the running stack\.\nset -Eeuo pipefail\n/);
  });
});

describe('starterPlaywrightConfig', () => {
  const config = readApp('apps/web-e2e/playwright.config.ts');

  for (const [frontend, url] of [
    ['angular', 'http://localhost:4200'],
    ['react', 'http://localhost:4300'],
  ]) {
    test(`drives the ${frontend} dev server of the web project, with no switch`, () => {
      const rewritten = renameProjects(
        starterPlaywrightConfig(config, frontend),
      );

      assert.match(rewritten, /serve: 'npx nx serve web',/);
      assert.match(rewritten, new RegExp(`url: '${url}',`));
      assert.ok(!rewritten.includes('E2E_FRONTEND'));
      assert.ok(!rewritten.includes('selectFrontend'));
      assert.ok(!rewritten.includes('FRONTENDS'));
      assert.match(
        rewritten,
        /const outputDir = resolve\(workspaceRoot, 'dist\/docs\/examples\/app\/apps\/web-e2e'\);/,
      );
      assert.match(rewritten, /baseURL: baseURL \?\? frontend\.url/);
    });
  }

  test('fails loudly when the config no longer has the table it rewrites', () => {
    assert.throws(
      () => starterPlaywrightConfig('export default {};', 'react'),
      /has no react frontend/,
    );
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

  const app = readJson(path.join(repoRoot, APP, 'package.json'));

  test('keeps the Angular scripts and drops the React ones', () => {
    const manifest = starterManifest(app, '2.161.0', 'angular');

    assert.deepEqual(manifest.scripts, {
      start: 'nx serve web',
      'start:api': 'nx serve api',
      test: 'nx run-many -t test -p model api web',
      e2e: 'nx e2e web-e2e',
    });
  });

  test('puts the React scripts under the plain names for the React starter', () => {
    const manifest = starterManifest(app, '2.161.0', 'react');

    assert.equal(manifest.name, 'smartsoft001-starter-react');
    assert.match(
      manifest.description,
      /react-stack and @smartsoft001\/nestjs-stack 2\.161\.0/,
    );
    assert.deepEqual(manifest.scripts, {
      start: 'nx serve web',
      'start:api': 'nx serve api',
      test: 'nx run-many -t test -p model api web',
      e2e: 'nx e2e web-e2e',
    });
  });
});

describe('starterDependencies', () => {
  const app = readJson(path.join(repoRoot, APP, 'package.json'));
  const all = (manifest) => [
    ...Object.keys(manifest.dependencies),
    ...Object.keys(manifest.devDependencies),
  ];

  test('the Angular starter installs nothing of the React frontend', () => {
    const names = all(starterManifest(app, '2.161.0', 'angular'));

    for (const name of [
      '@smartsoft001/react-stack',
      'react',
      'react-dom',
      '@types/react',
      '@testing-library/react',
      'eslint-plugin-react-hooks',
      'vite',
    ]) {
      assert.ok(!names.includes(name), `the Angular starter installs ${name}`);
    }
    assert.ok(names.includes('@angular/core'));
    assert.ok(names.includes('jest-preset-angular'));
    assert.ok(names.includes('@nestjs/core'));
  });

  test('the React starter installs nothing of the Angular frontend', () => {
    const names = all(starterManifest(app, '2.161.0', 'react'));

    assert.deepEqual(
      names.filter((name) =>
        /angular|^@ngrx\/|^@ngx-translate\/|^ngx?-/.test(name),
      ),
      [],
    );
    assert.ok(!names.includes('@smartsoft001/full-stack'));
    for (const name of [
      'react',
      'react-dom',
      'vite',
      '@nestjs/core',
      'jest',
      'playwright',
    ]) {
      assert.ok(names.includes(name), `the React starter misses ${name}`);
    }
  });

  test('the React starter takes the NestJS half of full-stack, at the release', () => {
    const dependencies = starterDependencies(
      {
        '@smartsoft001/full-stack': '2.161.0',
        '@smartsoft001/react-stack': '2.161.0',
        rxjs: '^7',
      },
      '2.161.0',
      'react',
    );

    assert.deepEqual(dependencies, {
      '@smartsoft001/nestjs-stack': '2.161.0',
      '@smartsoft001/react-stack': '2.161.0',
      rxjs: '^7',
    });
  });
});

describe('starterReactJestPreset', () => {
  test('is the Nx preset without the Angular module mappings', () => {
    const preset = starterReactJestPreset();

    assert.match(preset, /require\('@nx\/jest\/preset'\)\.default/);
    assert.match(
      preset,
      /customExportConditions: \['node', 'require', 'default'\]/,
    );
    assert.ok(!preset.includes('angular'));
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
      /https:\/\/framework\.smartflow\.biz\.pl\/docs\/example-app/,
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

describe('starterReadme for the React starter', () => {
  const readme = starterReadme('2.161.0', 'react');

  test('says React and NestJS and pins both stacks', () => {
    assert.match(readme, /^# smartsoft001 React starter/);
    assert.match(readme, /`@smartsoft001\/react-stack@2\.161\.0`/);
    assert.match(readme, /`@smartsoft001\/nestjs-stack@2\.161\.0`/);
    assert.match(
      readme,
      /a React frontend on `@smartsoft001\/crud-shell-react`/,
    );
    assert.match(readme, /a NestJS API on `@smartsoft001\/crud-shell-nestjs`/);
    assert.ok(!readme.includes('Angular'));
    assert.ok(!readme.includes('full-stack'));
  });

  test('says where it comes from and links the docs', () => {
    assert.match(readme, /generated/);
    assert.match(readme, /docs\/examples\/app/);
    assert.match(
      readme,
      /https:\/\/framework\.smartflow\.biz\.pl\/docs\/example-app/,
    );
  });

  test("documents the React app's port, commands and paths", () => {
    assert.match(readme, /Open http:\/\/localhost:4300/);
    assert.match(readme, /\.\/run\.sh web/);
    assert.match(readme, /npx nx e2e web-e2e/);
    assert.match(readme, /`apps\/web\/src\/app\/notes\/notes\.config\.ts`/);
    assert.match(readme, /`apps\/web\/vite\.config\.ts`/);
    assert.match(readme, /@smartsoft001\/crud-shell-react\/styles\.css/);
    assert.ok(!readme.includes('docs-examples-app'));
    assert.ok(!readme.includes('web-react'));
  });

  test('says how to upgrade', () => {
    assert.match(readme, /npx nx migrate @smartsoft001\/core@<next>/);
  });
});

describe('starterWorkflow', () => {
  const workflow = starterWorkflow();

  test('installs from the lockfile, lints, builds and tests', () => {
    assert.match(workflow, /npm ci/);
    assert.match(workflow, /npx nx run-many -t lint/);
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
    assert.equal(args.frontend, 'angular');
  });

  test('reads the frontend, and refuses one it does not know', () => {
    assert.equal(
      parseArgs([
        '--version',
        '2.161.0',
        '--target',
        'out',
        '--frontend',
        'react',
      ]).frontend,
      'react',
    );
    assert.throws(
      () =>
        parseArgs([
          '--version',
          '2.161.0',
          '--target',
          'out',
          '--frontend',
          'vue',
        ]),
      /unknown frontend "vue"/,
    );
    assert.throws(
      () =>
        parseArgs(['--version', '2.161.0', '--target', 'out', '--frontend']),
      /unknown frontend ""/,
    );
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

  test('keeps the lint targets and the project ESLint configs', () => {
    for (const file of [
      'apps/web/project.json',
      'apps/api/project.json',
      'apps/web-e2e/project.json',
      'libs/model/project.json',
    ]) {
      assert.equal(
        readJson(path.join(target, file)).targets.lint.executor,
        '@nx/eslint:lint',
        `${file} has no lint target`,
      );
    }

    for (const file of ['apps/web', 'apps/api']) {
      assert.match(
        read(`${file}/eslint.config.mjs`),
        /from '\.\.\/\.\.\/eslint\.config\.mjs'/,
      );
    }
  });

  test('writes the root ESLint config the projects extend', () => {
    assert.equal(read('eslint.config.mjs'), starterEslintConfig());
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

  test('has the Angular frontend only', () => {
    assert.ok(fs.existsSync(path.join(target, 'apps/web/src/main.ts')));
    assert.ok(!fs.existsSync(path.join(target, 'apps/web-react')));
    assert.ok(!fs.existsSync(path.join(target, 'apps/web-react-e2e')));
    assert.ok(!read('run.sh').includes('react'));
    assert.match(
      read('apps/web-e2e/playwright.config.ts'),
      /url: 'http:\/\/localhost:4200'/,
    );
    assert.equal(
      read('jest.preset.js'),
      fs.readFileSync(path.join(repoRoot, 'jest.preset.js'), 'utf8'),
    );
  });

  after(() => fs.rmSync(root, { recursive: true, force: true }));
});

describe('buildStarter for the React frontend', () => {
  const root = fixtureRepo();
  const target = path.join(root, 'starter');

  buildStarter({
    repoRoot: root,
    version: '2.161.0',
    target,
    frontend: 'react',
    install: false,
    git: false,
  });

  const read = (relative) =>
    fs.readFileSync(path.join(target, relative), 'utf8');

  test('has the React app as apps/web and no Angular app', () => {
    assert.ok(fs.existsSync(path.join(target, 'apps/web/src/main.tsx')));
    assert.ok(fs.existsSync(path.join(target, 'apps/web/vite.config.ts')));
    assert.ok(!fs.existsSync(path.join(target, 'apps/web/src/main.ts')));
    assert.ok(!fs.existsSync(path.join(target, 'apps/web/proxy.conf.json')));
    assert.ok(!fs.existsSync(path.join(target, 'apps/web-react')));
    assert.ok(!fs.existsSync(path.join(target, 'apps/web-react-e2e')));
  });

  test('names the projects like the Angular starter does', () => {
    const web = readJson(path.join(target, 'apps/web/project.json'));
    const e2e = readJson(path.join(target, 'apps/web-e2e/project.json'));

    assert.equal(web.name, 'web');
    assert.equal(web.sourceRoot, 'apps/web/src');
    assert.equal(web.targets.build.options.outputPath, 'dist/apps/web');
    assert.equal(
      web.targets.serve.options.command,
      'vite --config apps/web/vite.config.ts',
    );
    assert.equal(web.targets.styles, undefined);
    assert.equal(e2e.name, 'web-e2e');
    assert.deepEqual(e2e.implicitDependencies, ['web', 'api']);
    assert.match(read('apps/web/jest.config.ts'), /displayName: 'web'/);
    assert.match(
      read('apps/web/vite.config.ts'),
      /'dist\/apps\/web-demo\/demo-react'/,
    );
  });

  test('drives the React app with the shared Playwright suite', () => {
    const config = read('apps/web-e2e/playwright.config.ts');

    assert.match(config, /serve: 'npx nx serve web'/);
    assert.match(config, /url: 'http:\/\/localhost:4300'/);
    assert.ok(!config.includes('E2E_FRONTEND'));
    assert.match(read('apps/web-e2e/src/support/app.ts'), /tbody tr/);
  });

  test('installs the React and NestJS stacks at the release, and nothing of Angular', () => {
    const manifest = readJson(path.join(target, 'package.json'));

    assert.equal(manifest.name, 'smartsoft001-starter-react');
    assert.equal(manifest.dependencies['@smartsoft001/react-stack'], '2.161.0');
    assert.equal(
      manifest.dependencies['@smartsoft001/nestjs-stack'],
      '2.161.0',
    );
    assert.equal(manifest.dependencies['@smartsoft001/full-stack'], undefined);
    assert.equal(manifest.scripts.start, 'nx serve web');
    assert.match(manifest.description, /docs\/examples\/app/);
    assert.ok(!JSON.stringify(manifest).includes('angular'));
  });

  test('strips the snippet regions from the TSX sources too', () => {
    const main = read('apps/web/src/main.tsx');

    assert.ok(!main.includes('#region'));
    assert.match(main, /import '@smartsoft001\/react\/styles\.css';/);
  });

  test('writes the React starter files', () => {
    assert.match(read('README.md'), /^# smartsoft001 React starter/);
    assert.equal(read('jest.preset.js'), starterReactJestPreset());
    assert.ok(!read('.gitignore').includes('.angular'));
    assert.match(read('run.sh'), /`\.\/run\.sh web` the React frontend/);
    assert.match(read('docker-compose.yml'), /vite\.config\.ts/);
    assert.equal(read('.github/workflows/ci.yml'), starterWorkflow());
    assert.equal(read('eslint.config.mjs'), starterEslintConfig());
  });

  test('leaves no trace of the monorepo or of the Angular frontend behind', () => {
    assert.deepEqual(leftovers(target, 'react'), []);
  });

  after(() => fs.rmSync(root, { recursive: true, force: true }));
});

describe('leftovers', () => {
  test("flags the other frontend's pieces", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'starter-leftovers-'));

    try {
      fs.writeFileSync(path.join(dir, 'a.ts'), "import '@angular/core';\n");
      fs.writeFileSync(path.join(dir, 'b.sh'), 'npx nx serve web-react\n');

      assert.deepEqual(leftovers(dir, 'react'), ['a.ts: Angular frontend']);
      assert.deepEqual(leftovers(dir, 'angular'), ['b.sh: React frontend']);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('FRONTENDS', () => {
  test('names one starter repository package per frontend', () => {
    assert.deepEqual(
      Object.entries(FRONTENDS).map(([frontend, spec]) => [
        frontend,
        spec.name,
      ]),
      [
        ['angular', 'smartsoft001-starter'],
        ['react', 'smartsoft001-starter-react'],
      ],
    );
  });
});

describe('build-starter: waiting for the release on the registry', () => {
  const manifests = {
    '@smartsoft001/full-stack@1.0.0': {
      dependencies: {
        '@smartsoft001/core': '1.0.0',
        '@smartsoft001/angular-stack': '1.0.0',
      },
      version: '1.0.0',
    },
    '@smartsoft001/core@1.0.0': {
      dependencies: { tslib: '^2' },
      version: '1.0.0',
    },
    '@smartsoft001/angular-stack@1.0.0': {
      dependencies: { '@smartsoft001/angular': '1.0.0' },
      version: '1.0.0',
    },
    '@smartsoft001/angular@1.0.0': {
      dependencies: {},
      // The framework packages reach each other as peers, like auth-domain
      // and google on 2.179.0.
      peerDependencies: { '@smartsoft001/google': '1.0.0', rxjs: '^7' },
      version: '1.0.0',
    },
    '@smartsoft001/google@1.0.0': { dependencies: {}, version: '1.0.0' },
  };

  function viewFrom(available) {
    return (spec, field) => {
      if (!available.has(spec)) throw new Error(`npm error code E404 ${spec}`);

      return manifests[spec][field];
    };
  }

  it('should list the framework packages under the stack, transitively', () => {
    const view = viewFrom(new Set(Object.keys(manifests)));

    assert.deepEqual(releasePackages('1.0.0', view), [
      '@smartsoft001/angular',
      '@smartsoft001/angular-stack',
      '@smartsoft001/core',
      '@smartsoft001/full-stack',
      '@smartsoft001/google',
    ]);
  });

  it('should wait for a framework package that is only a peer', () => {
    const available = new Set(
      Object.keys(manifests).filter(
        (spec) => !spec.startsWith('@smartsoft001/google@'),
      ),
    );
    const naps = [];
    const sleep = (ms) => {
      naps.push(ms);
      available.add('@smartsoft001/google@1.0.0');
    };

    waitForRelease('1.0.0', { view: viewFrom(available), sleep, delayMs: 5 });

    assert.deepEqual(naps, [5]);
  });

  it('should return as soon as every package resolves', () => {
    const view = viewFrom(new Set(Object.keys(manifests)));
    const naps = [];

    waitForRelease('1.0.0', { view, sleep: (ms) => naps.push(ms) });

    assert.deepEqual(naps, []);
  });

  it('should wait for a package that the registry does not serve yet', () => {
    const available = new Set(
      Object.keys(manifests).filter(
        (spec) => !spec.startsWith('@smartsoft001/angular@'),
      ),
    );
    const naps = [];
    const sleep = (ms) => {
      naps.push(ms);
      // The missing package shows up after the first nap.
      available.add('@smartsoft001/angular@1.0.0');
    };

    waitForRelease('1.0.0', { view: viewFrom(available), sleep, delayMs: 5 });

    assert.deepEqual(naps, [5]);
  });

  it('should start from the stacks it is given, as the React starter does', () => {
    const view = viewFrom(new Set(Object.keys(manifests)));

    assert.deepEqual(
      releasePackages('1.0.0', view, ['@smartsoft001/angular-stack']),
      [
        '@smartsoft001/angular',
        '@smartsoft001/angular-stack',
        '@smartsoft001/google',
      ],
    );
  });

  it('should name the stacks it waits for when none resolves yet', () => {
    assert.throws(
      () =>
        waitForRelease('1.0.0', {
          view: viewFrom(new Set()),
          sleep: () => undefined,
          attempts: 1,
          roots: ['@smartsoft001/nestjs-stack', '@smartsoft001/react-stack'],
        }),
      /still missing: @smartsoft001\/nestjs-stack, @smartsoft001\/react-stack/,
    );
  });

  it('should give up after the attempts and name what is missing', () => {
    const view = viewFrom(new Set());

    assert.throws(
      () =>
        waitForRelease('1.0.0', { view, sleep: () => undefined, attempts: 2 }),
      /did not reach the registry in time; still missing: @smartsoft001\/full-stack/,
    );
  });
});

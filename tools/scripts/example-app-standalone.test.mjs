import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  createStandaloneApp,
  parsePackages,
  rewritePaths,
  standaloneManifest,
  standaloneProject,
  standaloneTsconfig,
} from './example-app-standalone.mjs';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);

const APP = path.join('docs', 'examples', 'app');

function readJson(absolute) {
  return JSON.parse(fs.readFileSync(absolute, 'utf8'));
}

/**
 * A repository with the real example application in it, plus the local state
 * a checkout accumulates and a copy must leave behind.
 */
function fixtureRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'example-app-fixture-'));
  const app = path.join(root, APP);

  fs.cpSync(path.join(repoRoot, APP), app, { recursive: true });
  fs.copyFileSync(
    path.join(repoRoot, 'tsconfig.base.json'),
    path.join(root, 'tsconfig.base.json'),
  );
  fs.copyFileSync(
    path.join(repoRoot, 'jest.preset.js'),
    path.join(root, 'jest.preset.js'),
  );
  fs.writeFileSync(path.join(app, '.env'), 'JWT_SECRET=local\n');
  fs.mkdirSync(path.join(app, 'node_modules', 'left-over'), {
    recursive: true,
  });
  fs.mkdirSync(path.join(app, 'dist'), { recursive: true });

  return root;
}

const tarballs = new Map([
  ['@smartsoft001/core', '/tmp/t/smartsoft001-core-2.160.0.tgz'],
  ['@smartsoft001/full-stack', '/tmp/t/smartsoft001-full-stack-2.160.0.tgz'],
  ['@smartsoft001/angular', '/tmp/t/smartsoft001-angular-2.160.0.tgz'],
]);

describe('rewritePaths', () => {
  test('moves a reference from five directories deep to the workspace root', () => {
    assert.equal(
      rewritePaths("preset: '../../../../../jest.preset.js'"),
      "preset: '../../jest.preset.js'",
    );
  });

  test('handles the bare form the Playwright config resolves from', () => {
    assert.equal(
      rewritePaths("resolve(__dirname, '../../../../..')"),
      "resolve(__dirname, '../..')",
    );
  });

  test('drops the monorepo prefix from a workspace-relative path', () => {
    assert.equal(
      rewritePaths('"main": "docs/examples/app/apps/api/src/main.ts"'),
      '"main": "apps/api/src/main.ts"',
    );
  });
});

describe('standaloneProject', () => {
  const web = readJson(path.join(repoRoot, APP, 'apps', 'web', 'project.json'));

  test('drops the styles target and what depended on it', () => {
    const project = standaloneProject(web);

    assert.equal(project.targets.styles, undefined);
    assert.equal(project.targets.build.dependsOn, undefined);
    assert.equal(project.targets.serve.dependsOn, undefined);
  });

  test('points the build at the stylesheets the packages publish', () => {
    assert.deepEqual(standaloneProject(web).targets.build.options.styles, [
      'node_modules/@smartsoft001/angular/styles.css',
      'node_modules/@smartsoft001/crud-shell-angular/styles.css',
      'apps/web/src/styles.scss',
    ]);
  });

  test('keeps a dependsOn that has nothing to do with styles', () => {
    const project = standaloneProject({
      targets: {
        styles: {},
        build: { dependsOn: ['^build', { target: 'styles' }] },
      },
    });

    assert.deepEqual(project.targets.build.dependsOn, ['^build']);
  });

  test('leaves a project without a styles target alone', () => {
    const api = readJson(
      path.join(repoRoot, APP, 'apps', 'api', 'project.json'),
    );

    assert.equal(standaloneProject(api), api);
  });
});

describe('standaloneManifest', () => {
  const manifest = readJson(path.join(repoRoot, APP, 'package.json'));

  test('installs the stack from its tarball and overrides every package', () => {
    const next = standaloneManifest(manifest, { tarballs });

    assert.equal(
      next.dependencies['@smartsoft001/full-stack'],
      'file:/tmp/t/smartsoft001-full-stack-2.160.0.tgz',
    );
    assert.deepEqual(next.overrides, {
      '@smartsoft001/core': 'file:/tmp/t/smartsoft001-core-2.160.0.tgz',
      '@smartsoft001/full-stack':
        'file:/tmp/t/smartsoft001-full-stack-2.160.0.tgz',
      '@smartsoft001/angular': 'file:/tmp/t/smartsoft001-angular-2.160.0.tgz',
    });
  });

  test('installs one exact version from the registry with no overrides', () => {
    const next = standaloneManifest(manifest, { version: '2.157.0' });

    assert.equal(next.dependencies['@smartsoft001/full-stack'], '2.157.0');
    assert.equal(next.overrides, undefined);
  });

  test('replaces the overrides when switching from one form to the other', () => {
    const registry = standaloneManifest(manifest, { version: '2.157.0' });
    const switched = standaloneManifest(
      standaloneManifest(registry, { tarballs }),
      { version: '2.157.0' },
    );

    assert.equal(switched.overrides, undefined);
  });

  test('keeps the name, the scripts and the other dependencies', () => {
    const next = standaloneManifest(manifest, { version: '2.157.0' });

    assert.equal(next.name, manifest.name);
    assert.deepEqual(next.scripts, manifest.scripts);
    assert.deepEqual(next.devDependencies, manifest.devDependencies);
    assert.equal(
      next.dependencies['@angular/core'],
      manifest.dependencies['@angular/core'],
    );
  });

  test('does not modify the manifest it was given', () => {
    const before = JSON.stringify(manifest);

    standaloneManifest(manifest, { tarballs });

    assert.equal(JSON.stringify(manifest), before);
  });
});

describe('standaloneTsconfig', () => {
  test('keeps the compiler options and aliases only the app model', () => {
    const config = standaloneTsconfig({
      compilerOptions: {
        target: 'es2022',
        strict: false,
        paths: {
          '@smartsoft001/models': ['packages/shared/models/src/index.ts'],
        },
      },
    });

    assert.equal(config.compilerOptions.target, 'es2022');
    assert.equal(config.compilerOptions.strict, false);
    assert.deepEqual(config.compilerOptions.paths, {
      '@app/model': ['libs/model/src/index.ts'],
    });
  });
});

describe('parsePackages', () => {
  test('reads the package names back from the tarballs in a directory', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tarballs-'));

    try {
      for (const name of [
        'smartsoft001-core-2.160.0.tgz',
        'smartsoft001-crud-shell-angular-2.160.0.tgz',
        'README.md',
      ]) {
        fs.writeFileSync(path.join(dir, name), '');
      }

      const { tarballs: found } = parsePackages(`tarballs:${dir}`);

      assert.deepEqual([...found.keys()].sort(), [
        '@smartsoft001/core',
        '@smartsoft001/crud-shell-angular',
      ]);
      assert.equal(
        found.get('@smartsoft001/core'),
        path.join(dir, 'smartsoft001-core-2.160.0.tgz'),
      );
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test('takes a registry version as it is', () => {
    assert.deepEqual(parsePackages('registry:2.157.0'), {
      version: '2.157.0',
    });
  });

  test('rejects anything else', () => {
    assert.throws(() => parsePackages('latest'), /tarballs:<dir> or registry:/);
  });
});

describe('createStandaloneApp', () => {
  const root = fixtureRepo();
  const target = path.join(root, 'standalone');

  createStandaloneApp({ repoRoot: root, target, packages: { tarballs } });

  const read = (relative) =>
    fs.readFileSync(path.join(target, relative), 'utf8');

  test('copies the app without its local state', () => {
    assert.ok(
      fs.existsSync(path.join(target, 'apps', 'web', 'src', 'main.ts')),
    );
    assert.ok(fs.existsSync(path.join(target, 'libs', 'model', 'src')));
    assert.ok(!fs.existsSync(path.join(target, '.env')));
    assert.ok(!fs.existsSync(path.join(target, 'node_modules')));
    assert.ok(!fs.existsSync(path.join(target, 'dist')));
  });

  test('points every config at the workspace root of the copy', () => {
    assert.match(
      read('apps/web/jest.config.ts'),
      /preset: '\.\.\/\.\.\/jest\.preset\.js'/,
    );
    assert.match(
      read('apps/api/tsconfig.json'),
      /"extends": "\.\.\/\.\.\/tsconfig\.base\.json"/,
    );
    assert.match(
      read('apps/web-e2e/playwright.config.ts'),
      /resolve\(__dirname, '\.\.\/\.\.'\)/,
    );

    for (const file of [
      'apps/api/jest.config.ts',
      'apps/api/tsconfig.app.json',
      'apps/web/tsconfig.spec.json',
      'apps/web/project.json',
      'apps/api/project.json',
      'apps/web-e2e/project.json',
      'apps/web-e2e/run.mjs',
      'libs/model/project.json',
      'libs/model/tsconfig.lib.json',
    ]) {
      assert.ok(
        !read(file).includes('../../../../..'),
        `${file} still points five directories up`,
      );
      assert.ok(
        !read(file).includes('docs/examples/app/'),
        `${file} still carries the monorepo prefix`,
      );
    }
  });

  test('leaves the sources alone', () => {
    assert.equal(
      read('apps/api/src/config.ts'),
      fs.readFileSync(path.join(root, APP, 'apps/api/src/config.ts'), 'utf8'),
    );
  });

  test('rewrites the web project for the published stylesheets', () => {
    const web = readJson(path.join(target, 'apps', 'web', 'project.json'));

    assert.equal(web.targets.styles, undefined);
    assert.equal(web.targets.build.dependsOn, undefined);
    assert.equal(web.targets.build.options.browser, 'apps/web/src/main.ts');
    assert.equal(web.targets.build.options.outputPath, 'dist/apps/web');
    assert.deepEqual(web.targets.build.options.styles, [
      'node_modules/@smartsoft001/angular/styles.css',
      'node_modules/@smartsoft001/crud-shell-angular/styles.css',
      'apps/web/src/styles.scss',
    ]);
    assert.equal(
      web.targets.serve.options.proxyConfig,
      'apps/web/proxy.conf.json',
    );
  });

  test('writes the workspace files the monorepo used to provide', () => {
    const nx = readJson(path.join(target, 'nx.json'));
    const tsconfig = readJson(path.join(target, 'tsconfig.base.json'));

    assert.equal(nx.extends, 'nx/presets/npm.json');
    assert.equal(nx.useInferencePlugins, false);
    assert.equal(nx.targetDefaults.build.cache, true);
    assert.equal(
      nx.targetDefaults['@nx/jest:jest'].options.passWithNoTests,
      true,
    );
    assert.deepEqual(Object.keys(tsconfig.compilerOptions.paths), [
      '@app/model',
    ]);
    assert.equal(
      read('jest.preset.js'),
      fs.readFileSync(path.join(root, 'jest.preset.js'), 'utf8'),
    );
    assert.equal(read('.gitignore'), 'node_modules\ndist\n.nx\ncoverage\n');
  });

  test('writes the manifest in the form it was asked for', () => {
    const manifest = readJson(path.join(target, 'package.json'));

    assert.equal(
      manifest.dependencies['@smartsoft001/full-stack'],
      'file:/tmp/t/smartsoft001-full-stack-2.160.0.tgz',
    );
    assert.equal(Object.keys(manifest.overrides).length, tarballs.size);
  });

  after(() => fs.rmSync(root, { recursive: true, force: true }));
});

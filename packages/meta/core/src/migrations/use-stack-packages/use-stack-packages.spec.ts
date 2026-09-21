import { Tree, readJson, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { ModuleKind, ScriptTarget, transpileModule } from 'typescript';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import update from './use-stack-packages';

describe('use-stack-packages migration', () => {
  let tree: Tree;
  let info: jest.SpyInstance;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    info = jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    info.mockRestore();
  });

  const logged = (): string => info.mock.calls.map(([line]) => line).join('\n');

  it('should replace two members of a stack with the stack itself', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: {
        '@smartsoft001/angular': '2.143.0',
        '@smartsoft001/crud-shell-angular': '2.143.0',
      },
    });

    await update(tree);

    expect(readJson(tree, 'package.json').dependencies).toEqual({
      '@smartsoft001/angular-stack': '2.143.0',
    });
  });

  it('should collapse a full Angular set into the angular stack alone', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: {
        '@smartsoft001/models': '2.143.0',
        '@smartsoft001/domain-core': '2.143.0',
        '@smartsoft001/utils': '2.143.0',
        '@smartsoft001/users': '2.143.0',
        '@smartsoft001/auth-domain': '2.143.0',
        '@smartsoft001/crud-domain': '2.143.0',
        '@smartsoft001/crud-shell-dtos': '2.143.0',
        '@smartsoft001/auth-shell-dtos': '2.143.0',
        '@smartsoft001/crud-shell-app-services': '2.143.0',
        '@smartsoft001/auth-shell-app-services': '2.143.0',
        '@smartsoft001/angular': '2.143.0',
        '@smartsoft001/crud-shell-angular': '2.143.0',
      },
    });

    await update(tree);

    expect(readJson(tree, 'package.json').dependencies).toEqual({
      '@smartsoft001/angular-stack': '2.143.0',
    });
  });

  it('should collapse two payments packages into the payments stack', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: {
        '@smartsoft001/trans-domain': '2.143.0',
        '@smartsoft001/paypal': '2.143.0',
      },
    });

    await update(tree);

    expect(readJson(tree, 'package.json').dependencies).toEqual({
      '@smartsoft001/payments-stack': '2.143.0',
    });
  });

  it('should collapse two NestJS packages into the NestJS stack', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: {
        '@smartsoft001/nestjs': '2.143.0',
        '@smartsoft001/mongo': '2.143.0',
      },
    });

    await update(tree);

    expect(readJson(tree, 'package.json').dependencies).toEqual({
      '@smartsoft001/nestjs-stack': '2.143.0',
    });
  });

  it('should collapse members listed in devDependencies', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      devDependencies: {
        '@smartsoft001/angular': '2.143.0',
        '@smartsoft001/crud-shell-angular': '2.143.0',
      },
    });

    await update(tree);

    const json = readJson(tree, 'package.json');

    expect(json.devDependencies).toEqual({
      '@smartsoft001/angular-stack': '2.143.0',
    });
    expect(json.dependencies).toBeUndefined();
  });

  it('should use the highest version when the members disagree', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: {
        '@smartsoft001/angular': '2.140.0',
        '@smartsoft001/crud-shell-angular': '^2.143.0',
      },
    });

    await update(tree);

    expect(readJson(tree, 'package.json').dependencies).toEqual({
      '@smartsoft001/angular-stack': '^2.143.0',
    });
  });

  it('should keep the stack at the position of the first entry it replaces', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: {
        rxjs: '7.8.0',
        '@smartsoft001/angular': '2.143.0',
        'zone.js': '0.14.0',
        '@smartsoft001/crud-shell-angular': '2.143.0',
        '@angular/core': '21.2.1',
      },
    });

    await update(tree);

    expect(Object.keys(readJson(tree, 'package.json').dependencies)).toEqual([
      'rxjs',
      '@smartsoft001/angular-stack',
      'zone.js',
      '@angular/core',
    ]);
  });

  it('should keep an alphabetically sorted block sorted', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: {
        '@smartsoft001/fb': '2.143.0',
        '@smartsoft001/users': '2.143.0',
        '@smartsoft001/utils': '2.143.0',
      },
    });

    await update(tree);

    expect(Object.keys(readJson(tree, 'package.json').dependencies)).toEqual([
      '@smartsoft001/core',
      '@smartsoft001/fb',
    ]);
  });

  it('should leave a single member of a stack alone', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: { '@smartsoft001/angular': '2.143.0' },
    });

    await update(tree);

    expect(readJson(tree, 'package.json').dependencies).toEqual({
      '@smartsoft001/angular': '2.143.0',
    });
  });

  it('should collapse only the stack that has two members in a mixed project', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: {
        '@smartsoft001/angular': '2.143.0',
        '@smartsoft001/crud-shell-angular': '2.143.0',
        '@smartsoft001/paypal': '2.143.0',
      },
    });

    await update(tree);

    expect(readJson(tree, 'package.json').dependencies).toEqual({
      '@smartsoft001/angular-stack': '2.143.0',
      '@smartsoft001/paypal': '2.143.0',
    });
  });

  it('should never touch a package that belongs to no stack', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: {
        '@smartsoft001/fb': '2.143.0',
        '@smartsoft001/google': '2.143.0',
        '@smartsoft001/claude-plugins': '2.143.0',
      },
    });

    await update(tree);

    expect(readJson(tree, 'package.json').dependencies).toEqual({
      '@smartsoft001/fb': '2.143.0',
      '@smartsoft001/google': '2.143.0',
      '@smartsoft001/claude-plugins': '2.143.0',
    });
  });

  it('should leave a package.json without any @smartsoft001 dependency alone', async () => {
    const original = {
      name: 'consumer',
      dependencies: { rxjs: '7.8.0' },
      devDependencies: { jest: '30.2.0' },
    };
    writeJson(tree, 'package.json', original);

    await update(tree);

    expect(readJson(tree, 'package.json')).toEqual(original);
  });

  it('should drop core when a stack that pins it is added', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: {
        '@smartsoft001/core': '2.143.0',
        '@smartsoft001/angular': '2.143.0',
      },
    });

    await update(tree);

    expect(readJson(tree, 'package.json').dependencies).toEqual({
      '@smartsoft001/angular-stack': '2.143.0',
    });
  });

  it('should change nothing when it runs a second time', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: {
        '@smartsoft001/models': '2.143.0',
        '@smartsoft001/utils': '2.143.0',
        '@smartsoft001/angular': '2.143.0',
        '@smartsoft001/paypal': '2.143.0',
      },
    });

    await update(tree);
    const afterFirstRun = tree.read('package.json', 'utf-8');

    await update(tree);

    expect(tree.read('package.json', 'utf-8')).toEqual(afterFirstRun);
  });

  it('should log one line per replacement', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: {
        '@smartsoft001/angular': '2.143.0',
        '@smartsoft001/crud-shell-angular': '2.143.0',
      },
      devDependencies: {
        '@smartsoft001/paypal': '2.143.0',
        '@smartsoft001/payu': '2.143.0',
      },
    });

    await update(tree);

    const lines = info.mock.calls
      .map(([line]) => line as string)
      .filter((line) => line.includes('->'));

    expect(lines).toEqual([
      'dependencies: @smartsoft001/angular, @smartsoft001/crud-shell-angular -> @smartsoft001/angular-stack@2.143.0',
      'devDependencies: @smartsoft001/paypal, @smartsoft001/payu -> @smartsoft001/payments-stack@2.143.0',
    ]);
  });

  it('should log a single line naming what stays installed individually', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: {
        '@smartsoft001/angular': '2.143.0',
        '@smartsoft001/crud-shell-angular': '2.143.0',
        '@smartsoft001/paypal': '2.143.0',
        '@smartsoft001/fb': '2.143.0',
      },
      devDependencies: { '@smartsoft001/mongo': '2.143.0' },
    });

    await update(tree);

    const lines = info.mock.calls
      .map(([line]) => line as string)
      .filter((line) => line.includes('individually'));

    expect(lines).toEqual([
      'Still installed individually: @smartsoft001/paypal, @smartsoft001/mongo',
    ]);
    expect(logged()).not.toContain('@smartsoft001/fb');
  });

  it('should not mention leftovers when there are none', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: {
        '@smartsoft001/angular': '2.143.0',
        '@smartsoft001/crud-shell-angular': '2.143.0',
      },
    });

    await update(tree);

    expect(logged()).not.toContain('individually');
  });

  it('should say in the log that the member versions disagreed', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: {
        '@smartsoft001/angular': '2.140.0',
        '@smartsoft001/crud-shell-angular': '^2.143.0',
      },
    });

    await update(tree);

    expect(logged()).toContain(
      'versions differed (2.140.0, ^2.143.0), kept the highest',
    );
  });

  it('should fold members into a stack the project already installs', async () => {
    writeJson(tree, 'package.json', {
      name: 'consumer',
      dependencies: {
        '@smartsoft001/angular-stack': '2.144.0',
        '@smartsoft001/angular': '2.143.0',
        '@smartsoft001/crud-shell-angular': '2.143.0',
      },
    });

    await update(tree);

    expect(readJson(tree, 'package.json').dependencies).toEqual({
      '@smartsoft001/angular-stack': '2.144.0',
    });
  });

  it('should compile to JavaScript that requires nothing', () => {
    // The unit tests above run inside this repository, where `@nx/devkit` is
    // installed. A consumer's workspace has `nx` and nothing else, so an import
    // that survives compilation fails there and only there: 2.145.0 shipped
    // with `Cannot find module '@nx/devkit'` while every test above was green.
    const source = readFileSync(
      join(__dirname, 'use-stack-packages.ts'),
      'utf-8',
    );

    const { outputText } = transpileModule(source, {
      compilerOptions: {
        module: ModuleKind.CommonJS,
        target: ScriptTarget.ES2022,
      },
    });

    const required = [
      ...outputText.matchAll(/require\(["']([^"']+)["']\)/g),
    ].map((match) => match[1]);

    expect(required).toEqual([]);
  });

  it('should leave a group alone when a member is not on a plain version', async () => {
    // A `file:`, `workspace:` or git specifier means the project resolves that
    // package its own way, and the stack's pinned version is not the same
    // thing. Comparing the digits inside such a string yields a number, and
    // the wrong one.
    writeJson(tree, 'package.json', {
      dependencies: {
        '@smartsoft001/angular': 'file:../angular',
        '@smartsoft001/crud-shell-angular': '2.145.0',
      },
    });

    await update(tree);

    expect(readJson(tree, 'package.json').dependencies).toEqual({
      '@smartsoft001/angular': 'file:../angular',
      '@smartsoft001/crud-shell-angular': '2.145.0',
    });
    expect(info).toHaveBeenCalledWith(
      expect.stringContaining(
        'left alone, @smartsoft001/angular is "file:../angular"',
      ),
    );
  });

  it('should still collapse a group written with ranges', async () => {
    writeJson(tree, 'package.json', {
      dependencies: {
        '@smartsoft001/angular': '^2.145.0',
        '@smartsoft001/crud-shell-angular': '~2.145.0',
      },
    });

    await update(tree);

    expect(Object.keys(readJson(tree, 'package.json').dependencies)).toEqual([
      '@smartsoft001/angular-stack',
    ]);
  });
});

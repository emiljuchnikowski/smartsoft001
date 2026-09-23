/**
 * The Angular libraries ship a compiled stylesheet, and it has to come out of
 * the `build` target itself.
 *
 * For months the stylesheet was compiled by a separate `postbuild` target
 * into the directory `build` declares as its output. The next `build` that
 * hit the cache restored that directory without the file, and because
 * `nx release version` reruns `build` right before packing, no published
 * version ever carried `styles.css` (FRA-389). These tests pin the shape
 * that closes that gap: a cached `styles` target compiles the stylesheet next
 * to ng-package.json, `build` depends on it and copies it as an asset, so the
 * file is part of what `build` produces and restores, and nothing named
 * `postbuild` is left for a script to forget.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);

function readJson(relative) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relative), 'utf8'));
}

/** Every project that builds with ng-packagr, by its project root. */
const angularLibraries = fs
  .globSync('packages/**/ng-package.json', {
    cwd: repoRoot,
    exclude: (name) => name === 'node_modules',
  })
  .map((file) => path.dirname(file))
  .sort();

describe('the Angular libraries compile their stylesheet inside build', () => {
  it('should find the Angular libraries', () => {
    assert.deepEqual(angularLibraries, [
      'packages/crud/shell/angular',
      'packages/shared/angular',
    ]);
  });

  for (const projectRoot of angularLibraries) {
    const project = readJson(path.join(projectRoot, 'project.json'));
    const manifest = readJson(path.join(projectRoot, 'package.json'));
    const { targets } = project;

    it(`${project.name}: styles compiles the stylesheet next to ng-package.json`, () => {
      const styles = targets.styles;

      assert.equal(styles.cache, true);
      assert.deepEqual(styles.outputs, ['{projectRoot}/styles.css']);
      assert.match(
        styles.options.command,
        new RegExp(
          `-i ${projectRoot}/src/lib/styles.css -o ${projectRoot}/styles.css$`,
        ),
      );
    });

    it(`${project.name}: build depends on styles and ships it as an asset`, () => {
      assert.equal(targets.build.executor, '@nx/angular:package');
      assert.ok(targets.build.dependsOn.includes('styles'));
      assert.ok(targets.build.dependsOn.includes('^build'));
      assert.ok(
        targets.build.outputs.includes('{workspaceRoot}/dist/{projectRoot}'),
      );

      const ngPackage = readJson(path.join(projectRoot, 'ng-package.json'));

      assert.ok(ngPackage.assets.includes('styles.css'));
    });

    it(`${project.name}: the generated stylesheet is ignored by git`, () => {
      const ignored = fs.readFileSync(
        path.join(repoRoot, '.gitignore'),
        'utf8',
      );

      assert.match(ignored, new RegExp(`^${projectRoot}/styles.css$`, 'm'));
    });

    it(`${project.name}: has no postbuild target`, () => {
      assert.equal(targets.postbuild, undefined);
    });

    it(`${project.name}: exports the stylesheet as a subpath`, () => {
      assert.equal(manifest.exports?.['./styles.css'], './styles.css');
    });
  }

  it('should not run a postbuild target from the hook or the workflow', () => {
    for (const relative of [
      '.husky/commit-msg',
      '.github/workflows/publish.yml',
    ]) {
      const source = fs.readFileSync(path.join(repoRoot, relative), 'utf8');

      assert.doesNotMatch(source, /postbuild/, relative);
    }
  });
});

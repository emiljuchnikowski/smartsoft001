import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const cli = path.join(here, 'docs-check.mjs');
const fixtures = path.join(
  here,
  '..',
  '..',
  'docs',
  'site',
  'tools',
  '__fixtures__',
);

function run(root, ...args) {
  return spawnSync(process.execPath, [cli, '--root', root, ...args], {
    encoding: 'utf8',
  });
}

describe('docs-check CLI', () => {
  test('exits 0 when a warnings-only repository is checked without --strict', () => {
    const result = run(path.join(fixtures, 'check-warnings'));

    assert.equal(result.status, 0);
    assert.match(result.stdout, /WARN R1/);
    assert.match(result.stdout, /docs-check: 0 errors, 1 warnings/);
  });

  test('exits 1 for the same repository with --strict', () => {
    const result = run(path.join(fixtures, 'check-warnings'), '--strict');

    assert.equal(result.status, 1);
    assert.match(result.stdout, /ERROR R1/);
    assert.match(result.stdout, /docs-check: 1 errors, 0 warnings/);
  });

  test('exits 1 with --strict=R1 when a package page is missing', () => {
    const result = run(path.join(fixtures, 'check-warnings'), '--strict=R1');

    assert.equal(result.status, 1);
    assert.match(result.stdout, /ERROR R1/);
    assert.match(result.stdout, /docs-check: 1 errors, 0 warnings/);
  });

  test('exits 0 with --strict=R1 when only components and skills are missing', () => {
    const result = run(path.join(fixtures, 'check-warnings-r2'), '--strict=R1');

    assert.equal(result.status, 0);
    assert.match(result.stdout, /WARN R2/);
    assert.match(result.stdout, /WARN R3/);
    assert.match(result.stdout, /docs-check: 0 errors, 2 warnings/);
  });

  test('exits 1 for that repository once R2 is strict as well', () => {
    const result = run(
      path.join(fixtures, 'check-warnings-r2'),
      '--strict=R1,R2',
    );

    assert.equal(result.status, 1);
    assert.match(result.stdout, /ERROR R2/);
    assert.match(result.stdout, /WARN R3/);
    assert.match(result.stdout, /docs-check: 1 errors, 1 warnings/);
  });

  test('prints findings of every rule, including rules added after R7', () => {
    const result = run(path.join(fixtures, 'check'));

    assert.equal(result.status, 1);
    assert.match(result.stdout, /ERROR R8 .*bad-pkg\/page\.md/);
    assert.match(result.stdout, /docs-check: 16 errors, 4 warnings/);
  });

  test('exits 1 when a rule fails and prints findings as JSON with --json', () => {
    const result = run(path.join(fixtures, 'check'), '--json');
    const findings = JSON.parse(result.stdout);

    assert.equal(result.status, 1);
    assert.equal(findings.length, 20);
    assert.ok(findings.every((finding) => finding.rule && finding.level));
  });
});

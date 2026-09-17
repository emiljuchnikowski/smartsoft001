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
    assert.match(result.stdout, /WARN R1 /);
    assert.match(result.stdout, /WARN R12 /);
    assert.match(result.stdout, /docs-check: 0 errors, 2 warnings/);
  });

  test('exits 1 for the same repository with --strict', () => {
    const result = run(path.join(fixtures, 'check-warnings'), '--strict');

    assert.equal(result.status, 1);
    assert.match(result.stdout, /ERROR R1 /);
    assert.match(result.stdout, /ERROR R12 /);
    assert.match(result.stdout, /docs-check: 2 errors, 0 warnings/);
  });

  test('exits 1 with --strict=R1 when a package page is missing', () => {
    const result = run(path.join(fixtures, 'check-warnings'), '--strict=R1');

    assert.equal(result.status, 1);
    assert.match(result.stdout, /ERROR R1 /);
    assert.match(result.stdout, /WARN R12 /);
    assert.match(result.stdout, /docs-check: 1 errors, 1 warnings/);
  });

  test('exits 0 with --strict=R1 when only components and skills are missing', () => {
    const result = run(path.join(fixtures, 'check-warnings-r2'), '--strict=R1');

    assert.equal(result.status, 0);
    assert.match(result.stdout, /WARN R2/);
    assert.match(result.stdout, /WARN R3/);
    assert.match(result.stdout, /WARN R9/);
    assert.match(result.stdout, /WARN R12/);
    assert.match(result.stdout, /docs-check: 0 errors, 4 warnings/);
  });

  test('exits 1 for that repository once R2 is strict as well', () => {
    const result = run(
      path.join(fixtures, 'check-warnings-r2'),
      '--strict=R1,R2',
    );

    assert.equal(result.status, 1);
    assert.match(result.stdout, /ERROR R2/);
    assert.match(result.stdout, /WARN R3/);
    assert.match(result.stdout, /WARN R9/);
    assert.match(result.stdout, /docs-check: 1 errors, 3 warnings/);
  });

  test('covers R9 with a bare --strict', () => {
    const result = run(path.join(fixtures, 'check-warnings-r2'), '--strict');

    assert.equal(result.status, 1);
    assert.match(result.stdout, /ERROR R9 Component "badge" has no Storybook/);
    assert.match(result.stdout, /docs-check: 4 errors, 0 warnings/);
  });

  test('exits 1 with --strict=R9 while the other rules still warn', () => {
    const result = run(path.join(fixtures, 'check-warnings-r2'), '--strict=R9');

    assert.equal(result.status, 1);
    assert.match(result.stdout, /WARN R2/);
    assert.match(result.stdout, /WARN R3/);
    assert.match(result.stdout, /ERROR R9/);
    assert.match(result.stdout, /docs-check: 1 errors, 3 warnings/);
  });

  test('warns about unresolved skill references without --strict', () => {
    const result = run(path.join(fixtures, 'check-r10'));

    assert.equal(result.status, 0);
    assert.match(result.stdout, /WARN R10 docs\/skills\/ghost\/page\.md/);
    assert.match(result.stdout, /docs-check: 0 errors, 4 warnings/);
  });

  test('covers R10 with a bare --strict', () => {
    const result = run(path.join(fixtures, 'check-r10'), '--strict');

    assert.equal(result.status, 1);
    assert.match(result.stdout, /ERROR R10 .*unknown skill "nope"/);
    assert.match(result.stdout, /docs-check: 4 errors, 0 warnings/);
  });

  test('exits 1 with --strict=R10 alone', () => {
    const result = run(path.join(fixtures, 'check-r10'), '--strict=R10');

    assert.equal(result.status, 1);
    assert.match(result.stdout, /ERROR R10/);
    assert.match(result.stdout, /docs-check: 4 errors, 0 warnings/);
  });

  test('leaves R10 a warning when another rule is strict', () => {
    const result = run(path.join(fixtures, 'check-r10'), '--strict=R1');

    assert.equal(result.status, 0);
    assert.match(result.stdout, /WARN R10/);
    assert.match(result.stdout, /docs-check: 0 errors, 4 warnings/);
  });

  test('exits 1 for a bare fence even without --strict', () => {
    const result = run(path.join(fixtures, 'check-r11'));

    assert.equal(result.status, 1);
    assert.match(
      result.stdout,
      /ERROR R11 docs\/guides\/fences\/page\.md:8: fenced code block has no language/,
    );
    assert.match(result.stdout, /docs-check: 1 errors, 0 warnings/);
  });

  test('keeps R11 an error when only another rule is strict', () => {
    const result = run(path.join(fixtures, 'check-r11'), '--strict=R1');

    assert.equal(result.status, 1);
    assert.match(result.stdout, /docs-check: 1 errors, 0 warnings/);
  });

  test('warns about a package outside every meta package without --strict', () => {
    const result = run(path.join(fixtures, 'check-r12'));

    assert.equal(result.status, 0);
    assert.match(
      result.stdout,
      /WARN R12 Package "ghost" belongs to no meta package/,
    );
    assert.match(result.stdout, /docs-check: 0 errors, 10 warnings/);
  });

  test('covers R12 with a bare --strict', () => {
    const result = run(path.join(fixtures, 'check-r12'), '--strict');

    assert.equal(result.status, 1);
    assert.match(
      result.stdout,
      /ERROR R12 Package "utils" belongs to more than one meta package/,
    );
    assert.match(result.stdout, /docs-check: 10 errors, 0 warnings/);
  });

  test('exits 1 with --strict=R12 while the other rules still warn', () => {
    const result = run(path.join(fixtures, 'check-r12'), '--strict=R12');

    assert.equal(result.status, 1);
    assert.match(result.stdout, /WARN R1 /);
    assert.match(
      result.stdout,
      /ERROR R12 Package "google" is excluded but also listed in meta package "core"/,
    );
    assert.match(result.stdout, /docs-check: 3 errors, 7 warnings/);
  });

  test('prints findings of every rule, including rules added after R7', () => {
    const result = run(path.join(fixtures, 'check'));

    assert.equal(result.status, 1);
    assert.match(result.stdout, /ERROR R8 .*bad-pkg\/page\.md/);
    assert.match(result.stdout, /WARN R12 Package "alpha"/);
    assert.match(result.stdout, /docs-check: 16 errors, 8 warnings/);
  });

  test('exits 1 when a rule fails and prints findings as JSON with --json', () => {
    const result = run(path.join(fixtures, 'check'), '--json');
    const findings = JSON.parse(result.stdout);

    assert.equal(result.status, 1);
    assert.equal(findings.length, 24);
    assert.ok(findings.every((finding) => finding.rule && finding.level));
  });
});

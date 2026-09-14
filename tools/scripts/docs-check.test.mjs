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

  test('exits 1 when a rule fails and prints findings as JSON with --json', () => {
    const result = run(path.join(fixtures, 'check'), '--json');
    const findings = JSON.parse(result.stdout);

    assert.equal(result.status, 1);
    assert.equal(findings.length, 15);
    assert.ok(findings.every((finding) => finding.rule && finding.level));
  });
});

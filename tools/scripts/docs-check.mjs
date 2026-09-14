/**
 * Checks that the documentation site stays in sync with the workspace:
 * every package, component and skill has a page, every snippet and storybook
 * tag resolves, and no page inlines code that should come from an example.
 *
 * Usage: node tools/scripts/docs-check.mjs [--strict] [--json]
 *
 * Without `--strict` the parity rules (R1-R3) only warn, so the check passes
 * while the pages are still being written. Exits 1 as soon as one error is
 * reported.
 */

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { runAllRules } from '../../docs/site/tools/check-rules.mjs';

const RULES = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'];

function parseArgs(argv) {
  const defaultRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    '..',
  );
  const rootIndex = argv.indexOf('--root');

  return {
    strict: argv.includes('--strict'),
    json: argv.includes('--json'),
    // `--root` is used by the tests to point the check at a fixture workspace.
    repoRoot:
      rootIndex === -1 ? defaultRoot : path.resolve(argv[rootIndex + 1]),
  };
}

function report(findings) {
  for (const rule of RULES) {
    const group = findings.filter((finding) => finding.rule === rule);

    if (!group.length) continue;

    for (const finding of group) {
      console.log(
        `${finding.level.toUpperCase()} ${finding.rule} ${finding.message}`,
      );
    }

    console.log('');
  }
}

const { strict, json, repoRoot } = parseArgs(process.argv.slice(2));

const findings = runAllRules({
  repoRoot,
  docsAppDir: path.join(repoRoot, 'docs', 'site', 'src', 'app'),
  examplesRoot: path.join(repoRoot, 'docs', 'examples'),
  strict,
});

const errors = findings.filter((finding) => finding.level === 'error').length;
const warnings = findings.length - errors;

if (json) {
  console.log(JSON.stringify(findings, null, 2));
} else {
  report(findings);
  console.log(`docs-check: ${errors} errors, ${warnings} warnings`);
}

process.exit(errors ? 1 : 0);

/**
 * Checks that the documentation site stays in sync with the workspace:
 * every package, component and skill has a page, every snippet and storybook
 * tag resolves, no page inlines code that should come from an example, every
 * package page follows the package page skeleton, every component ships a
 * story with a `usage` region, every skill reference resolves, every fenced
 * code block declares a language and every package belongs to exactly one
 * meta package.
 *
 * Usage: node tools/scripts/docs-check.mjs [--strict[=R1,R2]] [--json]
 *
 * Without `--strict` the parity rules (R1-R3, R9, R10 and R12) only warn, so
 * the check passes while the pages are still being written. `--strict`
 * enforces all six, `--strict=R1,R3` only the rules it names, which lets a
 * finished section be enforced while the others are still warnings. Exits 1 as
 * soon as one error is reported.
 */

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { runAllRules } from '../../docs/site/tools/check-rules.mjs';

/** The parity rules `--strict` covers when it names no rule of its own. */
const PARITY_RULES = ['R1', 'R2', 'R3', 'R9', 'R10', 'R12'];

/**
 * The set of rule ids to report as errors: empty without `--strict`, every
 * parity rule for a bare `--strict`, and the listed ids for `--strict=R1,R3`.
 */
function parseStrict(argv) {
  const flag = argv.find(
    (arg) => arg === '--strict' || arg.startsWith('--strict='),
  );

  if (!flag) return new Set();
  if (flag === '--strict') return new Set(PARITY_RULES);

  return new Set(
    flag
      .slice('--strict='.length)
      .split(',')
      .map((rule) => rule.trim().toUpperCase())
      .filter(Boolean),
  );
}

function parseArgs(argv) {
  const defaultRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    '..',
  );
  const rootIndex = argv.indexOf('--root');

  return {
    strict: parseStrict(argv),
    json: argv.includes('--json'),
    // `--root` is used by the tests to point the check at a fixture workspace.
    repoRoot:
      rootIndex === -1 ? defaultRoot : path.resolve(argv[rootIndex + 1]),
  };
}

function report(findings) {
  // `runAllRules` returns the findings rule by rule, so the order in which the
  // rule ids first appear is the rule order. Deriving the groups from the
  // findings means a new rule shows up without touching this file.
  const rules = [...new Set(findings.map((finding) => finding.rule))];

  for (const rule of rules) {
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

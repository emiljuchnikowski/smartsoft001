#!/usr/bin/env node
/**
 * Proves the generated starter works on its own, before it is pushed.
 *
 * `build-starter.mjs` leaves a directory with a lockfile, an installed
 * `node_modules` and one commit. That directory passing is not the proof a
 * newcomer needs: they get the commit, not the directory. So the check clones
 * the commit into a fresh temp dir, the way `git clone` of the starter
 * repository would, installs from the lockfile with `npm ci`, and runs the
 * build and the Jest suites. Same discipline as `verify:dist`: the artefact
 * is tested, not the source.
 *
 * The `Publish` workflow runs it in the `starter` job between generating the
 * starter and pushing it, and fails the push when it fails.
 *
 * Usage: node tools/scripts/verify-starter.mjs <dir>
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * The child environment: no daemon, no cloud and no distribution, because the
 * clone is a workspace of its own that exists for one run, and `CI` so that
 * nothing waits for a terminal.
 */
const CHILD_ENV = {
  ...process.env,
  NX_DAEMON: 'false',
  NX_NO_CLOUD: 'true',
  NX_CLOUD_DISTRIBUTED_EXECUTION: 'false',
  CI: 'true',
};

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, env: CHILD_ENV, stdio: 'inherit' });
}

function heading(text) {
  console.log(`\n=== ${text}`);
}

export function parseArgs(argv) {
  const [dir] = argv;

  if (!dir) throw new Error('usage: verify-starter.mjs <dir>');

  return { source: path.resolve(dir) };
}

function main(argv) {
  const { source } = parseArgs(argv);
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'starter-verify-'));
  const clone = path.join(workspace, 'starter');
  let step = `clone ${source}`;

  try {
    heading(`Cloning the starter from ${source}`);
    run('git', ['clone', '--quiet', source, clone]);

    step = 'install the starter from its lockfile';
    heading(step);
    run('npm', ['ci', '--no-audit', '--no-fund'], clone);

    step = 'build and test the starter';
    heading(step);
    run(
      'npx',
      ['nx', 'run-many', '-t', 'build', 'test', '--skip-nx-cache'],
      clone,
    );

    heading('The starter installs, builds and tests from a clean clone');
    return 0;
  } catch (error) {
    console.error(`\nFAILED: ${step}`);
    console.error(error.message);
    return 1;
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const hook = path.join(here, '../src/plugins/smart-core/hooks/audit_logger.py');

function runHook({ cwd, env = {} }) {
  const result = spawnSync('python3', [hook], {
    cwd,
    env: { ...process.env, CLAUDE_PROJECT_DIR: '', ...env },
    input: JSON.stringify({
      hook_event_name: 'PreToolUse',
      session_id: 'test-session',
      tool_name: 'Bash',
    }),
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr);
}

function logFiles(project) {
  const dir = path.join(project, '.claude', 'audit_logs');

  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((name) => name.endsWith('_audit.jsonl'))
    : [];
}

describe('audit_logger.py', () => {
  test('writes to .claude/audit_logs of CLAUDE_PROJECT_DIR, where the audit-log skill reads', () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-project-'));
    const elsewhere = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-cwd-'));

    runHook({ cwd: elsewhere, env: { CLAUDE_PROJECT_DIR: project } });

    const [file] = logFiles(project);
    assert.match(file, /^\d{8}_audit\.jsonl$/);

    const entry = JSON.parse(
      fs
        .readFileSync(path.join(project, '.claude', 'audit_logs', file), 'utf8')
        .trim(),
    );
    assert.equal(entry.event_type, 'PreToolUse');
    assert.equal(entry.session_id, 'test-session');
    assert.deepEqual(logFiles(elsewhere), []);
  });

  test('falls back to the working directory without CLAUDE_PROJECT_DIR', () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-project-'));

    runHook({ cwd: project });

    assert.equal(logFiles(project).length, 1);
  });
});

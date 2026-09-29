---
title: Installing the plugin
section: Skills
order: 1
nextjs:
  metadata:
    title: Installing the smart plugin
    description: Add the smartsoft marketplace from the npm package, enable the smart plugin in a project and learn what each hook does once it runs.
---

The plugin is distributed through npm and registered in Claude Code as a local marketplace. Three commands install it for a repository; reload Claude Code and its skills, agent and hooks are available in that project. {% .lead %}

---

## Prerequisites

- Claude Code with plugin support (`claude plugin --help` lists the `marketplace`, `install` and `update` commands).
- Python 3 on the path: four of the five hook scripts use it.
- nvm with Node.js 24, plus a working `npm run format` script. The `auto_format.sh` hook runs `source ~/.nvm/nvm.sh && nvm use 24 && npm run format` after every Write or Edit and has no fallback.

## Install

Add the package to the project, register the marketplace it contains, then install the plugin at project scope:

```bash
npm install --save-dev @smartsoft001/claude-plugins
claude plugin marketplace add ./node_modules/@smartsoft001/claude-plugins
claude plugin install smart@smartsoft --scope project
```

The first `npm install` happens before the marketplace and plugin exist, so its best-effort `postinstall` update can do nothing. After the three commands above, later package installs run `claude plugin update smart@smartsoft --scope project`, keeping the installed plugin registration aligned with the package.

The project-scoped install records this entry in `.claude/settings.json`; commit it so the repository enables the same plugin for every contributor:

```json
{
  "enabledPlugins": {
    "smart@smartsoft": true
  }
}
```

{% callout title="Project scope" %}
The `--scope project` flag stores the enabled setting in the repository's `.claude/settings.json`; it does not install the npm dependency or register its local marketplace on another machine. Every contributor must run the install commands themselves. A cloud or CI session does not gain the plugin merely from the committed setting.
{% /callout %}

Restart Claude Code, or run `/reload-plugins` in an open session. Then verify the installation:

```bash
claude plugin list
```

The list should show `smart@smartsoft` as enabled at project scope. Type `/smart:` in Claude Code to confirm that `audit-log`, `format-code` and `scaffold-nx-workspace` are offered.

## What the hooks do

Hooks are declared in `plugins/smart/hooks/hooks.json` and referenced with `${CLAUDE_PLUGIN_ROOT}`, so they work wherever the plugin is installed.

| Hook                        | Event                                     | Matcher             | Behaviour                                                                                                                                                                                                           |
| --------------------------- | ----------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `safety_validator.py`       | PreToolUse                                | `Bash\|Write\|Edit` | Blocks broad recursive deletes, raw-disk writes and filesystem formatting, a fork bomb, selected shell reads of sensitive files, and Write/Edit paths containing env, secret, private-key, PEM or credential names. |
| `sensitive_file_blocker.py` | PreToolUse                                | `Read\|Edit\|Write` | Refuses paths matching `.env`, `secrets` or `credentials`; files ending in `.example` are allowed.                                                                                                                  |
| `skill_validator.py`        | PreToolUse                                | `Write\|Edit`       | Warns about structure problems only when Claude writes a file below `.claude/skills/`. Warnings never block.                                                                                                        |
| `auto_format.sh`            | PostToolUse                               | `Write\|Edit`       | Runs the project's complete `npm run format` pipeline after every matching tool call, not only on the changed file.                                                                                                 |
| `audit_logger.py`           | PreToolUse, PostToolUse, UserPromptSubmit | any                 | Appends one JSON line per event to the project's `.claude/audit_logs/YYYYMMDD_audit.jsonl` and removes files older than 90 days.                                                                                    |

A blocking hook exits with code 2 and a message that Claude shows in the conversation. The [`audit-log`](/docs/skills/audit-log) skill reads the files the last hook writes; add `.claude/audit_logs` to the project's `.gitignore`.

## Customising

The hook scripts keep their patterns in plain lists, and `hooks/CONFIG.md` in the plugin explains how to add patterns, change the log location or add a hook. Edit and publish a fork rather than changing the copy in `node_modules`, which the next package install can replace.

## Source

The plugin lives in [`packages/shared/claude-plugins/src`](https://github.com/emiljuchnikowski/smartsoft001/tree/main/packages/shared/claude-plugins/src); the hook reference is [`plugins/smart/hooks/README.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/plugins/smart/hooks/README.md).

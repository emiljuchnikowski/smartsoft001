---
title: Installing the plugin
section: Skills
order: 1
nextjs:
  metadata:
    title: Installing the smart plugin
    description: Add the smartsoft marketplace from the npm package, enable the smart plugin in a project and learn what each hook does once it runs.
---

The plugin is distributed through npm and registered in Claude Code as a local marketplace. Three commands install it; the hooks then run on every Claude Code session in that project. {% .lead %}

---

## Prerequisites

- Claude Code with plugin support (`claude plugin --help` lists the `marketplace`, `install` and `update` commands).
- Python 3 on the path: four of the five hooks are Python scripts.
- The project's formatter available through `npm run format`, because `auto_format.sh` calls it after every edit.

## Install

Add the package to the project, register the marketplace it contains, then install the plugin at project scope:

```bash
npm install --save-dev @smartsoft001/claude-plugins
claude plugin marketplace add ./node_modules/@smartsoft001/claude-plugins
claude plugin install smart@smartsoft --scope project
```

The package's `postinstall` script runs `claude plugin update smart@smartsoft --scope project` on every install, so once the marketplace is registered the plugin follows the package version. Commit the resulting entry in `.claude/settings.json` so the whole team gets the same plugin:

```json
{
  "enabledPlugins": {
    "smart@smartsoft": true
  }
}
```

{% callout title="Project scope" %}
The `--scope project` flag stores the plugin in the repository's `.claude` directory instead of the user profile. That is what makes the hooks and skills identical for every contributor and for CI.
{% /callout %}

## What the hooks do

Hooks are declared in `plugins/smart/hooks/hooks.json` and referenced with `${CLAUDE_PLUGIN_ROOT}`, so they work wherever the plugin is installed.

| Hook                        | Event                                     | Matcher             | Behaviour                                                                                                                                                                                       |
| --------------------------- | ----------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `safety_validator.py`       | PreToolUse                                | `Bash\|Write\|Edit` | Blocks recursive deletes of the root, the home directory or the whole working directory, raw disk writes and formatting, fork bombs, and shell access to env, private key and credential files. |
| `sensitive_file_blocker.py` | PreToolUse                                | `Read\|Edit\|Write` | Refuses to open env files and any path containing `secrets` or `credentials`; files ending in `.example` are allowed.                                                                           |
| `skill_validator.py`        | PreToolUse                                | `Write\|Edit`       | Warns when a `SKILL.md` being written lacks the expected frontmatter or sections. Warnings only, it never blocks.                                                                               |
| `auto_format.sh`            | PostToolUse                               | `Write\|Edit`       | Runs the formatting pipeline on the file Claude just changed.                                                                                                                                   |
| `audit_logger.py`           | PreToolUse, PostToolUse, UserPromptSubmit | any                 | Appends one JSON line per event to `.claude/audit_logs/YYYYMMDD_audit.jsonl`.                                                                                                                   |

A blocking hook exits with code 2 and a message that Claude shows in the conversation. The [`audit-log`](/docs/skills/audit-log) skill reads the files the last hook writes.

## Customising

The hook scripts keep their patterns in plain lists at the top of each file, and `hooks/CONFIG.md` in the plugin explains how to add patterns, change the log location or add a hook. Because the plugin is installed from `node_modules`, edit a fork of the package rather than the installed copy, or the next `npm install` overwrites the change.

## Source

The plugin lives in [`packages/shared/claude-plugins/src`](https://github.com/emiljuchnikowski/smartsoft001/tree/main/packages/shared/claude-plugins/src); the hook reference is [`plugins/smart/hooks/README.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/plugins/smart/hooks/README.md).

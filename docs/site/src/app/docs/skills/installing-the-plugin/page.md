---
title: Installing the plugin
section: Skills
order: 1
nextjs:
  metadata:
    title: Installing the smartsoft plugins
    description: Add the smartsoft marketplace from the npm package, enable smart-angular or smart-react in a project, migrate from smart@smartsoft and learn what each hook does once it runs.
---

The npm package carries a local Claude Code marketplace, `smartsoft`, with three plugins. A project installs the plugin of its frontend framework, which brings the shared core with it; reload Claude Code and its skills, agent and hooks are available in that project. {% .lead %}

---

## Which plugin a project enables

| Plugin          | Contents                                                                                                                                                         | Enable it in                                             |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `smart-core`    | The hooks, plus the framework-neutral skills `audit-log`, `format-code`, `project-conventions` and `safety-check`.                                               | Every project. The two plugins below install it for you. |
| `smart-angular` | The `angular-components-*` skills and the [`angular-components` agent](/docs/skills/angular-components-agent), `smart-crud` and `scaffold-nx-workspace`.         | Projects that use `@smartsoft001/angular`.               |
| `smart-react`   | The `react-components-*` skills and the [`react-components` agent](/docs/skills/react-components-agent), `react-provider`, `react-forms` and `smart-crud-react`. | Projects that use `@smartsoft001/react`.                 |

`smart-angular` and `smart-react` both declare `smart-core` as a dependency, so installing either one installs the core as well. Enable one framework plugin per project: an Angular project never sees the React skills and a React project never sees the Angular ones. A project with no frontend from the framework, such as a NestJS API, installs `smart-core` on its own.

## Prerequisites

- Claude Code with plugin support (`claude plugin --help` lists the `marketplace`, `install` and `update` commands).
- Python 3 on the path: four of the five hook scripts use it.
- nvm with Node.js 24, plus a working `npm run format` script. The `auto_format.sh` hook runs `source ~/.nvm/nvm.sh && nvm use 24 && npm run format` after every Write or Edit and has no fallback.

## Install

Add the package to the project, register the marketplace it contains, then install the plugin of the project's framework at project scope. In an Angular project:

```bash
npm install --save-dev @smartsoft001/claude-plugins
claude plugin marketplace add ./node_modules/@smartsoft001/claude-plugins
claude plugin install smart-angular@smartsoft --scope project
```

In a React project the last command installs `smart-react` instead:

```bash
claude plugin install smart-react@smartsoft --scope project
```

Either install reports `(+ 1 dependency: smart-core)`. The first `npm install` happens before the marketplace and plugins exist, so its best-effort `postinstall` update can do nothing. After the commands above, later package installs run `claude plugin update` for `smart-core`, `smart-angular` and `smart-react` at project scope, skipping the ones the project has not installed, which keeps the installed plugins aligned with the package.

The project-scoped install records the framework plugin and its dependency in `.claude/settings.json`; commit the file so the repository enables the same plugins for every contributor. An Angular repository commits:

```json
{
  "enabledPlugins": {
    "smart-angular@smartsoft": true,
    "smart-core@smartsoft": true
  }
}
```

A React repository commits:

```json
{
  "enabledPlugins": {
    "smart-react@smartsoft": true,
    "smart-core@smartsoft": true
  }
}
```

`smart-core` comes with the framework plugin as its dependency, and a plugin that an enabled plugin depends on starts enabled even when its own key is missing.

{% callout title="Project scope" %}
The `--scope project` flag stores the enabled setting in the repository's `.claude/settings.json`; it does not install the npm dependency or register its local marketplace on another machine. Every contributor must run the install commands themselves. A cloud or CI session does not gain the plugins merely from the committed setting.
{% /callout %}

Restart Claude Code, or run `/reload-plugins` in an open session. Then verify the installation:

```bash
claude plugin list
```

The list should show the framework plugin and `smart-core@smartsoft` as enabled at project scope. Commands carry the name of the plugin that ships them: type `/smart-core:` in Claude Code to see `audit-log` and `format-code`, and in an Angular project `/smart-angular:` to see `scaffold-nx-workspace`.

## Migrating from smart@smartsoft

Up to now the marketplace shipped one plugin, `smart@smartsoft`, with the Angular skills and the hooks together. Its `renames` map now moves that name to `smart-angular`, so an existing project keeps the Angular skills and gains `smart-core` as their dependency:

1. Update `@smartsoft001/claude-plugins`, then refresh the marketplace with `claude plugin marketplace update smartsoft`. Claude Code rewrites `smart@smartsoft` to `smart-angular@smartsoft` in `enabledPlugins` of the user, project and local settings.
2. Run `claude plugin install smart-angular@smartsoft --scope project` once. It installs the renamed plugin together with `smart-core` and adds `smart-core@smartsoft` to `.claude/settings.json`.
3. Commit the rewritten `.claude/settings.json`.

The commands moved with their skills:

| Before                         | After                                  |
| ------------------------------ | -------------------------------------- |
| `/smart:audit-log`             | `/smart-core:audit-log`                |
| `/smart:format-code`           | `/smart-core:format-code`              |
| `/smart:scaffold-nx-workspace` | `/smart-angular:scaffold-nx-workspace` |
| `smart:angular-components`     | `smart-angular:angular-components`     |

A React project that had enabled `smart@smartsoft` is renamed to `smart-angular` as well. Switch it to its own plugin with `claude plugin uninstall smart-angular@smartsoft --scope project` followed by `claude plugin install smart-react@smartsoft --scope project`. When `smart@smartsoft` is enabled in managed settings, Claude Code cannot rewrite them, so an administrator replaces the key there.

## What the hooks do

The hooks belong to `smart-core`, so every project gets them whichever framework plugin it enables. They are declared in `plugins/smart-core/hooks/hooks.json` and referenced with `${CLAUDE_PLUGIN_ROOT}`, so they work wherever the plugin is installed.

| Hook                        | Event                                     | Matcher             | Behaviour                                                                                                                                                                                                           |
| --------------------------- | ----------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `safety_validator.py`       | PreToolUse                                | `Bash\|Write\|Edit` | Blocks broad recursive deletes, raw-disk writes and filesystem formatting, a fork bomb, selected shell reads of sensitive files, and Write/Edit paths containing env, secret, private-key, PEM or credential names. |
| `sensitive_file_blocker.py` | PreToolUse                                | `Read\|Edit\|Write` | Refuses paths matching `.env`, `secrets` or `credentials`; files ending in `.example` are allowed.                                                                                                                  |
| `skill_validator.py`        | PreToolUse                                | `Write\|Edit`       | Warns about structure problems only when Claude writes a file below `.claude/skills/`. Warnings never block.                                                                                                        |
| `auto_format.sh`            | PostToolUse                               | `Write\|Edit`       | Runs the project's complete `npm run format` pipeline after every matching tool call, not only on the changed file.                                                                                                 |
| `audit_logger.py`           | PreToolUse, PostToolUse, UserPromptSubmit | any                 | Appends one JSON line per event to the project's `.claude/audit_logs/YYYYMMDD_audit.jsonl` and removes files older than 90 days.                                                                                    |

A blocking hook exits with code 2 and a message that Claude shows in the conversation. The [`audit-log`](/docs/skills/audit-log) skill reads the files the last hook writes; add `.claude/audit_logs` to the project's `.gitignore`.

## Customising

The hook scripts keep their patterns in plain lists, and `hooks/CONFIG.md` in the `smart-core` plugin explains how to add patterns, change the log location or add a hook. Edit and publish a fork rather than changing the copy in `node_modules`, which the next package install can replace.

## Source

The marketplace lives in [`packages/shared/claude-plugins/src`](https://github.com/emiljuchnikowski/smartsoft001/tree/main/packages/shared/claude-plugins/src): [`.claude-plugin/marketplace.json`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/.claude-plugin/marketplace.json) lists the three plugins and the rename, and each plugin is a directory under `plugins/`. The hook reference is [`plugins/smart-core/hooks/README.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/plugins/smart-core/hooks/README.md).

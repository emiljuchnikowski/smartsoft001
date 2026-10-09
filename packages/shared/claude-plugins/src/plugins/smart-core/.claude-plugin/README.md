# smart-core Plugin for Claude Code

Smartsoft core - safety validation, audit logging, auto-formatting hooks, and the framework-neutral skills.

`smart-core` is one of the three plugins of the `smartsoft` marketplace. A project enables the
plugin of its framework, `smart-angular` or `smart-react`, and both declare `smart-core` as a
dependency, so the hooks below come with either of them.

| Plugin          | Contents                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------- |
| `smart-core`    | Hooks, `audit-log`, `format-code`, `project-conventions`, `safety-check`                      |
| `smart-angular` | `angular-components-*` skills, `angular-components` agent, `smart-crud`, `scaffold-nx-workspace` |
| `smart-react`   | `react-components-*` skills, `react-components` agent, `react-provider`, `react-forms`, `smart-crud-react` |

## Features

| Feature | Type | Description |
|---------|------|-------------|
| Safety validation | Hook | Blocks destructive bash commands (`rm -rf /`, etc.) |
| Sensitive file protection | Hook | Blocks access to `.env`, credentials, secrets |
| Audit logging | Hook | Logs all Claude actions to `.claude/audit_logs/` |
| Skill validation | Hook | Validates skill file structure (soft warnings) |
| Auto-formatting | Hook | Formats files after Write/Edit operations |
| Safety check | Skill (background) | Safety rules knowledge for Claude |
| Project conventions | Skill (background) | Monorepo conventions and patterns |
| Audit log viewer | Skill (user-invocable) | `/smart-core:audit-log` to query audit logs |
| Format code | Skill (user-invocable) | `/smart-core:format-code` to run formatting |

## Installation

```bash
# Angular project (installs smart-core as a dependency)
claude plugin install smart-angular@smartsoft --scope project
# React project (installs smart-core as a dependency)
claude plugin install smart-react@smartsoft --scope project
```

Installs of the former `smart@smartsoft` plugin are renamed to `smart-angular@smartsoft` by the
marketplace's `renames` map.

## Architecture

```
smart-core/
├── .claude-plugin/
│   ├── plugin.json              # Plugin metadata
│   ├── README.md                # This file
│   ├── settings.template.json   # Deprecated settings template
│   └── merge-permissions.js     # Deprecated merge script
├── hooks/
│   ├── hooks.json               # Hook configuration
│   ├── safety_validator.py      # Blocks destructive commands
│   ├── sensitive_file_blocker.py # Blocks access to sensitive files
│   ├── audit_logger.py          # Logs all Claude actions
│   ├── skill_validator.py       # Validates skill file structure
│   ├── auto_format.sh           # Formats code after changes
│   ├── CONFIG.md                # Hook customization guide
│   └── README.md                # Hook documentation
├── skills/
│   ├── safety-check/SKILL.md    # Background: safety rules
│   ├── audit-log/SKILL.md       # User-invocable: /smart-core:audit-log
│   ├── format-code/SKILL.md     # User-invocable: /smart-core:format-code
│   └── project-conventions/SKILL.md # Background: project knowledge
```

## Skills

### User-Invocable

| Skill | Command | Purpose |
|-------|---------|---------|
| audit-log | `/smart-core:audit-log [today\|yesterday\|YYYYMMDD]` | Query audit logs |
| format-code | `/smart-core:format-code` | Run `npm run format` |

### Background (automatic)

| Skill | Purpose |
|-------|---------|
| safety-check | Blocked patterns and sensitive file rules |
| project-conventions | Nx monorepo structure, conventions, patterns |

## Hooks

Hooks are configured in `hooks/hooks.json` and run automatically:

### PreToolUse

| Hook | Matcher | Purpose |
|------|---------|---------|
| `safety_validator.py` | Bash\|Write\|Edit | Blocks destructive commands |
| `sensitive_file_blocker.py` | Read\|Edit\|Write | Blocks sensitive files |
| `audit_logger.py` | * | Logs all events |
| `skill_validator.py` | Write\|Edit | Validates skill files |

### PostToolUse

| Hook | Matcher | Purpose |
|------|---------|---------|
| `auto_format.sh` | Write\|Edit | Runs formatting pipeline |
| `audit_logger.py` | * | Logs all events |

### UserPromptSubmit

| Hook | Purpose |
|------|---------|
| `audit_logger.py` | Logs user prompts |

## Audit Logs

Logs are stored in `.claude/audit_logs/YYYYMMDD_audit.jsonl`:

```json
{"timestamp":"2024-01-15T10:30:00Z","event_type":"PreToolUse","session_id":"abc123","event_data":{...}}
```

## Customization

See `hooks/CONFIG.md` for:
- Adding custom blocked patterns
- Changing log location
- Creating new hooks

## Migration from Legacy

`settings.template.json` and `merge-permissions.js` are kept for projects that still merge
settings by hand; installing the plugin replaces both.

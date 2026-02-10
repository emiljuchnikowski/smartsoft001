# Smart Plugin for Claude Code

Smartsoft integration - safety validation, audit logging, auto-formatting hooks, and project convention skills.

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
| Audit log viewer | Skill (user-invocable) | `/smart:audit-log` to query audit logs |
| Format code | Skill (user-invocable) | `/smart:format-code` to run formatting |

## Installation

```bash
claude plugin update smart@smartsoft --scope project
```

## Architecture

```
smart/
├── .claude-plugin/
│   ├── plugin.json              # Plugin metadata
│   └── README.md                # This file
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
│   ├── audit-log/SKILL.md       # User-invocable: /smart:audit-log
│   ├── format-code/SKILL.md     # User-invocable: /smart:format-code
│   └── project-conventions/SKILL.md # Background: project knowledge
├── _legacy/
│   ├── settings.template.json   # Deprecated settings template
│   └── merge-permissions.js     # Deprecated merge script
└── MIGRATION.md                 # Migration guide from legacy
```

## Skills

### User-Invocable

| Skill | Command | Purpose |
|-------|---------|---------|
| audit-log | `/smart:audit-log [today\|yesterday\|YYYYMMDD]` | Query audit logs |
| format-code | `/smart:format-code` | Run `npm run format` |

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

If upgrading from the old `settings.template.json` approach, see `MIGRATION.md`.

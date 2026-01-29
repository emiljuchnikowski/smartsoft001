# Smart Plugin for Claude Code

Smartsoft integration - safety validation, audit logging, and auto-formatting hooks.

## Features

| Feature | Description |
|---------|-------------|
| Safety validation | Blocks destructive bash commands (`rm -rf /`, etc.) |
| Sensitive file protection | Blocks access to `.env`, credentials, secrets |
| Audit logging | Logs all Claude actions to `.claude/audit_logs/` |
| Skill validation | Validates skill file structure (soft warnings) |
| Auto-formatting | Formats files after Write/Edit operations |

## Installation

### 1. Enable plugin in project's `.claude/settings.json`:

```json
{
  "enabledPlugins": {
    "smart@smartsoft": true
  }
}
```

### 2. Merge settings from template

**Quick merge script:**

```bash
node node_modules/@smartsoft001/claude-plugins/plugins/smart/.claude-plugin/merge-permissions.js
```

This will:
- Add required permissions (source, nvm, npm run format, jq)
- Configure all hooks (PreToolUse, PostToolUse, UserPromptSubmit)
- Enable the plugin

## Hooks

### PreToolUse Hooks

| Hook | Matcher | Purpose |
|------|---------|---------|
| `safety_validator.py` | Bash\|Write\|Edit | Blocks destructive commands |
| Sensitive file blocker | Read\|Edit\|Write | Blocks `.env`, secrets, credentials |
| `audit_logger.py` | * | Logs all events |
| `skill_validator.py` | Write\|Edit | Validates skill files |

### PostToolUse Hooks

| Hook | Matcher | Purpose |
|------|---------|---------|
| Auto-format | Write\|Edit | `npm run format` after file changes |
| `audit_logger.py` | * | Logs all events |

### UserPromptSubmit Hooks

| Hook | Purpose |
|------|---------|
| `audit_logger.py` | Logs user prompts |

## Permissions

The plugin requires these permissions to function:

```json
{
  "allow": [
    "Bash(source:*)",
    "Bash(nvm use:*)",
    "Bash(npm run format:*)",
    "Bash(jq:*)"
  ]
}
```

## Audit Logs

Logs are stored in `.claude/audit_logs/YYYYMMDD_audit.jsonl`:

```json
{"timestamp": "2024-01-15T10:30:00Z", "event": "PreToolUse", "tool": "Bash", "input": {...}}
{"timestamp": "2024-01-15T10:30:01Z", "event": "PostToolUse", "tool": "Bash", "success": true}
```

## Customization

See `hooks/CONFIG.md` for:
- Adding custom blocked patterns
- Changing log location
- Creating new hooks
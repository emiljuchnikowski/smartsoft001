# Hooks

Claude Code hooks for safety validation, sensitive file protection, formatting, and audit logging.

---

## What Are Hooks?

Hooks are scripts that run at specific points in Claude's workflow:
- **UserPromptSubmit**: When user submits a prompt
- **PreToolUse**: Before a tool executes
- **PostToolUse**: After a tool completes
- **Stop**: When Claude stops responding

**Key insight:** Hooks can modify prompts, block actions, and track state.

---

## Configuration

All hooks are configured in `hooks.json` in this directory. Claude Code reads this file automatically when the plugin is installed.

---

## Current Hooks

| Hook | Event | Purpose |
|------|-------|---------|
| `safety_validator.py` | PreToolUse | Blocks destructive commands |
| `sensitive_file_blocker.py` | PreToolUse | Blocks access to sensitive files |
| `skill_validator.py` | PreToolUse | Validates skill file structure |
| `auto_format.sh` | PostToolUse | Auto-formats after file changes |
| `audit_logger.py` | All events | Logs all actions for audit trail |

---

## Hook Details

### safety_validator.py (PreToolUse)

**Purpose:** Blocks destructive bash commands and sensitive file modifications.

**Matcher:** `Bash|Write|Edit`

**Blocks:**
- `rm -rf /`, `rm -rf ~`, `rm -rf *`
- `dd` disk operations, `mkfs` formatting
- Fork bombs
- Bash access to `.env`, `id_rsa`, `credentials` files

**Exit codes:**
- `0` - Allow
- `2` - Block with message

---

### sensitive_file_blocker.py (PreToolUse)

**Purpose:** Blocks Read/Edit/Write access to sensitive files.

**Matcher:** `Read|Edit|Write`

**Blocked patterns:**
- `.env` files (`.env`, `.env.local`, `.env.production`)
- `secrets` in path
- `credentials` in path

**Exception:** Files ending with `.example` are allowed.

**Exit codes:**
- `0` - Allow
- `2` - Block with message

---

### skill_validator.py (PreToolUse)

**Purpose:** Validates skill files follow correct structure.

**Matcher:** `Write|Edit`

**Checks:**
- YAML frontmatter (name, description)
- Required sections (Purpose, When to Use)
- File length limits
- Resource file references

**Enforcement:** Soft (warns but doesn't block)

---

### auto_format.sh (PostToolUse)

**Purpose:** Auto-formats files after Write/Edit operations.

**Matcher:** `Write|Edit`

**Runs:** `source ~/.nvm/nvm.sh && nvm use 24 && npm run format`

**Requires:** Node.js 24 via nvm

---

### audit_logger.py (All Events)

**Purpose:** Logs all Claude actions for audit trail.

**Log location:** `.claude/audit_logs/YYYYMMDD_audit.jsonl`

**Logged events:**
- PreToolUse (tool name, inputs)
- PostToolUse (tool name, success/failure)
- UserPromptSubmit (prompt text)
- Stop (session end)

---

## Adding New Hooks

1. Create script in this `hooks/` directory
2. Make executable: `chmod +x script.py`
3. Add to `hooks.json` under appropriate event
4. Include `_description` for documentation

Example entry in `hooks.json`:
```json
{
  "_description": "My custom hook: does something useful",
  "matcher": "Write|Edit",
  "hooks": [
    {
      "type": "command",
      "command": "./my-hook.py"
    }
  ]
}
```

See [CONFIG.md](./CONFIG.md) for customization options.

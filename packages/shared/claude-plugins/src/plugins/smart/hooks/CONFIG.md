# Hooks Configuration Guide

This guide explains how to configure and customize the hooks system.

## Current Configuration

The hooks are configured in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "_description": "Safety gate: blocks destructive bash commands",
        "matcher": "Bash|Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node_modules/@smartsoft001/claude-plugins/plugins/smart/hooks/safety_validator.py"
          }
        ]
      },
      {
        "_description": "Block sensitive files with detailed error message",
        "matcher": "Read|Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "FILE=$(jq -r '.tool_input.file_path // empty'); echo \"$FILE\" | grep -qE '(\\.env|secrets|credentials)' && { echo \"BLOCKED: Access denied to sensitive file: $FILE\" >&2; exit 2; } || exit 0"
          }
        ]
      },
      {
        "_description": "Audit trail: logs all PreToolUse events",
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node_modules/@smartsoft001/claude-plugins/plugins/smart/hooks/audit_logger.py"
          }
        ]
      },
      {
        "_description": "Skill validator: soft enforcement warnings for skill files",
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node_modules/@smartsoft001/claude-plugins/plugins/smart/hooks/skill_validator.py"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "_description": "Auto-format files after Write/Edit",
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "source ~/.nvm/nvm.sh && nvm use 24 && npm run format"
          }
        ]
      },
      {
        "_description": "Audit trail: logs all PostToolUse events",
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node_modules/@smartsoft001/claude-plugins/plugins/smart/hooks/audit_logger.py"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "_description": "Audit trail: logs all user prompt submissions",
        "hooks": [
          {
            "type": "command",
            "command": "node_modules/@smartsoft001/claude-plugins/plugins/smart/hooks/audit_logger.py"
          }
        ]
      }
    ]
  }
}
```

---

## Hook Customization

### safety_validator.py

**Add blocked patterns** by editing the script:

```python
DANGEROUS_PATTERNS = [
    r"rm\s+-rf\s+/",
    r"rm\s+-rf\s+~",
    # Add your patterns here
]

SENSITIVE_FILES = [
    ".env",
    "id_rsa",
    # Add your patterns here
]
```

---

### audit_logger.py

**Change log location:**

```python
# Default: .claude/audit_logs/YYYYMMDD_audit.jsonl
LOG_DIR = Path(__file__).parent.parent / "audit_logs"

# Custom location:
LOG_DIR = Path("/var/log/claude-audit")
```

---

## Environment Variables

| Variable             | Purpose                | Default       |
| -------------------- | ---------------------- | ------------- |
| `CLAUDE_PROJECT_DIR` | Project root directory | Auto-detected |
| `SKIP_AUDIT_LOG`     | Disable audit logging  | Not set       |

---

## Hook Execution Order

Hooks run in the order specified in `settings.json`:

**PreToolUse order:**

1. safety_validator.py (can block)
2. sensitive file blocker (can block)
3. audit_logger.py (logs)
4. skill-validator.py (warns)

**PostToolUse order:**

1. auto-format.sh (formats)
2. audit_logger.py (logs)

---

## Selective Hook Enabling

### Safety Only (No Formatting)

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "_description": "Safety gate",
        "matcher": "Bash|Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/safety_validator.py"
          }
        ]
      }
    ]
  }
}
```

---

## Adding New Hooks

### Python Hook Template

```python
#!/usr/bin/env python3
"""My custom hook."""

import json
import sys

def main() -> None:
    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    # Your logic here
    tool_name = data.get("tool_name", "")
    tool_input = data.get("tool_input", {})

    # Exit 0 = allow, Exit 2 = block
    sys.exit(0)

if __name__ == "__main__":
    main()
```

### Shell Hook Template

```bash
#!/bin/bash
set -e

# Read JSON input
INPUT=$(cat)

# Parse with jq
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Your logic here

# Exit 0 = allow, Exit 2 = block
exit 0
```

---

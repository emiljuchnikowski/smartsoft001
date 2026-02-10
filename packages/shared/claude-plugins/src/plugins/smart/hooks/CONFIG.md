# Hooks Configuration Guide

This guide explains how to configure and customize the hooks system.

## Hook Configuration

All hooks are defined in `hooks.json` in this directory:

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
            "command": "./safety_validator.py"
          }
        ]
      }
    ]
  }
}
```

Hook commands use relative paths (e.g., `./safety_validator.py`) resolved from the `hooks/` directory.

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

### sensitive_file_blocker.py

**Add blocked file patterns** by editing:

```python
SENSITIVE_PATTERNS = [
    r"\.env(?:\.|$)",
    r"secrets",
    r"credentials",
    # Add your patterns here
]
```

---

### audit_logger.py

**Change log location:**

```python
# Default: .claude/audit_logs/YYYYMMDD_audit.jsonl
LOG_DIR = Path(__file__).resolve().parent.parent / "audit_logs"

# Custom location:
LOG_DIR = Path("/var/log/claude-audit")
```

---

### auto_format.sh

**Change format command:**

```bash
# Default:
source ~/.nvm/nvm.sh && nvm use 24 && npm run format

# Custom (e.g., without nvm):
npm run format
```

---

## Environment Variables

| Variable             | Purpose                | Default       |
| -------------------- | ---------------------- | ------------- |
| `CLAUDE_HOOK_EVENT`  | Hook event type        | Set by Claude |
| `CLAUDE_SESSION_ID`  | Session identifier     | Set by Claude |
| `CLAUDE_PROJECT_DIR` | Project root directory | Auto-detected |
| `SKIP_AUDIT_LOG`     | Disable audit logging  | Not set       |

---

## Hook Execution Order

Hooks run in the order specified in `hooks.json`:

**PreToolUse order:**

1. safety_validator.py (can block)
2. sensitive_file_blocker.py (can block)
3. audit_logger.py (logs)
4. skill_validator.py (warns)

**PostToolUse order:**

1. auto_format.sh (formats)
2. audit_logger.py (logs)

---

## Selective Hook Enabling

To use only specific hooks, edit `hooks.json` and remove unwanted entries.

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
            "command": "./safety_validator.py"
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

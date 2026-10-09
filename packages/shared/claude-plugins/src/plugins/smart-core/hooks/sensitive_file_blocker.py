#!/usr/bin/env python3
"""
Sensitive File Blocker Hook for Claude Code
=============================================

Blocks Read/Edit/Write access to sensitive files such as .env, secrets,
and credentials. Files ending with .example are allowed.

Exit Codes:
    0 - File access permitted
    2 - File access blocked (sensitive file detected)

Integration:
    Configured as PreToolUse hook in hooks/hooks.json
    Receives tool call JSON via stdin from Claude Code
"""

import json
import re
import sys


SENSITIVE_PATTERNS = [
    r"\.env(?:\.|$)",
    r"secrets",
    r"credentials",
]


def main() -> None:
    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    tool_input = data.get("tool_input", {})
    file_path = tool_input.get("file_path", "")

    if not file_path:
        sys.exit(0)

    # Allow .example files (safe templates without secrets)
    if file_path.endswith(".example"):
        sys.exit(0)

    for pattern in SENSITIVE_PATTERNS:
        if re.search(pattern, file_path, re.IGNORECASE):
            print(
                f"BLOCKED: Access denied to sensitive file: {file_path}",
                file=sys.stderr,
            )
            sys.exit(2)

    sys.exit(0)


if __name__ == "__main__":
    main()

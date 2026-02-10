---
name: audit-log
description: Query and analyze Claude Code audit logs
user-invocable: true
allowed-tools: Bash, Read, Grep, Glob
---

# Audit Log

Query and analyze the Claude Code audit trail stored in `.claude/audit_logs/`.

## Purpose

Provide easy access to audit logs that track all Claude Code actions, including tool usage, prompt submissions, and session activity.

## When to Use

Use `/smart:audit-log` when you need to:

- Review what actions Claude took during a session
- Debug unexpected behavior by checking the audit trail
- Verify that safety validators blocked dangerous commands
- Analyze tool usage patterns

## Arguments

```
/smart:audit-log [today|yesterday|YYYYMMDD]
```

- **today** (default) — Show today's audit log
- **yesterday** — Show yesterday's audit log
- **YYYYMMDD** — Show log for a specific date (e.g., `20260210`)

## Log Location

```
.claude/audit_logs/YYYYMMDD_audit.jsonl
```

Each line is a JSON object with:

- `timestamp` — ISO 8601 UTC timestamp
- `event_type` — Hook event (PreToolUse, PostToolUse, UserPromptSubmit, Stop)
- `session_id` — Unique session identifier
- `event_data` — Full event payload

## Instructions

1. Determine the target date from the argument (default: today)
2. Construct the log file path: `.claude/audit_logs/YYYYMMDD_audit.jsonl`
3. Check if the file exists using Glob
4. Read the file and parse JSONL entries
5. Present a summary:
   - Total events count
   - Breakdown by event type
   - Any blocked actions (exit code 2)
   - Timeline of key actions

### Filtering Examples

To filter by tool name:

```bash
grep '"tool_name":"Bash"' .claude/audit_logs/YYYYMMDD_audit.jsonl
```

To filter by event type:

```bash
grep '"event_type":"PreToolUse"' .claude/audit_logs/YYYYMMDD_audit.jsonl
```

To show only blocked actions:

```bash
grep 'BLOCKED' .claude/audit_logs/YYYYMMDD_audit.jsonl
```

## Output Format

Present results as a readable summary table, not raw JSON. Group events chronologically and highlight any safety blocks or errors.

---
title: audit-log
section: Skills
order: 2
skill: audit-log
nextjs:
  metadata:
    title: /smart:audit-log
    description: Summarise the audit trail the plugin's hooks write for a day, with counts by event type, blocked actions and a timeline.
---

{% skill name="audit-log" /%}

## What it does

Every hook event of a session lands in `.claude/audit_logs/YYYYMMDD_audit.jsonl`, one JSON object per line with a timestamp, the event type, the session id and the full event payload. The skill reads the file for one day and turns it into a readable summary instead of raw JSON: the total number of events, a breakdown by event type, every action a safety hook blocked, and a chronological list of the key actions.

## When to use it

- To review what Claude did during a session, for example before approving a pull request it prepared.
- To debug unexpected behaviour by following the tool calls in order.
- To confirm that `safety_validator` or `sensitive_file_blocker` actually blocked a command.
- To look at tool usage patterns across a day.

## Invocation and arguments

```text
/smart:audit-log [today|yesterday|YYYYMMDD]
```

Without an argument the skill reads today's file. `yesterday` and an explicit `YYYYMMDD` date select another day. The skill reports when no file exists for the requested date, which means no Claude Code session ran in the project that day or the plugin was not installed yet.

## What it produces

A summary table in the conversation, grouped chronologically, with safety blocks and errors highlighted. Nothing is written to disk. For ad-hoc questions the log files are plain JSONL, so `grep` on `"tool_name":"Bash"`, `"event_type":"PreToolUse"` or `BLOCKED` works as well.

## Source

Defined in [`skills/audit-log/SKILL.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/plugins/smart/skills/audit-log/SKILL.md); the log format is produced by [`hooks/audit_logger.py`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/plugins/smart/hooks/audit_logger.py).

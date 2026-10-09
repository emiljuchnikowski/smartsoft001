---
title: audit-log
section: Skills
order: 2
skill: audit-log
nextjs:
  metadata:
    title: /smart-core:audit-log
    description: Summarise the audit trail the plugin's hooks write for a day, with counts by event type, blocked actions and a timeline.
---

{% skill name="audit-log" /%}

This command comes with the [`smart-core@smartsoft` plugin](/docs/skills/installing-the-plugin), which `smart-angular` and `smart-react` install as their dependency. Install the plugin of your framework and reload Claude Code before invoking the skill.

## What it does

The `audit_logger` hook writes every hook event to the project's `.claude/audit_logs/YYYYMMDD_audit.jsonl`. The skill reads one day's file and turns its JSON objects into a readable summary: the total number of events, a breakdown by event type, blocked actions and a chronological list of key actions. Each entry contains a timestamp, event type, session id and the full hook payload.

## When to use it

- To review what Claude did during a session, for example before approving a pull request it prepared.
- To debug unexpected behaviour by following the tool calls in order.
- To confirm that `safety_validator` or `sensitive_file_blocker` actually blocked a command.
- To look at tool usage patterns across a day.

## Invocation and arguments

```text
/smart-core:audit-log [today|yesterday|YYYYMMDD]
```

Without an argument the skill reads today's project-local file. `yesterday` and an explicit `YYYYMMDD` date select another day. A missing file means no session ran in the project that day or the plugin was not installed yet.

## What it produces

A summary table in the conversation, grouped chronologically, with safety blocks and errors highlighted. The skill does not write anything. For ad-hoc questions, the log files are plain JSONL, so `grep` on `"tool_name":"Bash"`, `"event_type":"PreToolUse"` or `BLOCKED` works as well.

## Source

Defined in [`skills/audit-log/SKILL.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/plugins/smart-core/skills/audit-log/SKILL.md); the log format is produced by [`hooks/audit_logger.py`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/plugins/smart-core/hooks/audit_logger.py).

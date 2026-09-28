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

This command requires the [`smart@smartsoft` plugin](/docs/skills/installing-the-plugin). Install it and reload Claude Code before invoking the skill.

## What it does

The skill looks for `.claude/audit_logs/YYYYMMDD_audit.jsonl`, then turns one day's JSON objects into a readable summary: the total number of events, a breakdown by event type, blocked actions and a chronological list of key actions. Each entry contains a timestamp, event type, session id and the full hook payload.

{% callout title="Current plugin limitation" %}
The installed `audit_logger.py` writes under `${CLAUDE_PLUGIN_ROOT}/audit_logs`, rather than to the project path this skill reads. With the documented local marketplace install, that is normally `node_modules/@smartsoft001/claude-plugins/plugins/smart/audit_logs`. `/smart:audit-log` can therefore report no file even after hooks ran; this needs a plugin fix, not a different skill argument.
{% /callout %}

## When to use it

- To review what Claude did during a session, for example before approving a pull request it prepared.
- To debug unexpected behaviour by following the tool calls in order.
- To confirm that `safety_validator` or `sensitive_file_blocker` actually blocked a command.
- To look at tool usage patterns across a day.

## Invocation and arguments

```text
/smart:audit-log [today|yesterday|YYYYMMDD]
```

Without an argument the skill reads today's project-local file. `yesterday` and an explicit `YYYYMMDD` date select another day. A missing file can mean no session ran that day, the plugin was not installed, or the hook wrote only to its current cache-relative location described above.

## What it produces

A summary table in the conversation, grouped chronologically, with safety blocks and errors highlighted. The skill does not write anything. For ad-hoc questions, any log file you locate is plain JSONL, so `grep` on `"tool_name":"Bash"`, `"event_type":"PreToolUse"` or `BLOCKED` works as well.

## Source

Defined in [`skills/audit-log/SKILL.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/plugins/smart/skills/audit-log/SKILL.md); the log format is produced by [`hooks/audit_logger.py`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/plugins/smart/hooks/audit_logger.py).

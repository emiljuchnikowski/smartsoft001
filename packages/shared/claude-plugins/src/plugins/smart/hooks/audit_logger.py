#!/usr/bin/env python3
"""
Claude Code Audit Logger

Comprehensive audit trail for all Claude Code hook events.
Logs are stored in JSONL format with ISO timestamps for easy parsing and sorting.

Features:
- Daily log rotation with yyyymmdd_audit.jsonl naming format
- ISO 8601 timestamps (UTC) for consistent sorting
- Automatic cleanup of logs older than 90 days
- Captures all hook events: PreToolUse, PostToolUse, Stop, UserPromptSubmit

Log location: <project>/.claude/audit_logs/, where <project> is
CLAUDE_PROJECT_DIR (set by Claude Code for hooks) or the working directory
Log format: JSONL (one JSON object per line)

Each log entry contains:
- timestamp: ISO 8601 UTC timestamp
- event_type: The Claude hook event type
- session_id: Unique session identifier
- event_data: Full event payload from stdin

Usage:
    Configure in .claude/settings.json hooks section
"""

import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path


def get_log_directory() -> Path:
    """Get or create the project's .claude/audit_logs directory.

    The log belongs to the project, where the audit-log skill reads it, not
    to the plugin: the script itself lives in the installed plugin, usually
    under node_modules, so a path relative to it lands where nobody looks.
    """
    project_dir = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
    log_dir = Path(project_dir) / ".claude" / "audit_logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    return log_dir


def get_iso_timestamp() -> str:
    """Get current UTC timestamp in ISO 8601 format."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def get_log_filename() -> str:
    """Get log filename in yyyymmdd_audit.jsonl format."""
    return datetime.now(timezone.utc).strftime("%Y%m%d") + "_audit.jsonl"


def parse_event_data() -> dict:
    """Parse event data from stdin."""
    try:
        return json.load(sys.stdin)
    except json.JSONDecodeError as e:
        return {"parse_error": str(e), "raw_input": "Could not read stdin"}
    except Exception as e:
        return {"error": str(e)}


def rotate_old_logs(log_dir: Path, retention_days: int = 90) -> None:
    """Remove log files older than retention period."""
    cutoff_time = time.time() - (retention_days * 24 * 60 * 60)

    for old_log in log_dir.glob("*_audit.jsonl"):
        try:
            if old_log.stat().st_mtime < cutoff_time:
                old_log.unlink()
        except OSError:
            pass  # Ignore errors during cleanup


def write_audit_entry(log_dir: Path, entry: dict) -> None:
    """Write audit entry to daily log file."""
    log_file = log_dir / get_log_filename()

    with open(log_file, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False, separators=(",", ":")) + "\n")


def main() -> None:
    """Main entry point for audit logging."""
    log_dir = get_log_directory()

    event_data = parse_event_data()
    if not isinstance(event_data, dict):
        event_data = {"payload": event_data}

    # Claude Code sends the event name and the session id in the stdin payload;
    # the environment variables are a fallback for other callers.
    audit_entry = {
        "timestamp": get_iso_timestamp(),
        "event_type": event_data.get("hook_event_name")
        or os.environ.get("CLAUDE_HOOK_EVENT", "unknown"),
        "session_id": event_data.get("session_id")
        or os.environ.get("CLAUDE_SESSION_ID", "unknown"),
        "event_data": event_data,
    }

    # Write to log file
    write_audit_entry(log_dir, audit_entry)

    # Rotate old logs (runs on each call, but fast due to glob)
    rotate_old_logs(log_dir)

    sys.exit(0)


if __name__ == "__main__":
    main()

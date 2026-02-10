---
name: safety-check
description: Safety validation rules for blocking destructive operations
user-invocable: false
---

# Safety Check

Background skill that provides safety validation knowledge. Claude uses these rules automatically when evaluating tool calls.

## Purpose

Prevent destructive operations from executing by defining blocked patterns for bash commands, file operations, and sensitive file access.

## Blocked Bash Patterns

The following command patterns are blocked when detected in Bash tool calls:

### Recursive Deletion

- `rm -rf /` — recursive delete root filesystem
- `rm -rf /*` — recursive delete root contents
- `rm -rf ~` — recursive delete home directory
- `rm -rf $HOME` — recursive delete home directory
- `rm -rf *` — recursive delete all files
- Covers variations: `-rf`, `-r -f`, `--recursive --force`, `-fr`, etc.

### Disk Operations

- `dd if=/dev/zero of=/dev/...` — disk wiping
- `dd of=/dev/...` — writing to raw devices
- `> /dev/sda` — overwrite disk via redirect
- `mkfs.*` — formatting filesystems

### System Attacks

- `:(){ :|:& };:` — fork bomb

### Sensitive File Access via Bash

Commands like `cat`, `head`, `tail`, `cp` targeting:

- `.env` files
- `.secret` files
- `id_rsa`, `id_ed25519` SSH keys
- `.pem` certificate files
- `credentials` files

## Sensitive File Patterns

Direct file access (Read/Write/Edit tools) is blocked for paths containing:

| Pattern       | Description                |
| ------------- | -------------------------- |
| `.env`        | Environment variable files |
| `.secret`     | Secret configuration files |
| `id_rsa`      | RSA SSH private keys       |
| `id_ed25519`  | Ed25519 SSH private keys   |
| `id_ecdsa`    | ECDSA SSH private keys     |
| `.pem`        | Certificate/key files      |
| `credentials` | Credential files           |

## Exception: `.example` Files

Files ending with `.example` are **always allowed**. These are safe template files without actual secrets:

- `.env.example` — safe to read for structure reference
- `.secret.example` — safe to read for structure reference

## When to Use

This skill is applied automatically. Claude should be aware of these safety rules when:

- Executing bash commands
- Reading, writing, or editing files
- Suggesting commands to users

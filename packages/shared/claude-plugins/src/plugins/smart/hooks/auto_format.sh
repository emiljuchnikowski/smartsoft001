#!/bin/bash
# Auto-format hook for Claude Code
#
# Runs the project's formatting pipeline (nx format + lint --fix)
# after Write/Edit operations.
#
# Requires Node.js 24 via nvm.

set -e

source ~/.nvm/nvm.sh && nvm use 24 && npm run format

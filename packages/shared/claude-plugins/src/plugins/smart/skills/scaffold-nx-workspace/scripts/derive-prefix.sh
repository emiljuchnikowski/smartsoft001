#!/usr/bin/env bash
# Propose an import-alias prefix from a workspace folder name.
#
# This is a PROPOSAL only — the skill must present the candidate to the user
# via AskUserQuestion and require explicit confirm/override. The prefix
# permanently shapes every import (e.g. @<prefix>/angular), so it is never
# applied without confirmation.
#
# Usage: derive-prefix.sh [workspace-folder-name]
#   Defaults to the basename of the current directory.
#
# Heuristic:
#   - lowercase; non-alphanumeric -> spaces
#   - drop noise tokens (mobilems, muzeum, museum, projekt, project, app, web,
#     www, front, frontend, site, deploy)
#   - multiple remaining tokens -> initials (e.g. "acme art gallery" -> "aag")
#   - single token -> first 3 letters
#   - nothing left -> "app"
set -euo pipefail

raw="${1:-$(basename "$PWD")}"

cleaned="$(printf '%s' "$raw" | tr '[:upper:]' '[:lower:]' | tr -c '[:alnum:]' ' ')"

noise=" mobilems muzeum museum projekt project app web www front frontend site deploy "
tokens=()
for tok in $cleaned; do
  case "$noise" in
    *" $tok "*) continue ;;
  esac
  tokens+=("$tok")
done

if [ "${#tokens[@]}" -eq 0 ]; then
  candidate="app"
elif [ "${#tokens[@]}" -eq 1 ]; then
  candidate="$(printf '%s' "${tokens[0]}" | cut -c1-3)"
else
  candidate=""
  for tok in "${tokens[@]}"; do
    candidate="${candidate}$(printf '%s' "$tok" | cut -c1)"
  done
fi

printf '%s\n' "$candidate"

#!/usr/bin/env bash
# Read-only, install-free structural verification of a scaffolded base workspace.
# Also reused as the self-validation grader spine.
#
# Usage: verify-scaffold.sh <workspace-root> <prefix>
# Exits non-zero if any check fails; prints a PASS/FAIL checklist.
set -uo pipefail

ROOT="${1:?usage: verify-scaffold.sh <workspace-root> <prefix>}"
PREFIX="${2:?usage: verify-scaffold.sh <workspace-root> <prefix>}"

fail=0
pass() { printf '  PASS  %s\n' "$1"; }
err()  { printf '  FAIL  %s\n' "$1"; fail=1; }

# exists <relative-path> <label>
exists() {
  if [ -e "$ROOT/$1" ]; then pass "$2"; else err "$2 (missing: $1)"; fi
}

# contains <relative-path> <pattern> <label>
contains() {
  if [ -f "$ROOT/$1" ] && grep -qF "$2" "$ROOT/$1"; then
    pass "$3"
  else
    err "$3 (expected '$2' in $1)"
  fi
}

# absent <relative-path> <pattern> <label>
absent() {
  if [ -f "$ROOT/$1" ] && grep -qF "$2" "$ROOT/$1"; then
    err "$3 (unexpected '$2' in $1)"
  else
    pass "$3"
  fi
}

# json_parses <relative-path>
json_parses() {
  if [ -f "$ROOT/$1" ]; then
    if node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" "$ROOT/$1" 2>/dev/null; then
      pass "valid JSON: $1"
    else
      err "invalid JSON: $1"
    fi
  fi
}

echo "Verifying scaffold at: $ROOT (prefix: $PREFIX)"
echo "--- structure ---"
exists "apps/web/src/main.ts" "apps/web main.ts"
exists "apps/web/src/main.server.ts" "apps/web main.server.ts"
exists "apps/web/src/server.ts" "apps/web server.ts"
exists "apps/web/src/app/app.config.server.ts" "apps/web app.config.server.ts"
exists "libs/shared/angular/src/index.ts" "shared lib index.ts"

echo "--- config ---"
contains "tsconfig.base.json" "@$PREFIX/angular" "tsconfig path alias @$PREFIX/angular"
absent  "tsconfig.base.json" "/domain" "tsconfig has no feature-lib (domain) path aliases"
absent  "tsconfig.base.json" "/shell/" "tsconfig has no feature-lib (shell) path aliases"
absent  "nx.json" "nxCloudId" "nx.json has no nxCloudId"
contains "nx.json" "@angular/build:application" "nx.json build targetDefault"
contains "nx.json" "@nx/eslint:lint" "nx.json lint targetDefault"
contains "nx.json" "@nx/jest:jest" "nx.json jest targetDefault"
contains "eslint.config.mjs" "@$PREFIX/**" "eslint pathGroup @$PREFIX/**"

echo "--- toolchain ---"
# .nvmrc must exist and hold a version (the value is derived from Angular, not fixed here)
if [ -f "$ROOT/.nvmrc" ] && tr -d '[:space:]' < "$ROOT/.nvmrc" | grep -qE '^v?[0-9]+(\.[0-9]+){0,2}$'; then
  pass ".nvmrc holds a Node version ($(tr -d '[:space:]' < "$ROOT/.nvmrc"))"
else
  err ".nvmrc holds a Node version"
fi

echo "--- no feature deps ---"
for dep in "@ngrx/" "@ngx-translate/" "@nestjs/" "leaflet" "openseadragon" \
           "masonry-layout" "@thisissoon/angular-masonry" "mongodb" "typeorm" \
           "tailwindcss" "@smartsoft001/crud-shell-angular" "@smartsoft001-mobilems/"; do
  absent "package.json" "$dep" "package.json excludes $dep"
done

echo "--- JSON validity ---"
json_parses "nx.json"
json_parses "tsconfig.base.json"
json_parses "package.json"
json_parses "apps/web/project.json"
json_parses "libs/shared/angular/project.json"
json_parses ".claude/settings.json"

echo "---"
if [ "$fail" -eq 0 ]; then
  echo "RESULT: PASS"
else
  echo "RESULT: FAIL"
fi
exit "$fail"

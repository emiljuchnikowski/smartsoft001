#!/usr/bin/env bash
#
# Installation smoke test for the published `@smartsoft001/*` packages.
#
# The `# #region <name>` blocks below are inlined into the documentation's
# Installation page by docs/site/tools/snippets.mjs, so their bodies are the
# literal commands a user is told to run. Everything the user does not need to
# see (the throwaway working directory, the registry probing, the timing) lives
# outside the regions.
#
# Each region body is wrapped in a shell function that the script actually
# calls, so the documented commands and the executed commands can never drift
# apart.
#
# Environment:
#   NPM_INSTALL_FLAGS  extra flags appended to every `npm install` (default
#                      empty). Local diagnosis only, never set in CI.
set -Eeuo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
SCOPE='@smartsoft001'

# Split NPM_INSTALL_FLAGS into an array so the flags survive word splitting.
NPM_INSTALL_FLAGS="${NPM_INSTALL_FLAGS:-}"
read -ra npm_extra_flags <<<"$NPM_INSTALL_FLAGS"

step='startup'
trap 'echo "FAILED: installation smoke test failed during step \"${step}\"" >&2' ERR

# Appends NPM_INSTALL_FLAGS to `npm install` so the documented `npm install`
# lines stay free of diagnostic flags.
npm() {
  if [ "${1:-}" = 'install' ]; then
    shift
    command npm install "$@" ${npm_extra_flags[@]+"${npm_extra_flags[@]}"}
  else
    command npm "$@"
  fi
}

check_prerequisites() {
  # #region prerequisites
  # Node.js ^22.12 or >= 26, npm >= 10
  node --version
  npm --version
  # #endregion
}

create_project() {
  # #region create-project
  mkdir my-app && cd my-app
  npm init -y
  # #endregion
}

install_angular() {
  # #region install-angular
  npm install @smartsoft001/angular-stack
  # #endregion
}

install_nestjs() {
  # #region install-nestjs
  npm install @smartsoft001/nestjs-stack
  # #endregion
}

install_payments() {
  # #region install-payments
  npm install @smartsoft001/payments-stack
  # #endregion
}

install_core_only() {
  # #region install-core
  npm install @smartsoft001/core
  # #endregion
}

# Fails unless the running Node.js satisfies `^22.12 || >= 26`.
require_node_version() {
  local version major minor
  version="$(node --version)"
  version="${version#v}"
  major="${version%%.*}"
  minor="${version#*.}"
  minor="${minor%%.*}"

  if [ "$major" -ge 26 ]; then return 0; fi
  if [ "$major" -eq 22 ] && [ "$minor" -ge 12 ]; then return 0; fi

  echo "Node.js v${version} is too old: this project needs ^22.12 or >= 26." >&2

  return 1
}

step='check prerequisites'
check_prerequisites
require_node_version

step='create an empty project'
workspace="$(mktemp -d)"
trap 'rm -rf "$workspace"' EXIT
cd "$workspace"
create_project

step='install the Angular stack'
install_angular

step='install the NestJS stack'
install_nestjs

step='install the payments stack'
install_payments

# The stacks are the documented path, but every package is also published on its
# own and a project is free to install one directly. This second, throwaway
# project checks that parity: each published package, installed by itself. It
# deliberately does NOT share the project above, because mixing exact pins from a
# stack with `latest` for the same library is how a release-window mismatch turns
# into an unresolvable tree.
# A stack is nothing but pinned dependencies, so the check that matters is that
# installing one brings the libraries it names. `require.resolve` rather than
# `require`: the published tarballs declare `"type": "commonjs"` but ship ES
# module source in `src/index.js`, so neither `require()` nor `import()` can load
# them from a plain project. Resolving the entry points still proves the packages
# installed and are reachable, which is what this smoke test is about.
step='resolve the packages the stacks pulled in'
node -e "require.resolve('@smartsoft001/utils'); require.resolve('@smartsoft001/models'); require.resolve('@smartsoft001/angular'); require.resolve('@smartsoft001/nestjs'); console.log('ok')"

step='create a second project for the per-package check'
per_package_workspace="$(mktemp -d)"
trap 'rm -rf "$workspace" "$per_package_workspace"' EXIT
cd "$per_package_workspace"
npm init -y >/dev/null

step='resolve the published packages'
inventory="$(node --input-type=module -e "import { packageInventory } from '${REPO_ROOT}/docs/site/tools/check-rules.mjs'; console.log(packageInventory('${REPO_ROOT}').join(' '))")"
published=()

for name in $inventory; do
  if npm view "${SCOPE}/${name}" version --silent >/dev/null 2>&1; then
    published+=("${SCOPE}/${name}")
  else
    echo "WARN: ${SCOPE}/${name} is not published on npm, skipping"
  fi
done

if [ "${#published[@]}" -eq 0 ]; then
  echo "No ${SCOPE}/* package is published on npm." >&2
  exit 1
fi

step='install every published package'
npm install --no-audit --no-fund "${published[@]}"


step='resolve the individually installed packages'
node -e "require.resolve('@smartsoft001/utils'); require.resolve('@smartsoft001/models'); console.log('ok')"

trap - ERR
echo "Installed the stacks and ${#published[@]} individual ${SCOPE}/* packages in ${SECONDS}s."

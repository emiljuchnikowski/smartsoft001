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

# How often, and how far apart, an install that names a version the registry
# does not serve yet is tried again.
INSTALL_ATTEMPTS="${INSTALL_ATTEMPTS:-6}"
INSTALL_RETRY_SECONDS="${INSTALL_RETRY_SECONDS:-30}"

# Appends NPM_INSTALL_FLAGS to `npm install` so the documented `npm install`
# lines stay free of diagnostic flags.
#
# A release reaches the registry one package at a time, and the Docs workflow
# starts the moment Publish ends. For a minute or so a stack can depend on a
# version of one of its packages that the registry does not serve yet, and npm
# fails with ETARGET ("No matching version found"). That is the registry
# catching up, not a broken release, so such an install is tried again; any
# other failure fails at once.
npm() {
  if [ "${1:-}" != 'install' ]; then
    command npm "$@"
    return
  fi

  shift

  local attempt log
  log="$(mktemp)"

  for ((attempt = 1; ; attempt++)); do
    if command npm install "$@" ${npm_extra_flags[@]+"${npm_extra_flags[@]}"} 2>&1 | tee "$log"; then
      rm -f "$log"
      return 0
    fi

    if ! grep -q 'ETARGET' "$log" || ((attempt >= INSTALL_ATTEMPTS)); then
      rm -f "$log"
      return 1
    fi

    echo "npm install: a version is not on the registry yet; retrying in ${INSTALL_RETRY_SECONDS}s (attempt ${attempt} of ${INSTALL_ATTEMPTS})" >&2
    sleep "$INSTALL_RETRY_SECONDS"
  done
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

install_react() {
  # #region install-react
  npm install @smartsoft001/react-stack react react-dom
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

install_full_stack() {
  # #region install-full-stack
  npm install @smartsoft001/full-stack
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

step='install the React stack'
install_react

step='install the NestJS stack'
install_nestjs

step='install the payments stack'
install_payments

step='install the full stack'
install_full_stack

# The stacks are the documented path, but every package is also published on its
# own and a project is free to install one directly. This second, throwaway
# project checks that parity: each published package, installed by itself. It
# deliberately does NOT share the project above, because mixing exact pins from a
# stack with `latest` for the same library is how a release-window mismatch turns
# into an unresolvable tree.
# A stack is nothing but pinned dependencies, so the check that matters is that
# installing one brings the libraries it names. The Node libraries are loaded
# rather than merely resolved, because being installable and being loadable are
# different claims and only the second one is worth anything to a consumer.
# `@smartsoft001/angular` is resolved instead: it is an Angular library whose
# entry points are ESM bundles meant for a bundler, and executing one in bare
# Node would prove nothing. The React libraries are resolved too, with the
# stylesheets the Installation page tells a React application to import.
step='load the packages the stacks pulled in'
node -e "require('@smartsoft001/utils'); require('@smartsoft001/models'); require('@smartsoft001/nestjs'); require.resolve('@smartsoft001/angular'); require.resolve('@smartsoft001/react'); require.resolve('@smartsoft001/react/styles.css'); require.resolve('@smartsoft001/crud-shell-react/styles.css'); console.log('ok')"

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


step='load the individually installed packages'
node -e "require('@smartsoft001/utils'); require('@smartsoft001/models'); console.log('ok')"

trap - ERR
echo "Installed the stacks and ${#published[@]} individual ${SCOPE}/* packages in ${SECONDS}s."

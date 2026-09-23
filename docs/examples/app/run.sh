#!/usr/bin/env bash
#
# Runs the example application. `./run.sh up` starts MongoDB and the API,
# `./run.sh web` the frontend, `./run.sh test` the Jest suites and
# `./run.sh e2e` the Playwright suite against the running stack.
#
# The `# #region <name>` blocks are inlined into the documentation's Example
# application page by docs/site/tools/snippets.mjs. Each of them is the body
# of a function this script calls, so the documented commands and the executed
# ones are the same lines.
set -Eeuo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$REPO_ROOT"

up() {
  # #region up
  # MongoDB and the API on http://localhost:3000/api
  docker compose -f docs/examples/app/docker-compose.yml up
  # #endregion
}

web() {
  # #region web
  # The frontend on http://localhost:4200, proxying /api to the API
  npx nx serve docs-examples-app-web
  # #endregion
}

unit() {
  # #region test
  # Jest: the model, the API services, the Angular services and pages
  npx nx run-many -t test -p docs-examples-app-model docs-examples-app-api docs-examples-app-web
  # #endregion
}

e2e() {
  # #region e2e
  # Playwright against MongoDB on localhost:27017; the API and the frontend are started for you
  RUN_EXAMPLE_APP_E2E=1 npx nx test docs-examples-app-web-e2e
  # #endregion
}

case "${1:-}" in
  up) up ;;
  web) web ;;
  test) unit ;;
  e2e) e2e ;;
  *)
    echo "usage: $0 up|web|test|e2e" >&2
    exit 64
    ;;
esac

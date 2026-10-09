#!/usr/bin/env bash
#
# Runs the example application. `./run.sh up` starts MongoDB and the API,
# `./run.sh web` the Angular frontend, `./run.sh web-react` the React one,
# `./run.sh test` the Jest suites, and `./run.sh e2e` and `./run.sh e2e-react`
# the Playwright suite against the running stack, with the Angular and the
# React frontend respectively.
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

web_react() {
  # #region web-react
  # The React frontend on http://localhost:4300, proxying /api to the API
  npx nx serve docs-examples-app-web-react
  # #endregion
}

unit() {
  # #region test
  # Jest: the model, the API services, the Angular and React services and pages
  npx nx run-many -t test -p docs-examples-app-model docs-examples-app-api docs-examples-app-web docs-examples-app-web-react
  # #endregion
}

e2e() {
  # #region e2e
  # Playwright against MongoDB on localhost:27017; the API and the frontend are started for you
  RUN_EXAMPLE_APP_E2E=1 npx nx test docs-examples-app-web-e2e
  # #endregion
}

e2e_react() {
  # #region e2e-react
  # Playwright through the React frontend, against MongoDB on localhost:27017; the API and the frontend are started for you
  RUN_EXAMPLE_APP_E2E=1 npx nx test docs-examples-app-web-react-e2e
  # #endregion
}

case "${1:-}" in
  up) up ;;
  web) web ;;
  web-react) web_react ;;
  test) unit ;;
  e2e) e2e ;;
  e2e-react) e2e_react ;;
  *)
    echo "usage: $0 up|web|web-react|test|e2e|e2e-react" >&2
    exit 64
    ;;
esac

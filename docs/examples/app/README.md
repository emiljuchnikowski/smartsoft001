# Example application

One entity, the whole loop: a NestJS API on `@smartsoft001/crud-shell-nestjs`, `@smartsoft001/mongo`
and `@smartsoft001/auth-shell-nestjs`, and two frontends with the same screens over it, a list
page, an item page and a login: an Angular one on `@smartsoft001/crud-shell-angular` (`apps/web`)
and a React one on `@smartsoft001/crud-shell-react` (`apps/web-react`). It is the smallest
application that still uses the framework end to end, and it lives in this repository so that
every change to the framework is tried on it. It is also the first consumer of every release:
before anything reaches npm, the `Publish` workflow installs a standalone copy of the app, both
frontends included, from the packed tarballs, builds and tests it, then migrates the same copy from
the previous version and does it again. The same two checks run locally with
`npm run verify:example-app`. The starter repositories a newcomer clones are generated from this
app by the same workflow on every release (`npm run build:starter`), one per frontend:
`smartsoft001-starter` with the Angular frontend (`--frontend angular`, the default) and
`smartsoft001-starter-react` with the React one (`--frontend react`), each with the API. Either is
this app on the published packages rather than a copy to keep in sync by hand.

## Prerequisites

- Node.js 22.12 or newer (26 is what CI uses) and npm 10 or newer
- Docker with Compose (`docker compose version`)
- The repository installed: `npm ci` at the repository root

## Run it

Three commands. The first two run from the repository root, and each is also a subcommand of
`docs/examples/app/run.sh`, the script the documentation's Example application page cuts them from.

```bash
# 1. MongoDB and the API on http://localhost:3000/api
docker compose -f docs/examples/app/docker-compose.yml up

# 2. The Angular frontend on http://localhost:4200 (proxies /api to the container)
npx nx serve docs-examples-app-web

# 2. or the React frontend on http://localhost:4300 (proxies /api the same way)
npx nx serve docs-examples-app-web-react
```

3. Open http://localhost:4200 (Angular) or http://localhost:4300 (React) and sign in with
   `admin@example.com` / `change-me`, the user the API seeds on its first start.

The two frontends can run side by side against the one API; they keep the token in
`localStorage` under the same key, but each origin has a storage of its own, so each asks you to
sign in.

What you will see: the login page, then an empty **Notes** list. **Add** opens the generated form
(a required title and a rich-text body), **Add** on that page saves the note and returns to the
list, and the arrow on a row opens the note read-only, where **Edit** turns it into the form again
and **Save** writes the change. **Remove** on a row deletes it. Every screen is generated from the
`@Field` decorators on the model and the `CrudFullConfig` object; each frontend is a handful of
small files around them, and both show the same screens.

The API needs no configuration to start. To change ports, the database name, the JWT secret or the
seeded user, copy `.env.example` to `.env` next to `docker-compose.yml`; Compose reads it and passes
the values to the container. Without Docker, start MongoDB yourself and run the API with the same
variables in the shell: `npx nx serve docs-examples-app-api`.

## The hosted demos

Both frontends are also published with the documentation site: the Angular one at
https://framework.smartflow.biz.pl/demo/ and the React one at
https://framework.smartflow.biz.pl/demo-react/. GitHub Pages serves files only, so each copy is
the frontend's `demo` build.

The Angular one is the `demo` build configuration: base href `/demo/`, hash routing (Pages has no
SPA fallback under `demo/`, its 404 page belongs to the docs) and, through `fileReplacements`, an
in-memory double of the API from `apps/web/src/app/in-memory/`. The double is an `HttpInterceptor`
registered under `HTTP_INTERCEPTORS` like the auth one; it answers only the requests the frontend
makes (`POST /api/token` for the seeded credentials, and the list, item, create, update and delete
calls under `/api/notes`) with the status codes and bodies the real API sends, and keeps the notes in
the browser tab's `sessionStorage`. It is a test double, not a second backend, and the development
and production builds do not contain it. The build writes to
`dist/docs/examples/app/apps/web-demo/demo`, the path the demo is served from, so
`npx nx run docs-examples-app-web:serve-static:demo` serves it at
`http://localhost:4200/demo/`, and `E2E_BASE_URL=http://localhost:4200/demo/`
points the Playwright suite at it without starting the stack.

The React one is `build:demo`, Vite's `--mode demo`: base `/demo-react/`, navigation in the hash
for the same reason, and the same file replacements done by a small plugin in
`apps/web-react/vite.config.ts`, which swap `navigation.ts` and `in-memory-api.providers.ts` for
their `.demo.ts` versions. There the double is the `fetch` of the HTTP client `SmartProvider`
uses, from `apps/web-react/src/app/in-memory/`, with the same answers and the same
`sessionStorage`. The build writes to `dist/docs/examples/app/apps/web-react-demo/demo-react`,
`npx nx run docs-examples-app-web-react:serve-static:demo` serves it at
`http://localhost:4300/demo-react/`, and `E2E_BASE_URL=http://localhost:4300/demo-react/` points
the same suite at it.

The Docs workflow copies both builds next to the site, `demo/` and `demo-react/`, and after every
deploy runs the suite against each deployed demo, once it serves the build just made.

## What is where

| Path                                       | What it is                                                                                                                    |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `libs/model/src/lib/note.model.ts`         | The entity, decorated with `@Model` and `@Field`. Shared by both apps through the `@app/model` alias.                         |
| `apps/api/src/app/app.module.ts`           | The whole backend: TypeORM for the users, the auth module (`POST /api/token`), the CRUD module mounted under `/api/notes`.    |
| `apps/api/src/app/users.seed.ts`           | Inserts the one user at startup so that login works at once.                                                                  |
| `apps/api/src/config.ts`                   | The environment variables the API reads, with the defaults from `.env.example`.                                               |
| `apps/web/src/app/app.config.ts`           | The root providers the CRUD screens need: NgRx, `SharedModule`, `NgrxSharedModule`, translations and the JWT interceptor.     |
| `apps/web/src/app/notes/notes.config.ts`   | The `CrudFullConfig` that says what the notes screens can do.                                                                 |
| `apps/web/src/app/notes/notes.module.ts`   | `CrudModule.forFeature({ routing: true })`: the list, add and item routes.                                                    |
| `apps/web/src/app/auth/`                   | The login page on `<smart-sign-in-form>`, the login service, the route guard and the interceptor that sends the token.        |
| `apps/web/src/app/in-memory/`              | The in-memory double of the API that the `demo` build registers instead of talking to a server.                               |
| `apps/web-react/src/main.tsx`              | The React entry point: `reflect-metadata`, the framework's stylesheets, then the app inside `AppProviders`.                   |
| `apps/web-react/src/app/app.providers.tsx` | One `SmartProvider`: translations, navigation, and the HTTP client and `AuthService` the screens use.                         |
| `apps/web-react/src/app/app.routes.tsx`    | The routes without a router: the login page, and the notes pages behind the guard.                                            |
| `apps/web-react/src/app/notes/`            | The React `CrudFullConfig`, and `CrudProvider` with `SmartCrudPages`: the list, add and item pages.                           |
| `apps/web-react/src/app/auth/`             | The login page on `SmartSignInForm`, the login service and the guard.                                                         |
| `apps/web-react/src/app/in-memory/`        | The React demo's double of the API: a `fetch` for the HTTP client of `SmartProvider`.                                         |
| `apps/web-react/vite.config.ts`            | Vite: the dev server on :4300 with its `/api` proxy, the build, and the `demo` mode with its file replacements.               |
| `apps/web-e2e/src/`                        | Playwright: login, list, item page, against the running stack. The same specs drive both frontends.                           |
| `apps/web-e2e/playwright.config.ts`        | Starts the API and the dev server of the frontend `E2E_FRONTEND` names (`angular`, the default, or `react`).                  |
| `apps/web-react-e2e/project.json`          | The suite again as a project of its own, with `E2E_FRONTEND=react`: the React frontend's e2e.                                 |
| `docker-compose.yml`, `Dockerfile`         | MongoDB plus the API built from the monorepo sources.                                                                         |
| `package.json`                             | What a standalone copy of the app installs. Inside the monorepo the framework resolves through the workspace aliases instead. |

## Tests

```bash
# Jest: the model, the API services, the Angular and React services and pages
npx nx run-many -t test -p docs-examples-app-model docs-examples-app-api docs-examples-app-web docs-examples-app-web-react

# Playwright, against MongoDB on localhost:27017 (the API and the frontend are started for you)
RUN_EXAMPLE_APP_E2E=1 npx nx test docs-examples-app-web-e2e

# The same suite through the React frontend
RUN_EXAMPLE_APP_E2E=1 npx nx test docs-examples-app-web-react-e2e
```

One Playwright suite covers both frontends: the specs select only what the framework renders in
Angular and in React alike, and `E2E_FRONTEND` in `apps/web-e2e/playwright.config.ts` picks the dev
server to start next to the API, `angular` (port 4200) by default or `react` (port 4300).
`docs-examples-app-web-e2e` runs it for Angular, `docs-examples-app-web-react-e2e` for React; both
run `apps/web-e2e/run.mjs` and keep their traces in `dist/docs/examples/app/apps/web-e2e/<frontend>`.
Each run starts the API on port 3000 against the one database, so their targets set
`parallelism: false`: `nx run-many` never runs them side by side, nor next to another task.

The suite sits behind `RUN_EXAMPLE_APP_E2E` so that a plain `nx run-many -t test` does not require
MongoDB; the pull request workflow sets the variable and provides the database, and so runs both.
`npx nx e2e docs-examples-app-web-e2e` and `npx nx e2e docs-examples-app-web-react-e2e` run it
unconditionally, and `E2E_BASE_URL` (see the hosted demos above) points it at a served demo of
either frontend instead.

## What the app has already found

The app is built and tested against the framework sources, so it shows where the framework stands
today, and a failing case here is a framework issue rather than something to fix in the app. Its
first build surfaced six of them, all fixed before the app landed: the sources were not clean under a
consumer's strict tsconfig, the ambient module declarations for `busboy`, `json2csv` and
`combined-stream` were unreachable from a consumer program, the item page could not submit, the
create form was rebuilt after the inputs had bound to it, `AlertService` was a stub so delete never
ran, and the API accepted any body because validation never saw the model type. The Playwright
suite asserts each of those paths, so a regression in the framework fails this app before it ships.

## How the pieces fit

- The frontends call `/api/...`; in development their dev servers proxy that to port 3000
  (`apps/web/proxy.conf.json` for Angular, `server.proxy` in `apps/web-react/vite.config.ts` for
  React), so there is no environment file on either frontend.
- Login is the OAuth password grant of `@smartsoft001/auth-shell-nestjs`: `POST /api/token` with the
  seeded username, the password and the `client_id` the API accepts. The returned JWT is stored by
  `AuthService` from `@smartsoft001/angular` and attached to every request by `AuthInterceptor`.
- In React, `AuthService` from `@smartsoft001/react` keeps the token under the same key and in the
  same shape, and the HTTP client of `SmartProvider` sends it as a bearer header with every request;
  there is no interceptor to register.
- The Angular interceptor is registered under `HTTP_INTERCEPTORS`, not with `withInterceptors`.
  `CrudModule.forFeature` imports `SharedModule`, which re-exports `HttpClientModule`, so the lazily
  loaded notes route gets its own `HttpClient`; a functional interceptor at the root never reaches
  it, a DI one does.
- `MODEL_VALIDATORS_PROVIDER` has to be provided, even when the app adds no validators of its own:
  the form factory injects it without a default, and without it the generated form never renders.
- The CRUD routes come from one `@Controller('')` in `@smartsoft001/crud-shell-nestjs`; the API mounts
  it with NestJS's `RouterModule` under `notes`, which is why `apiUrl` in the frontend is `/api/notes`.
- Writes require the `admin` permission, reads `admin` or `user`; the seeded user has `admin`.
- The React frontend has no router: `AppRoutes` reads the URL of the navigation adapter, and
  `matchCrudRoute` and `SmartCrudPages` map `/notes`, `/notes/add` and `/notes/:id` to the pages.
- The framework's stylesheets (Tailwind utilities under the `smart:` prefix) are the `styles.css` each
  UI package publishes. Inside the monorepo each frontend's `styles` target compiles them from the
  package sources with the same `@tailwindcss/cli` command the packages' `build` uses, into
  `dist/docs/examples/app/styles/` (Angular) and `dist/docs/examples/app/styles-react/` (React), and
  `build` and `serve` depend on it. These are the only places the app names a path under
  `packages/`: there is no alias for a stylesheet. The Angular build lists the files under `styles`
  in `apps/web/project.json`; the React app imports `@smartsoft001/react/styles.css` and
  `@smartsoft001/crud-shell-react/styles.css` in `main.tsx`, and its Vite config points those two
  imports at the compiled files while the packages resolve to their sources. A standalone copy
  drops both targets, points the Angular `styles` entries at
  `node_modules/@smartsoft001/angular/styles.css` and
  `node_modules/@smartsoft001/crud-shell-angular/styles.css`, and lets the React imports resolve to
  the files the installed packages ship.

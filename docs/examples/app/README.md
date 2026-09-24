# Example application

One entity, the whole loop: an Angular frontend on `@smartsoft001/crud-shell-angular` with a list
page, an item page and a login, and a NestJS API on `@smartsoft001/crud-shell-nestjs`,
`@smartsoft001/mongo` and `@smartsoft001/auth-shell-nestjs`. It is the smallest application that
still uses the framework end to end, and it lives in this repository so that every change to the
framework is tried on it. It is also the first consumer of every release: before anything reaches
npm, the `Publish` workflow installs a standalone copy of the app from the packed tarballs, builds
and tests it, then migrates the same copy from the previous version and does it again. The same
two checks run locally with `npm run verify:example-app`. The starter repository a newcomer clones,
`smartsoft001-starter`, is generated from this app by the same workflow on every release
(`npm run build:starter`), so it is this app on the published packages rather than a copy to keep
in sync by hand.

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

# 2. The frontend on http://localhost:4200 (proxies /api to the container)
npx nx serve docs-examples-app-web
```

3. Open http://localhost:4200 and sign in with `admin@example.com` / `change-me`, the user the API
   seeds on its first start.

What you will see: the login page, then an empty **Notes** list. **Add** opens the generated form
(a required title and a rich-text body), **Add** on that page saves the note and returns to the
list, and the arrow on a row opens the note read-only, where **Edit** turns it into the form again
and **Save** writes the change. **Remove** on a row deletes it. Every screen is generated from the
`@Field` decorators on the model and the `CrudFullConfig` object; the app itself is two pages of
code.

The API needs no configuration to start. To change ports, the database name, the JWT secret or the
seeded user, copy `.env.example` to `.env` next to `docker-compose.yml`; Compose reads it and passes
the values to the container. Without Docker, start MongoDB yourself and run the API with the same
variables in the shell: `npx nx serve docs-examples-app-api`.

## The hosted demo

The frontend is also published with the documentation site, at
https://emiljuchnikowski.github.io/smartsoft001/demo/. GitHub Pages serves files only, so that copy
is the `demo` build configuration: base href `/smartsoft001/demo/`, hash routing (Pages has no SPA
fallback under `demo/`, its 404 page belongs to the docs) and, through `fileReplacements`, an
in-memory double of the API from `apps/web/src/app/in-memory/`. The double is an `HttpInterceptor`
registered under `HTTP_INTERCEPTORS` like the auth one; it answers only the requests the frontend
makes (`POST /api/token` for the seeded credentials, and the list, item, create, update and delete
calls under `/api/notes`) with the status codes and bodies the real API sends, and keeps the notes in
the browser tab's `sessionStorage`. It is a test double, not a second backend, and the development
and production builds do not contain it. The build writes to
`dist/docs/examples/app/apps/web-demo/smartsoft001/demo`, the path the demo is served from, so
`npx nx run docs-examples-app-web:serve-static:demo` serves it at
`http://localhost:4200/smartsoft001/demo/`, and `E2E_BASE_URL=http://localhost:4200/smartsoft001/demo/`
points the Playwright suite at it without starting the stack. The Docs workflow runs that suite
against the deployed demo after every deploy.

## What is where

| Path                                        | What it is                                                                                                                    |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `libs/model/src/lib/note.model.ts`          | The entity, decorated with `@Model` and `@Field`. Shared by both apps through the `@app/model` alias.                         |
| `apps/api/src/app/app.module.ts`            | The whole backend: TypeORM for the users, the auth module (`POST /api/token`), the CRUD module mounted under `/api/notes`.     |
| `apps/api/src/app/users.seed.ts`            | Inserts the one user at startup so that login works at once.                                                                  |
| `apps/api/src/config.ts`                    | The environment variables the API reads, with the defaults from `.env.example`.                                               |
| `apps/web/src/app/app.config.ts`            | The root providers the CRUD screens need: NgRx, `SharedModule`, `NgrxSharedModule`, translations and the JWT interceptor.     |
| `apps/web/src/app/notes/notes.config.ts`    | The `CrudFullConfig` that says what the notes screens can do.                                                                 |
| `apps/web/src/app/notes/notes.module.ts`    | `CrudModule.forFeature({ routing: true })`: the list, add and item routes.                                                    |
| `apps/web/src/app/auth/`                    | The login page on `<smart-sign-in-form>`, the login service, the route guard and the interceptor that sends the token.        |
| `apps/web/src/app/in-memory/`               | The in-memory double of the API that the `demo` build registers instead of talking to a server.                              |
| `apps/web-e2e/src/`                         | Playwright: login, list, item page, against the running stack.                                                                |
| `docker-compose.yml`, `Dockerfile`          | MongoDB plus the API built from the monorepo sources.                                                                         |
| `package.json`                              | What a standalone copy of the app installs. Inside the monorepo the framework resolves through the workspace aliases instead. |

## Tests

```bash
# Jest: the model, the API services, the Angular services and pages
npx nx run-many -t test -p docs-examples-app-model docs-examples-app-api docs-examples-app-web

# Playwright, against MongoDB on localhost:27017 (the API and the frontend are started for you)
RUN_EXAMPLE_APP_E2E=1 npx nx test docs-examples-app-web-e2e
```

The Playwright suite sits behind `RUN_EXAMPLE_APP_E2E` so that a plain `nx run-many -t test` does
not require MongoDB; the pull request workflow sets the variable and provides the database.
`npx nx e2e docs-examples-app-web-e2e` runs it unconditionally.

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

- The frontend calls `/api/...`; in development the dev server proxies that to port 3000
  (`apps/web/proxy.conf.json`), so there is no environment file on the frontend.
- Login is the OAuth password grant of `@smartsoft001/auth-shell-nestjs`: `POST /api/token` with the
  seeded username, the password and the `client_id` the API accepts. The returned JWT is stored by
  `AuthService` from `@smartsoft001/angular` and attached to every request by `AuthInterceptor`.
- The interceptor is registered under `HTTP_INTERCEPTORS`, not with `withInterceptors`.
  `CrudModule.forFeature` imports `SharedModule`, which re-exports `HttpClientModule`, so the lazily
  loaded notes route gets its own `HttpClient`; a functional interceptor at the root never reaches
  it, a DI one does.
- `MODEL_VALIDATORS_PROVIDER` has to be provided, even when the app adds no validators of its own:
  the form factory injects it without a default, and without it the generated form never renders.
- The CRUD routes come from one `@Controller('')` in `@smartsoft001/crud-shell-nestjs`; the API mounts
  it with NestJS's `RouterModule` under `notes`, which is why `apiUrl` in the frontend is `/api/notes`.
- Writes require the `admin` permission, reads `admin` or `user`; the seeded user has `admin`.
- The framework's stylesheets (Tailwind utilities under the `smart:` prefix) are the `styles.css` each
  UI package publishes. Inside the monorepo the web project's `styles` target compiles them from the
  package sources with the same `@tailwindcss/cli` command the packages' `build` uses, into
  `dist/docs/examples/app/styles/`, and `build` and `serve` depend on it. This is the one place the
  app names a path under `packages/`: there is no alias for a stylesheet. A standalone copy points the
  same `styles` entries at `node_modules/@smartsoft001/angular/styles.css` and
  `node_modules/@smartsoft001/crud-shell-angular/styles.css` and drops the target.

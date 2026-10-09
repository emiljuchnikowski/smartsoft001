---
title: Example application
section: Getting started
order: 3
frameworks: [angular, react]
nextjs:
  metadata:
    title: Example application
    description: Walk through the smallest application that uses the framework end to end, from the decorated model to the generated Angular or React screens and the API, and run it on your machine.
---

One entity, the whole loop. A `Note` model, a NestJS API that stores notes in MongoDB behind a login, and a frontend whose list, form and details pages are generated from that model, in Angular and in React: two frontends with the same screens on the same API. The application lives in the repository under `docs/examples/app`, is built and tested against the framework sources on every pull request, and every fragment on this page is cut from it. Pick your framework with the switch above. {% .lead %}

---

## What it is

The application is the shortest path from an installed package to a working screen. It has three parts.

- `libs/model` holds the `Note` entity, decorated with `@Model` and `@Field`. The API and both frontends import it through the `@app/model` alias, so the frontend and the backend agree on one description of the data.
- `apps/api` is the backend: `AuthShellNestjsModule` issues tokens for the seeded user and `CrudShellNestjsModule` exposes the notes under `/api/notes`.

{% framework name="angular" %}

- `apps/web` is the Angular frontend: the login page on `smart-sign-in-form`, and the notes feature registered with `CrudModule.forFeature`, which brings the list, the add form and the item page.

{% /framework %}

{% framework name="react" %}

- `apps/web-react` is the React frontend, on Vite: the login page on `SmartSignInForm`, and the notes feature, a `CrudProvider` around `SmartCrudPages`, which brings the list, the add form and the item page.

{% /framework %}

Nothing else is written by hand. There is no notes component, no form template and no HTTP service in the application code, because the framework builds them from the model and one configuration object.

{% callout type="note" title="The application lives with the framework" %}
The application is part of this repository, compiles the framework from its sources and runs its Playwright suite in the pull request workflow, once against each frontend: the specs are the same, so the two frontends cannot drift apart. When a framework change breaks the loop, the application fails first. Its first build found six defects, all fixed before it landed, and the suite asserts each of those paths since.
{% /callout %}

---

## The model

One class describes the entity for both sides of the wire.

{% snippet file="app/libs/model/src/lib/note.model.ts" region="model" /%}

`@Model` names the field that stands for the record, which the item page uses as its title. Each `@Field` says what the field is and where it appears: `create` and `update` put it in the form, `list` makes it a column, `details` shows it on the item page. The `required` flag is repeated inside the `create` and `update` blocks on purpose, because the API validates each request against the block of its mode rather than the top-level flag. `focused` puts the cursor in the title when the form opens.

---

## The API

The whole backend is one module.

{% snippet file="app/apps/api/src/app/app.module.ts" region="module" /%}

Three things happen here. `TypeOrmModule.forRoot` opens the connection that `AuthShellNestjsModule` stores users in, and the auth module registers `POST /api/token`, the OAuth password grant the frontend calls to sign in. `CrudShellNestjsModule.forRoot` takes the same JWT settings, a permission map that says which roles may create, read, update and delete, and the MongoDB collection the notes live in. Its routes are declared at the module root, so `RouterModule.register` is what mounts them under `/api/notes`. The exception filter from `@smartsoft001/nestjs` turns a domain validation error into a 400 and a domain permission error into a 403.

The bootstrap adds the `api` prefix and turns on CORS, so a client on another origin can use the API as well as the dev server proxy.

{% snippet file="app/apps/api/src/main.ts" region="bootstrap" /%}

The API seeds one user on its first start, so login works before anybody has touched the database.

{% snippet file="app/apps/api/src/app/users.seed.ts" region="seed" /%}

The port, the database and the seeded credentials come from the environment, with the defaults listed in `.env.example` next to the compose file.

---

## The frontend

{% framework name="angular" %}

### Root providers

The CRUD screens need a few things at the root of the application, and this is the whole list.

{% snippet file="app/apps/web/src/app/app.config.ts" region="providers" /%}

The feature registers its own reducer and effects when it loads, so `provideStore` and `provideEffects` have to exist before it. `SharedModule` brings the built-in translations and `NgrxSharedModule` connects the store the reducers are added to. `MODEL_VALIDATORS_PROVIDER` is asked for extra validators per field and has no default, so an application without custom rules still registers it and hands back the validators the field metadata already implies. The HTTP client is configured with interceptors from dependency injection, for a reason explained under [Login](#login). `ROUTER_FEATURES` and `IN_MEMORY_API_PROVIDERS` come from the two files the `demo` build replaces, as described under [Try it hosted](#try-it-hosted); in every other build they are the scrolling feature and an empty list.

### The notes feature

One object says what the screens can do.

{% snippet file="app/apps/web/src/app/notes/notes.config.ts" region="config" /%}

The columns, the form fields and the details view are not listed here, because they come from the `@Field` decorators. The configuration adds the capabilities: which of add, edit, details and remove the screens offer, the search box, the page size and the default sort. `apiUrl` is relative, so the dev server proxy and any reverse proxy can route it.

The feature module registers that configuration and, with `routing` on, the three child routes.

{% snippet file="app/apps/web/src/app/notes/notes.module.ts" region="module" /%}

The application mounts the feature under `/notes` behind a guard and sends every other path there.

{% snippet file="app/apps/web/src/app/app.routes.ts" region="routes" /%}

### Login

The login page is the framework's sign-in form and a small service around the token endpoint.

{% snippet file="app/apps/web/src/app/auth/login.page.ts" region="page" /%}

The service runs the password grant against `/api/token` and stores the token through `AuthService`, which is what the guard and the interceptor read.

{% snippet file="app/apps/web/src/app/auth/login.service.ts" region="service" /%}

{% snippet file="app/apps/web/src/app/auth/auth.guard.ts" region="guard" /%}

Every request to the API carries the token. The interceptor is registered as a class under `HTTP_INTERCEPTORS` rather than as a functional interceptor, and the reason is worth knowing: `CrudModule.forFeature` imports `SharedModule`, which re-exports `HttpClientModule`, so the lazily loaded notes route builds its own `HttpClient`. A functional interceptor registered at the root is not seen by that client. A class provided at the root still is.

{% snippet file="app/apps/web/src/app/auth/auth.interceptor.ts" region="provider" /%}

### Labels

The generated screens look up two kinds of label: the page title from the configuration and `MODEL.<field>` for every decorated field. The framework ships its own strings for buttons and validation messages under the same language codes.

{% snippet file="app/apps/web/src/app/translations.ts" region="translations" /%}

{% /framework %}

{% framework name="react" %}

### Bootstrap

The entry point loads `reflect-metadata` before the model, imports the framework's compiled stylesheets and renders the application inside its providers.

{% snippet file="app/apps/web-react/src/main.tsx" region="bootstrap" /%}

### Root providers

The CRUD screens need one thing at the root of the application: a `SmartProvider`.

{% snippet file="app/apps/web-react/src/app/app.providers.tsx" region="providers" /%}

The provider brings the translations, the HTTP client, the `AuthService` and the navigation adapter every generated screen reads. Its default HTTP client sends the token the `AuthService` stores as a bearer header, so the application needs no interceptor of its own. `NAVIGATION` and `IN_MEMORY_API_PROVIDERS` come from the two files the `demo` build replaces, as described under [Try it hosted](#try-it-hosted); in every other build they are the browser history and an empty object.

### The notes feature

One object says what the screens can do.

{% snippet file="app/apps/web-react/src/app/notes/notes.config.ts" region="config" /%}

The columns, the form fields and the details view are not listed here, because they come from the `@Field` decorators. The configuration adds the capabilities: which of add, edit, details and remove the screens offer, the search box, the page size and the default sort. `apiUrl` is relative, so the dev server proxy and any reverse proxy can route it.

The feature is a `CrudProvider` with that configuration around `SmartCrudPages`, which renders the page of the current URL.

{% snippet file="app/apps/web-react/src/app/notes/notes.feature.tsx" region="feature" /%}

### Pages without a router

The React shell does not depend on a router: `SmartCrudPages` follows the navigation adapter of `SmartProvider`. The application picks its page from the same adapter, puts the notes behind a guard and sends every other path to `/notes`.

{% snippet file="app/apps/web-react/src/app/app.routes.tsx" region="routes" /%}

{% snippet file="app/apps/web-react/src/app/auth/auth.guard.tsx" region="guard" /%}

An application that already has a router renders `SmartCrudListPage` and `SmartCrudItemPage` from its own routes instead, as the [list page](/docs/crud/list-page) and the [item page](/docs/crud/item-page) show.

### Login

The login page is the framework's sign-in form and a small service around the token endpoint.

{% snippet file="app/apps/web-react/src/app/auth/login.page.tsx" region="page" /%}

The service runs the password grant against `/api/token` and stores the token through the `AuthService` of the provider, which is what the guard and the HTTP client read. It keeps the token under the same `AUTH_TOKEN` key, in the same shape, as the Angular frontend.

{% snippet file="app/apps/web-react/src/app/auth/login.service.ts" region="service" /%}

### Labels

The generated screens look up two kinds of label: the page title from the configuration and `MODEL.<field>` for every decorated field. The framework ships its own strings for buttons and validation messages under the same language codes, and `SmartProvider` merges the dictionary of its language over them.

{% snippet file="app/apps/web-react/src/app/translations.ts" region="translations" /%}

{% /framework %}

---

## Run it

The commands below are regions of `docs/examples/app/run.sh`, and each one is the body of a function that script runs, so the page and the script cannot disagree. You need Node.js, npm, Docker with Compose and the repository installed with `npm ci` at its root.

Start MongoDB and the API from the repository root.

{% snippet file="app/run.sh" region="up" /%}

Start the frontend in a second terminal.

{% framework name="angular" %}

{% snippet file="app/run.sh" region="web" /%}

Open `http://localhost:4200` and sign in with `admin@example.com` and `change-me`, the user the API seeds on its first start. You land on an empty list. Add opens the generated form, the arrow on a row opens the note read-only, Edit turns it into the form again and Remove asks for confirmation before deleting.

The dev server forwards `/api` to the API, so the frontend and the backend share one origin during development.

{% snippet file="app/apps/web/proxy.conf.json" /%}

{% /framework %}

{% framework name="react" %}

{% snippet file="app/run.sh" region="web-react" /%}

Open `http://localhost:4300` and sign in with `admin@example.com` and `change-me`, the user the API seeds on its first start. You land on an empty list. Add opens the generated form, the arrow on a row opens the note read-only, Edit turns it into the form again and Remove asks for confirmation before deleting.

The Vite dev server forwards `/api` to the API, so the frontend and the backend share one origin during development.

{% snippet file="app/apps/web-react/vite.config.ts" region="proxy" /%}

{% /framework %}

The Jest suites cover the model, the API configuration and seed, and on each frontend the login service, guard and page and the HTTP authorization.

{% snippet file="app/run.sh" region="test" /%}

The Playwright suite drives the real stack: it builds and starts the API against MongoDB on `localhost:27017`, starts the dev server, and walks through login, the list with its confirm dialog, the item page and the API validation. The specs are the same for both frontends; the pull request workflow runs them against each, with a MongoDB service.

{% framework name="angular" %}

{% snippet file="app/run.sh" region="e2e" /%}

{% /framework %}

{% framework name="react" %}

{% snippet file="app/run.sh" region="e2e-react" /%}

{% /framework %}

---

## Try it hosted

{% framework name="angular" %}

The Angular frontend is also published with this site, at [https://framework.smartflow.biz.pl/demo/](https://framework.smartflow.biz.pl/demo/). Sign in with the same `admin@example.com` and `change-me`, and click through the list, the form and the item page.

Be clear about what you are looking at. GitHub Pages serves files only, so the demo does not run the API above. It runs against an in-memory double of the API that lives next to the application, in `apps/web/src/app/in-memory`: an HTTP interceptor that answers the requests the frontend makes, with the status codes and bodies the real API sends, and keeps the notes in the storage of your browser tab. Your notes never leave the browser, and a new tab starts from the seed again. Only the `demo` build registers the double, and the real backend is the `docker compose up` above.

{% /framework %}

{% framework name="react" %}

The React frontend is also published with this site, at [https://framework.smartflow.biz.pl/demo-react/](https://framework.smartflow.biz.pl/demo-react/). Sign in with the same `admin@example.com` and `change-me`, and click through the list, the form and the item page.

Be clear about what you are looking at. GitHub Pages serves files only, so the demo does not run the API above. It runs against an in-memory double of the API that lives next to the application, in `apps/web-react/src/app/in-memory`: a `fetch` for the HTTP client of `SmartProvider` that answers the requests the frontend makes, with the status codes and bodies the real API sends, and keeps the notes in the storage of your browser tab. Your notes never leave the browser, and a new tab starts from the seed again. Pages has no fallback for deep links, so the demo keeps its route in the hash (`#/notes/add`). Only the `demo` build swaps in the double and the hash navigation, and the real backend is the `docker compose up` above.

{% /framework %}

The Docs workflow runs the Playwright suite of this page against both hosted demos after every deploy.

---

## Start from the template

{% framework name="angular" %}

The starter repository at `https://github.com/emiljuchnikowski/smartsoft001-starter` is this application with its Angular frontend, as a workspace of its own, with the framework installed from npm instead of resolved through the workspace aliases.

{% /framework %}

{% framework name="react" %}

The starter repository at `https://github.com/emiljuchnikowski/smartsoft001-starter-react` is this application with its React frontend, as a workspace of its own, with the framework installed from npm instead of resolved through the workspace aliases. Its frontend is the `web` project, on Vite.

{% /framework %}

It is generated from `docs/examples/app` on every release, pinned to the `@smartsoft001` packages of that release, and installed, built and tested from a clean clone before it is pushed, so it never drifts from the framework. Use "Use this template" on GitHub to create a repository of your own, or clone it and run `npm install` followed by `./run.sh up`.

---

## Where next

- [Architecture](/docs/architecture) explains the layers this application is built on and follows one entity from its decorators to a screen.
- [CRUD](/docs/crud/overview) documents every option of the configuration object and the generated pages.
- [Installation](/docs/installation) shows how to add the packages to a workspace of your own.

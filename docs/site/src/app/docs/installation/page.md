---
title: Installation
section: Getting started
order: 2
frameworks: [angular, react]
nextjs:
  metadata:
    title: Installation
    description: Install the @smartsoft001 packages in an Angular, React or NestJS workspace and wire up the minimum configuration.
---

Install the packages you need and wire them up once: the root of the frontend, Angular providers or a React provider, and one module import for NestJS. {% .lead %}

---

## Prerequisites

The packages are published for current Node.js releases and npm 10 or newer. Check what you have before installing.

{% snippet file="install/install.sh" region="prerequisites" /%}

On the consumer side the Angular packages target Angular 22, the React packages React 19, and the backend packages NestJS 11.

## Where to install

### A new workspace

{% framework name="angular" %}

If you are starting from nothing, the `smart-angular:scaffold-nx-workspace` skill from the `smart-angular@smartsoft` Claude Code plugin generates an Nx workspace that already follows the conventions these docs assume, and is documented in the [Skills section (coming soon)](/).

{% /framework %}

{% framework name="react" %}

There is no workspace generator for React yet. Start from the tooling you already use for a React application and install the packages into it; the `smart-react@smartsoft` Claude Code plugin brings the React conventions into Claude Code once the project exists.

{% /framework %}

### An existing workspace

In an existing Angular, React or NestJS project nothing needs to be restructured. Install the packages into the project that uses them and continue with the wiring below.

### Something to compare against

The [example application](/docs/example-app) is a complete application on the framework, a NestJS API with an Angular and a React frontend, kept in the repository and tested on every pull request. When a step on this page raises a question, it shows the answer in running code. Its starters, [`smartsoft001-starter`](https://github.com/emiljuchnikowski/smartsoft001-starter) for Angular and [`smartsoft001-starter-react`](https://github.com/emiljuchnikowski/smartsoft001-starter-react) for React, are the same application as a workspace of its own.

## Create a project

The commands on this page are the ones the smoke test runs, and it starts from an empty npm project.

{% snippet file="install/install.sh" region="create-project" /%}

---

## What to install

Each package is published on its own, but a project rarely wants one of them. A few meta packages group the rest by what a project actually is, and pin one version of each library they bring, so the whole set stays consistent.

| Package                        | For                                       | Brings                                                                                                                |
| ------------------------------ | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `@smartsoft001/core`           | Any project                               | The model decorators, the domain contracts, the helpers and the shared DTOs. No UI framework, no server, no database. |
| `@smartsoft001/angular-stack`  | An Angular application                    | `core`, the Angular UI library and the Angular CRUD screens.                                                          |
| `@smartsoft001/react-stack`    | A React application                       | `core`, the React UI library and the React CRUD screens.                                                              |
| `@smartsoft001/nestjs-stack`   | A NestJS service                          | `core`, the module helpers, MongoDB access and the CRUD and auth shells.                                              |
| `@smartsoft001/full-stack`     | An Angular frontend plus a NestJS backend | `core` and both of those runtime stacks, so such a project installs the whole framework with one command.             |
| `@smartsoft001/payments-stack` | A service that takes payments             | The transaction family and the PayPal, PayU, Paynow and Revolut integrations.                                         |

The split follows what a project runs on rather than where the code sits: the React frontend has its own stack next to the Angular one, and `core` is the same for both.

Installing a single library still works and is the right choice when a project needs exactly one, for example only the validators from [`utils`](/docs/packages/utils). Every package page shows its own install command.

---

## Frontend and backend

{% framework name="angular" %}

A project with both halves installs the whole framework with one command:

{% snippet file="install/install.sh" region="install-full-stack" /%}

That brings `core` and both runtime stacks at one version. The two sections below then apply to each half; nothing else is needed. Payments stay a separate opt-in, described under NestJS.

{% /framework %}

{% framework name="react" %}

`full-stack` brings the Angular stack, so a React project with a NestJS backend installs the two stacks it runs on: `react-stack` for the frontend and `nestjs-stack` for the backend, each with the command of its section below. Both pin `core` at the version of their release, so install them from the same release. Payments stay a separate opt-in, described under NestJS.

{% /framework %}

## Frontend

{% framework name="angular" %}

### Install the stack

One command installs everything an Angular application uses: the UI components, the CRUD screens and the framework-agnostic core they are built on.

{% snippet file="install/install.sh" region="install-angular" /%}

### Set up the root

Register the shared providers in the application config.

{% snippet file="angular/src/getting-started/app-config.example.ts" region="usage" /%}

Each entry earns its place. `provideRouter` is required because the framework's page components navigate between list and item routes. `provideHttpClient` backs the services that talk to the backend. `provideTranslateService` is not optional: `SharedModule` injects `TranslateService` in its constructor to install the default translations and language, so the application fails to start without it. `importProvidersFrom(SharedModule)` pulls in the module itself, which exports the shared factories, services, pipes, pages and directives that the UI components rely on.

With that in place a component can use the framework's elements directly, as the `smart-button` sample on the [home page](/) shows.

{% /framework %}

{% framework name="react" %}

### Install the stack

One command installs everything a React application uses: the UI components, the CRUD screens and the framework-agnostic core they are built on. React itself is a peer dependency, installed alongside.

{% snippet file="install/install.sh" region="install-react" /%}

### Set up the root

Import the stylesheets once and wrap the application in `SmartProvider`.

{% snippet file="react/src/getting-started/main.example.tsx" region="usage" /%}

Each line earns its place. `reflect-metadata` comes first because the `@Model` and `@Field` decorators write metadata as their classes are evaluated; the TypeScript configuration needs `experimentalDecorators` and `emitDecoratorMetadata` for the same reason. The two stylesheets are the compiled Tailwind of the UI library and of the CRUD screens, and every utility in them carries the `smart:` prefix, so they do not clash with the application's own styles. `SmartProvider` is the whole root: it holds the translations, Polish by default and English with `language="eng"`, with the application's `translations` merged over them; the navigation adapter, here the one over `window.history`, which an application with a router swaps for an adapter over that router; and the services, the HTTP client among them, created once for the provider's lifetime, which is why its configuration objects are module constants. There is no router, HTTP module or store to register next to it.

The spec mounts the application into an element and asserts the button rendered inside it with the application's label, and that a click moves `window.history` to `/notes` through the provider's navigation. From here a CRUD feature is one `CrudProvider` away, as the [CRUD overview](/docs/crud/overview) shows, and [`@smartsoft001/react`](/docs/packages/react) documents every prop of the provider.

{% /framework %}

---

## NestJS

One command installs the server side: the shared module, MongoDB access, the CRUD and auth shells, and the same core.

{% snippet file="install/install.sh" region="install-nestjs" /%}

Then configure the shared module once, in the application module.

{% snippet file="node/src/getting-started/app-module.example.ts" region="usage" /%}

`SharedModule.forRoot` takes three pieces of configuration. `tokenConfig` holds the JWT signing key and the token lifetime in seconds, and it feeds the JWT strategy that guards the endpoints, so the placeholder above must be replaced by a real secret from your environment. `permissions` maps each operation, create, read, update and delete, to the list of roles allowed to perform it, and the permission service checks the user's roles against that map. `db` is the MongoDB connection the repositories use. Use `forRoot` in the application module and `forFeature` in a feature module that should reuse the same configuration without opening a second database connection.

### Payments

A service that takes payments adds the transaction family and the provider integrations.

{% snippet file="install/install.sh" region="install-payments" /%}

{% callout type="warning" title="Server-side packages and plain Node" %}
The Node-side packages are currently published as ES modules with a CommonJS manifest, so `require()` and `import()` from a plain Node or NestJS project fail with `SyntaxError: Unexpected token 'export'` until the packaging is fixed. Bundler-based builds such as the Angular CLI are unaffected.
{% /callout %}

---

## Keeping it up to date

The packages are released together, so a project moves the whole set at once and the release brings its own migrations with it. [Upgrading](/docs/upgrading) has the two commands.

---

## Verify

There is nothing to take on trust here. The commands above are not transcribed into this page: they are regions of the installation script that the repository's continuous integration executes against the packages published on npm before every deploy of these docs. The script installs every published `@smartsoft001/*` package into a throwaway project and resolves the entry points, so if an install command stopped working the docs would not ship.

## Where next

- [Example application](/docs/example-app) is the smallest application that uses the framework end to end, with the commands to run it.
- [Architecture](/docs/architecture) follows one entity from its decorators to a generated screen.
- [Introduction](/docs/introduction) lists the packages and how they are layered.

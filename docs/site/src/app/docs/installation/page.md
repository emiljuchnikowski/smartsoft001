---
title: Installation
section: Getting started
order: 2
nextjs:
  metadata:
    title: Installation
    description: Install the @smartsoft001 packages in an Angular or NestJS workspace and wire up the minimum configuration.
---

Install the packages you need and register two modules: one provider block for Angular, one module import for NestJS. {% .lead %}

---

## Prerequisites

The packages are published for current Node.js releases and npm 10 or newer. Check what you have before installing.

{% snippet file="install/install.sh" region="prerequisites" /%}

On the consumer side the Angular packages target Angular 22 and the backend packages target NestJS 11.

## Where to install

### A new workspace

If you are starting from nothing, the `smart:scaffold-nx-workspace` skill from the `smart@smartsoft` Claude Code plugin generates an Nx workspace that already follows the conventions these docs assume, and is documented in the [Skills section (coming soon)](/).

### An existing workspace

In an existing Angular or NestJS project nothing needs to be restructured. Install the packages into the project that uses them and continue with the wiring below.

## Create a project

The commands on this page are the ones the smoke test runs, and it starts from an empty npm project.

{% snippet file="install/install.sh" region="create-project" /%}

---

## What to install

Each package is published on its own, but a project rarely wants one of them. Four packages group the rest by what a project actually is, and pin one version of each library they bring, so the whole set stays consistent.

| Package                        | For                           | Brings                                                                                                                |
| ------------------------------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `@smartsoft001/core`           | Any project                   | The model decorators, the domain contracts, the helpers and the shared DTOs. No UI framework, no server, no database. |
| `@smartsoft001/angular-stack`  | An Angular application        | `core`, the UI library and the CRUD screens.                                                                          |
| `@smartsoft001/nestjs-stack`   | A NestJS service              | `core`, the module helpers, MongoDB access and the CRUD and auth shells.                                              |
| `@smartsoft001/payments-stack` | A service that takes payments | The transaction family and the PayPal, PayU, Paynow and Revolut integrations.                                         |

The split follows what a project runs on rather than where the code sits, so a frontend written in something other than Angular gets its own stack later without `core` or any existing package changing name.

Installing a single library still works and is the right choice when a project needs exactly one, for example only the validators from [`utils`](/docs/packages/utils). Every package page shows its own install command.

---

## Angular

One command installs everything an Angular application uses: the UI components, the CRUD screens and the framework-agnostic core they are built on.

{% snippet file="install/install.sh" region="install-angular" /%}

Then register the shared providers in the application config.

{% snippet file="angular/src/getting-started/app-config.example.ts" region="usage" /%}

Each entry earns its place. `provideRouter` is required because the framework's page components navigate between list and item routes. `provideHttpClient` backs the services that talk to the backend. `provideTranslateService` is not optional: `SharedModule` injects `TranslateService` in its constructor to install the default translations and language, so the application fails to start without it. `importProvidersFrom(SharedModule)` pulls in the module itself, which exports the shared factories, services, pipes, pages and directives that the UI components rely on.

With that in place a component can use the framework's elements directly, as the `smart-button` sample on the [home page](/) shows.

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

- [Architecture](/docs/architecture) follows one entity from its decorators to a generated screen.
- [Introduction](/docs/introduction) lists the packages and how they are layered.

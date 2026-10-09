---
title: Overview
section: CRUD
order: 1
frameworks: [angular, react]
nextjs:
  metadata:
    title: CRUD overview
    description: How the crud family turns one decorated model and one configuration object into generated Angular or React screens and generic REST endpoints.
---

One decorated model and one configuration object produce both halves of a feature: the list and item screens in the browser, and the REST endpoints that serve them. {% .lead %}

---

## What the family generates

The crud packages are a container layer, not a component library. Nothing about a screen is written by hand: the entity is described with decorators, the behaviour of its screens is described with a configuration object, and the engine composes the generated UI out of the free components of the UI library, [`@smartsoft001/angular`](/docs/packages/angular) or [`@smartsoft001/react`](/docs/packages/react).

{% framework name="angular" %}

On the frontend that yields two page components. `smart-crud-list-page` renders the collection with its search box, filters, pagination, sorting, selection and export. `smart-crud-item-page` renders one record in create, details or update mode. Neither takes an input: both read the configuration that was provided for the feature.

{% /framework %}

{% framework name="react" %}

On the frontend that yields two page components. `SmartCrudListPage` renders the collection with its search box, filters, pagination, selection and export. `SmartCrudItemPage` renders one record in create, details or update mode. Neither takes the configuration as a prop: both read the one of the `CrudProvider` around them. Their props say only where they sit, `basePath` and, for the item page, the record's `id`, because the React shell does not depend on a router.

{% /framework %}

On the backend the same description yields a generic controller. With `restApi` enabled, `CrudShellNestjsModule.forRoot` registers create, bulk create, read by id, read a filtered page, replace, patch and delete, all guarded by the JWT strategy and the permission map. [Architecture](/docs/architecture) lists the routes.

## The three inputs

Every generated screen is the product of three things, and nothing else.

| Input             | Where it lives                                                             | What it decides                                                                                      |
| ----------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Decorators**    | `@Model` and `@Field` from [`@smartsoft001/models`](/docs/packages/models) | What each field is: its type, the editor it gets, its validation, and which operations may touch it. |
| **Configuration** | A `CrudFullConfig<T>` provided per feature                                 | What the screens do with those fields: the endpoint, the buttons, search, export, paging, sorting.   |
| **Engine**        | The page components and the dynamic components they resolve                | Which child components are instantiated at runtime from the first two.                               |

Because the engine reads metadata rather than markup, one pair of page components serves every entity in an application, and a screen changes by changing the description. In Angular the configuration is provided by `CrudModule.forFeature` and the pages resolve their children through `CreateDynamicComponent`; in React it is the `config` of a `CrudProvider`, and the pages resolve their bodies through the `components` registry of `SmartProvider`.

---

## Wiring the frontend

{% framework name="angular" %}

A feature module registers the CRUD slice with `CrudModule.forFeature`.

{% snippet file="angular/src/crud/crud-module.example.ts" region="usage" /%}

`forFeature` returns the core module when `routing` is false and the full module when it is true. Either way it provides the configuration under both `CrudConfig` and `CrudFullConfig`, derives `FILE_SERVICE_CONFIG` from `apiUrl` so attachment fields resolve their URLs, and registers either the real socket service or an inert stub depending on `socket`. The module constructor then registers the entity's reducer and starts the effects. With `routing: true` the full module also adds three child routes: the empty path renders the list page, `add` renders the item page in create mode, and `:id` renders it for one record.

### Root injector prerequisites

The feature module is not self-contained. NgRx has to be present at the **application** injector before any CRUD feature is imported, because `Actions`, `EffectSources` and `EffectsRunner` are provided in root and resolve their `Store` there.

| Registration                | Why it is required                                                                           |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| `StoreModule.forRoot({})`   | The feature reducer is added to this store at runtime, keyed by `entity`.                    |
| `EffectsModule.forRoot([])` | The CRUD effects call `init()` from the module constructor and need the root effects runner. |
| `NgrxSharedModule`          | Connects the static store reference that `forFeature` uses to register the reducer.          |
| `TranslateModule.forRoot()` | Labels resolve through `MODEL.<key>` translation keys; without it the raw keys are rendered. |
| `RouterModule.forRoot(…)`   | The pages navigate between the list and the item routes.                                     |

[Installation](/docs/installation) covers the shared Angular providers that sit alongside these.

{% /framework %}

{% framework name="react" %}

A `CrudProvider` sets the feature up for everything rendered inside it, and `SmartCrudPages` puts its screens on the map.

{% snippet file="react/src/crud/crud-provider.example.tsx" region="usage" /%}

`CrudProvider` creates a `CrudService` against `apiUrl`, a store named after `entity` with the effects that turn its actions into requests, the `CrudFacade` over that store, and a file service pointed at `apiUrl`, so attachment fields resolve their URLs against the feature. `SmartCrudPages` then renders the list page on `basePath`, the item page in create mode on `basePath/add` and the item page of one record on `basePath/:id`, and nothing on any other path. It follows the URL of the navigation adapter of `SmartProvider`, `window.history` unless the application passes its own, so no router is needed. An application with a router renders the two pages from its own routes instead, as the [list page](/docs/crud/list-page) and the [item page](/docs/crud/item-page) show.

The configuration is a module constant on purpose: `CrudProvider` creates its service and facade again for every new `config` object, while the store stays with the entity. Memoise it when a component builds it.

### Root prerequisites

There is no store to register. Each entity gets one store per `SmartProvider`, kept in a registry of the provider's HTTP client, so two `CrudProvider`s of the same entity share the list and the selection, while two applications rendered in one process stay apart. What the feature does need is one `SmartProvider` above every `CrudProvider`.

| What `SmartProvider` supplies | Why the CRUD screens need it                                                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| The HTTP client, `http`       | The service of every feature sends its requests through it; the default client adds the bearer token of `AuthService`.             |
| The navigation adapter        | `SmartCrudPages` follows its URL, and the add button, the row links and the item page after a save navigate through it.            |
| The translations              | Labels resolve through `MODEL.<key>` translation keys; a key without an entry is rendered as it is.                                |
| The services                  | The menu service holds the filters and multiselect panels, the modal service the export, the toast and alert services the prompts. |

[Installation](/docs/installation) covers the provider and the stylesheets that sit at the root of a React application.

{% /framework %}

## Wiring the backend

The server side takes one module import, configured once per feature.

{% snippet file="node/src/crud/crud-module.example.ts" region="usage" /%}

`tokenConfig` feeds the JWT strategy that guards the write routes, `permissions` maps each operation to the roles allowed to perform it, and `db` is the MongoDB collection the repository reads. The `apiUrl` in the frontend configuration, Angular or React, points at wherever this module is mounted.

{% callout type="note" title="What the details mode does" %}
Setting `details` on the configuration makes the rows of the list open the record on its own route, where the item page renders it read-only. The list itself never shows an inline detail panel, so use `edit` as well when the record also has to be editable.
{% /callout %}

---

## Where each concern lives

| Package                                                             | Role                                                                                                     |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [`crud-domain`](/docs/packages/crud-domain)                         | The entities and business rules, free of any framework.                                                  |
| [`crud-shell-angular`](/docs/packages/crud-shell-angular)           | The Angular pages, filter widgets, export and multiselect components, the NgRx slice and the facade.     |
| [`crud-shell-react`](/docs/packages/crud-shell-react)               | The React pages, filter widgets, export and multiselect components, the store per entity and the facade. |
| [`crud-shell-nestjs`](/docs/packages/crud-shell-nestjs)             | The generic controller, the websocket gateway and the auth guards.                                       |
| [`crud-shell-dtos`](/docs/packages/crud-shell-dtos)                 | The shapes that cross the network.                                                                       |
| [`crud-shell-app-services`](/docs/packages/crud-shell-app-services) | The application services the NestJS shell resolves from its injector.                                    |

---

## Where next

- [Configuration](/docs/crud/configuration) documents every field of `CrudConfig` and `CrudFullConfig`.
- [List page](/docs/crud/list-page) covers what the list page renders and the facade behind it.
- [Item page](/docs/crud/item-page) covers the create, details and update modes.
- [Filters and search](/docs/crud/filters-and-search) follows a filter from the model metadata to the database query.
- [Export, multiselect and groups](/docs/crud/export-multiselect-groups) covers the three list-level features.

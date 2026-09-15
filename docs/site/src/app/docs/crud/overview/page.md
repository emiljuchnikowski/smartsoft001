---
title: Overview
section: CRUD
order: 1
nextjs:
  metadata:
    title: CRUD overview
    description: How the crud family turns one decorated model and one configuration object into generated Angular screens and generic REST endpoints.
---

One decorated model and one configuration object produce both halves of a feature: the list and item screens in the browser, and the REST endpoints that serve them. {% .lead %}

---

## What the family generates

The crud packages are a container layer, not a component library. Nothing about a screen is written by hand: the entity is described with decorators, the behaviour of its screens is described with a configuration object, and the engine composes the generated UI out of the free components of [`@smartsoft001/angular`](/docs/packages/angular).

On the frontend that yields two page components. `smart-crud-list-page` renders the collection with its search box, filters, pagination, sorting, selection and export. `smart-crud-item-page` renders one record in create, details or update mode. Neither takes an input: both read the configuration that was provided for the feature.

On the backend the same description yields a generic controller. With `restApi` enabled, `CrudShellNestjsModule.forRoot` registers create, bulk create, read by id, read a filtered page, replace, patch and delete, all guarded by the JWT strategy and the permission map. [Architecture](/docs/architecture) lists the routes.

## The three inputs

Every generated screen is the product of three things, and nothing else.

| Input             | Where it lives                                                             | What it decides                                                                                      |
| ----------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Decorators**    | `@Model` and `@Field` from [`@smartsoft001/models`](/docs/packages/models) | What each field is: its type, the editor it gets, its validation, and which operations may touch it. |
| **Configuration** | A `CrudFullConfig<T>` provided per feature                                 | What the screens do with those fields: the endpoint, the buttons, search, export, paging, sorting.   |
| **Engine**        | `CreateDynamicComponent` and the page components                           | Which child components are instantiated at runtime from the first two.                               |

Because the engine reads metadata rather than markup, one pair of page components serves every entity in an application, and a screen changes by changing the description.

---

## Wiring the frontend

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

## Wiring the backend

The server side takes one module import, configured once per feature.

{% snippet file="node/src/crud/crud-module.example.ts" region="usage" /%}

`tokenConfig` feeds the JWT strategy that guards the write routes, `permissions` maps each operation to the roles allowed to perform it, and `db` is the MongoDB collection the repository reads. The `apiUrl` in the Angular configuration points at wherever this module is mounted.

{% callout type="warning" title="The details mode throws on the list page" %}
Setting `details` on the configuration makes the list page build detail options without a detail component, and the shared list component rejects that with `Error: Must set details component` while it is initialising. The rest of the page never renders. Until that is fixed, leave `details` off the configuration and use `edit` to open a record on its own route.
{% /callout %}

---

## Where each concern lives

| Package                                                             | Role                                                                                         |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [`crud-domain`](/docs/packages/crud-domain)                         | The entities and business rules, free of any framework.                                      |
| [`crud-shell-angular`](/docs/packages/crud-shell-angular)           | The pages, filter widgets, export and multiselect components, the NgRx slice and the facade. |
| [`crud-shell-nestjs`](/docs/packages/crud-shell-nestjs)             | The generic controller, the websocket gateway and the auth guards.                           |
| [`crud-shell-dtos`](/docs/packages/crud-shell-dtos)                 | The shapes that cross the network.                                                           |
| [`crud-shell-app-services`](/docs/packages/crud-shell-app-services) | The application services both shells resolve from their injector.                            |

---

## Where next

- [Configuration](/docs/crud/configuration) documents every field of `CrudConfig` and `CrudFullConfig`.
- [List page](/docs/crud/list-page) covers what `smart-crud-list-page` renders and the facade signals behind it.
- [Item page](/docs/crud/item-page) covers the create, details and update modes.
- [Filters and search](/docs/crud/filters-and-search) follows a filter from the model metadata to the database query.
- [Export, multiselect and groups](/docs/crud/export-multiselect-groups) covers the three list-level features.

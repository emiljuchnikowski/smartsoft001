---
title: '@smartsoft001/crud-shell-angular'
section: Packages
order: 15
package: '@smartsoft001/crud-shell-angular'
nextjs:
  metadata:
    title: '@smartsoft001/crud-shell-angular'
    description: 'The Angular CRUD shell: list and item screens, filters, export and multiselect generated from a CrudFullConfig and the model metadata, over an NgRx slice per entity.'
---

Generates the list and item screens of a collection from one configuration object and the model's own metadata, and keeps them on an NgRx slice named after the entity. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/crud-shell-angular @smartsoft001/angular @smartsoft001/domain-core @smartsoft001/models @smartsoft001/utils
```

The manifest declares the four workspace packages above as peer dependencies, pinned to its own version. Everything else the package imports still has to be present in the application: `@angular/common`, `@angular/core`, `@angular/forms` and `@angular/router`, `@ngrx/store` and `@ngrx/effects`, `@ngx-translate/core` for the labels, `ng-dynamic-component` for the pluggable slots, plus `rxjs`, `lodash`, `lodash-decorators` and `moment`.

## What it is

A collection screen is the same screen every time: a list with paging, sorting, a search box, filters, an export button, a row action that opens one record, and a form to add or edit it. This package writes that screen once and reads the differences out of two places. The `CrudFullConfig` says which capabilities the collection has, the `@Model` and `@Field` decorators from [`@smartsoft001/models`](/docs/packages/models) say which columns exist, which editor each one gets and which fields may be filtered.

Registration happens per entity. `CrudModule.forFeature` provides the configuration and installs a reducer under `config.entity` in the store, then starts the effects that turn actions into HTTP calls against `config.apiUrl`. A component reads the result through `CrudFacade`, whose signals are already scoped to that entity, so nothing in application code deals with selectors or action types.

The package layers on top of [`@smartsoft001/angular`](/docs/packages/angular): the pages compose its `smart-list`, `smart-form` and `smart-page` components, and the CRUD-specific pieces here are the filter widgets, the export and multiselect controls and the grouping component.

## Usage

### Root prerequisites

`forFeature` assumes the application injector already carries the pieces it builds on. NgRx must be at the root, because `Actions`, `EffectSources` and `EffectsRunner` are provided in root and have to find a `Store` there, and `NgrxSharedModule` is what connects the static store reference the feature registration writes its reducer through. The full list is `StoreModule.forRoot({})`, `EffectsModule.forRoot([])`, `NgrxSharedModule` and `TranslateModule.forRoot()` from [`@smartsoft001/angular`](/docs/packages/angular)'s ecosystem, plus a `RouterModule` at the root, which the generated routes attach to as child routes.

### Register a feature

{% snippet file="angular/src/crud/crud-module.example.ts" region="usage" /%}

The region registers one collection and exports both the `ModuleWithProviders` it produced and the module that imports it. It passes `routing: false`, which is the variant where the application decides where the screens appear and places `<smart-crud-list-page>` and `<smart-crud-item-page>` itself. With `routing: true` the package adds three child routes instead, `''` for the list, `'add'` and `':id'` for the item.

The configuration it names is a `CrudFullConfig` for a `Note` model; the [CRUD configuration page](/docs/crud/configuration) walks through it field by field.

The spec asserts what the registration produced, without booting the application. `ngModule` is `CrudCoreModule`, which is the branch `routing: false` selects. The same configuration object is provided under both `CrudConfig` and `CrudFullConfig`, by identity, so a component may inject either. And `FILE_SERVICE_CONFIG` is provided as `{ apiUrl }` taken from the configuration, which is how attachment URLs resolve against the same API.

### Read a collection in a component

{% snippet file="angular/src/crud/crud-facade.example.ts" region="usage" /%}

The region is a component that injects `CrudFacade`, triggers a read on init and renders the list. It shows the two things worth knowing about the facade: the signals are plain Angular signals, so `computed` works over them directly, and `list()` is `undefined` until the first read resolves, which is why the template reads a `computed` that falls back to an empty array.

Its spec replaces the facade with an object of writable signals and a Jest mock. It asserts that `read` runs exactly once on init and with an empty filter, that the template renders one row per item and prints each title, that flipping `loading` to true renders the loading message, and that setting `list` back to `undefined` renders no rows at all.

{% callout type="note" title="`details: true` adds no panel to the list" %}
The list page builds its details descriptor with a provider and with component factories, and never sets a `component`. The base list component in [`@smartsoft001/angular`](/docs/packages/angular) accepts that, and no list template renders a detail panel, so the option does not put details inline. What it does is make the rows link to the record's own route, where the item page renders it read-only.
{% /callout %}

## API

### Modules

| Export                           | What it is                                                                                                                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CrudModule.forFeature(options)` | The entry point. Returns `ModuleWithProviders<CrudModule<any>>` whose `ngModule` is `CrudFullModule` when `options.routing` is true and `CrudCoreModule` when it is false. |
| `CrudCoreModule<T>`              | Services, NgRx slice and components, no pages and no routes. The application places the page selectors itself.                                                             |
| `CrudFullModule<T>`              | The same plus the four pages and `RouterModule.forChild` with `''`, `'add'` and `':id'`.                                                                                   |
| `CrudComponentsModule`           | Declares and exports the filter, export, multiselect and group components.                                                                                                 |
| `CrudPipesModule`                | The pipes the generated screens use.                                                                                                                                       |
| `PAGES`                          | `[ItemComponent, ListComponent, ListStandardComponent, ItemStandardComponent]`, the array `CrudFullModule` imports and exports.                                            |

All three module classes run the same constructor: they install the reducer for `config.entity`, using `config.reducerFactory` when one is configured and the built-in reducer otherwise, then call `init()` on the effects.

`forFeature` takes one of two shipped option types, spelled `ICrudModuleOptionsWithRoutng<T>` and `ICrudModuleOptionsWithoutRoutng<T>`. The missing `i` is the published spelling, and the discriminant is `routing`: the first requires `routing: true` with a `CrudFullConfig`, the second `routing: false` with a `CrudConfig`. Both accept an optional `socket` flag, which today only chooses between two empty injectables, `SocketService` when it is on and `NotSocketService` when it is off; neither opens a connection.

### `CrudConfig<T>`

The base configuration, enough for `routing: false`.

| Field            | Type                          | What it does                                                               |
| ---------------- | ----------------------------- | -------------------------------------------------------------------------- |
| `apiUrl`         | `string`                      | Required. The collection endpoint every request is built from.             |
| `entity`         | `string`                      | Required. Names the NgRx slice and keys every selector.                    |
| `type`           | `any`                         | The `@Model`-decorated class the screens read their field metadata from.   |
| `reducerFactory` | `() => any`                   | Replaces the built-in reducer for this entity.                             |
| `baseQuery`      | `Array<ICrudFilterQueryItem>` | Query items merged into every read that does not carry a query of its own. |

### `CrudFullConfig<T>`

Extends `CrudConfig<T>` with everything the generated screens need.

| Field             | Type                                                                                                                                                                                | What it does                                                                                                               |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `title`           | `string`                                                                                                                                                                            | Required. The heading of the generated pages.                                                                              |
| `details`         | `boolean \| { cellPipe?: ICellPipe<T>; components?: { top?: any; bottom?: any } }`                                                                                                  | Rows open the record read-only on the item page. Nothing is rendered inline on the list.                                   |
| `edit`            | `boolean \| { cellPipe?: ICellPipe<T>; components?: { top?: any; bottom?: any } }`                                                                                                  | Whether a record can be edited, and what to render above and below the form.                                               |
| `add`             | `boolean \| { components?: { top?: any; bottom?: any } }`                                                                                                                           | Whether a record can be created, with the same slots.                                                                      |
| `remove`          | `boolean`                                                                                                                                                                           | Whether the list offers a delete action.                                                                                   |
| `search`          | `boolean`                                                                                                                                                                           | Whether the search box appears.                                                                                            |
| `export`          | `boolean`                                                                                                                                                                           | Whether the export control appears.                                                                                        |
| `pagination`      | `{ limit: number }`                                                                                                                                                                 | Page size of the list.                                                                                                     |
| `sort`            | `boolean \| { default?: string; defaultDesc?: boolean }`                                                                                                                            | Whether sorting is offered, and which column starts sorted.                                                                |
| `list`            | `{ cellPipe?: ICellPipe<T>; components?: { top?: any; multi?: any }; mode?: ListMode; paginationMode?: PaginationMode; resetQuery?: 'beforeInit'; groups?: Array<ICrudListGroup> }` | How the list renders: cell formatting, extra slots, layout mode, paging mode, grouping.                                    |
| `buttons`         | `Array<IIconButtonOptions>`                                                                                                                                                         | Extra buttons in the page header.                                                                                          |
| `inputComponents` | `{ [key: string]: Type<InputBaseComponent<T>> }`                                                                                                                                    | Replaces the editor for a named field with a custom component.                                                             |
| `cssClass`        | `string`                                                                                                                                                                            | Declarative styling hook. Partial today: the file notes that threading it into the list and page options is still to come. |
| `variant`         | `SmartPageVariant`                                                                                                                                                                  | The page variant, with the same caveat.                                                                                    |

`ICellPipe`, `ListMode`, `PaginationMode`, `SmartPageVariant`, `IIconButtonOptions` and `InputBaseComponent` all come from [`@smartsoft001/angular`](/docs/packages/angular). Both config classes are `@Injectable()`, which is what lets `forFeature` provide the same plain object under either token.

### Pages

| Class                   | Selector                        | Notes                                                                                            |
| ----------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------ |
| `ListComponent<T>`      | `smart-crud-list-page`          | The list screen. Resolves its implementation through the `crud-list-page` dynamic component key. |
| `ListStandardComponent` | `smart-crud-list-standard-page` | The default implementation behind it.                                                            |
| `ItemComponent<T>`      | `smart-crud-item-page`          | The add and edit screen, keyed as `crud-item-page`.                                              |
| `ItemStandardComponent` | `smart-crud-item-standard-page` | The default implementation behind it.                                                            |

Both base classes, `CrudListPageBaseComponent` and `CrudItemPageBaseComponent`, are exported so an application can supply its own implementation for the dynamic key.

### Components

`smart-crud-filters` and its configuration counterpart `smart-crud-filters-config` render the filter bar; `smart-crud-filter` dispatches to the widget matching the field type, and the widgets are `smart-crud-filter-check`, `-date`, `-date-time`, `-date-with-edit`, `-flag`, `-int`, `-radio` and `-text`. A field joins the bar by declaring `@Field({ filter: true, fieldType: ... })`. Alongside them, `smart-crud-export` renders the export control, `smart-crud-multiselect` the bulk selection and `smart-crud-group` the grouping header.

### Services

| Service             | Scope                        | What it does                                                                                                                                                                                                                                                  |
| ------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CrudService<T>`    | Provided by the CRUD modules | The HTTP client for the collection, against `config.apiUrl`: `create`, `createMany`, `getById`, `exportList`, `update`, `updatePartial`, `updatePartialMany`, `delete`. The effects call it, application code rarely does.                                    |
| `PageService<T>`    | Provided by the CRUD modules | `checkPermissions()`. Reads the model's `create`, `update` and `remove` permissions and turns `add`, `edit` or `remove` off in the configuration when the signed-in user lacks them.                                                                          |
| `CrudSearchService` | `providedIn: 'root'`         | The search box state, shared across features. `setFilter` and `setEnabled` write it, `filter`, `enabled`, `filter$` and `enabled$` read it, and both readers report an empty filter while search is disabled. Note the class name, it is not `SearchService`. |

### `CrudFacade<T>`

Injected by the generated screens and by application components. Every member is already bound to `config.entity`.

The read side is nine readonly signals: `loaded`, `loading`, `selected`, `multiSelected`, `list`, `filter`, `totalCount`, `links` and `error`. `loading` is the negation of `loaded`, so it starts true; `list`, `selected` and the rest are `undefined` until the first matching action resolves.

The write side is thirteen methods, each dispatching one action: `create(item)`, `createMany(items, options)`, `read(filter = {})`, `clear()`, `select(id)`, `unselect()`, `multiSelect(items)`, `update(item)`, `updatePartial(item)`, `updatePartialMany(items)`, `delete(id)` and `export(filter = {}, format?)`. `read` is the one that adds something: when the filter carries no `query`, it substitutes `config.baseQuery`, which is how a collection stays scoped without every caller repeating the condition.

### Providers

`CrudModelLabelProvider` supplies the column and field labels. It delegates to an application-level `IModelLabelProvider` higher in the injector tree when one exists, and otherwise translates `'MODEL.' + key` through `TranslateService`, which is why `TranslateModule.forRoot()` is a prerequisite.

`ICrudModelPossibilitiesProvider` and `CRUD_MODEL_POSSIBILITIES_PROVIDER` are exported but deprecated in favour of `IModelPossibilitiesProvider` and `MODEL_POSSIBILITIES_PROVIDER` from [`@smartsoft001/angular`](/docs/packages/angular). New code should use the latter.

## Where to go next

This page is the package surface. The screens it generates, and the options that shape them, are documented in the CRUD section:

- [Overview](/docs/crud/overview), what the shell builds and how the pieces fit.
- [Configuration](/docs/crud/configuration), the `CrudFullConfig` walked through on a worked example.
- [List page](/docs/crud/list-page) and [item page](/docs/crud/item-page), the two generated screens.
- [Filters and search](/docs/crud/filters-and-search), how a field becomes a filter widget.
- [Export, multiselect and groups](/docs/crud/export-multiselect-groups), the three list add-ons.

## Related packages

- [`@smartsoft001/angular`](/docs/packages/angular) provides the components, services and form factory these screens compose.
- [`@smartsoft001/models`](/docs/packages/models) provides the decorators the screens read their fields from.
- [`@smartsoft001/crud-shell-nestjs`](/docs/packages/crud-shell-nestjs) serves the endpoints this package calls.
- [`@smartsoft001/domain-core`](/docs/packages/domain-core) defines the `IEntity<string>` bound every entity here satisfies.

# 📦 @smartsoft001/crud-shell-angular

![npm](https://img.shields.io/npm/v/@smartsoft001/crud-shell-angular) ![downloads](https://img.shields.io/npm/dm/@smartsoft001/crud-shell-angular)

## 🧭 Overview

`@smartsoft001/crud-shell-angular` is the **config / metadata-driven container layer** for
CRUD screens — **not** a primitive-component library. You do not place a table here, a form
there, and wire them by hand. Instead you describe **what** the entity is (model decorators)
and **how** its screens should behave (a config object), and the engine **generates** the UI.

Three inputs drive every screen:

1. **Model decorators** — `@Model` / `@Field` from `@smartsoft001/models`, plus a `FieldType`
   per field. These describe the entity's shape, labels, validation and which fields appear in
   list / details / edit / filters.
2. **A `CrudFullConfig`** — declares the API endpoint, the entity name, and the screen behavior
   (title, pagination, search, export, sort, list mode, groups, buttons, styling, …).
3. **The engine** — `CreateDynamicComponent` and the page components read the config + model
   metadata and instantiate the right children dynamically.

The **free** library renders with the free `@smartsoft001/angular` components (Tailwind +
signals, OnPush, HTML-template-first). The **pro** library
(`@smartsoft001/pro-crud-shell-angular`, FRA-294) does **not** fork these screens — it
**extends the `@Directive()` base classes exported here** and registers richer `smartpro-*`
implementations via the base + token precedent established in `@smartsoft001/angular`.

## 🚀 Usage

```bash
npm i @smartsoft001/crud-shell-angular
```

### 1. Describe the entity with model decorators

```typescript
import { Model, Field, FieldType } from '@smartsoft001/models';

@Model({ name: 'user' })
export class User {
  @Field({ list: true, details: true, create: true, update: true })
  firstName!: string;

  @Field({ list: true, details: true, create: true, update: true })
  lastName!: string;

  @Field({
    list: true,
    filter: true,
    fieldType: FieldType.flag,
  })
  active!: boolean;
}
```

### 2. Declare a `CrudFullConfig`

```typescript
import { CrudFullConfig } from '@smartsoft001/crud-shell-angular';
import { ListMode, PaginationMode } from '@smartsoft001/angular';

export const userConfig: CrudFullConfig<User> = {
  // CrudConfig (base)
  apiUrl: 'https://api.example.com',
  entity: 'user',
  type: User,

  // CrudFullConfig
  title: 'Users',
  details: true,
  edit: true,
  add: true,
  remove: true,
  search: true,
  export: true,
  pagination: { limit: 25 },
  sort: { default: 'lastName', defaultDesc: false },
  list: {
    mode: ListMode.desktop,
    paginationMode: PaginationMode.singlePage,
  },

  // Declarative styling (tier 2)
  cssClass: 'smart:bg-gray-50',
  variant: 'standard',
};
```

### 3. Register the module

```typescript
import { CrudModule } from '@smartsoft001/crud-shell-angular';

@NgModule({
  imports: [
    CrudModule.forFeature({
      routing: true, // true -> CrudFullModule (with pages/routing); false -> CrudCoreModule
      config: userConfig,
      // socket: true, // opt-in realtime provider wiring (inert stub today)
    }),
  ],
})
export class UserModule {}
```

### 4. Place the pages

The engine-generated container pages are the **only** hand-placed entry points:

```html
<!-- List screen (page, search, end-buttons, generated list) -->
<smart-crud-list-page></smart-crud-list-page>

<!-- Item screen (create / update / details) -->
<smart-crud-item-page></smart-crud-item-page>
```

When `routing: true`, `CrudFullModule` wires these pages into routes for you.

## ⚙️ Configuration

### `CrudConfig<T>` (base)

| Property         | Type                          | Description                                                      |
| ---------------- | ----------------------------- | --------------------------------------------------------------- |
| `apiUrl`         | `string`                      | Backend base URL (also fed to `FILE_SERVICE_CONFIG`)            |
| `entity`         | `string`                      | Entity name — keys the NgRx reducer registration               |
| `type`           | `any`                         | Model class decorated with `@Model` / `@Field`                 |
| `reducerFactory` | `() => any`                   | Optional custom reducer factory (defaults to `getReducer`)      |
| `baseQuery`      | `Array<ICrudFilterQueryItem>` | Optional always-applied query items                             |

### `CrudFullConfig<T>` (extends `CrudConfig<T>`)

| Property          | Type                                                          | Description                                                                                |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `title`           | `string`                                                     | Page title (translated)                                                                     |
| `details`         | `boolean \| { cellPipe?; components?: { top?; bottom? } }`   | Enable details view; optionally a `cellPipe` and top/bottom dynamic components              |
| `edit`            | `boolean \| { cellPipe?; components?: { top?; bottom? } }`   | Enable edit; optional cell pipe and top/bottom components                                   |
| `add`             | `boolean \| { components?: { top?; bottom? } }`              | Enable create; optional top/bottom components                                               |
| `remove`          | `boolean`                                                    | Enable row remove                                                                           |
| `search`          | `boolean`                                                    | Enable the page search bar                                                                  |
| `export`          | `boolean`                                                    | Enable the export control                                                                   |
| `pagination`      | `{ limit: number }`                                          | Page size                                                                                   |
| `sort`            | `boolean \| { default?: string; defaultDesc?: boolean }`     | Enable sort; optional default column + direction                                           |
| `list`            | `{ cellPipe?; components?: { top?; multi? }; mode?; paginationMode?; resetQuery?; groups? }` | List behavior (see below)                          |
| `buttons`         | `Array<IIconButtonOptions>`                                  | Extra header/end buttons rendered through `<smart-page>`                                    |
| `inputComponents` | `{ [key: string]: Type<InputBaseComponent<T>> }`            | Per-field input component overrides (keyed by field name)                                   |
| `cssClass`        | `string`                                                     | **Tier-2 styling** — forwarded to `<smart-page [class]>` on the list/item pages             |
| `variant`         | `SmartPageVariant`                                           | **Tier-2 styling** — threaded into `pageOptions().variant` to pick a `<smart-page>` variant |

`list` sub-fields:

| Field            | Type                                | Description                                                  |
| ---------------- | ----------------------------------- | ------------------------------------------------------------ |
| `mode`           | `ListMode`                          | `desktop` / `mobile` / `masonryGrid` list rendering          |
| `paginationMode` | `PaginationMode`                    | `singlePage` / `infiniteScroll`                              |
| `groups`         | `Array<ICrudListGroup>`             | Grouped (accordion) list sections                            |
| `components`     | `{ top?; multi? }`                  | Dynamic top component + multi-select action component        |
| `cellPipe`       | `ICellPipe<T>`                      | Per-cell value transform                                     |
| `resetQuery`     | `'beforeInit'`                      | Reset the active filter query before first read              |

## 🧩 Components

The CRUD module exposes the following selectors. Only the **page** components and `smart-crud-export`
are normally hand-placed; the rest are mounted by the engine / containers.

| Selector                                | Purpose                                                                      |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| `smart-crud-list-page`                  | List container page (wraps `<smart-page>`; search, header buttons, list)     |
| `smart-crud-item-page`                  | Item container page (create / update / details; mode action buttons)         |
| `smart-crud-export`                     | Export control + post-export popover                                         |
| `smart-crud-filters`                    | Filters panel (header, scrollable list of per-field filters)                 |
| `smart-crud-filters-config`             | Active-filter chips (dismissible badges; remove active query)                |
| `smart-crud-multiselect`               | Multi-select header / action bar (`selected: N`, close)                      |
| `smart-crud-group`                      | Grouped list disclosure (accessible HTML accordion, two-way `show`)          |
| `smart-crud-filter`                     | **Filter dispatcher** — switches on `FieldType` to the right widget below    |
| `smart-crud-filter-text`                | Text filter                                                                  |
| `smart-crud-filter-int`                 | Integer filter (value + advanced min/max range)                             |
| `smart-crud-filter-flag`                | Boolean flag filter                                                          |
| `smart-crud-filter-radio`               | Single-choice (radio) filter                                                |
| `smart-crud-filter-check`               | Multi-choice (checkbox list) filter                                         |
| `smart-crud-filter-date`                | Single-date filter                                                          |
| `smart-crud-filter-date-time`           | Datetime "from"/"to" range filter                                          |
| `smart-crud-filter-date-with-edit`      | Editable-date filter (value + advanced min/max range)                       |

> The page component selectors have `*-standard` variant children
> (`smart-crud-list-standard-page`, `smart-crud-item-standard-page`) that hold the actual
> generated body; the public wrappers above are what you place.

## 🔎 Filter widgets

`smart-crud-filter` is a dispatcher: it reads `item().fieldType` and renders the matching widget
(`@switch` on `FieldType`, `text` as default). Each widget reuses the **shared input components**
from `@smartsoft001/angular` wherever the shape fits, is authored **OnPush**, and binds through a
reactive `FormControl` bridged to the filter state by the base class.

| `FieldType`     | Widget                             | Rendering                                                                  |
| --------------- | ---------------------------------- | -------------------------------------------------------------------------- |
| `text` (default)| `smart-crud-filter-text`           | `smart-input-text` (reactive `[formControl]`)                              |
| `flag`          | `smart-crud-filter-flag`           | `smart-input-flag`                                                          |
| `radio`         | `smart-crud-filter-radio`          | `smart-input-radio` (+ possibilities bridge)                              |
| `int`           | `smart-crud-filter-int`            | `smart-input-int` for the value; native Tailwind "from"/"to" range inputs  |
| `check`         | `smart-crud-filter-check`          | Native Tailwind checkbox list (scalar-id + array value shape)             |
| `date`          | `smart-crud-filter-date`           | `smart-date-edit`                                                          |
| `dateTime`      | `smart-crud-filter-date-time`      | Native `<input type="datetime-local">` "from"/"to"                        |
| `dateWithEdit`  | `smart-crud-filter-date-with-edit` | `smart-date-edit` + native "from"/"to" range                              |

Notes:

- **Possibilities** (radio / check options) flow through `options.possibilities` on the shared
  input. The base class maps `possibilities` into the `{ id, text, checked }` shape via
  `buildInputOptions(control, withPossibilities)`. Possibilities resolve from
  `item.possibilities`, and (when provided) the deprecated
  `CRUD_MODEL_POSSIBILITIES_PROVIDER` keyed by `config.type` + field key.
- **Labels** resolve via the shared `ModelLabelPipe`. The CRUD module ships a default
  `CrudModelLabelProvider` (registered for `IModelLabelProvider`) which delegates to an
  app-level `IModelLabelProvider` higher in the injector tree if one exists, otherwise translates
  `MODEL.<key>`. An app can override it.
- The base class exposes `bindControl(type)` / `bindValueControl()` (reactive bridge to the
  `value` / `>=` / `<=` query slots), and OnPush-safe `hasValue` / `hasMinValue` / `hasMaxValue`
  computed signals for clear-button visibility.

## 🎨 Styling (3-tier)

CRUD styling is layered so apps can reach for the lightest tool that does the job:

1. **Tailwind theme (`smart:` prefix).** All CRUD templates use the prefixed Tailwind utilities
   shared with `@smartsoft001/angular`. Theme tokens flow from the host app's Tailwind config.
2. **Declarative `cssClass` / `variant` on `CrudFullConfig`.** These are threaded into the page:
   `config.variant` drives `pageOptions().variant` (which `<smart-page>` variant renders) and
   `config.cssClass` is bound as `[class]` on the `<smart-page>` of the list/item screens.
3. **`class` on the hand-placed entry points only** — `smart-crud-list-page`,
   `smart-crud-item-page`, `smart-crud-export`. Engine-generated leaf components are mounted
   dynamically and do **not** expose a `class` input; style them through tiers 1–2.

## 🧬 Extending (pro / custom)

Every container component is split into a thin `@Directive()` base class (logic only) and a
concrete implementation, so the **pro** library can extend the logic and supply its own template
via the base + token precedent from `@smartsoft001/angular`.

Exported base classes (from the package barrel):

| Base class                | Concrete                  | Extend to customize                          |
| ------------------------- | ------------------------- | -------------------------------------------- |
| `ExportBaseComponent`     | `smart-crud-export`       | Export trigger + post-export popover logic   |
| `MultiselectBaseComponent`| `smart-crud-multiselect`  | Multi-select header / action bar             |
| `FiltersBaseComponent`    | `smart-crud-filters`      | Filters panel container                      |
| `GroupBaseComponent`      | `smart-crud-group`        | Grouped-list disclosure                      |
| `BaseComponent` (filter)  | `smart-crud-filter-*`     | Per-`FieldType` filter widget logic          |

The pro library (`@smartsoft001/pro-crud-shell-angular`, FRA-294) provides `smartpro-*` variants
that `extends` these bases — for example a rich `smartpro-accordion`-backed group — registered
through the same InjectionToken override pattern used across `@smartsoft001/angular` (the
`*_STANDARD_COMPONENT_TOKEN` precedent).

## 🅰️ Angular 22 readiness

- Components are authored **OnPush**.
- The form model stays **reactive** (`FormFactory` / `UntypedFormGroup`); signal-forms are a
  planned **additive** step, not a rewrite.
- `HttpClient` works under the Fetch backend; no XHR-specific assumptions.

## 📚 Storybook

```bash
nx storybook crud-shell-angular
```

## 🧪 Unit tests

```bash
nx test crud-shell-angular
```

## 🤝 Contributing

Contributions are welcome! 🎉

1. Fork the repository.
2. Create a feature branch: git checkout -b feature/my-new-feature.
3. Commit your changes: git commit -m 'Add some feature'.
4. Push to the branch: git push origin feature/my-new-feature.
   Submit a pull request.

For more details, see our [Contributing Guidelines](../../../../CONTRIBUTING.md).

## 📝 Changelog

All notable changes to this project will be documented in the [CHANGELOG](../../../../CHANGELOG.md).

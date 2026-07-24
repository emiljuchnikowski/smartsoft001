---
name: smart-crud
description: CRUD module API — config-driven list/item pages, filters, export, multiselect and groups in @smartsoft001/crud-shell-angular. Use when building or customizing CRUD screens, filters, or extending CRUD components.
user-invocable: false
---

# CRUD Module (`@smartsoft001/crud-shell-angular`)

The CRUD module is the **config / metadata-driven container layer** for CRUD screens. It is not a
primitive-component library: you describe the entity (model decorators) and the screen behavior (a
config object), and the engine **generates** the UI by composing free `@smartsoft001/angular`
components. This skill describes how to interact with the module and its code.

## When to Use This Skill

- Building or customizing a CRUD list/item screen
- Configuring or extending filters, export, multiselect or grouped lists
- Working with `CrudModule.forFeature`, `CrudConfig` / `CrudFullConfig`
- Extending CRUD base components (e.g. for the pro library) or providing model-label / possibilities providers

## Architecture

- **Config / metadata-driven.** Three inputs drive every screen: (1) `@Model` / `@Field`
  decorators + `FieldType` from `@smartsoft001/models`; (2) a `CrudFullConfig`; (3) the engine
  (`CreateDynamicComponent` + the page components) which instantiates children dynamically.
- **Engine-generated.** Only the page containers (`smart-crud-list-page`, `smart-crud-item-page`)
  and `smart-crud-export` are hand-placed. Lists, details, forms, filter widgets are mounted by
  the engine from config + model metadata.
- **Base + token.** Each container component is a thin `@Directive()` base (logic only) + concrete
  implementation. Bases are exported from the package barrel so other libraries can `extends` them.
- **Free / pro split.** The free module renders with free `@smartsoft001/angular` components
  (Tailwind `smart:` prefix, signals, OnPush, HTML-template-first). The pro library
  (`@smartsoft001/pro-crud-shell-angular`, FRA-294) extends these base classes and registers
  richer `smartpro-*` implementations. **Pro ships its own companion skill (FRA-294).**

## Module Setup

```typescript
import { CrudModule } from '@smartsoft001/crud-shell-angular';

CrudModule.forFeature({
  routing: true, // true -> CrudFullModule (pages + routing); false -> CrudCoreModule
  config: userConfig, // CrudFullConfig (routing:true) or CrudConfig (routing:false)
  socket: false, // optional realtime provider wiring (inert stub today)
});
```

`forFeature` provides `CrudConfig` / `CrudFullConfig` (from the passed config), `FILE_SERVICE_CONFIG`
(from `config.apiUrl`), and the `SocketService` / `NotSocketService` provider. `CrudCoreModule`
registers the NgRx reducer (`NgrxStoreService.addReducer(config.entity, …)`) and the
`CrudModelLabelProvider` for `IModelLabelProvider`.

## Configuration

### `CrudConfig<T>`

- `apiUrl: string` — backend base URL
- `entity: string` — entity name, keys the reducer
- `type?: any` — `@Model`-decorated class
- `reducerFactory?: () => any` — custom reducer (defaults to `getReducer`)
- `baseQuery?: Array<ICrudFilterQueryItem>` — always-applied query items

### `CrudFullConfig<T>` (extends `CrudConfig<T>`)

- `title: string`
- `details?` / `edit?` — `boolean | { cellPipe?; components?: { top?; bottom? } }`
- `add?` — `boolean | { components?: { top?; bottom? } }`
- `remove?` / `search?` / `export?` — `boolean`
- `pagination?: { limit: number }`
- `sort?` — `boolean | { default?: string; defaultDesc?: boolean }`
- `list?` — `{ cellPipe?; components?: { top?; multi? }; mode?: ListMode; paginationMode?: PaginationMode; resetQuery?: 'beforeInit'; groups?: Array<ICrudListGroup> }`
- `buttons?: Array<IIconButtonOptions>`
- `inputComponents?: { [key: string]: Type<InputBaseComponent<T>> }`
- `cssClass?: string` — **tier-2 styling**, bound as `[class]` on the page `<smart-page>`
- `variant?: SmartPageVariant` — **tier-2 styling**, threaded into `pageOptions().variant`

## Components

| Selector                           | Purpose                                                             |
| ---------------------------------- | ------------------------------------------------------------------- |
| `smart-crud-list-page`             | List container (wraps `<smart-page>`; search, header buttons, list) |
| `smart-crud-item-page`             | Item container (create / update / details; mode action buttons)     |
| `smart-crud-export`                | Export trigger + post-export popover                                |
| `smart-crud-filters`               | Filters panel (header + scrollable per-field filters)               |
| `smart-crud-filters-config`        | Active-filter chips (dismissible badges; removes active query)      |
| `smart-crud-multiselect`           | Multi-select header / action bar (`selected: N`, close)             |
| `smart-crud-group`                 | Grouped-list disclosure (accessible HTML accordion, two-way `show`) |
| `smart-crud-filter`                | **Filter dispatcher** — `@switch` on `FieldType` to the widgets     |
| `smart-crud-filter-text`           | Text filter                                                         |
| `smart-crud-filter-int`            | Integer filter (value + advanced min/max range)                     |
| `smart-crud-filter-flag`           | Boolean flag filter                                                 |
| `smart-crud-filter-radio`          | Single-choice (radio) filter                                        |
| `smart-crud-filter-check`          | Multi-choice (checkbox list) filter                                 |
| `smart-crud-filter-date`           | Single-date filter                                                  |
| `smart-crud-filter-date-time`      | Datetime "from"/"to" range filter                                   |
| `smart-crud-filter-date-with-edit` | Editable-date filter (value + advanced min/max range)               |

The page wrappers have `*-standard` variant children (`smart-crud-list-standard-page`,
`smart-crud-item-standard-page`) that hold the generated body.

## Filter Widgets

`smart-crud-filter` dispatches on `item().fieldType` (default branch = `text`). Each widget reuses
shared `smart-input-*` / `smart-date-edit` where the shape fits, is **OnPush**, and binds via a
reactive `FormControl` bridged to the filter state.

| `FieldType`      | Widget                             | Rendering                                               |
| ---------------- | ---------------------------------- | ------------------------------------------------------- |
| `text` (default) | `smart-crud-filter-text`           | `smart-input-text`                                      |
| `flag`           | `smart-crud-filter-flag`           | `smart-input-flag`                                      |
| `radio`          | `smart-crud-filter-radio`          | `smart-input-radio` (+ possibilities bridge)            |
| `int`            | `smart-crud-filter-int`            | `smart-input-int` + native "from"/"to" range inputs     |
| `check`          | `smart-crud-filter-check`          | Native Tailwind checkbox list (scalar-id + array value) |
| `date`           | `smart-crud-filter-date`           | `smart-date-edit`                                       |
| `dateTime`       | `smart-crud-filter-date-time`      | Native `<input type="datetime-local">` "from"/"to"      |
| `dateWithEdit`   | `smart-crud-filter-date-with-edit` | `smart-date-edit` + native "from"/"to" range            |

**Possibilities bridge.** Radio/check options flow through `options.possibilities` on the shared
input; the base maps them to the `{ id, text, checked }` shape.

**Filter base API** (`BaseComponent<T>`, in `components/filter/base/base.component.ts`):

- `bindControl(type: string | null = null): UntypedFormControl` — builds a reactive control seeded
  from the query slot (`null` -> `value`, `'>='` -> `minValue`, `'<='` -> `maxValue`) and wired so
  every change re-runs the debounced `refresh(v, type)`. `bindValueControl()` is the `null` slot.
- `buildInputOptions(control, withPossibilities = false): InputOptions` — builds the `InputOptions`
  for the shared input; maps `possibilities` into `{ id, text, checked }` when requested.
- `hasValue` / `hasMinValue` / `hasMaxValue` — OnPush-safe `computed` signals for clear-button
  visibility (replace `@if (value)` style checks).
- `value` / `minValue` / `maxValue` getters/setters and `clear()` read/write the filter query slots.
- `item` / `filter` inputs carry the `IModelFilter` and `ICrudFilter` state.

## Styling (3-tier)

1. **Tailwind theme**, `smart:` prefix — all templates use prefixed utilities shared with
   `@smartsoft001/angular`.
2. **Declarative `cssClass` / `variant` on `CrudFullConfig`** — threaded into the page:
   `variant` -> `pageOptions().variant`; `cssClass` -> `[class]` on `<smart-page>`.
3. **`class` on hand-placed entry points only** — `smart-crud-list-page`, `smart-crud-item-page`,
   `smart-crud-export`. Engine-generated leaf components do not expose `class`; style via tiers 1–2.

## Extension Points

Exported `@Directive()` base classes (logic only) — extend + register a `smartpro-*` concrete:

| Base class                 | Concrete                 |
| -------------------------- | ------------------------ |
| `ExportBaseComponent`      | `smart-crud-export`      |
| `MultiselectBaseComponent` | `smart-crud-multiselect` |
| `FiltersBaseComponent`     | `smart-crud-filters`     |
| `GroupBaseComponent`       | `smart-crud-group`       |
| `BaseComponent` (filter)   | `smart-crud-filter-*`    |

Pro extends these via the InjectionToken override precedent from `@smartsoft001/angular`
(`*_STANDARD_COMPONENT_TOKEN`) — e.g. a rich `smartpro-accordion`-backed group.

## Providers

- **`CrudModelLabelProvider`** — registered for `IModelLabelProvider` in `CrudCoreModule` /
  `CrudComponentsModule`. Delegates to an app-level `IModelLabelProvider` higher in the injector
  tree (via `skipSelf`) if present; otherwise translates `MODEL.<key>`. Override at the app level.
- **`CRUD_MODEL_POSSIBILITIES_PROVIDER`** (deprecated; prefer `MODEL_POSSIBILITIES_PROVIDER` from
  `@smartsoft001/angular`) — `InjectionToken<ICrudModelPossibilitiesProvider>`. When provided, the
  filter base resolves possibilities for `config.type` + field key from it (injected `{ optional: true }`).

## Examples

```typescript
import { CrudFullConfig } from '@smartsoft001/crud-shell-angular';
import { ListMode, PaginationMode } from '@smartsoft001/angular';

const config: CrudFullConfig<User> = {
  apiUrl: 'https://api.example.com',
  entity: 'user',
  type: User,
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
    groups: [
      { key: 'active', value: 'true', text: 'Active', show: true },
      { key: 'active', value: 'false', text: 'Inactive' },
    ],
  },
  cssClass: 'smart:bg-gray-50',
  variant: 'standard',
};
```

```html
<smart-crud-list-page></smart-crud-list-page>
<smart-crud-item-page></smart-crud-item-page>
```

Fields participate in filters via `@Field({ filter: true, fieldType: FieldType.* })` on the model;
the engine renders the matching `smart-crud-filter-*` widget through the `smart-crud-filter`
dispatcher inside `smart-crud-filters`.

## File Locations

- Module / config: `packages/crud/shell/angular/src/lib/crud.module.ts`, `crud.config.ts`
- Components: `packages/crud/shell/angular/src/lib/components/` (`export`, `filters`, `filters-config`, `multiselect`, `group`, `filter/*`)
- Pages: `packages/crud/shell/angular/src/lib/pages/{list,item}`
- Providers: `packages/crud/shell/angular/src/lib/providers/{model-label,model-possibilities}`

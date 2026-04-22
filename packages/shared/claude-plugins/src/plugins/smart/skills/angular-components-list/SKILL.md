---
name: angular-components-list
description: List component API with InjectionToken map pattern for custom implementations per mode (desktop/mobile/masonryGrid).
user-invocable: false
---

# List Component

The `<smart-list>` component renders a list of entities. It is a wrapper that dispatches to one of three built-in child components based on `options.mode` or `HardwareService.isMobile` auto-detection. Each mode's child can be replaced via `LIST_MODE_COMPONENTS_TOKEN`, which provides a partial override map — any mode you specify replaces the default child; any mode you omit falls back to the built-in.

## When to Use This Skill

- Developer wants to display a collection of entities with sorting, pagination, or detail drill-down
- Developer asks about `<smart-list>` or `ListComponent`
- Developer wants to provide a custom layout for a specific list mode (desktop, mobile, or masonryGrid)

## Components

### ListComponent (`<smart-list>`)

Main wrapper. Reads `options.mode` (or falls back to `HardwareService.isMobile` for auto mobile detection) and renders the appropriate child via `NgComponentOutlet`. Handles the empty-state display and loading skeleton before delegating to the mode child.

### ListDesktopComponent (`<smart-list-desktop>`)

Default desktop implementation. Uses CDK Table with Tailwind-styled column cells, sortable column headers, and optional remove/detail/item action columns.

### ListMobileComponent (`<smart-list-mobile>`)

Default mobile implementation. Renders a `<ul role="list">` with flex rows, one row per field key, plus optional action icons.

### ListMasonryGridComponent (`<smart-list-masonry-grid>`)

Default masonry-grid implementation. Renders a grid of cards that include image thumbnails and configurable field display.

### ListBaseComponent (abstract)

Abstract base directive. Extend it to build custom list implementations for any mode. Exposes the following from `IListInternalOptions<T>`:

- `fields` — computed array of `{ key, options }` from model decorators
- `keys` — string array of visible column keys (set by `initKeys()`)
- `list` — `Signal<T[]>` from provider
- `loading` — `Signal<boolean>` from provider
- `page` — `Signal<number>` from pagination options
- `totalPages` — `Signal<number>` from pagination options
- `provider` — `IListProvider<T>`
- `itemHandler` — resolved item navigation/select handler
- `removeHandler` — resolved remove handler
- `cellPipe` — `ICellPipe<T>` for cell value transformation
- `cssClass` — string input (alias `class`)

Methods:

- `initKeys()` — populates `keys` from computed `fields`
- `handlePageChange(page: number)` — triggers provider `getData` with updated page

## API

### Inputs

| Input     | Type                           | Default    | Description                                     |
| --------- | ------------------------------ | ---------- | ----------------------------------------------- |
| `options` | `InputSignal<IListOptions<T>>` | _required_ | Full list configuration                         |
| `class`   | `InputSignal<string>`          | `''`       | External CSS classes forwarded via `cssClass()` |

## IListOptions\<T>

```typescript
interface IListOptions<T> {
  provider: IListProvider<T>;
  type: any; // Model class decorated with @Model
  mode?: ListMode;
  pagination?: IListPaginationOptions;
  cellPipe?: ICellPipe<T>;
  componentFactories?: IListComponentFactories<T>;
  sort?:
    | boolean
    | {
        default?: string;
        defaultDesc?: boolean;
      };
  details?:
    | boolean
    | {
        provider?: IDetailsProvider<T>;
        componentFactories?: IDetailsComponentFactories<T>;
        component?: Type<any>;
      };
  item?:
    | boolean
    | {
        options?: ItemOptions;
      };
  remove?:
    | boolean
    | {
        provider?: IRemoveProvider<T>;
      };
  select?: 'multi';
}
```

### IListOptions property reference

| Property             | Type                                                                                  | Default    | Description                                                                         |
| -------------------- | ------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------- |
| `provider`           | `IListProvider<T>`                                                                    | _required_ | Data provider (list signal, loading signal, getData callback)                       |
| `type`               | `any`                                                                                 | _required_ | Model class decorated with `@Model`                                                 |
| `mode`               | `ListMode`                                                                            | -          | Force a specific mode; omit to auto-detect via `HardwareService.isMobile`           |
| `pagination`         | `IListPaginationOptions`                                                              | -          | Pagination config (mode, limit, page signal, totalPages signal, load callbacks)     |
| `cellPipe`           | `ICellPipe<T>`                                                                        | -          | Pipe for transforming each cell value                                               |
| `componentFactories` | `IListComponentFactories<T>`                                                          | -          | Top dynamic component factory                                                       |
| `sort`               | `boolean \| { default?: string; defaultDesc?: boolean }`                              | -          | Enable sorting; optionally set a default sort column and direction                  |
| `details`            | `boolean \| { provider?: IDetailsProvider<T>; componentFactories?: ...; component? }` | -          | Enable detail drill-down; optionally provide a custom details provider or component |
| `item`               | `boolean \| { options?: ItemOptions }`                                                | -          | Enable item row action (navigate or custom select)                                  |
| `remove`             | `boolean \| { provider?: IRemoveProvider<T> }`                                        | -          | Enable row remove action; optionally provide a custom remove provider               |
| `select`             | `'multi'`                                                                             | -          | Enable multi-select mode                                                            |

## IListProvider\<T>

```typescript
interface IListProvider<T> {
  list: Signal<T[]>;
  loading: Signal<boolean>;
  getData: (filter: any) => void;
  onChangeMultiSelected?: (list: T[]) => void;
  onCleanMultiSelected$?: Observable<void>;
}
```

## ListMode

```typescript
enum ListMode {
  mobile = 'mobile',
  desktop = 'desktop',
  masonryGrid = 'masonryGrid',
}
```

## IListPaginationOptions

```typescript
interface IListPaginationOptions {
  mode?: PaginationMode;
  limit: number;
  loadNextPage: () => Promise<boolean>;
  loadPrevPage: () => Promise<boolean>;
  page: Signal<number>;
  totalPages: Signal<number>;
}

enum PaginationMode {
  infiniteScroll = 'infiniteScroll',
  singlePage = 'singlePage',
}
```

## LIST_MODE_COMPONENTS_TOKEN

```typescript
import { LIST_MODE_COMPONENTS_TOKEN, ListMode } from '@smartsoft001/angular';
```

`InjectionToken` that provides a `Partial<Record<ListMode, Type<ListBaseComponent<any>>>>` override map. Any mode key you include replaces the built-in default child for that mode; any mode key you omit continues to use the built-in default.

```typescript
providers: [
  {
    provide: LIST_MODE_COMPONENTS_TOKEN,
    useValue: {
      [ListMode.desktop]: MyCustomDesktopListComponent,
      [ListMode.mobile]: MyCustomMobileListComponent,
      // masonryGrid not specified — falls back to built-in ListMasonryGridComponent
    },
  },
];
```

## Extending the Base Class

```typescript
import { Component, ViewEncapsulation } from '@angular/core';
import { ListBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-list',
  template: `
    <div [class]="cssClass()">
      @for (item of list()(); track item.id) {
        <div class="my-row">
          @for (key of keys; track key) {
            <span>{{ item[key] }}</span>
          }
        </div>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MyCustomListComponent extends ListBaseComponent<any> {}
```

Register with the token so `<smart-list>` picks it up for the target mode:

```typescript
providers: [
  {
    provide: LIST_MODE_COMPONENTS_TOKEN,
    useValue: { [ListMode.desktop]: MyCustomListComponent },
  },
];
```

## Usage Examples

```html
<!-- Basic (auto mode detection) -->
<smart-list [options]="listOptions"></smart-list>

<!-- Force desktop mode -->
<smart-list
  [options]="{ provider: myProvider, type: UserModel, mode: 'desktop' }"
></smart-list>

<!-- With external CSS class -->
<smart-list
  class="smart:p-4"
  [options]="{ provider: myProvider, type: UserModel }"
></smart-list>

<!-- With pagination -->
<smart-list
  [options]="{
    provider: myProvider,
    type: UserModel,
    pagination: {
      limit: 25,
      page: pageSignal,
      totalPages: totalPagesSignal,
      loadNextPage: onLoadNext,
      loadPrevPage: onLoadPrev
    }
  }"
></smart-list>

<!-- With sort and remove -->
<smart-list
  [options]="{
    provider: myProvider,
    type: UserModel,
    sort: { default: 'name' },
    remove: { provider: myRemoveProvider }
  }"
></smart-list>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/list/list.component.ts`
- Desktop child: `packages/shared/angular/src/lib/components/list/desktop/desktop.component.ts`
- Mobile child: `packages/shared/angular/src/lib/components/list/mobile/mobile.component.ts`
- Masonry grid child: `packages/shared/angular/src/lib/components/list/masonry-grid/masonry-grid.component.ts`
- Base class: `packages/shared/angular/src/lib/components/list/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`LIST_MODE_COMPONENTS_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IListOptions`, `IListProvider`, `IListPaginationOptions`, `ListMode`)

# 📦 @smartsoft001/utils

![npm](https://img.shields.io/npm/v/@smartsoft001/utils) ![downloads](https://img.shields.io/npm/dm/@smartsoft001/angular)

## 🚀 Usage

`npm i @smartsoft001/angular`

## 📚 Storybook

To run Storybook locally:

```bash
nx storybook angular
```

This will start the Storybook development server, typically at http://localhost:4400.

## 🤝 Contributing

Contributions are welcome! 🎉

1. Fork the repository.
2. Create a feature branch: git checkout -b feature/my-new-feature.
3. Commit your changes: git commit -m 'Add some feature'.
4. Push to the branch: git push origin feature/my-new-feature.
   Submit a pull request.

For more details, see our [Contributing Guidelines](../../../CONTRIBUTING.md).

## 📝 Changelog

All notable changes to this project will be documented in the [CHANGELOG](../../../CHANGELOG.md).

## Base Components

The following components expose abstract base classes (`@Directive()`) that can be extended to create custom implementations.

### ButtonBaseComponent

Abstract base class for button components. Provides variant/color computation, confirm mode logic, and disabled state handling.

**Inputs:** `options` (`IButtonOptions`), `disabled` (`boolean`), `class` (`string`)

### Button Component

The `<smart-button>` component renders a default `ButtonStandardComponent`. It supports an InjectionToken (`BUTTON_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `ButtonComponent` (selector: `smart-button`)
**Default:** `ButtonStandardComponent` (selector: `smart-button-standard`)
**Token:** `BUTTON_STANDARD_COMPONENT_TOKEN` — provide a `Type<ButtonBaseComponent>` to override the default.

#### Usage

```html
<smart-button [options]="{ click: onClick, variant: 'primary', size: 'md' }">
  Save
</smart-button>
```

#### IButtonOptions

| Property       | Type                                     | Default     | Description                       |
| -------------- | ---------------------------------------- | ----------- | --------------------------------- |
| `click`        | `() => void`                             | *required*  | Click handler                     |
| `variant`      | `'primary' \| 'secondary' \| 'soft'`    | `'primary'` | Color variant                     |
| `size`         | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`      | Button size                       |
| `color`        | `SmartColor`                             | `'indigo'`  | Tailwind color (22 options)       |
| `rounded`      | `boolean`                                | `false`     | Rounded pill shape                |
| `circular`     | `boolean`                                | `false`     | Circular shape (icon buttons)     |
| `iconPosition` | `'leading' \| 'trailing'`               | -           | Icon placement                    |
| `confirm`      | `boolean`                                | `false`     | Show confirmation before click    |
| `loading`      | `Signal<boolean>`                        | -           | Show loading spinner              |
| `type`         | `'submit' \| 'button'`                  | `'button'`  | HTML button type                  |

#### Overriding with Custom Implementation

```typescript
import { BUTTON_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  { provide: BUTTON_STANDARD_COMPONENT_TOKEN, useValue: MyButtonComponent },
]
```

### DetailsBaseComponent

Abstract base class for details components. Computes `fields` from model decorators (`@Field({ details: true })`) with permission/specification filtering, exposes the typed `item` signal, and supports `cellPipe` and `componentFactories`.

**Inputs:** `options` (`IDetailsOptions<T>`), `class` (`string`)

### Details Component

The `<smart-details>` component renders a list of model fields decorated with `@Field({ details: true })`. It is a wrapper that delegates to `DetailsStandardComponent` by default and supports an InjectionToken (`DETAILS_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `DetailsComponent` (selector: `smart-details`)
**Default:** `DetailsStandardComponent` (selector: `smart-details-standard`)
**Token:** `DETAILS_STANDARD_COMPONENT_TOKEN` — provide a `Type<DetailsBaseComponent<T>>` to override the default.

#### Usage

```html
<!-- Basic -->
<smart-details
  [options]="{ type: UserModel, item: userSignal }"
></smart-details>

<!-- With external CSS class -->
<smart-details
  class="smart:bg-yellow-50 smart:p-4"
  [options]="{ type: UserModel, item: userSignal }"
></smart-details>

<!-- With loading skeleton -->
<smart-details
  [options]="{ type: UserModel, item: userSignal, loading: loadingSignal }"
></smart-details>
```

#### IDetailsOptions

| Property             | Type                                | Default    | Description                                              |
| -------------------- | ----------------------------------- | ---------- | -------------------------------------------------------- |
| `type`               | `Type<T>`                           | *required* | Model class decorated with `@Model`                      |
| `item`               | `Signal<T \| undefined>`            | *required* | Reactive entity signal                                   |
| `loading`            | `Signal<boolean>`                   | -          | Show loading skeleton                                    |
| `cellPipe`           | `ICellPipe<T>`                      | -          | Pipe for transforming each field value                   |
| `componentFactories` | `IDetailsComponentFactories<T>`     | -          | Top/bottom dynamic component factories                   |

#### Overriding with Custom Implementation

```typescript
import { DETAILS_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  { provide: DETAILS_STANDARD_COMPONENT_TOKEN, useValue: MyDetailsComponent },
]
```

### FormBaseComponent

Abstract base class for form components. Holds reactive form logic: computes `fields` from `form.controls`, exposes `model`, `mode`, `possibilities`, `inputComponents`, and a `submit()` method emitting `invokeSubmit`.

**Inputs:** `form` (`UntypedFormGroup`), `options` (`IFormOptions<T>`), `class` (`string`)
**Outputs:** `invokeSubmit`

### Form Component

The `<smart-form>` component renders a reactive form driven by `@Field()` model decorators. It is a wrapper that delegates to `FormStandardComponent` by default and supports an InjectionToken (`FORM_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `FormComponent` (selector: `smart-form`)
**Default:** `FormStandardComponent` (selector: `smart-form-standard`)
**Token:** `FORM_STANDARD_COMPONENT_TOKEN` — provide a `Type<FormBaseComponent<T>>` to override the default.

#### Usage

```html
<!-- Basic -->
<smart-form
  [options]="{ model: userModel, show: true }"
  (invokeSubmit)="onSubmit($event)"
></smart-form>

<!-- With external CSS class -->
<smart-form
  class="smart:p-4 smart:bg-white"
  [options]="{ model: userModel, show: true }"
  (invokeSubmit)="onSubmit($event)"
></smart-form>

<!-- With pre-built control (skips FormFactory) -->
<smart-form
  [options]="{ model: userModel, show: true, control: myFormGroup }"
  (invokeSubmit)="onSubmit($event)"
></smart-form>
```

#### IFormOptions

| Property          | Type                                                                                | Default    | Description                                                  |
| ----------------- | ----------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------ |
| `model`           | `T`                                                                                 | *required* | Model instance decorated with `@Model` / `@Field`            |
| `show`            | `boolean`                                                                           | *required* | Whether the form is visible                                  |
| `mode`            | `'create' \| 'update' \| string`                                                   | -          | Merges `@Field({ create: … })` or `{ update: … }` overrides  |
| `control`         | `AbstractControl`                                                                   | -          | Pre-built form group — skips `FormFactory` when provided     |
| `loading$`        | `Observable<boolean>`                                                               | -          | Shows loading state while `true`                             |
| `treeLevel`       | `number`                                                                            | -          | Nesting depth in hierarchical forms                          |
| `uniqueProvider`  | `(values: Record<keyof T, any>) => Promise<boolean>`                                | -          | Async uniqueness check per field                             |
| `possibilities`   | `{ [key: string]: WritableSignal<{ id: any; text: string; checked: boolean }[]> }` | -          | Options for `radio`/`check` inputs keyed by field name       |
| `inputComponents` | `{ [key: string]: InputBaseComponentType<T> }`                                      | -          | Per-field component overrides keyed by field name            |
| `fieldOptions`    | `IFieldOptions`                                                                     | -          | Additional `@Field()` metadata overrides                     |
| `modelOptions`    | `IModelOptions`                                                                     | -          | Additional `@Model()` metadata overrides                     |

#### Overriding with Custom Implementation

```typescript
import { FORM_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  { provide: FORM_STANDARD_COMPONENT_TOKEN, useValue: MyFormComponent },
]
```

### ListBaseComponent

Abstract base class for list components. Computes `fields` and `keys` from model decorators, exposes `list`, `loading`, `page`, `totalPages`, `provider`, `itemHandler`, `removeHandler`, and `cellPipe` from `IListInternalOptions<T>`. Extend it to build a custom list implementation for any `ListMode`.

**Inputs:** `options` (`IListInternalOptions<T>`), `class` (`string`)
**Methods:** `initKeys()` — populates column keys from `fields`; `handlePageChange(page)` — triggers `provider.getData` with the new page; `initList()` — wires the list signal from the provider; `initLoading()` — wires the loading signal from the provider

### List Component

The `<smart-list>` component renders a collection of entities. It is a wrapper that dispatches to one of three built-in children based on `options.mode` or `HardwareService.isMobile` auto-detection. Each child can be replaced via `LIST_MODE_COMPONENTS_TOKEN`, which provides a partial override map — any mode you specify replaces the built-in default; any mode you omit continues to use the built-in.

**Wrapper:** `ListComponent` (selector: `smart-list`)
**Default children:**
- `ListDesktopComponent` (selector: `smart-list-desktop`) — CDK Table with Tailwind styling
- `ListMobileComponent` (selector: `smart-list-mobile`) — `<ul role="list">` with flex rows
- `ListMasonryGridComponent` (selector: `smart-list-masonry-grid>`) — grid of cards with images
**Token:** `LIST_MODE_COMPONENTS_TOKEN` — provide a `Partial<Record<ListMode, Type<ListBaseComponent<T>>>>` to override one or more mode children.

#### Usage

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
```

#### IListOptions

| Property             | Type                                                                                  | Default    | Description                                                                          |
| -------------------- | ------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------ |
| `provider`           | `IListProvider<T>`                                                                    | *required* | Data provider (list signal, loading signal, getData callback)                        |
| `type`               | `any`                                                                                 | *required* | Model class decorated with `@Model`                                                  |
| `mode`               | `ListMode`                                                                            | -          | Force a specific mode; omit to auto-detect via `HardwareService.isMobile`            |
| `pagination`         | `IListPaginationOptions`                                                              | -          | Pagination config (mode, limit, page signal, totalPages signal, load callbacks)      |
| `cellPipe`           | `ICellPipe<T>`                                                                        | -          | Pipe for transforming each cell value                                                |
| `componentFactories` | `IListComponentFactories<T>`                                                          | -          | Top dynamic component factory                                                        |
| `sort`               | `boolean \| { default?: string; defaultDesc?: boolean }`                              | -          | Enable sorting; optionally set a default sort column and direction                   |
| `details`            | `boolean \| { provider?: IDetailsProvider<T>; componentFactories?: ...; component? }` | -          | Enable detail drill-down; optionally provide a custom details provider or component  |
| `item`               | `boolean \| { options?: ItemOptions }`                                                | -          | Enable item row action (navigate or custom select)                                   |
| `remove`             | `boolean \| { provider?: IRemoveProvider<T> }`                                        | -          | Enable row remove action; optionally provide a custom remove provider                |
| `select`             | `'multi'`                                                                             | -          | Enable multi-select mode                                                             |

#### Overriding with Custom Implementation

```typescript
import { LIST_MODE_COMPONENTS_TOKEN, ListMode } from '@smartsoft001/angular';

providers: [
  {
    provide: LIST_MODE_COMPONENTS_TOKEN,
    useValue: {
      [ListMode.desktop]: MyCustomDesktopListComponent,
      [ListMode.mobile]: MyCustomMobileListComponent,
      // masonryGrid not specified — falls back to built-in ListMasonryGridComponent
    },
  },
]
```

### CardBaseComponent

Abstract base class for card components. Provides shared container, header, body, and footer CSS class computation with gray background and divider support.

**Inputs:** `options` (`ICardOptions`), `hasHeader` (`boolean`), `hasFooter` (`boolean`), `class` (`string`), `headerTpl`/`bodyTpl`/`footerTpl` (`TemplateRef`)

### Card Component

The `<smart-card>` component renders a default `CardStandardComponent`. It supports an InjectionToken (`CARD_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `CardComponent` (selector: `smart-card`)
**Default:** `CardStandardComponent` (selector: `smart-card-standard`)
**Token:** `CARD_STANDARD_COMPONENT_TOKEN` — provide a `Type<CardBaseComponent>` to override the default.

#### Usage

```html
<!-- Basic -->
<smart-card>
  <p>Body content</p>
</smart-card>

<!-- With header and title -->
<smart-card [options]="{ title: 'My Card' }" [hasHeader]="true">
  <p>Body content</p>
</smart-card>

<!-- With header, footer, and gray footer -->
<smart-card
  [options]="{ grayFooter: true }"
  [hasHeader]="true"
  [hasFooter]="true"
>
  <div cardHeader>Custom Header</div>
  <p>Body content</p>
  <div cardFooter>Footer content</div>
</smart-card>
```

#### ICardOptions

| Property     | Type                       | Default | Description                   |
| ------------ | -------------------------- | ------- | ----------------------------- |
| `title`      | `string`                   | -       | Card title (shown in header)  |
| `buttons`    | `Array<IIconButtonOptions>`| -       | Optional action icons         |
| `grayFooter` | `boolean`                  | `false` | Gray background on footer     |
| `grayBody`   | `boolean`                  | `false` | Gray background on body       |

#### Content Projection

| Selector       | Description    |
| -------------- | -------------- |
| `[cardHeader]` | Header content |
| default        | Body content   |
| `[cardFooter]` | Footer content |

#### Overriding with Custom Implementation

```typescript
import { CARD_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  { provide: CARD_STANDARD_COMPONENT_TOKEN, useValue: MyCardComponent },
]
```

### PageBaseComponent

Abstract base class for page components. Exposes `options` (`IPageOptions`), `cssClass` (`class` alias), a `back()` method wired to `Location.back()`, an `isMobile` getter via `HardwareService`, and a `contentTpl` view child for variants that need to re-project the body.

**Inputs:** `options` (`IPageOptions`), `class` (`string`)

### Page Component

The `<smart-page>` component uses a map-based variant dispatch. It renders `PageStandardComponent` by default (`options.variant === 'standard'` or omitted) and can be extended with additional variants via `PAGE_VARIANT_COMPONENTS_TOKEN`. Projection uses `TemplateRef` slots declared on `IPageOptions`, plus a default `<ng-content>` fallback for the body.

**Wrapper:** `PageComponent` (selector: `smart-page`)
**Default:** `PageStandardComponent` (selector: `smart-page-standard`)
**Variant type:** `SmartPageVariant` — `'standard' | (string & {})`
**Token:** `PAGE_VARIANT_COMPONENTS_TOKEN` — provide a `Partial<Record<SmartPageVariant, Type<PageBaseComponent>>>` to register additional variants (merged on top of the built-in `{ standard: PageStandardComponent }`).

#### Usage

```html
<!-- Simple page with <ng-content> body -->
<smart-page [options]="{ title: 'Dashboard' }">
  <p>Dashboard content</p>
</smart-page>

<!-- With back button, search, and end buttons -->
<smart-page
  [options]="{
    title: 'Users',
    showBackButton: true,
    search: { text: searchText, set: onSearch },
    endButtons: [{ icon: 'add', text: 'Add user', handler: onAdd }]
  }"
>
  <users-list />
</smart-page>

<!-- Advanced: pick a variant and provide named slots -->
<ng-template #breadcrumbs><nav>Home / Users</nav></ng-template>
<ng-template #body><user-list /></ng-template>

<smart-page
  [options]="{
    title: 'Users',
    variant: 'analytics',
    breadcrumbsTpl: breadcrumbs,
    bodyTpl: body,
  }"
/>
```

#### IPageOptions

| Property         | Type                                                   | Default    | Description                                                      |
| ---------------- | ------------------------------------------------------ | ---------- | ---------------------------------------------------------------- |
| `title`          | `string`                                               | *required* | Page title (translated)                                          |
| `hideHeader`     | `boolean`                                              | `false`    | Hide the entire header block                                     |
| `hideMenuButton` | `boolean`                                              | `false`    | Reserved for layouts with a menu button                          |
| `showBackButton` | `boolean`                                              | `false`    | Render a back arrow that calls `Location.back()`                 |
| `endButtons`     | `Array<IIconButtonOptions>`                            | -          | Action buttons rendered via `<smart-button>`                     |
| `search`         | `{ text: Signal<string>; set: (txt: string) => void }` | -          | Inline search input                                              |
| `variant`        | `SmartPageVariant`                                     | `standard` | Selects the variant component from the merged map                |
| `bodyTpl`        | `TemplateRef<unknown>`                                 | -          | Explicit body template (falls back to `<ng-content>` if omitted) |
| `breadcrumbsTpl` | `TemplateRef<unknown>`                                 | -          | Breadcrumbs slot                                                 |
| `metaTpl`        | `TemplateRef<unknown>`                                 | -          | Meta slot (status, timestamps, ...)                              |
| `avatarTpl`      | `TemplateRef<unknown>`                                 | -          | Avatar slot                                                      |
| `bannerTpl`      | `TemplateRef<unknown>`                                 | -          | Banner slot                                                      |
| `filtersTpl`     | `TemplateRef<unknown>`                                 | -          | Filters slot                                                     |
| `logoTpl`        | `TemplateRef<unknown>`                                 | -          | Logo slot                                                        |
| `statsTpl`       | `TemplateRef<unknown>`                                 | -          | Stats slot                                                       |
| `subtitleTpl`    | `TemplateRef<unknown>`                                 | -          | Subtitle slot                                                    |
| `navTpl`         | `TemplateRef<unknown>`                                 | -          | Navigation slot                                                  |
| `sidebarTpl`     | `TemplateRef<unknown>`                                 | -          | Sidebar slot                                                     |

#### Registering Additional Variants

```typescript
import { PAGE_VARIANT_COMPONENTS_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: PAGE_VARIANT_COMPONENTS_TOKEN,
    useValue: {
      'product-detail': MyProductDetailPageComponent,
      'analytics': MyAnalyticsPageComponent,
    },
  },
]
```

### InfoBaseComponent

Abstract base class for info popover components. Exposes required `options: IInfoOptions`, `cssClass: string` (alias `class`), an `isOpen: WritableSignal<boolean>` state, and `toggle()`/`open()`/`close()` methods.

**Inputs:** `options` (`IInfoOptions`), `class` (`string`)

### Info Component

The `<smart-info>` component renders a small info icon that toggles a popover with a short tooltip text. It is a wrapper that delegates to `InfoStandardComponent` by default and supports an InjectionToken (`INFO_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `InfoComponent` (selector: `smart-info`)
**Default:** `InfoStandardComponent` (selector: `smart-info-standard`)
**Token:** `INFO_STANDARD_COMPONENT_TOKEN` — provide a `Type<InfoBaseComponent>` to override the default.

#### Usage

```html
<!-- Basic -->
<smart-info [options]="{ text: 'Helpful description' }"></smart-info>

<!-- With external CSS class -->
<smart-info
  class="smart:text-indigo-600"
  [options]="{ text: 'Helpful description' }"
></smart-info>
```

#### IInfoOptions

| Property | Type     | Default    | Description                           |
| -------- | -------- | ---------- | ------------------------------------- |
| `text`   | `string` | *required* | Text shown inside the popover (translated via `TranslatePipe`) |

#### Overriding with Custom Implementation

```typescript
import { INFO_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  { provide: INFO_STANDARD_COMPONENT_TOKEN, useValue: MyInfoComponent },
]
```

When providing a custom implementation, note that the default `InfoStandardComponent` registers a `document:click` listener to close the popover on outside clicks — a custom implementation is responsible for its own close-on-outside-click behavior if needed.

### SearchbarBaseComponent

Abstract base class for searchbar components. Provides reactive `UntypedFormControl` with debounced text emission, `show`/`text` models, `setShow()`/`tryHide()` methods.

**Inputs:** `options` (`ISearchbarOptions`), `show` (`ModelSignal<boolean>`), `text` (`ModelSignal<string>`), `class` (`string`)

### Searchbar Component

The `<smart-searchbar>` component renders a debounced search input with an optional toggle button. It is a wrapper that delegates to `SearchbarStandardComponent` by default and supports an InjectionToken (`SEARCHBAR_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `SearchbarComponent` (selector: `smart-searchbar`)
**Default:** `SearchbarStandardComponent` (selector: `smart-searchbar-standard`)
**Token:** `SEARCHBAR_STANDARD_COMPONENT_TOKEN` — provide a `Type<SearchbarBaseComponent>` to override the default.

#### Usage

```html
<!-- Basic -->
<smart-searchbar [(text)]="searchText" />

<!-- With options (custom placeholder + debounce) -->
<smart-searchbar
  [(text)]="searchText"
  [options]="{ placeholder: 'users.search', debounceTime: 300 }"
/>

<!-- Hidden with toggle button -->
<smart-searchbar
  [(show)]="searchShown"
  [(text)]="searchText"
  [options]="{ showToggleButton: true }"
/>

<!-- With external CSS class -->
<smart-searchbar class="smart:max-w-md" [(text)]="searchText" />
```

#### ISearchbarOptions

| Property           | Type         | Default    | Description                                                              |
| ------------------ | ------------ | ---------- | ------------------------------------------------------------------------ |
| `placeholder`      | `string`     | `'search'` | Placeholder translation key (rendered through `TranslatePipe`)           |
| `debounceTime`     | `number`     | `1000`     | Debounce (ms) before `text` model emits a new value                      |
| `showToggleButton` | `boolean`    | `false`    | When `show` is `false`, display a magnifier button that reveals the input |
| `size`             | `SmartSize`  | -          | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                  |
| `color`            | `SmartColor` | -          | Tailwind color (22 options)                                              |

#### Overriding with Custom Implementation

```typescript
import { SEARCHBAR_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  { provide: SEARCHBAR_STANDARD_COMPONENT_TOKEN, useValue: MySearchbarComponent },
]
```

A custom implementation extending `SearchbarBaseComponent` should declare `cssClass = input<string>('')` without the `class` alias (because `NgComponentOutlet` passes inputs by canonical name) and rely on the base's `control` signal, `setShow()`, and `tryHide()` methods. The base class already wires `control.valueChanges` through `debounceTime()` and emits into the `text` model — do not re-subscribe.

### ToggleBaseComponent

Abstract base class for toggle components. Exposes `value` (two-way `ModelSignal<boolean>`), `disabled`, optional `IToggleOptions`, `cssClass` (alias `class`), and a `toggle()` method that flips `value` while respecting `disabled`.

**Inputs:** `value` (`ModelSignal<boolean>`), `disabled` (`boolean`), `options` (`IToggleOptions`), `class` (`string`)

### Toggle Component

The `<smart-toggle>` component renders a boolean on/off control. It is a wrapper that delegates to `ToggleStandardComponent` by default and supports an InjectionToken (`TOGGLE_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `ToggleComponent` (selector: `smart-toggle`)
**Default:** `ToggleStandardComponent` (selector: `smart-toggle-standard`)
**Token:** `TOGGLE_STANDARD_COMPONENT_TOKEN` — provide a `Type<ToggleBaseComponent>` to override the default.

#### Usage

```html
<!-- Basic -->
<smart-toggle [(value)]="enabled" />

<!-- With options -->
<smart-toggle [(value)]="enabled" [options]="{ ariaLabel: 'Use setting' }" />

<!-- Disabled -->
<smart-toggle [(value)]="enabled" [disabled]="true" />

<!-- With external class -->
<smart-toggle [(value)]="enabled" class="smart:my-2" />
```

#### IToggleOptions

| Property        | Type                  | Default | Description                                              |
| --------------- | --------------------- | ------- | -------------------------------------------------------- |
| `label`         | `string`              | -       | Optional label                                           |
| `description`   | `string`              | -       | Optional secondary description                           |
| `labelPosition` | `'left' \| 'right'`  | -       | Where the label sits relative to the toggle              |
| `ariaLabel`     | `string`              | -       | Accessible label rendered as `aria-label`                |

The default `ToggleStandardComponent` consumes only `ariaLabel`. `label`, `description`, and `labelPosition` are intended for custom implementations registered via `TOGGLE_STANDARD_COMPONENT_TOKEN`.

#### Overriding with Custom Implementation

```typescript
import { TOGGLE_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  { provide: TOGGLE_STANDARD_COMPONENT_TOKEN, useValue: MyToggleComponent },
];
```

### CalendarBaseComponent

Abstract base class for calendar components. Contains shared date logic — month-grid construction, period navigation (prev/next/today), single-day selection, and per-day event filtering. Exposes optional `ICalendarOptions`, two-way `value` model (`Date | null`), optional `referenceDate`, `events` array, and `cssClass` (alias `class`). Computed signals: `view`, `weekStart`, `showToolbar`, `reference`, `monthGrid`. Methods: `selectDay()`, `goToToday()`, `prevPeriod()`, `nextPeriod()`, `eventsForDay()`. Static method `buildMonthGrid()` is a pure function returning a 6×7 grid.

**Inputs:** `options` (`ICalendarOptions`), `value` (`Date | null`, two-way), `referenceDate` (`Date`), `events` (`ICalendarEvent[]`), `class` (`string`)

### Calendar Component

The `<smart-calendar>` component renders a date calendar with shared month-grid logic, navigation toolbar (prev/next/today), and single-day selection. It is a wrapper that delegates to `CalendarStandardComponent` by default and supports an InjectionToken (`CALENDAR_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `CalendarComponent` (selector: `smart-calendar`)
**Default:** `CalendarStandardComponent` (selector: `smart-calendar-standard`)
**Token:** `CALENDAR_STANDARD_COMPONENT_TOKEN` — provide a `Type<CalendarBaseComponent>` to override the default.

#### Usage

```html
<!-- Basic two-way binding -->
<smart-calendar [(value)]="selected" />

<!-- With reference date and events -->
<smart-calendar
  [(value)]="selected"
  [referenceDate]="january2026"
  [events]="meetings"
/>

<!-- Hidden toolbar -->
<smart-calendar [(value)]="selected" [options]="{ showToolbar: false }" />

<!-- Sunday-first weeks -->
<smart-calendar [(value)]="selected" [options]="{ weekStart: 0 }" />

<!-- Custom day cell -->
<ng-template #dayCell let-cell let-events="events">
  <span>{{ cell.date.getDate() }}</span>
  @for (event of events; track event.id) {
    <span class="dot"></span>
  }
</ng-template>

<smart-calendar
  [(value)]="selected"
  [events]="meetings"
  [options]="{ dayCellTpl: dayCell }"
/>
```

#### ICalendarOptions

| Property            | Type                                 | Default | Description                                                  |
| ------------------- | ------------------------------------ | ------- | ------------------------------------------------------------ |
| `view`              | `'month' \| 'week' \| 'day' \| 'year'` | `'month'` | Active view (hint for custom implementations)               |
| `monthsCount`       | `1 \| 2 \| 12`                       | `1`     | Number of mini-months to render (custom impl hint)           |
| `weekStart`         | `0 \| 1`                             | `1`     | Week start day (0 = Sunday, 1 = Monday)                       |
| `showToolbar`       | `boolean`                            | `true`  | Toggle the prev/today/next toolbar                           |
| `toolbarActionsTpl` | `TemplateRef<unknown>`               | -       | Slot for additional toolbar buttons                          |
| `eventListTpl`      | `TemplateRef<unknown>`               | -       | Agenda / event list slot (custom impl)                       |
| `sidePanelTpl`      | `TemplateRef<unknown>`               | -       | Side-panel slot (custom impl)                                |
| `dayCellTpl`        | `TemplateRef<unknown>`               | -       | Custom day-cell template; receives `$implicit: ICalendarDayCell` and `events: ICalendarEvent[]` |
| `eventTpl`          | `TemplateRef<unknown>`               | -       | Single-event template (custom impl)                          |

#### ICalendarEvent

| Property | Type                       | Default | Description                                |
| -------- | -------------------------- | ------- | ------------------------------------------ |
| `id`     | `string \| number`         | -       | Unique identifier                          |
| `start`  | `Date`                     | -       | Event start (date is what is matched)      |
| `end`    | `Date`                     | -       | Optional event end                         |
| `title`  | `string`                   | -       | Optional title                             |
| `meta`   | `Record<string, unknown>`  | -       | Free-form metadata for custom impl         |

#### Overriding with Custom Implementation

```typescript
import { CALENDAR_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  { provide: CALENDAR_STANDARD_COMPONENT_TOKEN, useValue: MyCalendarComponent },
];
```

> `NgComponentOutlet` does not propagate output bindings. When a custom component is injected via the token, `value` two-way becomes one-way input. Custom impl should expose dedicated outputs and host wires manually.

### SectionHeadingBaseComponent

Abstract base class for section heading components. Exposes optional `ISectionHeadingOptions` and `cssClass` (alias `class`).

**Inputs:** `options` (`ISectionHeadingOptions`), `class` (`string`)

### SectionHeading Component

The `<smart-section-heading>` component renders a heading region for sections within a page (positioned between `<smart-page-heading>` and `<smart-card-heading>` in size and scope), with optional slots for label, description, actions, tabs, an input group (search), and a badge. It is a wrapper that delegates to `SectionHeadingStandardComponent` by default and supports an InjectionToken (`SECTION_HEADING_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `SectionHeadingComponent` (selector: `smart-section-heading`)
**Default:** `SectionHeadingStandardComponent` (selector: `smart-section-heading-standard`)
**Token:** `SECTION_HEADING_STANDARD_COMPONENT_TOKEN` — provide a `Type<SectionHeadingBaseComponent>` to override the default.

#### Usage

```html
<!-- Title only -->
<smart-section-heading [options]="{ title: 'Applicants' }" />

<!-- Title with label -->
<smart-section-heading
  [options]="{ title: 'Applicants', label: 'in Engineering' }"
/>

<!-- With actions -->
<ng-template #actions>
  <button>Add</button>
</ng-template>

<smart-section-heading
  [options]="{ title: 'Applicants', actionsTpl: actions }"
/>

<!-- With tabs and search -->
<ng-template #tabs>
  <a>All</a>
</ng-template>

<ng-template #search>
  <smart-searchbar />
</ng-template>

<smart-section-heading
  [options]="{ title: 'Applicants', tabsTpl: tabs, inputGroupTpl: search }"
/>
```

#### ISectionHeadingOptions

| Property        | Type                   | Default | Description                                  |
| --------------- | ---------------------- | ------- | -------------------------------------------- |
| `title`         | `string`               | -       | Heading title (rendered as `<h3>`)           |
| `description`   | `string`               | -       | Optional description string                  |
| `label`         | `string`               | -       | Inline label rendered next to the title      |
| `actionsTpl`    | `TemplateRef<unknown>` | -       | Actions / buttons template on the right      |
| `tabsTpl`       | `TemplateRef<unknown>` | -       | Tabs template rendered below the header      |
| `inputGroupTpl` | `TemplateRef<unknown>` | -       | Input/search group template on the right     |
| `badgeTpl`      | `TemplateRef<unknown>` | -       | Badge / chip template on the right           |

The default `SectionHeadingStandardComponent` consumes every property; a section is rendered only when its template/string is provided.

#### Overriding with Custom Implementation

```typescript
import { SECTION_HEADING_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: SECTION_HEADING_STANDARD_COMPONENT_TOKEN,
    useValue: MySectionHeadingComponent,
  },
];
```

### DescriptionListBaseComponent

Abstract base class for description list components. Exposes optional `IDescriptionListOptions` and `cssClass` (alias `class`).

**Inputs:** `options` (`IDescriptionListOptions`), `class` (`string`)

### DescriptionList Component

The `<smart-description-list>` component renders a list of label/value pairs (a `<dl>` with `<dt>`/`<dd>` rows) with optional title, description, per-item value/action template slots, and bottom attachments/footer slots. It is a wrapper that delegates to `DescriptionListStandardComponent` by default and supports an InjectionToken (`DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `DescriptionListComponent` (selector: `smart-description-list`)
**Default:** `DescriptionListStandardComponent` (selector: `smart-description-list-standard`)
**Token:** `DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN` — provide a `Type<DescriptionListBaseComponent>` to override the default.

#### Usage

```html
<!-- Title and items only -->
<smart-description-list
  [options]="{
    title: 'Applicant Information',
    items: [
      { label: 'Full name', value: 'Margot Foster' },
      { label: 'Application for', value: 'Backend Developer' },
    ],
  }"
/>

<!-- With description and templated value -->
<ng-template #salaryValue>
  <strong>$120,000</strong>
</ng-template>

<smart-description-list
  [options]="{
    title: 'Applicant Information',
    description: 'Personal details and application.',
    items: [
      { label: 'Full name', value: 'Margot Foster' },
      { label: 'Salary expectation', valueTpl: salaryValue },
    ],
  }"
/>

<!-- With per-item actions -->
<ng-template #updateAction>
  <button>Update</button>
</ng-template>

<smart-description-list
  [options]="{
    title: 'Applicant Information',
    items: [
      { label: 'Full name', value: 'Margot Foster', actionTpl: updateAction },
    ],
  }"
/>
```

#### IDescriptionListOptions

| Property         | Type                       | Default | Description                                              |
| ---------------- | -------------------------- | ------- | -------------------------------------------------------- |
| `title`          | `string`                   | -       | Heading title (rendered as `<h3>`)                       |
| `description`    | `string`                   | -       | Optional description string                              |
| `items`          | `IDescriptionListItem[]`   | -       | List of label/value pairs to render as `<dl>` rows       |
| `attachmentsTpl` | `TemplateRef<unknown>`     | -       | Bottom attachments slot (e.g. file lists)                |
| `footerTpl`      | `TemplateRef<unknown>`     | -       | Bottom footer slot (e.g. download link / call to action) |

#### IDescriptionListItem

| Property    | Type                   | Default | Description                                                       |
| ----------- | ---------------------- | ------- | ----------------------------------------------------------------- |
| `label`     | `string`               | -       | Term shown in `<dt>` (required)                                   |
| `value`     | `string`               | -       | Static value shown in `<dd>`. Ignored when `valueTpl` is provided |
| `valueTpl`  | `TemplateRef<unknown>` | -       | Template used to render the value inside `<dd>` (overrides `value`) |
| `actionTpl` | `TemplateRef<unknown>` | -       | Inline action template rendered in `<span class="action">`        |

The default `DescriptionListStandardComponent` consumes every property; a section is rendered only when its template/string is provided. Within an item, `valueTpl` takes precedence over `value` when both are set.

#### Overriding with Custom Implementation

```typescript
import { DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN,
    useValue: MyDescriptionListComponent,
  },
];
```

### CardHeadingBaseComponent

Abstract base class for card heading components. Exposes optional `ICardHeadingOptions` and `cssClass` (alias `class`).

**Inputs:** `options` (`ICardHeadingOptions`), `class` (`string`)

### CardHeading Component

The `<smart-card-heading>` component renders a small composable heading region for cards, with optional slots for avatar, title, description, meta, and actions. It can be used standalone or passed as the `headerTpl` value to `<smart-card>`. It is a wrapper that delegates to `CardHeadingStandardComponent` by default and supports an InjectionToken (`CARD_HEADING_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `CardHeadingComponent` (selector: `smart-card-heading`)
**Default:** `CardHeadingStandardComponent` (selector: `smart-card-heading-standard`)
**Token:** `CARD_HEADING_STANDARD_COMPONENT_TOKEN` — provide a `Type<CardHeadingBaseComponent>` to override the default.

#### Usage

```html
<!-- Title only -->
<smart-card-heading [options]="{ title: 'Job Postings' }" />

<!-- Title and description -->
<smart-card-heading
  [options]="{ title: 'Job Postings', description: 'Currently open' }"
/>

<!-- With actions -->
<ng-template #actions>
  <button>View all</button>
</ng-template>

<smart-card-heading
  [options]="{ title: 'Job Postings', actionsTpl: actions }"
/>
```

#### ICardHeadingOptions

| Property      | Type                   | Default | Description                                  |
| ------------- | ---------------------- | ------- | -------------------------------------------- |
| `title`       | `string`               | -       | Heading title (rendered as `<h3>`)           |
| `description` | `string`               | -       | Optional description string                  |
| `avatarTpl`   | `TemplateRef<unknown>` | -       | Avatar template rendered to the left         |
| `actionsTpl`  | `TemplateRef<unknown>` | -       | Actions / buttons template on the right      |
| `metaTpl`     | `TemplateRef<unknown>` | -       | Meta info template under the title           |

The default `CardHeadingStandardComponent` consumes every property; a section is rendered only when its template/string is provided.

#### Overriding with Custom Implementation

```typescript
import { CARD_HEADING_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: CARD_HEADING_STANDARD_COMPONENT_TOKEN,
    useValue: MyCardHeadingComponent,
  },
];
```

### PageHeadingBaseComponent

Abstract base class for page heading components. Exposes optional `IPageHeadingOptions` and `cssClass` (alias `class`).

**Inputs:** `options` (`IPageHeadingOptions`), `class` (`string`)

### PageHeading Component

The `<smart-page-heading>` component renders a composable page heading region with optional slots for breadcrumbs, banner image, avatar, logo, title, subtitle, meta, stats, actions, and filters. It is independent of `<smart-page>` and can be used standalone or inside any layout. It is a wrapper that delegates to `PageHeadingStandardComponent` by default and supports an InjectionToken (`PAGE_HEADING_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `PageHeadingComponent` (selector: `smart-page-heading`)
**Default:** `PageHeadingStandardComponent` (selector: `smart-page-heading-standard`)
**Token:** `PAGE_HEADING_STANDARD_COMPONENT_TOKEN` — provide a `Type<PageHeadingBaseComponent>` to override the default.

#### Usage

```html
<!-- Title only -->
<smart-page-heading [options]="{ title: 'Back End Developer' }" />

<!-- With actions -->
<ng-template #actions>
  <button>Edit</button>
</ng-template>

<smart-page-heading
  [options]="{ title: 'Back End Developer', actionsTpl: actions }"
/>

<!-- With breadcrumbs, meta and avatar -->
<ng-template #crumbs>
  <a routerLink="/jobs">Jobs</a>
</ng-template>

<ng-template #meta>
  <span>Full-time</span>
</ng-template>

<ng-template #avatar>
  <img src="avatar.jpg" alt="" />
</ng-template>

<smart-page-heading
  [options]="{
    title: 'Back End Developer',
    subtitle: 'Engineering',
    breadcrumbsTpl: crumbs,
    metaTpl: meta,
    avatarTpl: avatar,
  }"
/>
```

#### IPageHeadingOptions

| Property         | Type                   | Default | Description                                  |
| ---------------- | ---------------------- | ------- | -------------------------------------------- |
| `title`          | `string`               | -       | Heading title (rendered as `<h1>`)           |
| `subtitle`       | `string`               | -       | Subtitle string                              |
| `breadcrumbsTpl` | `TemplateRef<unknown>` | -       | Breadcrumb navigation template               |
| `metaTpl`        | `TemplateRef<unknown>` | -       | Meta tags / labels template                  |
| `avatarTpl`      | `TemplateRef<unknown>` | -       | User/profile avatar template                 |
| `bannerTpl`      | `TemplateRef<unknown>` | -       | Banner image template                        |
| `actionsTpl`     | `TemplateRef<unknown>` | -       | Actions / button group template              |
| `statsTpl`       | `TemplateRef<unknown>` | -       | Stats list template                          |
| `logoTpl`        | `TemplateRef<unknown>` | -       | Organization logo template                   |
| `filtersTpl`     | `TemplateRef<unknown>` | -       | Filters / chips template                     |

The default `PageHeadingStandardComponent` consumes every property and renders a slot only when its corresponding template/string is provided.

#### Overriding with Custom Implementation

```typescript
import { PAGE_HEADING_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: PAGE_HEADING_STANDARD_COMPONENT_TOKEN,
    useValue: MyPageHeadingComponent,
  },
];
```

### MultiColumnLayoutBaseComponent

Abstract base class for multi-column layout components. Exposes optional `IMultiColumnLayoutOptions` and `cssClass` (alias `class`).

**Inputs:** `options` (`IMultiColumnLayoutOptions`), `class` (`string`)

### MultiColumnLayout Component

The `<smart-multi-column-layout>` component renders a three-column application shell — a left navigation `<aside>`, a main content region, and a right secondary `<aside>`, with an optional top header. It is a wrapper that delegates to `MultiColumnLayoutStandardComponent` by default and supports an InjectionToken (`MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `MultiColumnLayoutComponent` (selector: `smart-multi-column-layout`)
**Default:** `MultiColumnLayoutStandardComponent` (selector: `smart-multi-column-layout-standard`)
**Token:** `MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN` — provide a `Type<MultiColumnLayoutBaseComponent>` to override the default.

#### Usage

```html
<!-- Basic with main content -->
<smart-multi-column-layout>
  <h1>Hello</h1>
</smart-multi-column-layout>

<!-- With nav and secondary -->
<ng-template #nav>
  <a routerLink="/">Inbox</a>
</ng-template>

<ng-template #secondary>
  <p>Filters</p>
</ng-template>

<smart-multi-column-layout
  [options]="{ navTpl: nav, secondaryTpl: secondary }"
>
  <p>Email content</p>
</smart-multi-column-layout>

<!-- With top header -->
<ng-template #header>
  <h1>Inbox</h1>
</ng-template>

<smart-multi-column-layout
  [options]="{ navTpl: nav, secondaryTpl: secondary, headerTpl: header }"
>
  <p>Email content</p>
</smart-multi-column-layout>
```

#### IMultiColumnLayoutOptions

| Property         | Type                          | Default | Description                                                  |
| ---------------- | ----------------------------- | ------- | ------------------------------------------------------------ |
| `title`          | `string`                      | -       | Optional layout title                                        |
| `navTpl`         | `TemplateRef<unknown>`        | -       | Template projected into the left `<aside class="nav">`       |
| `secondaryTpl`   | `TemplateRef<unknown>`        | -       | Template projected into the right `<aside class="secondary">`|
| `headerTpl`      | `TemplateRef<unknown>`        | -       | Template projected into a top `<header>` block               |
| `width`          | `'full' \| 'constrained'`     | -       | Hint for max-width container size used by custom variants    |
| `secondaryWidth` | `'sm' \| 'md' \| 'lg'`        | -       | Hint for secondary column width used by custom variants      |

The default `MultiColumnLayoutStandardComponent` consumes `navTpl`, `secondaryTpl`, and `headerTpl`. `title`, `width`, and `secondaryWidth` are intended for custom implementations registered via `MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN`.

#### Overriding with Custom Implementation

```typescript
import { MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN,
    useValue: MyMultiColumnLayoutComponent,
  },
];
```

### SidebarLayoutBaseComponent

Abstract base class for sidebar layout components. Exposes optional `ISidebarLayoutOptions` and `cssClass` (alias `class`).

**Inputs:** `options` (`ISidebarLayoutOptions`), `class` (`string`)

### SidebarLayout Component

The `<smart-sidebar-layout>` component renders a two-column application shell with a sidebar (left or right) and a main content region, plus an optional top header. It is a wrapper that delegates to `SidebarLayoutStandardComponent` by default and supports an InjectionToken (`SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `SidebarLayoutComponent` (selector: `smart-sidebar-layout`)
**Default:** `SidebarLayoutStandardComponent` (selector: `smart-sidebar-layout-standard`)
**Token:** `SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN` — provide a `Type<SidebarLayoutBaseComponent>` to override the default.

#### Usage

```html
<!-- Basic with main content -->
<smart-sidebar-layout>
  <h1>Hello</h1>
</smart-sidebar-layout>

<!-- With sidebar template -->
<ng-template #sidebar>
  <a routerLink="/">Dashboard</a>
</ng-template>

<smart-sidebar-layout [options]="{ sidebarTpl: sidebar }">
  <p>Main content</p>
</smart-sidebar-layout>

<!-- Right-positioned sidebar -->
<smart-sidebar-layout
  [options]="{ sidebarTpl: sidebar, sidebarPosition: 'right' }"
>
  <p>Main content</p>
</smart-sidebar-layout>

<!-- With top header -->
<ng-template #header>
  <h1>Dashboard</h1>
</ng-template>

<smart-sidebar-layout [options]="{ sidebarTpl: sidebar, headerTpl: header }">
  <p>Main content</p>
</smart-sidebar-layout>
```

#### ISidebarLayoutOptions

| Property           | Type                          | Default  | Description                                                  |
| ------------------ | ----------------------------- | -------- | ------------------------------------------------------------ |
| `title`            | `string`                      | -        | Optional layout title                                        |
| `sidebarTpl`       | `TemplateRef<unknown>`        | -        | Template projected into the `<aside>` region                 |
| `headerTpl`        | `TemplateRef<unknown>`        | -        | Template projected into a top `<header>` block               |
| `sidebarPosition`  | `'left' \| 'right'`           | `'left'` | Sidebar position relative to main content                    |
| `mobileBreakpoint` | `'sm' \| 'md' \| 'lg'`        | -        | Hint for the breakpoint at which sidebar collapses to drawer |
| `condensed`        | `boolean`                     | -        | Hint for compact (rail) sidebar variant                      |

The default `SidebarLayoutStandardComponent` consumes `sidebarTpl`, `headerTpl`, and `sidebarPosition`. `title`, `mobileBreakpoint`, and `condensed` are intended for custom implementations registered via `SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN`.

#### Overriding with Custom Implementation

```typescript
import { SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN,
    useValue: MySidebarLayoutComponent,
  },
];
```

### StackedLayoutBaseComponent

Abstract base class for stacked layout components. Exposes optional `IStackedLayoutOptions` and `cssClass` (alias `class`).

**Inputs:** `options` (`IStackedLayoutOptions`), `class` (`string`)

### StackedLayout Component

The `<smart-stacked-layout>` component renders a top-to-bottom application shell with a top navigation bar, an optional page header section, and a main content region. It is a wrapper that delegates to `StackedLayoutStandardComponent` by default and supports an InjectionToken (`STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `StackedLayoutComponent` (selector: `smart-stacked-layout`)
**Default:** `StackedLayoutStandardComponent` (selector: `smart-stacked-layout-standard`)
**Token:** `STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN` — provide a `Type<StackedLayoutBaseComponent>` to override the default.

#### Usage

```html
<!-- Basic with main content -->
<smart-stacked-layout>
  <h1>Hello</h1>
</smart-stacked-layout>

<!-- With navigation template -->
<ng-template #nav>
  <a routerLink="/">Dashboard</a>
</ng-template>

<smart-stacked-layout [options]="{ navTpl: nav }">
  <p>Main content</p>
</smart-stacked-layout>

<!-- With page header -->
<ng-template #header>
  <h1>Dashboard</h1>
</ng-template>

<smart-stacked-layout [options]="{ navTpl: nav, headerTpl: header }">
  <p>Main content</p>
</smart-stacked-layout>

<!-- With external class -->
<smart-stacked-layout class="smart:bg-gray-50">
  <p>Main content</p>
</smart-stacked-layout>
```

#### IStackedLayoutOptions

| Property         | Type                                 | Default | Description                                                   |
| ---------------- | ------------------------------------ | ------- | ------------------------------------------------------------- |
| `title`          | `string`                             | -       | Optional layout title                                         |
| `navTpl`         | `TemplateRef<unknown>`               | -       | Template projected into the top `<nav>`                       |
| `headerTpl`      | `TemplateRef<unknown>`               | -       | Template projected into a secondary `<header>` block          |
| `containerWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | -   | Hint for max-width container size used by custom variants     |

The default `StackedLayoutStandardComponent` consumes `navTpl` and `headerTpl`. `title` and `containerWidth` are intended for custom implementations registered via `STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN`.

#### Overriding with Custom Implementation

```typescript
import { STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN,
    useValue: MyStackedLayoutComponent,
  },
];
```

### StatsBaseComponent

Abstract base class for stats components. Exposes optional `IStatsOptions` and `cssClass` (alias `class`).

**Inputs:** `options` (`IStatsOptions`), `class` (`string`)

### Stats Component

The `<smart-stats>` component renders a list of statistic cards (label/value pairs with optional previous value, change indicator, trend, icon, and action slot). It is a wrapper that delegates to `StatsStandardComponent` by default and supports an InjectionToken (`STATS_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `StatsComponent` (selector: `smart-stats`)
**Default:** `StatsStandardComponent` (selector: `smart-stats-standard`)
**Token:** `STATS_STANDARD_COMPONENT_TOKEN` — provide a `Type<StatsBaseComponent>` to override the default.

#### Usage

```html
<!-- Simple stats -->
<smart-stats
  [options]="{
    items: [
      { label: 'Number of deploys', value: 405 },
      { label: 'Average deploy time', value: '3.65 mins' },
      { label: 'Success rate', value: '98.5%' },
    ],
  }"
/>

<!-- With title and trending changes -->
<smart-stats
  [options]="{
    title: 'Last 30 days',
    items: [
      { label: 'Revenue', value: '$405,091', change: '+4.75%', trend: 'up' },
      { label: 'Overdue invoices', value: '$12,787', change: '+54.02%', trend: 'down' },
    ],
  }"
/>

<!-- With previous value -->
<smart-stats
  [options]="{
    title: 'Last 30 days',
    items: [
      { label: 'Total Subscribers', value: '71,897', previousValue: '70,946', change: '+12%', trend: 'up' },
    ],
  }"
/>

<!-- With icon and action slots -->
<ng-template #icon>
  <svg viewBox="0 0 24 24"><!-- ... --></svg>
</ng-template>

<ng-template #viewAll>
  <a href="#">View all</a>
</ng-template>

<smart-stats
  [options]="{
    items: [
      { label: 'Total Subscribers', value: '71,897', iconTpl: icon, actionTpl: viewAll },
    ],
  }"
/>
```

#### IStatsOptions

| Property  | Type             | Default | Description                                                |
| --------- | ---------------- | ------- | ---------------------------------------------------------- |
| `title`   | `string`         | -       | Optional heading rendered above the items                  |
| `items`   | `IStatItem[]`    | —       | Required array of stat items                               |
| `columns` | `1 \| 2 \| 3 \| 4` | -     | Layout hint for custom implementations (ignored by default) |

#### IStatItem

| Property        | Type                                | Default | Description                                                              |
| --------------- | ----------------------------------- | ------- | ------------------------------------------------------------------------ |
| `label`         | `string`                            | -       | Term shown in `<dt>` (required)                                          |
| `value`         | `string \| number`                  | -       | Value shown in `<dd class="value">` (required)                           |
| `previousValue` | `string \| number`                  | -       | Optional previous value shown in `<dd class="previous">`                 |
| `change`        | `string`                            | -       | Optional change indicator (e.g. `'+4.75%'`)                              |
| `trend`         | `'up' \| 'down' \| 'neutral'`       | -       | Trend exposed as `data-trend` attribute on `<dd class="change">`         |
| `iconTpl`       | `TemplateRef<unknown>`              | -       | Icon template rendered in `<div class="icon">`                           |
| `actionTpl`     | `TemplateRef<unknown>`              | -       | Action template rendered in `<div class="action">`                       |
| `ariaLabel`     | `string`                            | -       | Accessible label rendered as `aria-label` on the item                    |

The default `StatsStandardComponent` renders a section only when its corresponding template/string is provided.

#### Overriding with Custom Implementation

```typescript
import { STATS_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  { provide: STATS_STANDARD_COMPONENT_TOKEN, useValue: MyStatsComponent },
];
```

### PasswordStrengthBaseComponent

Abstract base class for password-strength indicator components. Exposes required `passwordToCheck: string` and `showHint: boolean` inputs, `cssClass: string` (alias `class`), a `passwordStrength: boolean` output, and computed signals: `result`, `strength` (0/10/20/30), `strengthIndex` (0..3), `msg` (`'' | 'poor' | 'notGood' | 'good'`), `barClasses` (length-3 string array), `msgClass`, and `containerClasses`. The output `passwordStrength` is emitted automatically via an `effect()` — `true` when `strength === 30`, `false` otherwise.

**Inputs:** `passwordToCheck` (`string`, required), `showHint` (`boolean`, required), `class` (`string`)
**Outputs:** `passwordStrength` (`boolean`)

### Password Strength Component

The `<smart-password-strength>` component renders a three-bar strength indicator with an optional hint list of unmet requirements. It is a wrapper that delegates to `PasswordStrengthStandardComponent` by default and supports an InjectionToken (`PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `PasswordStrengthComponent` (selector: `smart-password-strength`)
**Default:** `PasswordStrengthStandardComponent` (selector: `smart-password-strength-standard`)
**Token:** `PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN` — provide a `Type<PasswordStrengthBaseComponent>` to override the default.

#### Usage

```html
<!-- Basic -->
<smart-password-strength
  [passwordToCheck]="password"
  [showHint]="false"
></smart-password-strength>

<!-- With hint list of unmet requirements -->
<smart-password-strength
  [passwordToCheck]="password"
  [showHint]="true"
></smart-password-strength>

<!-- React to strength changes -->
<smart-password-strength
  [passwordToCheck]="password"
  [showHint]="false"
  (passwordStrength)="onStrong($event)"
></smart-password-strength>
```

#### Translation Keys

- `INPUT.PASSWORD-STRENGTH.{poor|notGood|good}` — strength message
- `INPUT.ERRORS.invalidMinLength` — shown when password length ≤ 6 (suffixed with ` 7`)
- `INPUT.ERRORS.{upperLetters|lowerLetters|symbols}` — shown when the matching character class is missing

#### Overriding with Custom Implementation

```typescript
import { PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN,
    useValue: MyPasswordStrengthComponent,
  },
];
```

A custom implementation extending `PasswordStrengthBaseComponent` should declare `cssClass = input<string>('')` without the `class` alias (because `NgComponentOutlet` passes inputs by canonical name) and rely on the base's `barClasses()`, `msgClass()`, and `containerClasses()` for Tailwind classes. Do not re-emit `passwordStrength` — the base class already does that via an `effect()`.

### AccordionBaseComponent

Abstract base class for accordion components. Provides toggle logic, disabled state, and shared container CSS classes.

**Inputs:** `show` (`ModelSignal<boolean>`), `options` (`IAccordionOptions`), `cssClass` (`string`)

### DetailBaseComponent

Abstract base directive for detail field sub-components. Exposes `options: IDetailOptions<T>` input, `cssClass: string` (alias `class`), and an `afterSetOptionsHandler()` hook invoked via effect on options change.

**Inputs:** `options` (`IDetailOptions<T>`), `class` (`string`)

### PagingBaseComponent

Abstract base class for paging components. Provides signal-based paging state, computed helpers for ellipsized page lists and item ranges, and navigation methods.

**Inputs:** `currentPage` (`number`), `totalPages` (`number`), `pageSize` (`number`), `totalItems` (`number`), `variant` (`PagingVariant`), `class` (`string`)
**Outputs:** `pageChange` (`number`)
**Computed:** `showingFrom`, `showingTo`, `canGoBack`, `canGoForward`, `pages` (numbers + `'...'`)
**Methods:** `goToPage(page)`, `nextPage()`, `previousPage()`

### Paging Component

The `<smart-paging>` component renders a default `PagingStandardComponent`. It supports an InjectionToken (`PAGING_STANDARD_COMPONENT_TOKEN`) to replace the default rendering with a custom implementation.

**Wrapper:** `PagingComponent` (selector: `smart-paging`)
**Default:** `PagingStandardComponent` (selector: `smart-paging-standard`)
**Token:** `PAGING_STANDARD_COMPONENT_TOKEN` — provide a `Type<PagingBaseComponent>` to override the default.

#### Usage

```html
<smart-paging
  [currentPage]="page()"
  [totalPages]="totalPages()"
  [pageSize]="25"
  [totalItems]="248"
  (pageChange)="onPageChange($event)"
></smart-paging>
```

#### Overriding with Custom Implementation

```typescript
import { PAGING_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  { provide: PAGING_STANDARD_COMPONENT_TOKEN, useValue: MyPagingComponent },
];
```

## Components

The following components include both an abstract base class (`@Directive()`) and a default concrete implementation with templates. The base classes can be extended to create custom implementations.

### Detail Component

The `<smart-detail>` component renders a single model field value by delegating to a sub-component chosen by `FieldType`. Supports 15 default sub-components and allows per-field substitution via `DETAIL_FIELD_COMPONENTS_TOKEN`.

**Wrapper:** `DetailComponent` (selector: `smart-detail`)
**Base class:** `DetailBaseComponent<T>` — base for all sub-components.
**Token:** `DETAIL_FIELD_COMPONENTS_TOKEN` — provide a `Partial<Record<FieldType, Type<DetailBaseComponent<any>>>>` to substitute default sub-components for specific field types.

#### Usage

```html
<smart-detail [options]="detailOptions" [type]="ModelClass"></smart-detail>
```

#### IDetailOptions

| Property   | Type                          | Default    | Description                            |
| ---------- | ----------------------------- | ---------- | -------------------------------------- |
| `key`      | `string`                      | *required* | Model property name                    |
| `item`     | `Signal<T>`                   | -          | Signal with the model instance         |
| `options`  | `IFieldOptions`               | *required* | Field metadata (`type`, `info`, ...)   |
| `cellPipe` | `ICellPipe<T>`                | -          | Optional cell transformation pipe      |
| `loading`  | `Signal<boolean>`             | -          | Loading indicator                      |

#### Default Sub-Components (selector → FieldType)

| Selector                        | FieldType       |
| ------------------------------- | --------------- |
| `smart-detail-text`             | `text` (default)|
| `smart-detail-email`            | `email`         |
| `smart-detail-enum`             | `enum`          |
| `smart-detail-flag`             | `flag`          |
| `smart-detail-color`            | `color`         |
| `smart-detail-address`          | `address`       |
| `smart-detail-object`           | `object`        |
| `smart-detail-array`            | `array`         |
| `smart-detail-date-range`       | `dateRange`     |
| `smart-detail-phone-number-pl`  | `phoneNumberPl` |
| `smart-detail-image`            | `image`         |
| `smart-detail-logo`             | `logo`          |
| `smart-detail-video`            | `video`         |
| `smart-detail-attachment`       | `attachment`    |
| `smart-detail-pdf`              | `pdf`           |

#### Overriding Sub-Components

```typescript
import { DETAIL_FIELD_COMPONENTS_TOKEN } from '@smartsoft001/angular';
import { FieldType } from '@smartsoft001/models';

providers: [
  {
    provide: DETAIL_FIELD_COMPONENTS_TOKEN,
    useValue: {
      [FieldType.text]: MyCustomTextComponent,
    },
  },
]
```

#### Features

- Field-type dispatch via map with `NgComponentOutlet`
- Per-field substitution through `DETAIL_FIELD_COMPONENTS_TOKEN`
- Skeleton placeholder while `item()` resolves
- Label via `ModelLabelPipe`
- `smart:` Tailwind prefix, dark mode via `smart:dark:`

### Input Component

The `<smart-input>` component renders a form input for a single model field by dispatching to a sub-component chosen by `FieldType`. Supports 30 default sub-components and allows per-field substitution via `INPUT_FIELD_COMPONENTS_TOKEN`.

**Wrapper:** `InputComponent` (selector: `smart-input`)
**Base class:** `InputBaseComponent<T>` — base for all sub-components; exposes `control`, `fieldOptions`, `cssClass` (`class` alias), `required`, `afterSetOptionsHandler()` hook.
**Possibilities base:** `InputPossibilitiesBaseComponent<T>` — extends the base for list-based sub-components (radio/check).
**Token:** `INPUT_FIELD_COMPONENTS_TOKEN` — provide a `Partial<Record<FieldType, Type<InputBaseComponent<any>>>>` to substitute default sub-components for specific field types.

#### Usage

```html
<smart-input [options]="inputOptions"></smart-input>
```

```typescript
import { UntypedFormControl } from '@angular/forms';
import { InputOptions } from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

@Model({})
class UserModel {
  @Field({ type: FieldType.email, required: true })
  email = '';
}

const control = new UntypedFormControl('', Validators.required);
const inputOptions: InputOptions<UserModel> = {
  control,
  fieldKey: 'email',
  model: new UserModel(),
  treeLevel: 0,
};
```

#### InputOptions

| Property        | Type                                                           | Default     | Description                                                      |
| --------------- | -------------------------------------------------------------- | ----------- | ---------------------------------------------------------------- |
| `control`       | `UntypedFormControl \| UntypedFormArray`                       | _required_  | Reactive form control                                            |
| `fieldKey`      | `string`                                                       | _required_  | Model property name (strips trailing `Confirm`)                  |
| `model`         | `T`                                                            | _required_  | Model instance (used to resolve `@Field()` metadata)             |
| `treeLevel`     | `number`                                                       | _required_  | Nesting depth in the form tree                                   |
| `mode`          | `'create' \| 'update' \| string`                               | -           | Merges `@Field({ create: … })` or `{ update: … }` overrides      |
| `possibilities` | `WritableSignal<{ id; text; checked }[]>`                      | -           | Options for `radio` / `check` sub-components                     |
| `component`     | `Type<InputBaseComponent<any>>`                                | -           | Per-call inline override (takes precedence over the token)       |

#### Default Sub-Components (selector → FieldType)

| Selector                        | FieldType       |
| ------------------------------- | --------------- |
| `smart-input-text`              | `text`          |
| `smart-input-email`             | `email`         |
| `smart-input-password`          | `password`      |
| `smart-input-nip`               | `nip`           |
| `smart-input-pesel`             | `pesel`         |
| `smart-input-int`               | `int`           |
| `smart-input-float`             | `float`         |
| `smart-input-currency`          | `currency`      |
| `smart-input-phone-number`      | `phoneNumber`   |
| `smart-input-phone-number-pl`   | `phoneNumberPl` |
| `smart-input-long-text`         | `longText`      |
| `smart-input-date`              | `date`          |
| `smart-input-date-with-edit`    | `dateWithEdit`  |
| `smart-input-date-range`        | `dateRange`     |
| `smart-input-flag`              | `flag`          |
| `smart-input-radio`             | `radio`         |
| `smart-input-check`             | `check`         |
| `smart-input-enum`              | `enum`          |
| `smart-input-color`             | `color`         |
| `smart-input-logo`              | `logo`          |
| `smart-input-address`           | `address`       |
| `smart-input-object`            | `object`        |
| `smart-input-array`             | `array`         |
| `smart-input-ints`              | `ints`          |
| `smart-input-strings`           | `strings`       |
| `smart-input-file`              | `file`          |
| `smart-input-attachment`        | `attachment`    |
| `smart-input-image`             | `image`         |
| `smart-input-pdf`               | `pdf`           |
| `smart-input-video`             | `video`         |

#### Overriding Sub-Components

```typescript
import { INPUT_FIELD_COMPONENTS_TOKEN } from '@smartsoft001/angular';
import { FieldType } from '@smartsoft001/models';

providers: [
  {
    provide: INPUT_FIELD_COMPONENTS_TOKEN,
    useValue: {
      [FieldType.text]: MyCustomTextInputComponent,
    },
  },
]
```

#### Features

- Field-type dispatch via map with `NgComponentOutlet`
- Per-field substitution through `INPUT_FIELD_COMPONENTS_TOKEN`
- Inline error rendering via `<smart-input-error>` (when `touched && errors`)
- Label via `ModelLabelPipe`
- Resolves `@Field()` metadata from the model decorator (with `create`/`update` mode merge)
- `smart:` Tailwind prefix, dark mode via `smart:dark:`

### Date Range Component

The `<smart-date-range>` component provides a date range picker with a trigger button and a modal calendar overlay.

**Default component:** `DateRangeDefaultComponent` (selector: `smart-date-range`)
**Base class:** `DateRangeBaseComponent` — provides `ControlValueAccessor` integration, open/close state, calendar data management, clear and apply logic.
**Modal base class:** `DateRangeModalBaseComponent` — provides calendar rendering, quick filter buttons, date selection logic, and range restriction support.

#### Usage

```html
<!-- Basic -->
<smart-date-range [(ngModel)]="dateRange"></smart-date-range>

<!-- In reactive form -->
<smart-date-range formControlName="period"></smart-date-range>
```

#### Properties

| Property  | Type                                   | Default     | Description                                        |
| --------- | -------------------------------------- | ----------- | -------------------------------------------------- |
| `ngModel` | `ModelSignal<IDateRange \| undefined>` | `undefined` | Date range value (`start`, `end` in `YYYY-MM-DD`)  |

#### IDateRange (from @smartsoft001/domain-core)

```typescript
interface IDateRange {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
}
```

#### Features

- Trigger button showing selected range or "select" placeholder
- Clear button to reset value
- Modal overlay with full calendar view
- Quick filter buttons (Today, Yesterday, Last 7/30 days, This/Last Month)
- Date range selection with visual highlighting
- `ControlValueAccessor` integration
- Dark mode support

### Date Edit Component

The `<smart-date-edit>` component provides a digit-by-digit date input editor (DD-MM-RRRR format).

**Default component:** `DateEditDefaultComponent` (selector: `smart-date-edit`)
**Base class:** `DateEditBaseComponent` — provides `ControlValueAccessor` integration, digit-by-digit value management, date validation via moment.js, and auto-focus navigation logic.

#### Usage

```html
<!-- Basic -->
<smart-date-edit [(ngModel)]="dateValue"></smart-date-edit>

<!-- In reactive form -->
<smart-date-edit formControlName="birthDate"></smart-date-edit>

<!-- Listen for validity -->
<smart-date-edit [(ngModel)]="dateValue" (validChange)="onValid($event)"></smart-date-edit>
```

#### Properties

| Property      | Type                     | Default        | Description                      |
| ------------- | ------------------------ | -------------- | -------------------------------- |
| `ngModel`     | `ModelSignal<string>`    | `'2001-01-01'` | Date value in `YYYY-MM-DD` format |
| `validChange` | `OutputEmitter<boolean>` | -              | Emits when date validity changes  |

#### Features

- Digit-by-digit editing with auto-focus navigation
- Date validation via moment.js
- Invalid state visual feedback (red borders)
- Dark mode support
- `ControlValueAccessor` integration


## 📜 License

This project is licensed under the MIT License.

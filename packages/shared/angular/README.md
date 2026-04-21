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
- `smart:` Tailwind prefix, dark mode via `dark:smart:`

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
- `smart:` Tailwind prefix, dark mode via `dark:smart:`

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

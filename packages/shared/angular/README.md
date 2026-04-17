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

### AccordionBaseComponent

Abstract base class for accordion components. Provides toggle logic, disabled state, and shared container CSS classes.

**Inputs:** `show` (`ModelSignal<boolean>`), `options` (`IAccordionOptions`), `cssClass` (`string`)

## Components

The following components include both an abstract base class (`@Directive()`) and a default concrete implementation with templates. The base classes can be extended to create custom implementations.

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

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

## Button Component

The `<smart-button>` component provides a flexible button with three shape variants, three color variants, five sizes, and support for loading, disabled, and confirm states.

### Usage

```html
<!-- Standard (default shape) -->
<smart-button [options]="{ click: onClick, variant: 'primary', size: 'md' }">
  Save
</smart-button>

<!-- Rounded -->
<smart-button [options]="{ click: onClick, variant: 'secondary', rounded: true }">
  Cancel
</smart-button>

<!-- Circular with icon -->
<smart-button [options]="{ click: onClick, variant: 'primary', circular: true }">
  <svg>...</svg>
</smart-button>

<!-- Loading state (pass a signal) -->
<smart-button [options]="{ click: onClick, loading: loadingSignal }">
  Submit
</smart-button>

<!-- Disabled -->
<smart-button [options]="{ click: onClick }" [disabled]="true">
  Disabled
</smart-button>

<!-- Confirm mode (shows confirmation before executing click) -->
<smart-button [options]="{ click: onDelete, confirm: true }">
  Delete
</smart-button>
```

### IButtonOptions

| Property   | Type                              | Default     | Description                          |
| ---------- | --------------------------------- | ----------- | ------------------------------------ |
| `click`    | `() => void`                      | *required*  | Click handler                        |
| `variant`  | `'primary' \| 'secondary' \| 'soft'` | `'primary'` | Color variant                        |
| `size`     | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`      | Button size                          |
| `rounded`  | `boolean`                         | `false`     | Rounded pill shape                   |
| `circular` | `boolean`                         | `false`     | Circular shape (for icon buttons)    |
| `confirm`  | `boolean`                         | `false`     | Show confirmation before click       |
| `loading`  | `Signal<boolean>`                 | -           | Show loading spinner when true       |
| `type`     | `'submit' \| 'button'`           | `'button'`  | HTML button type                     |
| `expand`   | `'block' \| 'full'`              | -           | Expand button width                  |
| `color`    | `string`                          | `'primary'` | Legacy color option                  |

### Inputs

| Input      | Type      | Default | Description          |
| ---------- | --------- | ------- | -------------------- |
| `options`  | `IButtonOptions` | *required* | Button configuration |
| `disabled` | `boolean` | `false` | Disabled state       |
| `class`    | `string`  | `''`    | External CSS class   |

### Variants

| Variant     | Description                                  |
| ----------- | -------------------------------------------- |
| `primary`   | Indigo background with white text            |
| `secondary` | White background with gray text and border   |
| `soft`      | Light indigo background with indigo text     |

### Sizes

| Size | Description    |
| ---- | -------------- |
| `xs` | Extra small    |
| `sm` | Small          |
| `md` | Medium (default) |
| `lg` | Large          |
| `xl` | Extra large    |

## Date Range Component

The `<smart-date-range>` component provides a date range picker with a trigger button and a modal calendar overlay. Supports quick filter buttons (Today, Yesterday, Last 7/30 days, This/Last Month), `ControlValueAccessor` for forms, and dark mode.

### Usage

```html
<!-- Basic -->
<smart-date-range [(ngModel)]="dateRange"></smart-date-range>

<!-- In reactive form -->
<smart-date-range formControlName="period"></smart-date-range>
```

### Properties

| Property    | Type                              | Default     | Description                      |
| ----------- | --------------------------------- | ----------- | -------------------------------- |
| `ngModel`   | `ModelSignal<IDateRange \| undefined>` | `undefined` | Date range value (`start`, `end` in `YYYY-MM-DD`) |

### IDateRange (from @smartsoft001/domain-core)

```typescript
interface IDateRange {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
}
```

### Features

- Trigger button showing selected range or "select" placeholder
- Clear button to reset value
- Modal overlay with full calendar view
- Quick filter buttons (Today, Yesterday, Last 7/30 days, This/Last Month)
- Date range selection with visual highlighting
- `ControlValueAccessor` integration
- Dark mode support

## Date Edit Component

The `<smart-date-edit>` component provides a digit-by-digit date input editor (DD-MM-RRRR format). Implements `ControlValueAccessor` for Angular forms integration. Auto-navigates between fields on input.

### Usage

```html
<!-- Basic -->
<smart-date-edit [(ngModel)]="dateValue"></smart-date-edit>

<!-- In reactive form -->
<smart-date-edit formControlName="birthDate"></smart-date-edit>

<!-- Listen for validity -->
<smart-date-edit [(ngModel)]="dateValue" (validChange)="onValid($event)"></smart-date-edit>
```

### Properties

| Property      | Type                  | Default        | Description                          |
| ------------- | --------------------- | -------------- | ------------------------------------ |
| `ngModel`     | `ModelSignal<string>` | `'2001-01-01'` | Date value in `YYYY-MM-DD` format    |
| `validChange` | `OutputEmitter<boolean>` | -           | Emits when date validity changes     |

### Features

- Digit-by-digit editing with auto-focus navigation
- Date validation via moment.js
- Invalid state visual feedback (red borders)
- Dark mode support
- `ControlValueAccessor` integration

## Card Component

The `<smart-card>` component provides a flexible card container with multiple variants from Tailwind UI. Supports header/footer sections, gray backgrounds, well styles, and dark mode.

### Usage

```html
<!-- Basic card -->
<smart-card>
  <p>Card body content</p>
</smart-card>

<!-- With header and title -->
<smart-card [options]="{ title: 'My Card' }" [hasHeader]="true">
  <p>Body content</p>
</smart-card>

<!-- With header, footer, and gray footer -->
<smart-card [options]="{ grayFooter: true }" [hasHeader]="true" [hasFooter]="true">
  <div cardHeader>Custom Header</div>
  <p>Body content</p>
  <div cardFooter>Footer content</div>
</smart-card>

<!-- Well variant -->
<smart-card [options]="{ variant: 'well' }">
  <p>Well-style card</p>
</smart-card>
```

### ICardOptions

| Property     | Type               | Default   | Description                    |
| ------------ | ------------------ | --------- | ------------------------------ |
| `title`      | `string`           | -         | Card title (shown in header)   |
| `variant`    | `SmartCardVariant` | `'basic'` | Card style variant             |
| `grayFooter` | `boolean`          | `false`   | Gray background on footer      |
| `grayBody`   | `boolean`          | `false`   | Gray background on body        |
| `buttons`    | `IIconButtonOptions[]` | -     | Header action buttons          |

### Inputs

| Input       | Type             | Default     | Description              |
| ----------- | ---------------- | ----------- | ------------------------ |
| `options`   | `ICardOptions`   | `undefined` | Card configuration       |
| `hasHeader` | `boolean`        | `false`     | Show header section      |
| `hasFooter` | `boolean`        | `false`     | Show footer section      |

### Variants

| Variant              | Description                                  |
| -------------------- | -------------------------------------------- |
| `basic`              | White card with shadow and rounded corners   |
| `edge-to-edge`       | No rounded corners on mobile                 |
| `well`               | Gray background, no shadow                   |
| `well-on-gray`       | Darker gray background                       |
| `well-edge-to-edge`  | Gray well, no rounding on mobile             |

### Content Projection

| Selector       | Description        |
| -------------- | ------------------ |
| `[cardHeader]` | Header content     |
| default        | Body content       |
| `[cardFooter]` | Footer content     |

## Accordion Component

The `<smart-accordion>` component provides a collapsible disclosure panel with a header (toggle button) and body (content area). Supports two-way binding, disabled state, and dark mode.

### Usage

```html
<!-- Basic -->
<smart-accordion [(show)]="isOpen">
  <span accordionHeader>Click to expand</span>
  <span accordionBody>Hidden content here.</span>
</smart-accordion>

<!-- Disabled -->
<smart-accordion [(show)]="isOpen" [options]="{ disabled: true }">
  <span accordionHeader>Cannot toggle</span>
  <span accordionBody>This will not show.</span>
</smart-accordion>

<!-- Multiple FAQ -->
<smart-accordion [(show)]="q1">
  <span accordionHeader>Question 1?</span>
  <span accordionBody>Answer 1.</span>
</smart-accordion>
<smart-accordion [(show)]="q2">
  <span accordionHeader>Question 2?</span>
  <span accordionBody>Answer 2.</span>
</smart-accordion>
```

### IAccordionOptions

| Property   | Type      | Default | Description                       |
| ---------- | --------- | ------- | --------------------------------- |
| `open`     | `boolean` | `false` | Initial open state                |
| `disabled` | `boolean` | `false` | Prevents toggle when true         |
| `animated` | `boolean` | `true`  | Enable/disable CSS transitions    |

### Inputs

| Input     | Type                | Default     | Description               |
| --------- | ------------------- | ----------- | ------------------------- |
| `show`    | `ModelSignal<boolean>` | `false`  | Two-way binding for open state |
| `options` | `IAccordionOptions` | `undefined` | Accordion configuration   |

### Content Projection

| Selector            | Description                    |
| ------------------- | ------------------------------ |
| `[accordionHeader]` | Header content (toggle button) |
| `[accordionBody]`   | Collapsible body content       |

## 📜 License

This project is licensed under the MIT License.

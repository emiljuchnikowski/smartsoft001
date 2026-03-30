---
name: angular-components-button
description: Button component API, variants, and usage patterns for @smartsoft001/angular
user-invocable: false
---

# Button Component

Standalone Angular button component with multiple shapes, variants, sizes, and color palette support.

## API

### Selector

`<smart-button>` (wrapper) or directly: `<smart-button-standard>`, `<smart-button-rounded>`, `<smart-button-circular>`

### Inputs

| Input      | Type             | Default  | Description                                 |
| ---------- | ---------------- | -------- | ------------------------------------------- |
| `options`  | `IButtonOptions` | required | Button configuration                        |
| `disabled` | `boolean`        | `false`  | Disabled state                              |
| `class`    | `string`         | `''`     | External CSS classes (alias for `cssClass`) |

### IButtonOptions

```typescript
interface IButtonOptions {
  type?: 'submit' | 'button';
  confirm?: boolean;
  click: () => void;
  loading?: Signal<boolean>;
  variant?: SmartVariant; // 'primary' | 'secondary' | 'soft'
  size?: SmartSize; // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: SmartColor; // 22 Tailwind colors, default 'indigo'
  rounded?: boolean; // Use rounded shape
  circular?: boolean; // Use circular (icon-only) shape
}
```

## Shapes

### Standard (`<smart-button-standard>`)

- Border radius based on size: `smart:rounded-sm` (xs/sm), `smart:rounded-md` (md/lg/xl)
- Supports confirm mode (cancel/confirm buttons)

### Rounded (`<smart-button-rounded>`)

- Always `smart:rounded-full`
- Supports confirm mode

### Circular (`<smart-button-circular>`)

- Always `smart:rounded-full`, padding only (no px/py)
- Icon-only — pass SVG as `<ng-content>`
- No confirm mode

## Variants (via `variant` option)

- **primary** — colored background (`smart:bg-{color}-600`), white text
- **secondary** — white background, gray border (`smart:inset-ring`), gray text
- **soft** — light colored background (`smart:bg-{color}-50`), colored text

## Color Palette

Uses `COMPONENT_COLORS` from `models/colors.ts`. All 22 Tailwind colors supported. Default: `indigo`.

## Usage Examples

```html
<!-- Standard primary -->
<smart-button [options]="{ click: onClick, variant: 'primary', size: 'md' }">
  Click me
</smart-button>

<!-- Rounded secondary with color -->
<smart-button
  [options]="{ click: onClick, variant: 'secondary', size: 'lg', rounded: true, color: 'red' }"
>
  Delete
</smart-button>

<!-- Circular with icon -->
<smart-button [options]="{ click: onClick, circular: true }">
  <svg>...</svg>
</smart-button>

<!-- With loading -->
<smart-button [options]="{ click: onClick, loading: loadingSignal }">
  Save
</smart-button>

<!-- With confirm -->
<smart-button
  [options]="{ click: onDelete, confirm: true, variant: 'primary', color: 'red' }"
>
  Delete
</smart-button>

<!-- With external class -->
<smart-button class="smart:mt-4" [options]="opts">Submit</smart-button>
```

## Related

- Icon component: `packages/shared/angular/src/lib/components/icon/` (spinner SVG)
- Color map: `packages/shared/angular/src/lib/models/colors.ts` (`COMPONENT_COLORS`)
- Shared types: `SmartVariant`, `SmartSize`, `SmartColor` in `models/interfaces.ts`

---
name: angular-components-icon
description: Icon component API, IconName glyph set, template override, and the styled Preset variation for @smartsoft001/angular
user-invocable: false
---

# Icon Component

Inline SVG glyph primitive. `<smart-icon>` dispatches over a fixed `IconName`
set via `@switch`, rendering one of the standalone glyph components. Unlike the
other component groups the icon has **no `*_STANDARD_COMPONENT_TOKEN`** and **no
`IIconOptions`** — it is configured entirely through direct inputs.

## When to Use This Skill

- Developer needs a built-in glyph (spinner, chevron) → use `<smart-icon>`
- Developer wants to inline a custom SVG through the same API → pass `[template]`
- Developer wants a styled icon in a box/badge surface → use `<smart-icon-preset>`

## Public API

### `smart-icon`

| Input      | Type                         | Default     | Description                            |
| ---------- | ---------------------------- | ----------- | -------------------------------------- |
| `name`     | `IconName`                   | `undefined` | Which built-in glyph to render         |
| `template` | `TemplateRef<unknown>\|null` | `null`      | Custom SVG; overrides `name` when set  |
| `class`    | `string`                     | `''`        | Extra CSS class forwarded to the glyph |

`class` is the alias of the internal `cssClass` input (`input('', { alias: 'class' })`).

### IconName

```typescript
type IconName = 'spinner' | 'chevron-down' | 'chevron-up';
```

Each value maps to a standalone component (`smart-icon-spinner`,
`smart-icon-chevron-down`, `smart-icon-chevron-up`) that renders a raw `<svg>`
with `smart:`-prefixed Tailwind sizing.

### Dispatch

The wrapper picks the branch with `@switch (name())`; when `template()` is set it
renders `[ngTemplateOutlet]` instead and ignores `name`.

## Usage

```html
<!-- Built-in glyph -->
<smart-icon name="spinner"></smart-icon>

<!-- Restyle via the class alias -->
<smart-icon
  name="chevron-down"
  class="smart:size-8 smart:text-red-500"
></smart-icon>

<!-- Custom SVG through the template override -->
<ng-template #heart>
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    class="smart:size-8 smart:text-pink-500"
  >
    <path d="..." />
  </svg>
</ng-template>
<smart-icon [template]="heart"></smart-icon>
```

## Preset

`<smart-icon-preset>` (`IconPresetComponent`) composes `<smart-icon>` inside a
themed container. It is **composition, not inheritance** — it does not extend the
base icon; it renders one and wraps it. Because there is no token, the preset is
used through its selector directly (there is nothing to register).

### Inputs

| Input      | Type                         | Default     | Description                         |
| ---------- | ---------------------------- | ----------- | ----------------------------------- |
| `name`     | `IconName`                   | `'spinner'` | Glyph rendered by the inner icon    |
| `template` | `TemplateRef<unknown>\|null` | `null`      | Custom SVG override                 |
| `variant`  | `IconPresetVariant`          | `'plain'`   | Container treatment                 |
| `size`     | `IconPresetSize`             | `'md'`      | Glyph footprint + box padding       |
| `class`    | `string`                     | `''`        | Extra class merged on the container |

### Variants (`IconPresetVariant`)

| Variant     | Surface                                                                      |
| ----------- | ---------------------------------------------------------------------------- |
| `plain`     | No box — icon sits inline (inline-flex, centered)                            |
| `contained` | Bordered white square (`rounded-lg`, gray border, `shadow-2xs`) + dark twins |
| `soft`      | Tinted round pill (`rounded-full`, `bg-blue-50`, blue text) + dark twins     |

### Sizes (`IconPresetSize`)

| Size | Glyph          | Box padding   |
| ---- | -------------- | ------------- |
| `sm` | `smart:size-4` | `smart:p-1.5` |
| `md` | `smart:size-5` | `smart:p-2`   |
| `lg` | `smart:size-6` | `smart:p-2.5` |

`plain` ignores the padding (no box). The container is exposed via
`data-role="icon-preset"` for testing.

```html
<smart-icon-preset
  variant="soft"
  name="chevron-down"
  size="lg"
></smart-icon-preset>
```

## Documented Gaps / Limitations

- **No token and no `IIconOptions`** by design — the icon and its preset are
  configured through direct inputs only, so `<smart-icon>` cannot be globally
  reskinned the way token-driven components can.
- The `IconName` set is closed; new built-in glyphs require a new standalone
  glyph component plus a `@switch` branch. For one-off SVGs use `[template]`.

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/icon/icon.component.ts`
- Base + `IconName`: `packages/shared/angular/src/lib/components/icon/base/base.component.ts`
- Glyphs: `packages/shared/angular/src/lib/components/icon/{spinner,chevron-down,chevron-up}/`
- Preset: `packages/shared/angular/src/lib/components/icon/preset/preset.component.ts`
- Preset classes: `packages/shared/angular/src/lib/components/icon/preset/preset-classes.util.ts`
- Stories: `packages/shared/angular/src/lib/components/icon/icon.component.stories.ts`

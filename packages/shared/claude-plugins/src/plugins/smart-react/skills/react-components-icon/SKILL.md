---
name: react-components-icon
description: SmartIcon React component API (@smartsoft001/react) — the library's glyphs (spinner, chevron-down, chevron-up) or a custom template node, plus SmartIconPreset with plain/contained/soft containers in sm/md/lg; no registry key.
user-invocable: false
---

# Icon (`SmartIcon`)

`SmartIcon` renders one of the library's three glyphs by `name` (`spinner`, `chevron-down`, `chevron-up`) or, when `template` is given, that node instead. It renders nothing for an unknown name. The glyph components (`SmartIconSpinner`, `SmartIconChevronDown`, `SmartIconChevronUp`) are exported too. `SmartIconPreset` wraps the icon in a themed container (`plain`, `contained`, `soft`) in three sizes. The icon has **no registry key**: use `template` for your own icon, or the preset directly.

## When to Use This Skill

- Showing a loading spinner or an expand / collapse chevron
- Rendering an icon of your own through the same API (`template`)
- Putting an icon in a coloured tile or circle (`SmartIconPreset`)

## Exports

All from `@smartsoft001/react`.

| Export                 | Kind      | What it is                                                                                                                                            |
| ---------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartIcon`            | component | One of the library's glyphs, or a custom `template`.                                                                                                  |
| `SmartIconSpinner`     | component | The spinner glyph (an animated SVG).                                                                                                                  |
| `SmartIconChevronDown` | component | The chevron-down glyph.                                                                                                                               |
| `SmartIconChevronUp`   | component | The chevron-up glyph.                                                                                                                                 |
| `SmartIconPreset`      | component | Styled icon variation (preset): `<SmartIcon>` inside a themed container, across a `plain` / `contained` / `soft` variant scale in `sm` / `md` / `lg`. |

The preset's class helpers (`getIconSizeClasses`, `getIconContainerClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartIconProps`

| Prop         | Type        | Default | Description                                                                        |
| ------------ | ----------- | ------- | ---------------------------------------------------------------------------------- |
| `name?`      | `IconName`  | —       | The glyph; renders nothing without a `name` or `template`, or for an unknown name. |
| `className?` | `string`    | —       | Classes on the SVG of the glyph.                                                   |
| `template?`  | `ReactNode` | —       | Rendered instead of the named glyph.                                               |

### `SmartIconGlyphProps`

Props of the glyph components.

| Prop         | Type     | Default | Description         |
| ------------ | -------- | ------- | ------------------- |
| `className?` | `string` | —       | Classes on the SVG. |

### `SmartIconPresetProps`

Props of `SmartIconPreset`.

| Prop         | Type                | Default     | Description                           |
| ------------ | ------------------- | ----------- | ------------------------------------- |
| `name?`      | `IconName`          | `'spinner'` | The glyph inside the container.       |
| `template?`  | `ReactNode`         | —           | A node rendered instead of the glyph. |
| `variant?`   | `IconPresetVariant` | `'plain'`   | The container treatment.              |
| `size?`      | `IconPresetSize`    | `'md'`      | The container footprint.              |
| `className?` | `string`            | —           | Classes on the container.             |

### Related types

- `IconName`: `'spinner' \| 'chevron-down' \| 'chevron-up'` — The glyph names.
- `IconPresetVariant`: `'plain' \| 'contained' \| 'soft'` — Visual treatment applied around the icon glyph.
- `IconPresetSize`: `'sm' \| 'md' \| 'lg'` — Icon footprint on the `size-*` scale.

## Usage

```tsx
import { SmartIcon, SmartIconPreset } from '@smartsoft001/react';

export function Icons({ open }: { open: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <SmartIcon name="spinner" />
      <SmartIcon
        name={open ? 'chevron-up' : 'chevron-down'}
        className="size-4"
      />
      <SmartIconPreset name="spinner" variant="soft" size="lg" />
      <SmartIconPreset
        variant="contained"
        template={
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
          </svg>
        }
      />
    </div>
  );
}
```

## Replacing the Implementation

`SmartIcon` has no `SmartProvider` registry key, so it cannot be replaced application-wide. Pass your own node through `template` (it is rendered as is), use `SmartIconPreset` for a themed container, or render the glyph components directly. Components that show a spinner or a chevron (button, accordion, input loader) render `SmartIcon` themselves.

## Styling

- The glyphs are inline SVGs that take `currentColor`, so they follow the text colour (and dark mode) of their parent.
- `SmartIconPreset` adds the container classes per `variant` and `size`, with `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/icon/` in the smartsoft001 repository.

- `glyphs.tsx`: `SmartIconSpinner`, `SmartIconChevronDown`, `SmartIconChevronUp`
- `icon.tsx`: `SmartIcon`
- `icon.types.ts`: `IconName`, `SmartIconGlyphProps`, `SmartIconProps`
- `preset/icon-preset.tsx`: `SmartIconPreset`, `SmartIconPresetProps`
- `icon.stories.tsx`: Storybook stories

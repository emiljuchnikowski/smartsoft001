---
name: react-components-section-heading
description: SmartSectionHeading React component API (@smartsoft001/react) — heading of a page section with title, label, description and slots for actions, tabs, input group, badge and image, half/narrow/wide/vertical presentations, the 'section-heading' registry key and SmartSectionHeadingPreset.
user-invocable: false
---

# Section Heading (`SmartSectionHeading`)

`SmartSectionHeading` titles a section of a page: a title with an optional eyebrow `label`, a description, and `ReactNode` slots for actions, tabs, an input group, a badge and an image. The standard rendering is an unstyled `<h3>` header with the slots and the tabs underneath. `SmartSectionHeadingPreset` renders a "content with image" block (eyebrow label + badge, `<h2>` title, description and actions beside `imageTpl`) laid out by `options.presentation.layout`.

## When to Use This Skill

- The heading of a section inside a page, with actions or tabs on the side
- A marketing-style text-and-image block (preset layouts)
- Restyling every section heading (the `section-heading` registry key)

## Exports

All from `@smartsoft001/react`.

| Export                        | Kind      | What it is                                                                                                                                                                     |
| ----------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SmartSectionHeading`         | component | Renders the implementation registered as `components['section-heading']` on `SmartProvider`, `SmartSectionHeadingStandard` by default.                                         |
| `SmartSectionHeadingPreset`   | component | HyperUI-styled "content with image" section heading (preset).                                                                                                                  |
| `SmartSectionHeadingStandard` | component | The default section heading rendering: an unstyled `<h3>` title (with its `label`), description and the badge / input group / actions slots, and a tabs slot under the header. |

The preset's class helpers (`getSectionHeadingGridClasses`, `getSectionHeadingTextClasses`, `getSectionHeadingImageClasses`, `SECTION_HEADING_SECTION_CLASSES`, `SECTION_HEADING_CONTAINER_CLASSES`, `SECTION_HEADING_EYEBROW_CLASSES`, `SECTION_HEADING_TITLE_CLASSES`, `SECTION_HEADING_DESCRIPTION_CLASSES`, `SECTION_HEADING_ACTIONS_CLASSES`) are exported too, with the type `SectionHeadingPresetLayout` (the layout argument of the helpers), for a custom implementation that wants the preset look.

## Props and Types

### `SmartSectionHeadingProps`

| Prop         | Type                     | Default | Description                           |
| ------------ | ------------------------ | ------- | ------------------------------------- |
| `options?`   | `ISectionHeadingOptions` | —       | Title, texts, slots and presentation. |
| `className?` | `string`                 | —       | Classes on the root element.          |

### `ISectionHeadingOptions`

| Field            | Type                                                       | Default | Description                                                                                  |
| ---------------- | ---------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------- |
| `title?`         | `string`                                                   | —       | The heading (`<h3>` in the standard, `<h2>` in the preset).                                  |
| `description?`   | `string`                                                   | —       | Text under the heading.                                                                      |
| `label?`         | `string`                                                   | —       | Standard: a `.label` span inside the title (needs `title`). Preset: eyebrow above the title. |
| `actionsTpl?`    | `ReactNode`                                                | —       | Action buttons.                                                                              |
| `tabsTpl?`       | `ReactNode`                                                | —       | Standard only: tabs under the header; the preset does not render it.                         |
| `inputGroupTpl?` | `ReactNode`                                                | —       | Standard only: a search or input group; the preset does not render it.                       |
| `badgeTpl?`      | `ReactNode`                                                | —       | A badge: in the header row (standard) or next to the eyebrow label (preset).                 |
| `imageTpl?`      | `ReactNode`                                                | —       | Preset only: the image beside the text.                                                      |
| `presentation?`  | `{ layout?: 'half' \| 'narrow' \| 'wide' \| 'vertical'; }` | —       | `layout` of the preset: `half` (default), `narrow`, `wide` (image first) or `vertical`.      |

## Usage

```tsx
import {
  SmartButton,
  SmartSectionHeading,
  SmartTabs,
} from '@smartsoft001/react';

export function CandidatesHeading({ onAdd }: { onAdd: () => void }) {
  return (
    <SmartSectionHeading
      options={{
        title: 'Candidates',
        description: 'Everyone who applied in the last 30 days.',
        actionsTpl: (
          <SmartButton options={{ click: onAdd }}>Add candidate</SmartButton>
        ),
        tabsTpl: (
          <SmartTabs
            options={{
              items: [
                { id: 'applied', label: 'Applied' },
                { id: 'interview', label: 'Interview' },
              ],
            }}
          />
        ),
      }}
    />
  );
}
```

## Replacing the Implementation

`SmartSectionHeading` renders the component registered under the `'section-heading'` key of `SmartProvider`'s `components`, and `SmartSectionHeadingStandard` when nothing is registered there. Every `SmartSectionHeading` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartSectionHeadingPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'section-heading': SmartSectionHeadingPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartSectionHeadingPreset` is the styled (preset) implementation: register it under the `'section-heading'` key of `SmartProvider`'s `components`, render it directly in place of `SmartSectionHeading`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartSectionHeadingProps } from '@smartsoft001/react';

export function RuleSectionHeading({
  options,
  className,
}: SmartSectionHeadingProps) {
  return (
    <div className={className}>
      <h2>
        {options?.title} {options?.badgeTpl}
      </h2>
      {options?.description && <p>{options.description}</p>}
      {options?.actionsTpl}
      <hr />
      {options?.tabsTpl}
    </div>
  );
}
```

## Styling

- The standard rendering is unstyled; the preset carries the four layouts with `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/section-heading/` in the smartsoft001 repository.

- `preset/section-heading-preset.tsx`: `SmartSectionHeadingPreset`
- `section-heading.tsx`: `SmartSectionHeading`
- `section-heading.types.ts`: `SmartSectionHeadingProps`
- `standard/section-heading-standard.tsx`: `SmartSectionHeadingStandard`
- `section-heading.stories.tsx`: Storybook stories

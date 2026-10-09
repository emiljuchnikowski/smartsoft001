---
name: react-components-card-heading
description: SmartCardHeading React component API (@smartsoft001/react) — card header block with title, description, avatar, meta and actions slots and author/stacked/overlay/outline presentations, the 'card-heading' registry key and SmartCardHeadingPreset.
user-invocable: false
---

# Card Heading (`SmartCardHeading`)

`SmartCardHeading` renders the heading block of a card: a title and description, plus `ReactNode` slots for an avatar, meta information and actions, each rendered only when given. `SmartCardHeadingStandard` is unstyled and ignores `options.presentation`; `SmartCardHeadingPreset` renders one of four looks chosen by `options.presentation.variant` (`author`, the default, `stacked`, `overlay`, `outline`).

## When to Use This Skill

- The top of a card or article teaser: author avatar, title, description, meta (date, read time) and actions
- Choosing a card-heading presentation (`author`, `stacked`, `overlay`, `outline`) through the preset
- Restyling every card heading (the `card-heading` registry key)

## Exports

All from `@smartsoft001/react`.

| Export                     | Kind      | What it is                                                                                                                           |
| -------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `SmartCardHeading`         | component | Renders the implementation registered as `components['card-heading']` on `SmartProvider`, `SmartCardHeadingStandard` by default.     |
| `SmartCardHeadingPreset`   | component | HyperUI-styled card heading variation (preset).                                                                                      |
| `SmartCardHeadingStandard` | component | The default card heading rendering: the avatar, the title, description and meta, and the actions of `options`, each only when given. |

The preset's class helper `getCardHeadingContainerClasses` and its `CardHeadingVariant` type (`'author' | 'stacked' | 'overlay' | 'outline'`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartCardHeadingProps`

| Prop         | Type                  | Default | Description                             |
| ------------ | --------------------- | ------- | --------------------------------------- |
| `options?`   | `ICardHeadingOptions` | —       | The content slots and the presentation. |
| `className?` | `string`              | —       | Classes on the root element.            |

### `ICardHeadingOptions`

| Field           | Type                                                             | Default | Description                                                                                 |
| --------------- | ---------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------- |
| `title?`        | `string`                                                         | —       | The heading text.                                                                           |
| `description?`  | `string`                                                         | —       | Text under the title.                                                                       |
| `avatarTpl?`    | `ReactNode`                                                      | —       | An avatar or image node.                                                                    |
| `actionsTpl?`   | `ReactNode`                                                      | —       | Buttons or a menu.                                                                          |
| `metaTpl?`      | `ReactNode`                                                      | —       | Meta information (date, tags, read time).                                                   |
| `presentation?` | `{ variant?: 'author' \| 'stacked' \| 'overlay' \| 'outline'; }` | —       | `variant` picks the preset look (`'author'` by default); ignored by the standard rendering. |

## Usage

```tsx
import {
  SmartAvatarPreset,
  SmartButton,
  SmartCardHeadingPreset,
} from '@smartsoft001/react';

export function ArticleHeading({ onFollow }: { onFollow: () => void }) {
  return (
    <SmartCardHeadingPreset
      options={{
        title: 'Designing for dark mode',
        description: 'How we picked colours that work at night.',
        presentation: { variant: 'author' },
        avatarTpl: <SmartAvatarPreset initials="AK" size="sm" />,
        metaTpl: <span>12 Mar 2026 · 6 min read</span>,
        actionsTpl: (
          <SmartButton
            options={{ click: onFollow, size: 'sm', variant: 'secondary' }}
          >
            Follow
          </SmartButton>
        ),
      }}
    />
  );
}
```

## Replacing the Implementation

`SmartCardHeading` renders the component registered under the `'card-heading'` key of `SmartProvider`'s `components`, and `SmartCardHeadingStandard` when nothing is registered there. Every `SmartCardHeading` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartCardHeadingPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'card-heading': SmartCardHeadingPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartCardHeadingPreset` is the styled (preset) implementation: register it under the `'card-heading'` key of `SmartProvider`'s `components`, render it directly in place of `SmartCardHeading`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartCardHeadingProps } from '@smartsoft001/react';

export function SimpleCardHeading({
  options,
  className,
}: SmartCardHeadingProps) {
  return (
    <div className={className}>
      {options?.avatarTpl}
      <div>
        <h3>{options?.title}</h3>
        {options?.description && <p>{options.description}</p>}
        {options?.metaTpl}
      </div>
      {options?.actionsTpl}
    </div>
  );
}
```

## Styling

- `SmartCardHeadingStandard` is unstyled markup; `SmartCardHeadingPreset` carries the four presentations with `smart:dark:` variants (`overlay` places the text over the avatar image, so give that slot an image).
- `className` is appended to the root element.

## File Locations

Source: `packages/shared/react/src/lib/components/card-heading/` in the smartsoft001 repository.

- `card-heading.tsx`: `SmartCardHeading`
- `card-heading.types.ts`: `SmartCardHeadingProps`
- `preset/card-heading-preset.tsx`: `SmartCardHeadingPreset`
- `standard/card-heading-standard.tsx`: `SmartCardHeadingStandard`
- `card-heading.stories.tsx`: Storybook stories

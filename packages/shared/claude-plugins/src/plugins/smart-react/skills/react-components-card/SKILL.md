---
name: react-components-card
description: SmartCard React component API (@smartsoft001/react) — panel with header, body and footer slots (header/footer/children), title, gray body/footer, the 'card' registry key with SmartCardVariantProps, SmartCardPreset and useCard.
user-invocable: false
---

# Card (`SmartCard`)

`SmartCard` is a panel with three sections: an optional header (`header`, plus `options.title`), the body (`children`) and an optional footer (`footer`). A section is rendered when its content is given, unless `hasHeader` / `hasFooter` force it. The wrapper hands the slots to the registered implementation as `headerTpl` / `bodyTpl` / `footerTpl` (`SmartCardVariantProps`), so a custom card receives nodes, not `children`.

## When to Use This Skill

- Grouping content in a bordered/raised panel with a title and actions
- Putting actions in the header or footer (`header`, `footer` nodes)
- Restyling every card (the `card` registry key; implementations take `SmartCardVariantProps`)

## Exports

All from `@smartsoft001/react`.

| Export               | Kind      | What it is                                                                                                                                         |
| -------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartCard`          | component | Renders the implementation registered as `components.card` on `SmartProvider`, `SmartCardStandard` by default.                                     |
| `SmartCardPreset`    | component | Styled card variation (preset).                                                                                                                    |
| `SmartCardStandard`  | component | The default card rendering: a white panel with an optional header (with `options.title`), the body and an optional footer.                         |
| `useCard`            | hook      | The behaviour every card variant shares: which sections are shown, and the classes of the container and the header, body and footer sections.      |
| `isCardSectionShown` | function  | Whether a card section is rendered: `flag` when set, otherwise whether `content` renders anything (`null`, `undefined`, booleans and `''` do not). |

The preset's class helpers (`getCardContainerClasses`, `getCardHeaderClasses`, `getCardBodyClasses`, `getCardFooterClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartCardProps`

Props of `<SmartCard>`.

| Prop         | Type           | Default | Description                                                     |
| ------------ | -------------- | ------- | --------------------------------------------------------------- |
| `options?`   | `ICardOptions` | —       | Title and the gray body / footer flags.                         |
| `hasHeader?` | `boolean`      | —       | Renders the header section; by default, when `header` is given. |
| `hasFooter?` | `boolean`      | —       | Renders the footer section; by default, when `footer` is given. |
| `className?` | `string`       | —       | Classes on the card container.                                  |
| `header?`    | `ReactNode`    | —       | The header content.                                             |
| `footer?`    | `ReactNode`    | —       | The footer content.                                             |
| `children?`  | `ReactNode`    | —       | The body content.                                               |

### `SmartCardVariantProps`

Props of a card implementation (`SmartCardStandard`, `SmartCardPreset` or one registered as `components.card`): the wrapper passes `header` / `children` / `footer` as `headerTpl` / `bodyTpl` / `footerTpl`.

| Prop         | Type           | Default | Description                                                        |
| ------------ | -------------- | ------- | ------------------------------------------------------------------ |
| `options?`   | `ICardOptions` | —       | Title and the gray body / footer flags.                            |
| `hasHeader?` | `boolean`      | —       | Renders the header section; by default, when `headerTpl` is given. |
| `hasFooter?` | `boolean`      | —       | Renders the footer section; by default, when `footerTpl` is given. |
| `className?` | `string`       | —       | Classes on the card container.                                     |
| `headerTpl?` | `ReactNode`    | —       | The header content (`SmartCard`'s `header`).                       |
| `bodyTpl?`   | `ReactNode`    | —       | The body content (`SmartCard`'s `children`).                       |
| `footerTpl?` | `ReactNode`    | —       | The footer content (`SmartCard`'s `footer`).                       |

### `ICardOptions`

| Field         | Type                        | Default | Description                                                                                                                                                                                                                           |
| ------------- | --------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title?`      | `string`                    | —       | Rendered in the header (the header is shown for it when `hasHeader` is set).                                                                                                                                                          |
| `buttons?`    | `Array<IIconButtonOptions>` | —       | @deprecated Has never been rendered by any card variant (standard or preset). Put actions in the header or footer instead: pass them as the `header` / `footer` of `SmartCard`, which reach the variant as `headerTpl` / `footerTpl`. |
| `grayFooter?` | `boolean`                   | —       | Gray background on the footer.                                                                                                                                                                                                        |
| `grayBody?`   | `boolean`                   | —       | Gray background on the body.                                                                                                                                                                                                          |

### `IIconButtonOptions`

An icon button description (used by `ICardOptions.buttons`, deprecated here, and by page buttons).

| Field        | Type                     | Default  | Description                                                                                     |
| ------------ | ------------------------ | -------- | ----------------------------------------------------------------------------------------------- |
| `icon`       | `string`                 | required | Identifier of the button (page renderings use it as the React key; it is not drawn as an icon). |
| `text?`      | `string`                 | —        | Label.                                                                                          |
| `handler?`   | `() => void`             | —        | Click handler.                                                                                  |
| `component?` | `any`                    | —        | Carried for implementations of your own; the library's renderings do not read it.               |
| `type?`      | `'default' \| 'popover'` | —        | Carried for implementations of your own; the library's renderings do not read it.               |
| `disabled?`  | `boolean`                | —        | Disables the button.                                                                            |
| `number?`    | `number`                 | —        | A count badge on the button.                                                                    |

## Sections

- The header is rendered when `header` is given, or when `hasHeader` is `true` (for example to show only `options.title`).
- The footer is rendered when `footer` is given, or when `hasFooter` is `true`.
- `hasHeader={false}` / `hasFooter={false}` hide a section even when content is given. `isCardSectionShown(flag, content)` is the rule (`null`, `undefined`, booleans and `''` count as no content).
- `options.buttons` is deprecated and never rendered: put actions into `header` or `footer`.

## Usage

```tsx
import { SmartButton, SmartCard, SmartCardPreset } from '@smartsoft001/react';

export function ProfileCard({ onEdit }: { onEdit: () => void }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <SmartCard
        options={{ title: 'Profile', grayFooter: true }}
        hasHeader
        footer={
          <SmartButton options={{ click: onEdit, size: 'sm' }}>
            Edit
          </SmartButton>
        }
      >
        <p>Anna Kowalska, product designer.</p>
      </SmartCard>

      {/* The preset takes the variant props: headerTpl / bodyTpl / footerTpl. */}
      <SmartCardPreset
        options={{ title: 'Usage' }}
        hasHeader
        bodyTpl={<p>12 of 20 seats used.</p>}
      />
    </div>
  );
}
```

## Replacing the Implementation

`SmartCard` renders the component registered under the `'card'` key of `SmartProvider`'s `components`, and `SmartCardStandard` when nothing is registered there. Every `SmartCard` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartCardPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { card: SmartCardPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartCardPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartCard`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useCard` hook

The behaviour every card variant shares: which sections are shown, and the classes of the container and the header, body and footer sections.

```ts
function useCard({
  options,
  hasHeader,
  hasFooter,
  headerTpl,
  footerTpl,
}: SmartCardVariantProps);
```

| Returns                  | Type       | Description                                                     |
| ------------------------ | ---------- | --------------------------------------------------------------- |
| `showHeader`             | `boolean`  | Whether the header section is rendered.                         |
| `showFooter`             | `boolean`  | Whether the footer section is rendered.                         |
| `sharedContainerClasses` | `string[]` | Classes of the card container.                                  |
| `headerClasses`          | `string`   | Classes of the header section.                                  |
| `bodyClasses`            | `string`   | Classes of the body section (gray with `options.grayBody`).     |
| `footerClasses`          | `string`   | Classes of the footer section (gray with `options.grayFooter`). |

```tsx
import { SmartCardVariantProps, useCard } from '@smartsoft001/react';

export function FlatCard(props: SmartCardVariantProps) {
  const { showHeader, showFooter } = useCard(props);

  return (
    <article className={props.className}>
      {showHeader && (
        <header>
          {props.options?.title && <h3>{props.options.title}</h3>}
          {props.headerTpl}
        </header>
      )}
      <div>{props.bodyTpl}</div>
      {showFooter && <footer>{props.footerTpl}</footer>}
    </article>
  );
}
```

Register it as `components={{ card: FlatCard }}`: `SmartCard` keeps taking `header` / `children` / `footer` and passes them on as `headerTpl` / `bodyTpl` / `footerTpl`.

## Styling

- `SmartCardStandard` is a white panel with dark-mode variants; `SmartCardPreset` adds the rounded `shadow-2xs` surface with bordered header and footer.
- `className` is appended to the container.

## File Locations

Source: `packages/shared/react/src/lib/components/card/` in the smartsoft001 repository.

- `card.tsx`: `SmartCard`
- `card.types.ts`: `SmartCardProps`, `SmartCardVariantProps`
- `preset/card-preset.tsx`: `SmartCardPreset`
- `standard/card-standard.tsx`: `SmartCardStandard`
- `use-card.ts`: `isCardSectionShown`, `useCard`
- `card.stories.tsx`: Storybook stories

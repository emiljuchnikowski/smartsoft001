---
name: react-components-page
description: SmartPage React component API (@smartsoft001/react) — screen layout with a translated title, back button, search box and end buttons above the body (children or bodyTpl), page variants resolved by registry key ('page', 'page:<variant>'), SmartPagePreset with breadcrumbs/meta/stats/filters/sidebar slots, PAGE_PRESET_VARIANT_COMPONENTS and usePage.
user-invocable: false
---

# Page (`SmartPage`)

`SmartPage` lays out a screen: a header with an optional back button, the **translated** `title`, an optional search input and the `endButtons`, followed by the body (`children`, or `options.bodyTpl`). Which component renders it depends on `options.variant`: the component registered under `getPageVariantKey(variant)` (`'page'` for `'standard'`, `'page:<variant>'` for the others), else `SmartPageStandard`. `SmartPagePreset` is a full application-shell layout that also renders the breadcrumbs, avatar / logo, subtitle, meta, stats, filters, banner and sidebar slots. CRUD list and item screens are built on `SmartPage`.

## When to Use This Skill

- The frame of a screen: title, back button, search and action buttons above the content
- A richer page header with breadcrumbs, meta, stats, filters or a sidebar (`SmartPagePreset`)
- Several page looks in one application (`options.variant` + `'page:<variant>'` registrations)
- Restyling every page (the `page` key) or one variant

## Exports

All from `@smartsoft001/react`.

| Export                           | Kind      | What it is                                                                                                                                                                                       |
| -------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SmartPage`                      | component | Renders the component registered for `options.variant` (`'standard'` when omitted) under `getPageVariantKey(variant)` on `SmartProvider`, `SmartPageStandard` when nothing is registered for it. |
| `SmartPagePreset`                | component | Styled page variation (preset).                                                                                                                                                                  |
| `SmartPageStandard`              | component | The default page rendering: a header with the optional back button, the translated title, the search input and the end buttons, followed by `options.bodyTpl`.                                   |
| `usePage`                        | hook      | The page's logic: `back()` goes to the previous location, through the navigation adapter.                                                                                                        |
| `getPageVariantKey`              | function  | The registry key of a page variant: `'page'` for `'standard'`, `'page:<variant>'` otherwise.                                                                                                     |
| `getPageButtonOptions`           | function  | The `SmartButton` options of an end button (secondary, `md`, running its handler).                                                                                                               |
| `PAGE_PRESET_VARIANT_COMPONENTS` | const     | Styled page variant preset, keyed by `getPageVariantKey(variant)`.                                                                                                                               |

The preset's class helpers (`getPagePageClasses`, `getPageHeaderClasses`, `getPageContainerClasses`, `getPageTitleClasses`, `getPageBodyCardClasses`, `getPageIconButtonClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartPageProps`

Extends `SmartPageVariantProps`.

| Prop        | Type        | Default | Description                                            |
| ----------- | ----------- | ------- | ------------------------------------------------------ |
| `children?` | `ReactNode` | —       | The page body, used when `options.bodyTpl` is not set. |

### `SmartPageVariantProps`

The props of a page variant (what `<SmartPage>` hands to the resolved component): the options, with `bodyTpl` already merged with the wrapper's children, and the CSS class.

| Prop         | Type                   | Default | Description                                                                   |
| ------------ | ---------------------- | ------- | ----------------------------------------------------------------------------- |
| `options?`   | `IPageOptions \| null` | —       | The page options, with `bodyTpl` already set from `children`.                 |
| `className?` | `string`               | —       | Classes of the page root (the standard rendering has no root and ignores it). |

### `IPageOptions`

| Field             | Type                                           | Default      | Description                                                                                                                                                                                                       |
| ----------------- | ---------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`           | `string`                                       | required     | The page title, passed through the translations (a key or text).                                                                                                                                                  |
| `hideHeader?`     | `boolean`                                      | —            | Hides the header (title, buttons, search).                                                                                                                                                                        |
| `hideMenuButton?` | `boolean`                                      | —            | Preset: hides the menu button (which has no action of its own).                                                                                                                                                   |
| `showBackButton?` | `boolean`                                      | —            | Shows a back button that calls `navigation.back()`.                                                                                                                                                               |
| `endButtons?`     | `Array<IIconButtonOptions>`                    | `[]`         | Buttons at the end of the header: each renders a `SmartButton` (secondary, `md`) running `handler`, labelled with the translated `text` and a `number` badge. `icon` is used as the React key, so keep it unique. |
| `search?`         | `{ text: string; set: (txt: string) => void }` | —            | A search input bound to `text` / `set` (the placeholder is the `search` translation).                                                                                                                             |
| `variant?`        | `SmartPageVariant`                             | `'standard'` | Picks the registered component (`'page'` or `'page:<variant>'`).                                                                                                                                                  |
| `bodyTpl?`        | `ReactNode`                                    | `children`   | The body; wins over `children`.                                                                                                                                                                                   |
| `breadcrumbsTpl?` | `ReactNode`                                    | —            | Preset: breadcrumbs above the title.                                                                                                                                                                              |
| `metaTpl?`        | `ReactNode`                                    | —            | Preset: meta row.                                                                                                                                                                                                 |
| `avatarTpl?`      | `ReactNode`                                    | —            | Preset: avatar next to the title.                                                                                                                                                                                 |
| `bannerTpl?`      | `ReactNode`                                    | —            | Preset: banner strip above the header.                                                                                                                                                                            |
| `filtersTpl?`     | `ReactNode`                                    | —            | Preset: filters bar under the header.                                                                                                                                                                             |
| `logoTpl?`        | `ReactNode`                                    | —            | Preset: logo next to the title.                                                                                                                                                                                   |
| `statsTpl?`       | `ReactNode`                                    | —            | Preset: stats row.                                                                                                                                                                                                |
| `subtitleTpl?`    | `ReactNode`                                    | —            | Preset: subtitle under the title.                                                                                                                                                                                 |
| `navTpl?`         | `ReactNode`                                    | —            | Declared; neither `SmartPageStandard` nor `SmartPagePreset` renders it.                                                                                                                                           |
| `sidebarTpl?`     | `ReactNode`                                    | —            | Preset: an `<aside>` next to the body card.                                                                                                                                                                       |

### `IIconButtonOptions`

A page button.

| Field        | Type                     | Default  | Description                                                         |
| ------------ | ------------------------ | -------- | ------------------------------------------------------------------- |
| `icon`       | `string`                 | required | Identifier of the button (the React key of the standard rendering). |
| `text?`      | `string`                 | —        | Label (translated).                                                 |
| `handler?`   | `() => void`             | —        | Click handler.                                                      |
| `component?` | `any`                    | —        | For implementations of your own (e.g. a popover body).              |
| `type?`      | `'default' \| 'popover'` | —        | For implementations of your own (`'popover'`).                      |
| `disabled?`  | `boolean`                | —        | Disables the button.                                                |
| `number?`    | `number`                 | —        | A count badge.                                                      |

### Related types

- `SmartPageVariant`: `'standard' \| (string & {})` — `'standard'` or the name of a variant you register.

## Usage

```tsx
import { useState } from 'react';

import {
  SmartPage,
  SmartPagePreset,
  SmartBreadcrumbs,
} from '@smartsoft001/react';

export function NotesScreen({
  onAdd,
  onExport,
}: {
  onAdd: () => void;
  onExport: () => void;
}) {
  const [search, setSearch] = useState('');

  return (
    <SmartPage
      options={{
        title: 'Notes',
        showBackButton: true,
        search: { text: search, set: setSearch },
        endButtons: [
          { icon: 'add', text: 'Add', handler: onAdd },
          { icon: 'export', text: 'Export', handler: onExport, number: 3 },
        ],
      }}
    >
      <p>Results for “{search}”…</p>
    </SmartPage>
  );
}

// The preset rendered directly: bodyTpl instead of children, and the extra slots.
export function ProjectScreen() {
  return (
    <SmartPagePreset
      options={{
        title: 'Project Alpha',
        breadcrumbsTpl: (
          <SmartBreadcrumbs
            options={{
              items: [
                { id: 'projects', label: 'Projects', href: '/projects' },
                { id: 'alpha', label: 'Alpha', current: true },
              ],
            }}
          />
        ),
        metaTpl: <span>Updated 2 hours ago</span>,
        bodyTpl: <p>Project content</p>,
      }}
    />
  );
}
```

## Replacing the Implementation

`SmartPage` resolves its component per variant:

| `options.variant`          | Registry key                             | Fallback            |
| -------------------------- | ---------------------------------------- | ------------------- |
| `'standard'` (or unset)    | `'page'`                                 | `SmartPageStandard` |
| any other, e.g. `'preset'` | `'page:<variant>'`, e.g. `'page:preset'` | `SmartPageStandard` |

`PAGE_PRESET_VARIANT_COMPONENTS` registers `SmartPagePreset` under `'page:preset'` only, so pages opt in with `variant: 'preset'`. `SMART_PRESET_COMPONENTS` registers it under `'page'` too, so every page renders the preset.

```tsx
import type { ReactNode } from 'react';

import {
  PAGE_PRESET_VARIANT_COMPONENTS,
  SmartPageVariantProps,
  SmartProvider,
} from '@smartsoft001/react';

function CompactPage({ options, className }: SmartPageVariantProps) {
  return (
    <section className={className}>
      <h1>{options?.title}</h1>
      {options?.bodyTpl}
    </section>
  );
}

// 'preset' from the library, 'compact' of our own; 'standard' stays SmartPageStandard.
const components = {
  ...PAGE_PRESET_VARIANT_COMPONENTS,
  'page:compact': CompactPage,
};

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

A page variant receives `SmartPageVariantProps`: the options with `bodyTpl` already merged from `children`, and `className`. Translate `options.title` yourself (`useTranslate()`) if the variant should match the standard one.

### The `usePage` hook

The page's logic: `back()` goes to the previous location, through the navigation adapter.

```ts
function usePage();
```

| Returns | Type         | Description                                                   |
| ------- | ------------ | ------------------------------------------------------------- |
| `back`  | `() => void` | Goes to the previous location through the navigation adapter. |

## Styling

- `SmartPageStandard` renders no wrapper element (header and body are siblings) and does not apply `className`.
- `SmartPagePreset` appends `className` to its root and renders a gray page body with the content in a card, with `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/page/` in the smartsoft001 repository.

- `page.tsx`: `getPageVariantKey`, `SmartPage`
- `page.types.ts`: `SmartPageVariantProps`, `SmartPageProps`
- `preset-variants.ts`: `PAGE_PRESET_VARIANT_COMPONENTS`
- `preset/page-preset.tsx`: `SmartPagePreset`
- `standard/page-standard.tsx`: `SmartPageStandard`
- `use-page.ts`: `usePage`, `getPageButtonOptions`
- `page.stories.tsx`: Storybook stories

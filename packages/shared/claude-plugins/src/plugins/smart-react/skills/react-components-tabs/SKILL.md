---
name: react-components-tabs
description: SmartTabs React component API (@smartsoft001/react) — tab navigation (buttons or router links) with icons and badges, controlled selectedId or uncontrolled defaultSelectedId, onTabChange, a mobile select, nine layouts, the 'tabs' registry key, SmartTabsPreset and useTabs.
user-invocable: false
---

# Tabs (`SmartTabs`)

`SmartTabs` renders the tab strip only; the parent renders the content of the selected tab. Tabs are buttons that select themselves, or links (`href`, rendered through the navigation adapter's `linkComponent` for internal paths). The selection is controlled (`selectedId` + `onSelectedIdChange`) or kept inside (`defaultSelectedId`); `onTabChange({ tabId })` reports every choice. Unless `options.showMobileSelect` is `false`, a `<select>` of the tabs is rendered too: the preset shows it below `sm` and the strip from `sm` up, the standard rendering marks the two with the `tabs-mobile` / `tabs-desktop` class hooks for your CSS. `SmartTabsPreset` renders the nine `layout`s with `role="tablist"` / `tab`, `aria-selected` and `aria-controls={item.id}` (give your panel that id).

## When to Use This Skill

- Switching between sections of a page (Overview / Settings / Members)
- Tabs that are links to sub-routes, with the current one highlighted
- Tabs with icons or counts (`underline-with-icons`, `underline-with-badges`)
- Restyling every tab strip (the `tabs` registry key)

## Exports

All from `@smartsoft001/react`.

| Export              | Kind      | What it is                                                                                                                                                                                                                                    |
| ------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartTabs`         | component | Renders the implementation registered as `components.tabs` on `SmartProvider`, `SmartTabsStandard` by default.                                                                                                                                |
| `SmartTabsPreset`   | component | Styled tabs variation (preset).                                                                                                                                                                                                               |
| `SmartTabsStandard` | component | The default tabs rendering.                                                                                                                                                                                                                   |
| `useTabs`           | hook      | The behaviour every tabs variant shares: the selection, controlled through `selectedId` or kept internally when that prop is `undefined`, and `selectTab`, which selects a tab and reports it through `onSelectedIdChange` and `onTabChange`. |

The preset's class helpers (`getTabsContainerClasses`, `getTabsNavClasses`, `getTabsTriggerClasses`, `getTabsBadgeClasses`, `getTabsIconClasses`, `getTabsMobileSelectClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartTabsProps`

| Prop                  | Type                           | Default | Description                                                                                                 |
| --------------------- | ------------------------------ | ------- | ----------------------------------------------------------------------------------------------------------- |
| `options?`            | `ITabsOptions`                 | —       | Items, layout, accessible name and the mobile select.                                                       |
| `selectedId?`         | `string \| null`               | —       | The id of the selected tab (`null` for none). Leave it `undefined` to let the component keep the selection. |
| `defaultSelectedId?`  | `string \| null`               | `null`  | The initial selection of an uncontrolled component.                                                         |
| `onSelectedIdChange?` | `(selectedId: string) => void` | —       | Called with the id of the selected tab.                                                                     |
| `onTabChange?`        | `(event: ITabChange) => void`  | —       | A tab was chosen (button click, preset link click or mobile select).                                        |
| `className?`          | `string`                       | —       | Classes on the root element.                                                                                |

### `ITabsOptions`

| Field               | Type              | Default       | Description                                                                                                     |
| ------------------- | ----------------- | ------------- | --------------------------------------------------------------------------------------------------------------- |
| `layout?`           | `SmartTabsLayout` | `'underline'` | Preset look; the standard rendering ignores it.                                                                 |
| `items?`            | `ITabItem[]`      | `[]`          | The tabs.                                                                                                       |
| `ariaLabel?`        | `string`          | `'Tabs'`      | Accessible name of the strip; the standard mobile select uses it too, with `'Select a tab'` as its own default. |
| `showMobileSelect?` | `boolean`         | `true`        | Renders a `<select>` of the tabs for small screens.                                                             |

### `ITabChange`

| Field   | Type     | Default  | Description                 |
| ------- | -------- | -------- | --------------------------- |
| `tabId` | `string` | required | The `id` of the chosen tab. |

### `ITabItem`

| Field      | Type               | Default  | Description                                                                                        |
| ---------- | ------------------ | -------- | -------------------------------------------------------------------------------------------------- |
| `id`       | `string`           | required | Identifies the tab (`selectedId`, `tabId`, and the preset's `aria-controls`).                      |
| `label?`   | `string`           | —        | Tab text.                                                                                          |
| `href?`    | `string`           | —        | Renders the tab as a link; the standard rendering follows the link without changing the selection. |
| `badge?`   | `string \| number` | —        | A count or text badge.                                                                             |
| `iconTpl?` | `ReactNode`        | —        | Icon before the label.                                                                             |

### Related types

- `SmartTabsLayout`: `'underline' \| 'underline-with-icons' \| 'underline-with-badges' \| 'underline-full-width' \| 'pills' \| 'pills-on-gray' \| 'pills-with-brand-color' \| 'bar-with-underline' \| 'simple'`

## Usage

```tsx
import { useState } from 'react';

import { SmartTabsPreset } from '@smartsoft001/react';

export function ProjectTabs() {
  const [tab, setTab] = useState('overview');

  return (
    <>
      <SmartTabsPreset
        selectedId={tab}
        onSelectedIdChange={setTab}
        options={{
          layout: 'underline-with-badges',
          ariaLabel: 'Project sections',
          items: [
            { id: 'overview', label: 'Overview' },
            { id: 'members', label: 'Members', badge: 4 },
            { id: 'settings', label: 'Settings' },
          ],
        }}
      />
      <section id={tab} role="tabpanel">
        {tab === 'overview' && <p>Overview…</p>}
        {tab === 'members' && <p>Members…</p>}
        {tab === 'settings' && <p>Settings…</p>}
      </section>
    </>
  );
}
```

## Replacing the Implementation

`SmartTabs` renders the component registered under the `'tabs'` key of `SmartProvider`'s `components`, and `SmartTabsStandard` when nothing is registered there. Every `SmartTabs` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartTabsPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { tabs: SmartTabsPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartTabsPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartTabs`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useTabs` hook

The behaviour every tabs variant shares: the selection, controlled through `selectedId` or kept internally when that prop is `undefined`, and `selectTab`, which selects a tab and reports it through `onSelectedIdChange` and `onTabChange`.

```ts
function useTabs({
  selectedId,
  defaultSelectedId = null,
  onSelectedIdChange,
  onTabChange,
}: SmartTabsProps);
```

| Returns      | Type                      | Description                                                       |
| ------------ | ------------------------- | ----------------------------------------------------------------- |
| `selectedId` | `string \| null`          | The selected id (controlled or internal).                         |
| `selectTab`  | `(tabId: string) => void` | Selects a tab and reports `onSelectedIdChange` and `onTabChange`. |

```tsx
import { SmartTabsProps, useTabs } from '@smartsoft001/react';

export function SegmentTabs(props: SmartTabsProps) {
  const { selectedId, selectTab } = useTabs(props);
  const items = props.options?.items ?? [];
  const current = selectedId ?? items[0]?.id;

  return (
    <div
      role="tablist"
      aria-label={props.options?.ariaLabel}
      className={props.className}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === current}
          onClick={() => selectTab(item.id)}
        >
          {item.label}
          {item.badge !== undefined && <span> {item.badge}</span>}
        </button>
      ))}
    </div>
  );
}
```

## Styling

- The standard rendering is unstyled; the preset treats the first item as current when nothing is selected and carries `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/tabs/` in the smartsoft001 repository.

- `preset/tabs-preset.tsx`: `SmartTabsPreset`
- `standard/tabs-standard.tsx`: `SmartTabsStandard`
- `tabs.tsx`: `SmartTabs`
- `tabs.types.ts`: `ITabChange`, `SmartTabsProps`
- `use-tabs.ts`: `useTabs`
- `tabs.stories.tsx`: Storybook stories

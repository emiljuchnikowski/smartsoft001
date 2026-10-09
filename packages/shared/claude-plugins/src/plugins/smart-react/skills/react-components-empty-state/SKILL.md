---
name: react-components-empty-state
description: SmartEmptyState React component API (@smartsoft001/react) — placeholder for an empty list or first-run screen with icon, title, description, actions, suggested items, a form slot and a footer link, onActionClick/onItemClick, the 'empty-state' registry key and SmartEmptyStatePreset.
user-invocable: false
---

# Empty State (`SmartEmptyState`)

`SmartEmptyState` fills the space where content would be: an icon, a title and description, a row of actions, an optional list of suggested items (starting points, templates, recommendations), a form slot and a footer link. Actions and items with `href` render as links; the others as buttons reported through `onActionClick({ actionId })` / `onItemClick({ itemId })`.

## When to Use This Skill

- A list or table with no rows yet ("No projects — create your first one")
- A first-run screen offering starting points or templates (`items`)
- Inviting the user with an inline form (`formTpl`), e.g. "Add team members"
- Restyling every empty state (the `empty-state` registry key)

## Exports

All from `@smartsoft001/react`.

| Export                    | Kind      | What it is                                                                                                                                                                                                                                    |
| ------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartEmptyState`         | component | Renders the implementation registered as `components['empty-state']` on `SmartProvider`, `SmartEmptyStateStandard` by default.                                                                                                                |
| `SmartEmptyStatePreset`   | component | Styled empty-state variation (preset).                                                                                                                                                                                                        |
| `SmartEmptyStateStandard` | component | The default empty-state rendering: icon, title, description, form slot, actions (anchors when `href` is set, otherwise buttons calling `onActionClick`), an optional items list (anchors or buttons calling `onItemClick`) and a footer link. |

The preset's class helpers (`getEmptyStateActionClasses`, `EMPTY_STATE_CONTAINER`, `EMPTY_STATE_ICON_WRAP`, `EMPTY_STATE_TITLE`, `EMPTY_STATE_DESCRIPTION`, `EMPTY_STATE_FORM`, `EMPTY_STATE_FOOTER_LINK`, `EMPTY_STATE_FOOTER_WRAP`, `EMPTY_STATE_ACTIONS`, `EMPTY_STATE_ITEMS_TITLE`, `EMPTY_STATE_ITEMS_LIST`, `EMPTY_STATE_ITEM`, `EMPTY_STATE_ITEM_ICON`, `EMPTY_STATE_ITEM_IMAGE`, `EMPTY_STATE_ITEM_CONTENT`, `EMPTY_STATE_ITEM_TITLE`, `EMPTY_STATE_ITEM_DESCRIPTION`, `EMPTY_STATE_ITEM_META`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartEmptyStateProps`

| Prop             | Type                                      | Default | Description                                      |
| ---------------- | ----------------------------------------- | ------- | ------------------------------------------------ |
| `options?`       | `IEmptyStateOptions`                      | —       | Content of the empty state.                      |
| `className?`     | `string`                                  | —       | Classes on the root element.                     |
| `onActionClick?` | `(event: IEmptyStateActionClick) => void` | —       | Called when an action without `href` is clicked. |
| `onItemClick?`   | `(event: IEmptyStateItemClick) => void`   | —       | Called when an item without `href` is clicked.   |

### `IEmptyStateOptions`

| Field              | Type                    | Default | Description                                                                                 |
| ------------------ | ----------------------- | ------- | ------------------------------------------------------------------------------------------- |
| `title?`           | `string`                | —       | Heading.                                                                                    |
| `description?`     | `string`                | —       | Text under the heading.                                                                     |
| `layout?`          | `SmartEmptyStateLayout` | —       | Declared (`SmartEmptyStateLayout`); neither the standard nor the preset rendering reads it. |
| `iconTpl?`         | `ReactNode`             | —       | Icon or illustration above the title.                                                       |
| `actions?`         | `IEmptyStateAction[]`   | `[]`    | Buttons / links under the description.                                                      |
| `items?`           | `IEmptyStateItem[]`     | `[]`    | Suggested items listed below.                                                               |
| `itemsTitle?`      | `string`                | —       | Heading of the items list.                                                                  |
| `formTpl?`         | `ReactNode`             | —       | A form slot (e.g. an invite input).                                                         |
| `footerLinkLabel?` | `string`                | —       | Text of the footer link.                                                                    |
| `footerLinkHref?`  | `string`                | —       | Target of the footer link.                                                                  |

### `IEmptyStateActionClick`

Payload of `onActionClick`.

| Field      | Type     | Default  | Description                     |
| ---------- | -------- | -------- | ------------------------------- |
| `actionId` | `string` | required | The `id` of the clicked action. |

### `IEmptyStateItemClick`

Payload of `onItemClick`.

| Field    | Type     | Default  | Description                   |
| -------- | -------- | -------- | ----------------------------- |
| `itemId` | `string` | required | The `id` of the clicked item. |

### `IEmptyStateAction`

| Field      | Type                                            | Default  | Description                                                                          |
| ---------- | ----------------------------------------------- | -------- | ------------------------------------------------------------------------------------ |
| `id`       | `string`                                        | required | Reported as `actionId`.                                                              |
| `label?`   | `string`                                        | —        | Button / link text.                                                                  |
| `href?`    | `string`                                        | —        | Renders a link instead of a button.                                                  |
| `variant?` | `'primary' \| 'secondary' \| 'ghost' \| 'link'` | —        | Look of the action (the preset defaults to `link` with `href`, `primary` otherwise). |
| `iconTpl?` | `ReactNode`                                     | —        | Icon next to the label.                                                              |

### `IEmptyStateItem`

| Field          | Type        | Default  | Description                                     |
| -------------- | ----------- | -------- | ----------------------------------------------- |
| `id`           | `string`    | required | Reported as `itemId`.                           |
| `title?`       | `string`    | —        | Item title.                                     |
| `description?` | `string`    | —        | Item text.                                      |
| `href?`        | `string`    | —        | Renders the item as a link instead of a button. |
| `iconTpl?`     | `ReactNode` | —        | Item icon.                                      |
| `imageUrl?`    | `string`    | —        | Item image.                                     |
| `imageAlt?`    | `string`    | —        | Alt text of the image.                          |
| `meta?`        | `string`    | —        | Small extra text.                               |

### Related types

- `SmartEmptyStateLayout`: `'simple' \| 'dashed-border' \| 'starting-points' \| 'with-recommendations' \| 'with-templates' \| 'with-recommendations-grid'`

## Usage

```tsx
import { SmartEmptyState } from '@smartsoft001/react';

export function NoProjects({
  onCreate,
  onTemplate,
}: {
  onCreate: () => void;
  onTemplate: (id: string) => void;
}) {
  return (
    <SmartEmptyState
      options={{
        title: 'No projects',
        description: 'Get started by creating a new project.',
        actions: [
          { id: 'create', label: 'New project', variant: 'primary' },
          { id: 'docs', label: 'Read the guide', href: '/docs/projects' },
        ],
        itemsTitle: 'Or start from a template',
        items: [
          {
            id: 'kanban',
            title: 'Kanban board',
            description: 'Track work in columns.',
          },
          {
            id: 'roadmap',
            title: 'Roadmap',
            description: 'Plan quarters ahead.',
          },
        ],
      }}
      onActionClick={({ actionId }) => {
        if (actionId === 'create') onCreate();
      }}
      onItemClick={({ itemId }) => onTemplate(itemId)}
    />
  );
}
```

## Replacing the Implementation

`SmartEmptyState` renders the component registered under the `'empty-state'` key of `SmartProvider`'s `components`, and `SmartEmptyStateStandard` when nothing is registered there. Every `SmartEmptyState` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartEmptyStatePreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'empty-state': SmartEmptyStatePreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartEmptyStatePreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartEmptyState`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartEmptyStateProps } from '@smartsoft001/react';

export function MinimalEmptyState({
  options,
  className,
  onActionClick,
}: SmartEmptyStateProps) {
  return (
    <div className={className} role="status">
      {options?.iconTpl}
      <h3>{options?.title}</h3>
      <p>{options?.description}</p>
      {options?.actions?.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={() => onActionClick?.({ actionId: action.id })}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
```

## Styling

- The standard rendering is unstyled markup with class hooks (`title`, `form`, `items-title`, ...); `SmartEmptyStatePreset` renders the centred block (icon tile, title, description, link and actions) with `smart:dark:` variants.
- `className` is appended to the root element.

## File Locations

Source: `packages/shared/react/src/lib/components/empty-state/` in the smartsoft001 repository.

- `empty-state.tsx`: `SmartEmptyState`
- `empty-state.types.ts`: `IEmptyStateActionClick`, `IEmptyStateItemClick`, `SmartEmptyStateProps`
- `preset/empty-state-preset.tsx`: `SmartEmptyStatePreset`
- `standard/empty-state-standard.tsx`: `SmartEmptyStateStandard`
- `empty-state.stories.tsx`: Storybook stories

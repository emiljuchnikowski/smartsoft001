---
name: react-components-description-list
description: SmartDescriptionList React component API (@smartsoft001/react) — label/value rows (dl) with a title, description, per-row value and action slots, attachments and footer slots, the 'description-list' registry key and SmartDescriptionListPreset.
user-invocable: false
---

# Description List (`SmartDescriptionList`)

`SmartDescriptionList` renders a list of label / value pairs (a `<dl>`), with an optional title and description above it and attachments and footer slots below it. A row's `valueTpl` node wins over its `value` text, and `actionTpl` adds an action (e.g. an "Update" link) next to the value. `SmartDescriptionListStandard` is unstyled; `SmartDescriptionListPreset` renders the header, a divided list and the extra sections styled.

## When to Use This Skill

- Showing the fields of a record read-only (profile, order, applicant) from data you already have
- Rows with custom value content or an action per row
- Restyling every description list (the `description-list` registry key)

For the fields of a model described with `@Field` decorators, use `SmartDetails` (`react-components-details`) instead: it builds the rows from the metadata.

## Exports

All from `@smartsoft001/react`.

| Export                         | Kind      | What it is                                                                                                                                                                                                |
| ------------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartDescriptionList`         | component | Renders the implementation registered as `components['description-list']` on `SmartProvider`, `SmartDescriptionListStandard` by default.                                                                  |
| `SmartDescriptionListPreset`   | component | Preset-styled description list.                                                                                                                                                                           |
| `SmartDescriptionListStandard` | component | The default description list rendering: an unstyled title, description, a `<dl>` of label/value items (`valueTpl` wins over `value`, `actionTpl` follows the value) and the attachments and footer slots. |

The preset's class helpers (`getDescriptionListListClasses`, `DESCRIPTION_LIST_TITLE_CLASSES`, `DESCRIPTION_LIST_DESCRIPTION_CLASSES`, `DESCRIPTION_LIST_LIST_CLASSES`, `DESCRIPTION_LIST_ROW_CLASSES`, `DESCRIPTION_LIST_TERM_CLASSES`, `DESCRIPTION_LIST_VALUE_CLASSES`, `DESCRIPTION_LIST_ACTION_CLASSES`, `DESCRIPTION_LIST_ATTACHMENTS_CLASSES`, `DESCRIPTION_LIST_FOOTER_CLASSES`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartDescriptionListProps`

| Prop         | Type                      | Default | Description                                                |
| ------------ | ------------------------- | ------- | ---------------------------------------------------------- |
| `options?`   | `IDescriptionListOptions` | —       | Header, rows and extra sections.                           |
| `className?` | `string`                  | —       | Classes on the root element (on the `<dl>` in the preset). |

### `IDescriptionListOptions`

| Field             | Type                     | Default | Description                                  |
| ----------------- | ------------------------ | ------- | -------------------------------------------- |
| `title?`          | `string`                 | —       | Heading above the list.                      |
| `description?`    | `string`                 | —       | Text under the heading.                      |
| `items?`          | `IDescriptionListItem[]` | `[]`    | The rows.                                    |
| `attachmentsTpl?` | `ReactNode`              | —       | A section after the rows (e.g. a file list). |
| `footerTpl?`      | `ReactNode`              | —       | A section at the end.                        |

### `IDescriptionListItem`

| Field        | Type        | Default  | Description                             |
| ------------ | ----------- | -------- | --------------------------------------- |
| `label`      | `string`    | required | The term.                               |
| `value?`     | `string`    | —        | The value as text.                      |
| `valueTpl?`  | `ReactNode` | —        | The value as a node; wins over `value`. |
| `actionTpl?` | `ReactNode` | —        | An action next to the value.            |

## Usage

```tsx
import { SmartDescriptionList } from '@smartsoft001/react';

export function ApplicantInfo({ onEditEmail }: { onEditEmail: () => void }) {
  return (
    <SmartDescriptionList
      options={{
        title: 'Applicant information',
        description: 'Personal details and application.',
        items: [
          { label: 'Full name', value: 'Margot Foster' },
          {
            label: 'Email address',
            value: 'margotfoster@example.com',
            actionTpl: (
              <button type="button" onClick={onEditEmail}>
                Update
              </button>
            ),
          },
          { label: 'Salary expectation', valueTpl: <strong>$120,000</strong> },
        ],
        footerTpl: <small>Last updated yesterday</small>,
      }}
    />
  );
}
```

## Replacing the Implementation

`SmartDescriptionList` renders the component registered under the `'description-list'` key of `SmartProvider`'s `components`, and `SmartDescriptionListStandard` when nothing is registered there. Every `SmartDescriptionList` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartDescriptionListPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'description-list': SmartDescriptionListPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartDescriptionListPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartDescriptionList`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartDescriptionListProps } from '@smartsoft001/react';

export function InlineDescriptionList({
  options,
  className,
}: SmartDescriptionListProps) {
  return (
    <dl className={className}>
      {(options?.items ?? []).map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>
            {item.valueTpl ?? item.value} {item.actionTpl}
          </dd>
        </div>
      ))}
    </dl>
  );
}
```

## Styling

- `SmartDescriptionListPreset` has no wrapper element: header, `<dl>`, attachments and footer render side by side, and `className` lands on the `<dl>`. It carries `smart:dark:` variants.
- `SmartDescriptionListStandard` is unstyled markup.

## File Locations

Source: `packages/shared/react/src/lib/components/description-list/` in the smartsoft001 repository.

- `description-list.tsx`: `SmartDescriptionList`
- `description-list.types.ts`: `SmartDescriptionListProps`
- `preset/description-list-preset.tsx`: `SmartDescriptionListPreset`
- `standard/description-list-standard.tsx`: `SmartDescriptionListStandard`
- `description-list.stories.tsx`: Storybook stories

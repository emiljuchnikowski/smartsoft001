---
name: react-components-textarea
description: SmartTextarea React component API (@smartsoft001/react) — multi-line text field (comment box) with label, rows, maxLength, actions reported with the text (onActionClick), avatar/toolbar/preview/footer slots and five preset variants, controlled value/onValueChange or uncontrolled defaultValue, the 'textarea' registry key, SmartTextareaPreset and useTextarea.
user-invocable: false
---

# Textarea (`SmartTextarea`)

`SmartTextarea` is a multi-line text field shaped for comment and message boxes: a label, the `<textarea>`, and a bar of `actions` (e.g. Post, Attach) reported through `onActionClick({ actionId, value })` with the current text, plus slots for an avatar, a toolbar, a preview and a footer. The text is controlled (`value` + `onValueChange`) or kept inside (`defaultValue`). `SmartTextareaPreset` adds five `variant`s (including Write / Preview tabs), focuses on mount with `autoFocus` and shows a character counter for `maxLength`.

## When to Use This Skill

- A comment, reply or message box with a submit action
- A plain multi-line field outside a model-driven form
- Restyling every textarea (the `textarea` registry key)

Inside a form generated from a model, `longText` fields render their own input (`react-components-input`).

## Exports

All from `@smartsoft001/react`.

| Export                  | Kind      | What it is                                                                                                                                                                                                                           |
| ----------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SmartTextarea`         | component | Renders the implementation registered as `components.textarea` on `SmartProvider`, `SmartTextareaStandard` by default.                                                                                                               |
| `SmartTextareaPreset`   | component | Styled textarea variation (preset).                                                                                                                                                                                                  |
| `SmartTextareaStandard` | component | The default, unstyled textarea.                                                                                                                                                                                                      |
| `useTextarea`           | hook      | The behaviour every textarea variant shares: the `value`, controlled through `value` / `onValueChange` or kept internally from `defaultValue`, and `actionClick()`, which reports an action with the current text unless `disabled`. |

The preset's class helpers (`textareaFieldClasses`, `textareaFrameClasses`, `textareaBarClasses`, `textareaBarInside`, `textareaActionClasses`, `textareaTabClasses`, `TEXTAREA_ROOT`, `TEXTAREA_AVATAR`, `TEXTAREA_BODY`, `TEXTAREA_LABEL`, `TEXTAREA_REQUIRED`, `TEXTAREA_TOOLBAR`, `TEXTAREA_ACTIONS`, `TEXTAREA_TABS`, `TEXTAREA_PREVIEW_PANE`, `TEXTAREA_PREVIEW_BELOW`, `TEXTAREA_COUNTER`, `TEXTAREA_FOOTER`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartTextareaProps`

| Prop             | Type                                    | Default | Description                                                                                  |
| ---------------- | --------------------------------------- | ------- | -------------------------------------------------------------------------------------------- |
| `value?`         | `string`                                | —       | The text. Leave it `undefined` for an uncontrolled textarea that starts from `defaultValue`. |
| `defaultValue?`  | `string`                                | `''`    | Initial text of an uncontrolled textarea.                                                    |
| `onValueChange?` | `(value: string) => void`               | —       | Called with the edited text.                                                                 |
| `placeholder?`   | `string`                                | `''`    | Placeholder of the field.                                                                    |
| `disabled?`      | `boolean`                               | `false` | Disables the field; action clicks are ignored.                                               |
| `options?`       | `ITextareaOptions`                      | —       | Field attributes, actions and slots.                                                         |
| `className?`     | `string`                                | —       | Classes on the root element.                                                                 |
| `onActionClick?` | `(event: ITextareaActionClick) => void` | —       | An action was clicked; reported with the current text.                                       |

### `ITextareaOptions`

| Field         | Type                   | Default    | Description                                                                        |
| ------------- | ---------------------- | ---------- | ---------------------------------------------------------------------------------- |
| `rows?`       | `number`               | `3`        | Visible rows.                                                                      |
| `maxLength?`  | `number`               | —          | Maximum length (a counter in the preset).                                          |
| `variant?`    | `SmartTextareaVariant` | `'simple'` | Preset look; the standard ignores it.                                              |
| `label?`      | `string`               | —          | Label of the field.                                                                |
| `name?`       | `string`               | —          | `name` attribute.                                                                  |
| `required?`   | `boolean`              | —          | `required` attribute.                                                              |
| `autoFocus?`  | `boolean`              | —          | Preset: focuses the field on mount.                                                |
| `ariaLabel?`  | `string`               | —          | Accessible name when there is no label.                                            |
| `actions?`    | `ITextareaAction[]`    | `[]`       | Buttons of the action bar.                                                         |
| `avatarTpl?`  | `ReactNode`            | —          | Avatar beside the field.                                                           |
| `toolbarTpl?` | `ReactNode`            | —          | Toolbar (formatting, attachments).                                                 |
| `previewTpl?` | `ReactNode`            | —          | Preview content (the preset's `with-preview` variant shows it on the Preview tab). |
| `footerTpl?`  | `ReactNode`            | —          | A slot below.                                                                      |

### `ITextareaActionClick`

Payload of `onActionClick`.

| Field      | Type     | Default  | Description                        |
| ---------- | -------- | -------- | ---------------------------------- |
| `actionId` | `string` | required | The `id` of the clicked action.    |
| `value`    | `string` | required | The text at the time of the click. |

### `ITextareaAction`

| Field      | Type                                  | Default    | Description                             |
| ---------- | ------------------------------------- | ---------- | --------------------------------------- |
| `id`       | `string`                              | required   | Reported as `actionId`.                 |
| `label?`   | `string`                              | —          | Button text.                            |
| `iconTpl?` | `ReactNode`                           | —          | Icon of the button.                     |
| `variant?` | `'primary' \| 'secondary' \| 'ghost'` | `'simple'` | `primary`, `secondary` or `ghost` look. |

### Related types

- `SmartTextareaVariant`: `'simple' \| 'with-avatar-actions' \| 'with-underline' \| 'with-pill-actions' \| 'with-preview'`

## Usage

```tsx
import { useState } from 'react';

import { SmartAvatarPreset, SmartTextareaPreset } from '@smartsoft001/react';

export function CommentBox({ onPost }: { onPost: (text: string) => void }) {
  const [text, setText] = useState('');

  return (
    <SmartTextareaPreset
      value={text}
      onValueChange={setText}
      placeholder="Add your comment…"
      options={{
        variant: 'with-avatar-actions',
        label: 'Comment',
        rows: 4,
        maxLength: 500,
        avatarTpl: <SmartAvatarPreset initials="AK" size="sm" />,
        actions: [{ id: 'post', label: 'Post', variant: 'primary' }],
      }}
      onActionClick={({ actionId, value }) => {
        if (actionId === 'post' && value.trim()) {
          onPost(value);
          setText('');
        }
      }}
    />
  );
}
```

## Replacing the Implementation

`SmartTextarea` renders the component registered under the `'textarea'` key of `SmartProvider`'s `components`, and `SmartTextareaStandard` when nothing is registered there. Every `SmartTextarea` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartTextareaPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { textarea: SmartTextareaPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartTextareaPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartTextarea`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useTextarea` hook

The behaviour every textarea variant shares: the `value`, controlled through `value` / `onValueChange` or kept internally from `defaultValue`, and `actionClick()`, which reports an action with the current text unless `disabled`.

```ts
function useTextarea({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  disabled = false,
  onActionClick,
}: SmartTextareaProps);
```

| Returns       | Type                         | Description                                                        |
| ------------- | ---------------------------- | ------------------------------------------------------------------ |
| `value`       | `string`                     | The text (controlled or internal).                                 |
| `setValue`    | `(next: string) => void`     | Sets the text and calls `onValueChange`.                           |
| `actionClick` | `(actionId: string) => void` | Reports an action with the current text; ignored while `disabled`. |

```tsx
import { SmartTextareaProps, useTextarea } from '@smartsoft001/react';

export function AutoGrowTextarea(props: SmartTextareaProps) {
  const { value, setValue, actionClick } = useTextarea(props);

  return (
    <div className={props.className}>
      <textarea
        value={value}
        placeholder={props.placeholder}
        disabled={props.disabled}
        rows={Math.max(props.options?.rows ?? 3, value.split('\n').length)}
        onChange={(event) => setValue(event.target.value)}
      />
      {props.options?.actions?.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={() => actionClick(action.id)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
```

## Styling

- The standard textarea is unstyled; the preset renders the comment-form looks with `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/textarea/` in the smartsoft001 repository.

- `preset/textarea-preset.tsx`: `SmartTextareaPreset`
- `standard/textarea-standard.tsx`: `SmartTextareaStandard`
- `textarea.tsx`: `SmartTextarea`
- `textarea.types.ts`: `ITextareaActionClick`, `SmartTextareaProps`
- `use-textarea.ts`: `useTextarea`
- `textarea.stories.tsx`: Storybook stories

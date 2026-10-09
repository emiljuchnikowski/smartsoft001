---
name: react-components-searchbar
description: SmartSearchbar React component API (@smartsoft001/react) — debounced search input (text/onTextChange after debounceTime, 1000 ms by default) that hides itself on blur while empty, with an optional toggle button, controlled or uncontrolled show and text, the 'searchbar' registry key and the useSearchbar hook.
user-invocable: false
---

# Searchbar (`SmartSearchbar`)

`SmartSearchbar` is a search input whose text is reported **once the typing settles** (`options.debounceTime`, 1000 ms by default) through `onTextChange`. While empty, it hides itself on blur; with `options.showToggleButton` a magnifying-glass button shows it again. Both `text` and `show` can be controlled (`text` / `onTextChange`, `show` / `onShowChange`) or left to the component (`defaultText`, `defaultShow` = `true`). There is no preset.

## When to Use This Skill

- A search box that filters a list after the user stops typing
- A collapsible search field behind a magnifying-glass button
- Providing the application's own search box (the `searchbar` registry key) on `useSearchbar`

## Exports

All from `@smartsoft001/react`.

| Export                   | Kind      | What it is                                                                                                               |
| ------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `SmartSearchbar`         | component | Renders the implementation registered as `components.searchbar` on `SmartProvider`, `SmartSearchbarStandard` by default. |
| `SmartSearchbarStandard` | component | The default searchbar: a search input bound to the hook's `control`, hidden on blur while empty.                         |
| `useSearchbar`           | hook      | The behaviour every searchbar variant shares.                                                                            |

## Props and Types

### `SmartSearchbarProps`

| Prop            | Type                      | Default | Description                                                                                                                                                                          |
| --------------- | ------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options?`      | `ISearchbarOptions`       | —       | Placeholder, label, debounce and toggle button.                                                                                                                                      |
| `className?`    | `string`                  | —       | Classes on the input.                                                                                                                                                                |
| `show?`         | `boolean`                 | —       | Whether the search field is shown. Leave it `undefined` for an uncontrolled searchbar that starts from `defaultShow`.                                                                |
| `defaultShow?`  | `boolean`                 | `true`  | Initial `show` of an uncontrolled searchbar (default `true`).                                                                                                                        |
| `onShowChange?` | `(show: boolean) => void` | —       | Called when the search field is shown or hidden.                                                                                                                                     |
| `text?`         | `string`                  | —       | The search text, updated once the typing settles for `options.debounceTime` ms (1000 by default). Leave it `undefined` for an uncontrolled searchbar that starts from `defaultText`. |
| `defaultText?`  | `string`                  | `''`    | Initial text of an uncontrolled searchbar.                                                                                                                                           |
| `onTextChange?` | `(text: string) => void`  | —       | Called with the search text once the typing settles.                                                                                                                                 |

### `ISearchbarOptions`

| Field               | Type         | Default    | Description                                                                                                        |
| ------------------- | ------------ | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `placeholder?`      | `string`     | `'search'` | Placeholder of the input, passed through the translations (a key or text).                                         |
| `label?`            | `string`     | —          | Not read by the built-in implementations; available to a custom implementation (e.g. as the input's `aria-label`). |
| `debounceTime?`     | `number`     | `1000`     | Milliseconds the typing has to settle before `onTextChange`.                                                       |
| `showToggleButton?` | `boolean`    | —          | Renders a magnifying-glass button while the field is hidden.                                                       |
| `size?`             | `SmartSize`  | —          | Not read by the built-in implementations; available to a custom implementation.                                    |
| `color?`            | `SmartColor` | —          | Not read by the built-in implementations; available to a custom implementation.                                    |

`SmartColor`, `SmartSize` are described in the `react-provider` skill.

## Usage

```tsx
import { useState } from 'react';

import { SmartSearchbar } from '@smartsoft001/react';

export function NoteSearch({ onSearch }: { onSearch: (text: string) => void }) {
  const [text, setText] = useState('');

  return (
    <SmartSearchbar
      text={text}
      onTextChange={(next) => {
        setText(next);
        onSearch(next);
      }}
      options={{
        placeholder: 'Search notes',
        debounceTime: 300,
        showToggleButton: true,
      }}
    />
  );
}
```

## Replacing the Implementation

`SmartSearchbar` renders the component registered under the `'searchbar'` key of `SmartProvider`'s `components`, and `SmartSearchbarStandard` when nothing is registered there. Every `SmartSearchbar` below the provider then renders the registered component, which receives the same props.

There is no preset for this component: register a component of your own that takes `SmartSearchbarProps`, as shown below, as `components={{ searchbar: MySearchbar }}`. Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useSearchbar` hook

The behaviour every searchbar variant shares. The field is bound to `control`. Its changes reach `text` once they settle for `options.debounceTime` ms (1000 by default); a non-empty `text` coming from outside is copied into the control without being reported back. `tryHide()` (on blur) hides an empty searchbar, `setShow()` shows it again. `show` and `text` are controlled through `show` / `onShowChange` and `text` / `onTextChange`, or kept internally from `defaultShow` / `defaultText`.

```ts
function useSearchbar({
  options,
  show: showProp,
  defaultShow = true,
  onShowChange,
  text: textProp,
  defaultText = '',
  onTextChange,
}: SmartSearchbarProps);
```

| Returns   | Type                               | Description                                                             |
| --------- | ---------------------------------- | ----------------------------------------------------------------------- |
| `show`    | `boolean`                          | Whether the field is shown (controlled or internal).                    |
| `text`    | `string`                           | The settled search text (controlled or internal).                       |
| `control` | `SmartFormControl<string \| null>` | The `SmartFormControl` the input is bound to (see `useControlBinding`). |
| `setShow` | `() => void`                       | Shows the field.                                                        |
| `tryHide` | `() => void`                       | Hides the field when it is empty (call on blur).                        |

```tsx
import {
  SmartSearchbarProps,
  useControlBinding,
  useSearchbar,
} from '@smartsoft001/react';

export function AlwaysOnSearch(props: SmartSearchbarProps) {
  const { control } = useSearchbar(props);
  const binding = useControlBinding(control);

  return (
    <input
      type="search"
      className={props.className}
      aria-label={props.options?.label ?? 'Search'}
      placeholder={props.options?.placeholder}
      value={binding.value ?? ''}
      onChange={(event) => binding.onChange(event.target.value)}
      onBlur={binding.onBlur}
    />
  );
}
```

## Styling

- `className` goes on the input; the standard input carries `smart:dark:` variants.
- A non-empty `text` coming from the parent is copied into the field without being reported back.

## File Locations

Source: `packages/shared/react/src/lib/components/searchbar/` in the smartsoft001 repository.

- `searchbar.tsx`: `SmartSearchbar`
- `searchbar.types.ts`: `SmartSearchbarProps`
- `standard/searchbar-standard.tsx`: `SmartSearchbarStandard`
- `use-searchbar.ts`: `useSearchbar`
- `searchbar.stories.tsx`: Storybook stories

---
name: react-components-import
description: SmartImport React component API (@smartsoft001/react) — upload-icon button that opens a hidden file input (accept, JSON by default) and passes the picked File to onSet, and the useImport hook.
user-invocable: false
---

# Import (`SmartImport`)

`SmartImport` is an upload-icon button that opens a hidden `<input type="file">`; the picked `File` is passed to `onSet`, and the input is cleared so the same file can be picked again. `accept` limits the file types (`application/json` by default). Reading and parsing the file is up to you. It renders through `SmartButton`, so it follows the `button` registry key.

## When to Use This Skill

- Letting the user load a JSON (or other) file the page will parse
- Pairing with `SmartExport` for a download / upload round trip

For file fields of a model-driven form (attachments, images, PDFs), use the input field components (`react-components-input`).

## Exports

All from `@smartsoft001/react`.

| Export        | Kind      | What it is                                                                                                                                                                                                |
| ------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartImport` | component | An upload-icon `SmartButton` that opens a hidden file input and passes the picked file to `onSet`.                                                                                                        |
| `useImport`   | hook      | The import button's logic: `onFileSelected` hands the picked file to `onSet` and clears the input, so picking the same file again fires `change` again; `triggerFileInput` opens the picker of `inputEl`. |

## Props and Types

### `SmartImportProps`

| Prop         | Type                   | Default              | Description                                                       |
| ------------ | ---------------------- | -------------------- | ----------------------------------------------------------------- |
| `accept?`    | `string`               | `'application/json'` | The file types the picker offers (`application/json` by default). |
| `className?` | `string`               | —                    | Extra CSS classes applied to the `<span>` around the button.      |
| `onSet?`     | `(file: File) => void` | —                    | Called with the picked file.                                      |

## Usage

```tsx
import { SmartImport } from '@smartsoft001/react';

export function ImportNotes({
  onNotes,
}: {
  onNotes: (notes: unknown[]) => void;
}) {
  const read = async (file: File) => {
    const parsed: unknown = JSON.parse(await file.text());
    if (Array.isArray(parsed)) onNotes(parsed);
  };

  return (
    <SmartImport accept="application/json" onSet={(file) => void read(file)} />
  );
}
```

## Replacing the Implementation

`SmartImport` has no registry key of its own: it renders a `SmartButton`, so registering a component under the `button` key restyles it too. For a different control, build one on `useImport`.

### The `useImport` hook

The import button's logic: `onFileSelected` hands the picked file to `onSet` and clears the input, so picking the same file again fires `change` again; `triggerFileInput` opens the picker of `inputEl`.

```ts
function useImport({ onSet }: Pick<SmartImportProps, 'onSet'>);
```

| Returns            | Type                                             | Description                                                                          |
| ------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `inputRef`         | `RefObject<HTMLInputElement \| null>`            | Attach to the hidden file input.                                                     |
| `onFileSelected`   | `(event: { target: HTMLInputElement; }) => void` | The input's `change` handler: passes the first file to `onSet` and clears the input. |
| `triggerFileInput` | `(inputEl: HTMLInputElement) => void`            | Opens the file picker of an input element.                                           |

```tsx
import { SmartImportProps, useImport } from '@smartsoft001/react';

export function ImportLink(props: SmartImportProps) {
  const { inputRef, onFileSelected, triggerFileInput } = useImport(props);

  return (
    <span className={props.className}>
      <button
        type="button"
        onClick={() => inputRef.current && triggerFileInput(inputRef.current)}
      >
        Upload a file…
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={props.accept ?? 'application/json'}
        hidden
        onChange={onFileSelected}
      />
    </span>
  );
}
```

## Styling

- `className` goes on the `<span>` around the button and the input.

## File Locations

Source: `packages/shared/react/src/lib/components/import/` in the smartsoft001 repository.

- `import.tsx`: `SmartImport`
- `import.types.ts`: `SmartImportProps`
- `use-import.ts`: `useImport`
- `import.stories.tsx`: Storybook stories

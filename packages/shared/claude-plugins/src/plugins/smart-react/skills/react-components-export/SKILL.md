---
name: react-components-export
description: SmartExport React component API (@smartsoft001/react) — download-icon button that hands value and fileName to a handler you write to serialise and download data, disabled while there is no value, and the useExport hook.
user-invocable: false
---

# Export (`SmartExport`)

`SmartExport` is a download-icon button. On click it calls `handler(value, fileName)`; the handler serialises the data and triggers the download, so the format is yours (JSON, CSV, ...). The button is disabled while `value` is empty. It renders through `SmartButton`, so it follows whatever is registered under the `button` key.

## When to Use This Skill

- An "export / download" button for data the page already holds
- Pairing with `SmartImport` for a JSON round trip

For exporting a CRUD collection from the server (CSV / XLSX of the current filter), use the CRUD export of `@smartsoft001/crud-shell-react` (`smart-crud-react` skill).

## Exports

All from `@smartsoft001/react`.

| Export        | Kind      | What it is                                                                                                                |
| ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------- |
| `SmartExport` | component | A download-icon `SmartButton` that calls `handler(value, fileName)`.                                                      |
| `useExport`   | hook      | The export button's logic: `onClick` hands `value` and `fileName` to `handler`, and does nothing while there is no value. |

## Props and Types

### `SmartExportProps`

| Prop         | Type                                      | Default  | Description                                                                                                                                                         |
| ------------ | ----------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value?`     | `any`                                     | —        | The data to export; the button is disabled while it is empty.                                                                                                       |
| `fileName?`  | `string`                                  | —        | Name for the exported file, passed to `handler` as its second argument.                                                                                             |
| `handler`    | `(value: any, fileName?: string) => void` | required | Called with `value` and `fileName` on click. Serialise and download the data here. The `fileName` argument is optional, so `(value) => void` handlers keep working. |
| `className?` | `string`                                  | —        | Classes on the button and on the `<span>` around it.                                                                                                                |

## Usage

```tsx
import { SmartExport } from '@smartsoft001/react';

function downloadJson(value: unknown, fileName = 'export') {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function ExportNotes({
  notes,
}: {
  notes: Array<{ id: string; title: string }>;
}) {
  return (
    <SmartExport
      value={notes.length ? notes : undefined}
      fileName="notes"
      handler={downloadJson}
    />
  );
}
```

## Replacing the Implementation

`SmartExport` has no registry key of its own: it renders a `SmartButton`, so registering a component under the `button` key (or `SMART_PRESET_COMPONENTS`) restyles it too. For a different control, call `useExport` from a component of your own.

### The `useExport` hook

The export button's logic: `onClick` hands `value` and `fileName` to `handler`, and does nothing while there is no value.

```ts
function useExport({
  value,
  fileName,
  handler,
}: Pick<SmartExportProps, 'value' | 'fileName' | 'handler'>);
```

| Returns   | Type                  | Description                                                             |
| --------- | --------------------- | ----------------------------------------------------------------------- |
| `onClick` | `() => Promise<void>` | Calls `handler(value, fileName)`; does nothing while there is no value. |

```tsx
import { SmartExportProps, useExport } from '@smartsoft001/react';

export function ExportLink(props: SmartExportProps) {
  const { onClick } = useExport(props);

  return (
    <button
      type="button"
      className={props.className}
      disabled={!props.value}
      onClick={() => void onClick()}
    >
      Download
    </button>
  );
}
```

## Styling

- The icon is an inline SVG with an `Export` screen-reader label; the button look comes from the registered button implementation.

## File Locations

Source: `packages/shared/react/src/lib/components/export/` in the smartsoft001 repository.

- `export.tsx`: `SmartExport`
- `export.types.ts`: `SmartExportProps`
- `use-export.ts`: `useExport`
- `export.stories.tsx`: Storybook stories

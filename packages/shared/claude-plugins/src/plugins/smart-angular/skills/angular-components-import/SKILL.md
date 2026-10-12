---
name: angular-components-import
description: Import component API, an upload button that opens the native file dialog (accept filter, JSON by default) and emits the chosen File through its set output, and the base class for custom implementations.
user-invocable: false
---

# Import Component

`<smart-import>` is a button with an upload icon and a hidden file input. Clicking it opens the native file dialog; the chosen file is emitted through the `set` output.

The input is cleared after every pick, so choosing the same file again emits it again. `accept` filters the dialog (`application/json` by default). Reading and parsing the file is up to you. The component renders a `<smart-button>`, so it follows whatever button implementation is registered through `BUTTON_STANDARD_COMPONENT_TOKEN`. It has no injection token of its own: for a different control, extend `ImportBaseComponent`. `<smart-export>` is the matching download button, for a download / upload round trip.

## When to Use This Skill

- Letting the user load a JSON (or other) file the page will parse
- Pairing with `<smart-export>` (`angular-components-export`) for a download / upload round trip
- Developer asks about `<smart-import>`, `ImportComponent` or `ImportBaseComponent`

For file fields of a model-driven form (attachments, images, PDFs), use the input field components (`angular-components-input`).

## Components

### ImportComponent (`<smart-import>`)

Renders a `<smart-button>` with a projected upload icon next to a hidden `<input type="file">`, both inside a `<span>` that takes `class`. The button click forwards to the input through `triggerFileInput`, and the input's change event goes through `ImportBaseComponent.onFileSelected`. As with `<smart-export>`, a button implementation registered through `BUTTON_STANDARD_COMPONENT_TOKEN` receives the projected icon in its default `<ng-content>` slot. Unlike `<smart-export>`, the icon has no text alternative, so the button has no accessible name; for a labelled control, extend `ImportBaseComponent`.

### ImportBaseComponent (abstract)

The base directive. `onFileSelected(event)` reads the first selected file, clears the input so the same file can be chosen again, and emits it through `set`; it throws `ImportBaseComponent: File not found` when the change event carries no file. `triggerFileInput(inputEl)` opens the dialog. Extend it to change the markup while keeping the behaviour. There is no token to register a subclass under, so a custom import control is rendered by its own selector.

| Member                      | Type                                  | Description                                                                               |
| --------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------- |
| `onFileSelected(event)`     | `(event: Event) => void`              | The `change` handler of the file input: emits its first file through `set` and clears it. |
| `triggerFileInput(inputEl)` | `(inputEl: HTMLInputElement) => void` | Opens the native file dialog of `inputEl` (calls its `click()`).                          |
| `cssClass`                  | `InputSignal<string>`                 | The `class` input under its property name; bind it on the element your template renders.  |

## API

### Inputs

| Input    | Type                               | Default              | Description                                                                                                                        |
| -------- | ---------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `accept` | `InputSignal<string \| undefined>` | `'application/json'` | Value of the `accept` attribute on the hidden file input; filters the native dialog. Binding `undefined` keeps `application/json`. |
| `class`  | `InputSignal<string>`              | `''`                 | Classes on a `<span>` around the button and the hidden file input (`cssClass` input, alias `class`).                               |

### Outputs

| Output | Type                     | Description                                            |
| ------ | ------------------------ | ------------------------------------------------------ |
| `set`  | `OutputEmitterRef<File>` | Emits the selected `File` once per dialog confirmation |

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ImportBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-import-link',
  template: `
    <span [class]="cssClass()">
      <button type="button" (click)="triggerFileInput(fileInput)">
        Upload a file
      </button>
      <input
        #fileInput
        type="file"
        hidden
        [accept]="accept() ?? 'application/json'"
        (change)="onFileSelected($event)"
      />
    </span>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyImportLinkComponent extends ImportBaseComponent {}
```

Render it by its own selector with the same input and output (`<my-import-link (set)="onImport($event)" />`); there is no token that swaps `<smart-import>` for it.

## Usage Examples

```html
<smart-import accept="application/json" (set)="onImport($event)" />
```

```typescript
import { Component, signal } from '@angular/core';
import { ImportComponent } from '@smartsoft001/angular';

@Component({
  selector: 'app-notes-import',
  imports: [ImportComponent],
  templateUrl: './notes-import.component.html',
})
export class NotesImportComponent {
  readonly notes = signal<unknown[]>([]);

  async onImport(file: File): Promise<void> {
    const parsed: unknown = JSON.parse(await file.text());
    if (Array.isArray(parsed)) this.notes.set(parsed);
  }
}
```

## File Locations

- Component: `packages/shared/angular/src/lib/components/import/import.component.ts`
- Base class: `packages/shared/angular/src/lib/components/import/base/base.component.ts`
- Stories: `packages/shared/angular/src/lib/components/import/import.component.stories.ts`
- Usage example: `docs/examples/angular/src/components/import/usage.example.ts` and `usage.example.html`

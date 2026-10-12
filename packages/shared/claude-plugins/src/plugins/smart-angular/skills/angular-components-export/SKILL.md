---
name: angular-components-export
description: Export component API, a download button that hands the bound value and file name to a handler you write, disabled while there is nothing to export, and the base class for custom implementations.
user-invocable: false
---

# Export Component

`<smart-export>` is a button with a download icon. Bind the data to export and a handler; the button stays disabled until there is a value and calls the handler with it, and the file name, on click.

The handler serialises the data and starts the download, so the format is yours (JSON, CSV, ...). The component renders a `<smart-button>`, so it follows whatever button implementation is registered through `BUTTON_STANDARD_COMPONENT_TOKEN`. It has no injection token of its own: for a different control, extend `ExportBaseComponent`. `<smart-import>` is the matching upload button, for a download / upload round trip.

## When to Use This Skill

- An "export / download" button for data the page already holds
- Pairing with `<smart-import>` (`angular-components-import`) for a download / upload round trip
- Developer asks about `<smart-export>`, `ExportComponent` or `ExportBaseComponent`

For exporting a CRUD collection from the server (CSV / XLSX of the current filter), use the `export` option of the CRUD list page (`smart-crud` skill), which renders its own `smart-crud-export`, not `<smart-export>`.

## Components

### ExportComponent (`<smart-export>`)

Renders a `<smart-button>` with a projected download icon, disabled while `value` is falsy, and passes `class` to it. The icon is hidden from assistive technology and a visually hidden "Export" label gives the button its accessible name. It extends `ExportBaseComponent`, which owns the inputs and the click logic. The icon is projected content, so a button implementation registered through `BUTTON_STANDARD_COMPONENT_TOKEN` in the same injector (the button preset that `provideSmartPresets()` registers, or your own) renders it too, in its default `<ng-content>` slot.

### ExportBaseComponent (abstract)

The base directive. `onClick()` reads `value` and, when it is set, calls `handler(value, fileName)`; it does nothing while `value` is falsy. Extend it to change the markup while keeping the behaviour. There is no token to register a subclass under, so a custom export control is rendered by its own selector.

| Member      | Type                  | Description                                                                              |
| ----------- | --------------------- | ---------------------------------------------------------------------------------------- |
| `onClick()` | `() => Promise<void>` | Calls `handler(value, fileName)` when `value` is truthy; does nothing otherwise.         |
| `cssClass`  | `InputSignal<string>` | The `class` input under its property name; bind it on the element your template renders. |

## API

### Inputs

| Input      | Type                                                   | Default     | Description                                                                                                                                                                         |
| ---------- | ------------------------------------------------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`    | `InputSignal<any \| undefined>`                        | `undefined` | The data to export. The button is disabled while it is falsy; an empty array is truthy and enables it, so bind `undefined` while there is nothing to export.                        |
| `handler`  | `InputSignal<(value: any, fileName?: string) => void>` | required    | Called with `value` and `fileName` on click; serialise and download the data here. It is called as a plain function, so pass an arrow function (a class field) when it uses `this`. |
| `fileName` | `InputSignal<string \| undefined>`                     | `undefined` | Name for the downloaded file, passed to `handler` as its second argument. The `fileName` argument is optional, so `(value) => void` handlers keep working.                          |
| `class`    | `InputSignal<string>`                                  | `''`        | Extra CSS classes applied to the rendered button (`cssClass` input, alias `class`).                                                                                                 |

The component emits no outputs: the `handler` input is where the data leaves it. The CRUD list page does not use it; its `export` option renders the CSV / XLSX export of `@smartsoft001/crud-shell-angular` (see the `smart-crud` skill).

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ExportBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-export-link',
  template: `
    <button
      type="button"
      [class]="cssClass()"
      [disabled]="!value()"
      (click)="onClick()"
    >
      Download
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyExportLinkComponent extends ExportBaseComponent {}
```

Render it by its own selector with the same inputs (`<my-export-link [value]="orders" [handler]="exportOrders" />`); there is no token that swaps `<smart-export>` for it.

## Usage Examples

```html
<smart-export [value]="orders" fileName="orders" [handler]="downloadJson" />
```

```typescript
import { Component } from '@angular/core';
import { ExportComponent } from '@smartsoft001/angular';

@Component({
  selector: 'app-orders-export',
  imports: [ExportComponent],
  templateUrl: './orders-export.component.html',
})
export class OrdersExportComponent {
  orders = [{ id: 'ORD-1001', total: 120 }];

  // An arrow function: <smart-export> calls the handler without `this`.
  readonly downloadJson = (value: unknown, fileName = 'export'): void => {
    const blob = new Blob([JSON.stringify(value, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
}
```

## File Locations

- Component: `packages/shared/angular/src/lib/components/export/export.component.ts`
- Base class: `packages/shared/angular/src/lib/components/export/base/base.component.ts`
- Stories: `packages/shared/angular/src/lib/components/export/export.component.stories.ts`
- Usage example: `docs/examples/angular/src/components/export/usage.example.ts` and `usage.example.html`

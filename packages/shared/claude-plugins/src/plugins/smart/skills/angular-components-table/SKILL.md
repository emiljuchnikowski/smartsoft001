---
name: angular-components-table
description: Table component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Table Component

The `<smart-table>` component renders a tabular data view with optional title, description, toolbar slot, columns + rows, optional checkbox column, custom per-cell/per-header templates, an empty state slot, and a bottom footer slot. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `TableBaseComponent` defines the shared API — optional `ITableOptions` and `cssClass` (alias `class`). `TableStandardComponent` is a barebones placeholder concrete implementation. `TableComponent` is the public wrapper that renders `TableStandardComponent` by default and accepts a custom replacement via `TABLE_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the table component
- Developer asks about `<smart-table>`, `TableComponent`, `TableStandardComponent`, or `TableBaseComponent`

## Components

### TableComponent (`<smart-table>`)

Main wrapper component. Renders `TableStandardComponent` by default. When `TABLE_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### TableStandardComponent (`<smart-table-standard>`)

Barebones placeholder concrete implementation. Renders a wrapper `<div>` containing an optional `<h3 class="title">`, optional `<p class="description">`, optional toolbar slot, and a `<table>` with `<thead>` (one `<th>` per column) and `<tbody>` (one `<tr>` per row, one `<td>` per column reading the value via `row[col.key]`). When `withCheckboxes` is set, an extra checkbox column is rendered before all data columns. Per-column `cellTpl` and `headerTpl` templates override the default text rendering. When `rows` is empty and `emptyTpl` is provided, the empty template is rendered as a single full-width row. A bottom `footerTpl` renders inside `<div class="footer">`. The external `cssClass` is applied to the root wrapper. It does not include any visual styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### TableBaseComponent (abstract)

Abstract base directive for extending custom table implementations. Exposes `options` as an `InputSignal<ITableOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`).

## API

### Inputs

| Input     | Type                                      | Default | Description                                                                                  |
| --------- | ----------------------------------------- | ------- | -------------------------------------------------------------------------------------------- |
| `options` | `InputSignal<ITableOptions \| undefined>` | -       | Optional configuration (title, description, columns, rows, layout flags, empty/footer slots) |
| `class`   | `InputSignal<string>`                     | `''`    | External CSS classes (alias for `cssClass`)                                                  |

### ITableOptions

```typescript
interface ITableOptions {
  title?: string;
  description?: string;
  columns?: ITableColumn[];
  rows?: TableRow[];
  striped?: boolean;
  stickyHeader?: boolean;
  withCheckboxes?: boolean;
  withBorder?: boolean;
  emptyTpl?: TemplateRef<unknown>;
  footerTpl?: TemplateRef<unknown>;
  toolbarTpl?: TemplateRef<unknown>;
}

interface ITableColumn {
  key: string;
  label?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  cellTpl?: TemplateRef<unknown>;
  headerTpl?: TemplateRef<unknown>;
  ariaLabel?: string;
}

type TableRow = Record<string, unknown>;
```

All properties are optional except `ITableColumn.key`. The default `TableStandardComponent` consumes every property; a section is rendered only when its template/string is provided. `striped`, `stickyHeader`, `withBorder` and `sortable` are hints for custom implementations — the standard placeholder ignores them visually but they remain part of the shared contract.

## TABLE_STANDARD_COMPONENT_TOKEN

```typescript
import { TABLE_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `TableStandardComponent` with a custom implementation. Provide a `Type<TableBaseComponent>` to override.

```typescript
providers: [
  {
    provide: TABLE_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomTableComponent,
  },
];
```

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { TableBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-table',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.title) {
        <h3>{{ options()!.title }}</h3>
      }
      <table>
        <thead>
          <tr>
            @for (col of options()?.columns ?? []; track col.key) {
              <th>{{ col.label ?? col.key }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of options()?.rows ?? []; track $index) {
            <tr>
              @for (col of options()?.columns ?? []; track col.key) {
                <td>{{ row[col.key] }}</td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomTableComponent extends TableBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['my-table'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

## Usage Examples

```html
<!-- Simple columns + rows -->
<smart-table
  [options]="{
    title: 'Users',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'email', label: 'Email' },
    ],
    rows: [
      { name: 'Lindsay Walton', role: 'Front-end', email: 'lindsay@x.com' },
      { name: 'Courtney Henry', role: 'Designer', email: 'courtney@x.com' },
    ],
  }"
/>

<!-- With checkbox column -->
<smart-table
  [options]="{
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
    ],
    rows: [{ name: 'Lindsay Walton', role: 'Front-end' }],
    withCheckboxes: true,
  }"
/>

<!-- With per-cell template -->
<ng-template #emailCell let-row>
  <a [attr.href]="'mailto:' + row.email">{{ row.email }}</a>
</ng-template>

<smart-table
  [options]="{
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email', cellTpl: emailCell },
    ],
    rows: [{ name: 'Lindsay Walton', email: 'lindsay@x.com' }],
  }"
/>

<!-- With empty state and footer -->
<ng-template #emptyMsg>
  <span>Brak wyników</span>
</ng-template>
<ng-template #footer>
  <a href="#">Load more &rarr;</a>
</ng-template>

<smart-table
  [options]="{
    columns: [{ key: 'name', label: 'Name' }],
    rows: [],
    emptyTpl: emptyMsg,
    footerTpl: footer,
  }"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/table/table.component.ts`
- Standard: `packages/shared/angular/src/lib/components/table/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/table/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`TABLE_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`ITableOptions`, `ITableColumn`, `TableRow`)

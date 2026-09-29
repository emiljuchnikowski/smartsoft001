---
name: angular-components-table
description: Table component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Table Component

The `<smart-table>` component renders a tabular data view with optional title, description, toolbar slot, columns + rows, optional checkbox column, custom per-cell/per-header templates, an empty state slot, and a bottom footer slot. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `TableBaseComponent` defines the shared API — optional `ITableOptions` and `cssClass` (alias `class`). `TableStandardComponent` is a barebones placeholder concrete implementation. `TableComponent` is the public wrapper that renders `TableStandardComponent` by default and accepts a custom replacement via `TABLE_STANDARD_COMPONENT_TOKEN`. `TablePresetComponent` is the styled Tailwind variation you register on that token (see [Preset](#preset)).

## When to Use This Skill

- Developer wants to use or customize the table component
- Developer asks about `<smart-table>`, `TableComponent`, `TableStandardComponent`, `TablePresetComponent`, or `TableBaseComponent`

## Components

### TableComponent (`<smart-table>`)

Main wrapper component. Renders `TableStandardComponent` by default. When `TABLE_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### TableStandardComponent (`<smart-table-standard>`)

Barebones placeholder concrete implementation. Renders a wrapper `<div>` containing an optional `<h3 class="title">`, optional `<p class="description">`, optional toolbar slot, and a `<table>` with `<thead>` (one `<th>` per column) and `<tbody>` (one `<tr>` per row, one `<td>` per column reading the value via `row[col.key]`). When `withCheckboxes` is set, an extra checkbox column is rendered before all data columns. Per-column `cellTpl` and `headerTpl` templates override the default text rendering. When `rows` is empty and `emptyTpl` is provided, the empty template is rendered as a single full-width row. A bottom `footerTpl` renders inside `<div class="footer">`. The external `cssClass` is applied to the root wrapper. It does not include any visual styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### TablePresetComponent (`<smart-table-preset>`)

Styled drop-in replacement for `TableStandardComponent`. See [Preset](#preset).

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

All properties are optional except `ITableColumn.key`. The default `TableStandardComponent` consumes every property; a section is rendered only when its template/string is provided. `striped`, `stickyHeader`, `withBorder`, `align` and `sortable` are layout hints: the standard placeholder ignores them visually (it only sets `data-align`), while `TablePresetComponent` honours every one of them (see [Preset](#preset)).

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

## Preset

`TablePresetComponent` (`<smart-table-preset>`) extends `TableBaseComponent`, so it takes the same `options` input, and it renders everything the standard component renders in the Tailwind UI table look. Every class carries the `smart:` prefix and has an explicit `smart:dark:*` twin. The class recipes live in `preset/preset-classes.util.ts`, which is not exported from the barrel.

What it styles:

- **Header** (`data-role="header"`, only rendered when there is a title, description or toolbar). The title is an `<h3>` with `text-base font-semibold text-gray-900 dark:text-white`. The description uses `text-sm text-gray-500 dark:text-gray-400`. `toolbarTpl` sits on the right of the header on `sm+` screens.
- **Table.** `min-w-full divide-y divide-gray-300 dark:divide-white/15`. Header cells use `text-sm font-semibold text-gray-900 dark:text-white`. Body cells use `whitespace-nowrap text-sm`: the first data column is emphasised (`font-medium text-gray-900 dark:text-white`) and the rest are muted (`text-gray-500 dark:text-gray-400`).
- **Checkbox column** (`withCheckboxes`). Styled checkboxes, with select-all and an indeterminate state in the header. Selected rows are highlighted with `bg-gray-50 dark:bg-gray-800/50`. Selection is internal visual state; the table has no outputs.
- **Slots.** `cellTpl` gets `{ $implicit: row, column }`. `headerTpl` replaces the label. `emptyTpl` renders in a centred row that spans every column (checkbox column included). `footerTpl` renders under the table.
- **External class.** Merged onto the root `<div>` next to `w-full`.

The options the standard component ignores, which the preset honours:

| Option            | Preset rendering                                                                                                                                                                                                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default           | Rows separated by `divide-y divide-gray-200 dark:divide-white/10`, no frame, outer columns flush with the edges                                                                                                                                                                               |
| `striped`         | Row dividers replaced by zebra stripes, `even:bg-gray-50 dark:even:bg-gray-800/50`                                                                                                                                                                                                            |
| `withBorder`      | Rounded card (`rounded-lg bg-white shadow-sm outline-1 outline-black/5`, `dark:bg-gray-900 dark:outline-white/10`) with a `bg-gray-50 dark:bg-gray-800/75` header, outer cells padded                                                                                                         |
| `stickyHeader`    | Body scrolls inside `max-h-96 overflow-y-auto`; header cells are `sticky top-0 z-10 bg-white/75 backdrop-blur-sm dark:bg-gray-900/75`                                                                                                                                                         |
| `column.align`    | `text-left` / `text-center` / `text-right` on both the header and the body cells                                                                                                                                                                                                              |
| `column.sortable` | Heading becomes a button with a chevron. Click sorts the rows client-side ascending, click again for descending; `aria-sort` is set on the `<th>`. Numbers sort numerically, text in natural order, empty values last. The active column's chevron gets a `bg-gray-100 dark:bg-gray-800` chip |

The flags combine freely (for example striped + bordered + sortable + checkboxes).

Because `TableComponent` forwards inputs by canonical name through `NgComponentOutlet`, the preset declares `override cssClass = input<string>('')` (dropping the inherited `class` alias). Pass `class` on `<smart-table>` as usual, or bind `[cssClass]` when you use `<smart-table-preset>` directly.

Register it on the token to restyle every `<smart-table>`:

```typescript
import {
  TABLE_STANDARD_COMPONENT_TOKEN,
  TablePresetComponent,
} from '@smartsoft001/angular';

providers: [
  {
    provide: TABLE_STANDARD_COMPONENT_TOKEN,
    useValue: TablePresetComponent,
  },
];
```

The preset adds no new `ITableOptions` fields; it only consumes the existing API.

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
- Preset variation: `packages/shared/angular/src/lib/components/table/preset/preset.component.ts`
- Preset class recipes: `packages/shared/angular/src/lib/components/table/preset/preset-classes.util.ts`
- Base class: `packages/shared/angular/src/lib/components/table/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`TABLE_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`ITableOptions`, `ITableColumn`, `TableRow`)

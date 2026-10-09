---
name: angular-components-description-list
description: Description list component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Description List Component

The `<smart-description-list>` component renders a list of label/value pairs (a `<dl>` with `<dt>`/`<dd>` rows) with optional title, description, per-item value/action template slots, and bottom attachments/footer slots. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `DescriptionListBaseComponent` defines the shared API — optional `IDescriptionListOptions` and `cssClass` (alias `class`). `DescriptionListStandardComponent` is a barebones placeholder concrete implementation. `DescriptionListComponent` is the public wrapper that renders `DescriptionListStandardComponent` by default and accepts a custom replacement via `DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the description list component
- Developer asks about `<smart-description-list>`, `DescriptionListComponent`, `DescriptionListStandardComponent`, or `DescriptionListBaseComponent`

## Components

### DescriptionListComponent (`<smart-description-list>`)

Main wrapper component. Renders `DescriptionListStandardComponent` by default. When `DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### DescriptionListStandardComponent (`<smart-description-list-standard>`)

Barebones placeholder concrete implementation. Renders a wrapper `<div>` containing an optional `<h3 class="title">`, optional `<p class="description">`, and a `<dl>` with one `<div class="item">` per item. Each item renders a `<dt>` (label) and a `<dd>` whose content is either the static `value` string or the `valueTpl` template, optionally followed by `actionTpl` inside `<span class="action">`. Bottom slots `attachmentsTpl` and `footerTpl` render in `<div class="attachments">` and `<div class="footer">` respectively. The external `cssClass` is applied to the root wrapper. It does not include any visual styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### DescriptionListBaseComponent (abstract)

Abstract base directive for extending custom description-list implementations. Exposes `options` as an `InputSignal<IDescriptionListOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`).

## API

### Inputs

| Input     | Type                                                | Default | Description                                                                           |
| --------- | --------------------------------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `options` | `InputSignal<IDescriptionListOptions \| undefined>` | -       | Optional configuration (title, description, items, attachments/footer slot templates) |
| `class`   | `InputSignal<string>`                               | `''`    | External CSS classes (alias for `cssClass`)                                           |

### IDescriptionListOptions

All fields are optional. Both the standard and the preset read every field; a section renders only when its string or template is set.

| Field            | Type                     | Default | Description                                  |
| ---------------- | ------------------------ | ------- | -------------------------------------------- |
| `title`          | `string`                 | -       | Heading above the list.                      |
| `description`    | `string`                 | -       | Text under the heading.                      |
| `items`          | `IDescriptionListItem[]` | `[]`    | The rows.                                    |
| `attachmentsTpl` | `TemplateRef<unknown>`   | -       | A section after the rows (e.g. a file list). |
| `footerTpl`      | `TemplateRef<unknown>`   | -       | A section at the end.                        |

### IDescriptionListItem

| Field       | Type                   | Default  | Description                                 |
| ----------- | ---------------------- | -------- | ------------------------------------------- |
| `label`     | `string`               | required | The term (`<dt>`).                          |
| `value`     | `string`               | -        | The value as text.                          |
| `valueTpl`  | `TemplateRef<unknown>` | -        | The value as a template; wins over `value`. |
| `actionTpl` | `TemplateRef<unknown>` | -        | An action next to the value.                |

```typescript
interface IDescriptionListOptions {
  title?: string;
  description?: string;
  items?: IDescriptionListItem[];
  attachmentsTpl?: TemplateRef<unknown>;
  footerTpl?: TemplateRef<unknown>;
}

interface IDescriptionListItem {
  label: string;
  value?: string;
  valueTpl?: TemplateRef<unknown>;
  actionTpl?: TemplateRef<unknown>;
}
```

## DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN

```typescript
import { DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `DescriptionListStandardComponent` with a custom implementation. Provide a `Type<DescriptionListBaseComponent>` to override. The wrapper passes `options` and the `class` value to the registered component (under `class` when it keeps the base's alias, under `cssClass` when it redeclares the input without it).

```typescript
providers: [
  {
    provide: DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomDescriptionListComponent,
  },
];
```

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { DescriptionListBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-description-list',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.title) {
        <h3>{{ options()!.title }}</h3>
      }
      <dl>
        @for (item of options()?.items ?? []; track $index) {
          <div>
            <dt>{{ item.label }}</dt>
            <dd>
              @if (item.valueTpl) {
                <ng-container [ngTemplateOutlet]="item.valueTpl" />
              } @else {
                {{ item.value }}
              }
            </dd>
          </div>
        }
      </dl>
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomDescriptionListComponent extends DescriptionListBaseComponent {
  containerClasses = computed(() => {
    const classes = ['my-description-list'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

## Usage Examples

```html
<!-- Title and items only -->
<smart-description-list
  [options]="{
    title: 'Applicant Information',
    items: [
      { label: 'Full name', value: 'Margot Foster' },
      { label: 'Application for', value: 'Backend Developer' },
      { label: 'Email address', value: 'margotfoster@example.com' },
    ],
  }"
/>

<!-- With description and templated value -->
<ng-template #salaryValue>
  <strong>$120,000</strong>
</ng-template>

<smart-description-list
  [options]="{
    title: 'Applicant Information',
    description: 'Personal details and application.',
    items: [
      { label: 'Full name', value: 'Margot Foster' },
      { label: 'Salary expectation', valueTpl: salaryValue },
    ],
  }"
/>

<!-- With per-item actions -->
<ng-template #updateAction>
  <smart-button [options]="{ click: onUpdate }">Update</smart-button>
</ng-template>

<smart-description-list
  [options]="{
    title: 'Applicant Information',
    items: [
      { label: 'Full name', value: 'Margot Foster', actionTpl: updateAction },
      { label: 'Email address', value: 'margotfoster@example.com', actionTpl: updateAction },
    ],
  }"
/>

<!-- With attachments and footer slots -->
<ng-template #attachments>
  <ul>
    <li>resume.pdf</li>
    <li>coverletter.pdf</li>
  </ul>
</ng-template>

<ng-template #footer>
  <a href="#">Download all &rarr;</a>
</ng-template>

<smart-description-list
  [options]="{
    title: 'Applicant Information',
    items: [{ label: 'Full name', value: 'Margot Foster' }],
    attachmentsTpl: attachments,
    footerTpl: footer,
  }"
/>
```

## Preset

`DescriptionListPresetComponent` (`<smart-description-list-preset>`) is a styled drop-in replacement for the barebones standard component. It renders the same structure with Tailwind utility classes (every class carries the `smart:` prefix, with explicit `smart:dark:*` twins):

- Optional header (`data-role="header"`): title as `<h3>` (`text-base font-semibold text-gray-900 dark:text-white`) and description as `<p>` (`text-sm text-gray-500 dark:text-gray-400`). Rendered only when title or description is set.
- List (`data-role="list"`): the `<dl>` carries `divide-y divide-gray-200 dark:divide-gray-700`; the external `cssClass` is merged onto it.
- Rows (`data-role="row"`): `grid py-3 sm:grid-cols-3 sm:gap-4` with `<dt>` (`data-role="term"`, `text-sm font-medium text-gray-500 dark:text-gray-400`) and `<dd>` (`data-role="value"`, `text-sm text-gray-900 dark:text-white sm:col-span-2`). `valueTpl` wins over `value`; `actionTpl` renders right-aligned inside `data-role="action"`.
- Optional `attachmentsTpl` (`data-role="attachments"`) and `footerTpl` (`data-role="footer"`) render as separate sections below the list.

The preset declares `cssClass` without the `class` alias, so bind `[cssClass]` when you use the `<smart-description-list-preset>` selector directly; `class` on `<smart-description-list>` reaches it through the wrapper. Register it for `DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-description-list>`, or register every preset at once with `provideSmartPresets()`.

```typescript
providers: [
  {
    provide: DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN,
    useValue: DescriptionListPresetComponent,
  },
];
```

No new `IDescriptionListOptions` fields are introduced; the preset consumes the existing API. Its class recipes are internal (not exported from `@smartsoft001/angular`).

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/description-list/description-list.component.ts`
- Standard: `packages/shared/angular/src/lib/components/description-list/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/description-list/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IDescriptionListOptions`, `IDescriptionListItem`)

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

All properties are optional. The default `DescriptionListStandardComponent` consumes every property; a section is rendered only when its template/string is provided. Within an item, `valueTpl` takes precedence over `value` when both are set.

## DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN

```typescript
import { DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `DescriptionListStandardComponent` with a custom implementation. Provide a `Type<DescriptionListBaseComponent>` to override.

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
  input,
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
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

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
  <button>Update</button>
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

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/description-list/description-list.component.ts`
- Standard: `packages/shared/angular/src/lib/components/description-list/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/description-list/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IDescriptionListOptions`, `IDescriptionListItem`)

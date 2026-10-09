---
name: angular-components-detail
description: Detail field component with InjectionToken pattern for per-field substitution.
user-invocable: false
---

# Detail Component

The `<smart-detail>` component renders a single model field value by delegating to a sub-component chosen by `FieldType`. It selects a sub-component based on the `FieldType` from an internal `baseMap` and an optional `extendMap` injected via `DETAIL_FIELD_COMPONENTS_TOKEN`. It renders the label (via `ModelLabelPipe`), the value (`NgComponentOutlet` on the selected sub-component), or a skeleton when `item()` returns undefined.

## When to Use This Skill

- Developer wants to use or customize the detail field component
- Developer asks about `<smart-detail>` or `DetailComponent`
- Developer wants to extend `DetailBaseComponent` for a custom sub-component

## Components

### DetailComponent (`<smart-detail>`)

Main wrapper component. Selects a sub-component from `baseMap` (or `extendMap` override) based on `options().options.type` and renders it via `NgComponentOutlet`. Shows a skeleton placeholder while `item()` is undefined.

### DetailBaseComponent (abstract)

Abstract base directive for all detail sub-components. Provides:

- `options: InputSignal<IDetailOptions<T>>` — field configuration
- `cssClass: InputSignal<string>` (alias `class`) — external CSS classes
- `afterSetOptionsHandler()` — hook invoked via effect on options change
- Effect that calls `ChangeDetectorRef.detectChanges()` when options change

### Default Sub-Components

| FieldType       | Sub-component                  | Selector                       | Description                                                   |
| --------------- | ------------------------------ | ------------------------------ | ------------------------------------------------------------- |
| `text`          | `DetailTextComponent`          | `smart-detail-text`            | Sanitized HTML via `ListCellPipe`, fallback for unknown types |
| `email`         | `DetailEmailComponent`         | `smart-detail-email`           | Link `mailto:`                                                |
| `enum`          | `DetailEnumComponent`          | `smart-detail-enum`            | Single value or array with `translate`                        |
| `flag`          | `DetailFlagComponent`          | `smart-detail-flag`            | Inline SVG ✓ / ✗                                              |
| `color`         | `DetailColorComponent`         | `smart-detail-color`           | Rectangle with `background-color`                             |
| `address`       | `DetailAddressComponent`       | `smart-detail-address`         | `IAddress` (street, number, zip, city)                        |
| `object`        | `DetailObjectComponent`        | `smart-detail-object`          | Nested model via `DETAILS_COMPONENT_TOKEN`                    |
| `array`         | `DetailArrayComponent`         | `smart-detail-array`           | Array of nested models                                        |
| `dateRange`     | `DetailDateRangeComponent`     | `smart-detail-date-range`      | `start – end`                                                 |
| `phoneNumberPl` | `DetailPhoneNumberPlComponent` | `smart-detail-phone-number-pl` | Link `tel:48...` as badge                                     |
| `image`         | `DetailImageComponent`         | `smart-detail-image`           | `<img>` via `FileService.getUrl(item[key].id)`                |
| `logo`          | `DetailLogoComponent`          | `smart-detail-logo`            | `<img>` with `item[key]` as URL                               |
| `video`         | `DetailVideoComponent`         | `smart-detail-video`           | `<video controls>` via `FileService`                          |
| `attachment`    | `DetailAttachmentComponent`    | `smart-detail-attachment`      | Native `<button>` Tailwind — download via `FileService`       |
| `pdf`           | `DetailPdfComponent`           | `smart-detail-pdf`             | Native `<button>` Tailwind — show via `FileService`           |

## API

### DetailComponent Inputs

| Input     | Type                                          | Default  | Description                                                                                                     |
| --------- | --------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `options` | `InputSignal<IDetailOptions<T> \| undefined>` | required | Field configuration                                                                                             |
| `type`    | `InputSignal<any>`                            | required | Model class (used by `ModelLabelPipe`)                                                                          |
| `class`   | `InputSignal<string>`                         | `''`     | Classes forwarded to the field sub-component (`cssClass` input, alias `class`); the host is `display: contents` |

### IDetailOptions

| Field      | Type              | Default  | Description                                                                                                                |
| ---------- | ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `key`      | `string`          | required | The field key.                                                                                                             |
| `item`     | `Signal<T>`       | -        | The record. While it is missing or returns nothing, the wrapper shows a skeleton instead of the value.                     |
| `options`  | `IFieldOptions`   | required | The field's `@Field` options: `type` picks the sub-component (`text` when unset or unmapped), `info` adds an info tooltip. |
| `cellPipe` | `ICellPipe<T>`    | -        | Formats the value. Read by the `text` and `phoneNumberPl` sub-components (standard and preset).                            |
| `loading`  | `Signal<boolean>` | -        | Not read by the built-in implementations; available to a custom implementation.                                            |

```typescript
interface IDetailOptions<T> {
  key: string;
  item?: Signal<T>;
  options: IFieldOptions;
  cellPipe?: ICellPipe<T>;
  loading?: Signal<boolean>;
}
```

`IFieldOptions` comes from `@smartsoft001/models` (the `@Field` decorator options); the wrapper reads its `type` and `info`.

### DETAIL_FIELD_COMPONENTS_TOKEN

```typescript
import { DETAIL_FIELD_COMPONENTS_TOKEN } from '@smartsoft001/angular';
import { FieldType } from '@smartsoft001/models';
```

`InjectionToken<Partial<Record<FieldTypeDef, Type<DetailBaseComponent<any>>>>>` — allows substituting a sub-component for any field type.

```typescript
providers: [
  {
    provide: DETAIL_FIELD_COMPONENTS_TOKEN,
    useValue: {
      [FieldType.text]: MyCustomTextComponent,
      [FieldType.image]: MyCustomImageComponent,
    },
  },
];
```

Maps are merged (`{ ...baseMap, ...extendMap }`), so only selected types need to be overridden.

### HTML in text fields

The `text` sub-component and its preset bind the value through `[innerHTML]` WITHOUT
`TrustHtmlPipe`, so Angular's sanitizer runs on every value, including one returned by a
`cellPipe`. Scripts, event handlers (`onerror`, `onload`), `<iframe>`, `<svg>` and `javascript:`
URLs are removed, while basic formatting (`<b>`, `<em>`, `<a href="https://...">`) survives.

The sanitizer also strips inline `style` attributes, for example the colours and alignment the
rich-text editor writes. A consumer who needs raw HTML for a field it trusts can return `SafeHtml`
from its own `cellPipe` (`ICellPipe.transform` is typed as `string`, so cast the result). A
tested version, `TrustedDescriptionCellPipe`, lives in
`docs/examples/angular/src/components/detail/trusted-html.example.ts`.

```typescript
@Injectable()
export class TrustedDescriptionCellPipe implements ICellPipe<Product> {
  private readonly sanitizer = inject(DomSanitizer);

  transform(item: Product, key: string): string {
    if (key !== 'description') return item[key];
    // Only for HTML you produce or have sanitized yourself.
    return this.sanitizer.bypassSecurityTrustHtml(
      item.description,
    ) as unknown as string;
  }
}
```

## Preline field presets

Fifteen field types ship a Preline-styled **preset** (`Detail<Field>PresetComponent`, selector
`smart-detail-<field>-preset`) alongside the default sub-component, living in `<field>/preset/`:

| FieldType       | Preset                               | Look                                                         |
| --------------- | ------------------------------------ | ------------------------------------------------------------ |
| `email`         | `DetailEmailPresetComponent`         | `mailto:` link, blue + `hover:underline`, envelope icon      |
| `enum`          | `DetailEnumPresetComponent`          | Values as soft blue badges (reuses badge preset recipes)     |
| `flag`          | `DetailFlagPresetComponent`          | Soft badge — green ✓ / red ✗ (reuses badge preset recipes)   |
| `color`         | `DetailColorPresetComponent`         | `size-6` rounded swatch + monospace hex code                 |
| `address`       | `DetailAddressPresetComponent`       | Multi-line `text-sm` block with pin icon                     |
| `dateRange`     | `DetailDateRangePresetComponent`     | `start – end` as two soft gray chips                         |
| `phoneNumberPl` | `DetailPhoneNumberPlPresetComponent` | `tel:` link styled as a soft blue badge                      |
| `logo`          | `DetailLogoPresetComponent`          | `<img>` `max-h-10 object-contain`                            |
| `image`         | `DetailImagePresetComponent`         | 150×150 preview, `rounded-xl`, border + `shadow-2xs`         |
| `video`         | `DetailVideoPresetComponent`         | `<video controls>` framed `rounded-xl` border + `shadow-2xs` |
| `attachment`    | `DetailAttachmentPresetComponent`    | File chip: icon, file name (`fileName`/`name`), download     |
| `pdf`           | `DetailPdfPresetComponent`           | File chip: red PDF icon, file name, show button              |
| `text`          | `DetailTextPresetComponent`          | `text-sm` typography, `text-pretty`; em-dash when empty      |
| `object`        | `DetailObjectPresetComponent`        | Card envelope around the untouched nested details            |
| `array`         | `DetailArrayPresetComponent`         | `space-y-2` stack of item cards; em-dash when empty          |

Apply them all by providing the ready-made partial map `DETAIL_PRESET_FIELD_COMPONENTS` for
`DETAIL_FIELD_COMPONENTS_TOKEN`, or register every preset of the library at once with
`provideSmartPresets()`.

```typescript
import {
  DETAIL_FIELD_COMPONENTS_TOKEN,
  DETAIL_PRESET_FIELD_COMPONENTS,
} from '@smartsoft001/angular';

providers: [
  {
    provide: DETAIL_FIELD_COMPONENTS_TOKEN,
    useValue: DETAIL_PRESET_FIELD_COMPONENTS,
  },
];
```

Notes on the preset map:

- The map is partial — all other field types keep their standard components (maps merge over `baseMap`).
  Registering `text` in the map does NOT change the fallback for unmapped/unknown types — the map is
  keyed per `FieldType`, so those still fall back to the standard `DetailTextComponent`.
- Unlike their standard components, the `text` and `array` presets render an em-dash placeholder when
  the value is empty (the standard components collapse to nothing).
- The presets have a fixed look; `IDetailOptions` carries no per-field style channel (deliberate,
  matches the fidelity-gap deferral from the Preline group).

## Extending the Base Class

```typescript
import { Component, computed } from '@angular/core';
import { DetailBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-detail-text',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      <p [class]="classes()">{{ item[key] }}</p>
    }
  `,
  standalone: true,
})
export class MyDetailTextComponent extends DetailBaseComponent<any> {
  classes = computed(() => ['my-prefix-text', this.cssClass()].join(' '));
}
```

## Usage Examples

```html
<!-- Direct usage -->
<smart-detail [options]="fieldOptions" [type]="ModelClass"></smart-detail>

<!-- With custom class -->
<smart-detail
  [options]="fieldOptions"
  [type]="ModelClass"
  class="smart:mt-4"
></smart-detail>

<!-- Loading skeleton (when item() returns undefined) -->
<smart-detail
  [options]="{ ...fieldOptions, item: signal(undefined) }"
  [type]="ModelClass"
></smart-detail>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/detail/detail.component.ts`
- Base: `packages/shared/angular/src/lib/components/detail/base/base.component.ts`
- Sub-components: `packages/shared/angular/src/lib/components/detail/<name>/<name>.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`DETAIL_FIELD_COMPONENTS_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IDetailOptions`)

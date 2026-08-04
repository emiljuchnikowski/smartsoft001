---
name: angular-components
description: Create and modify Angular UI components with full stack (tests, Storybook, docs, dark/light mode). Use when creating new UI components or modifying existing ones in @smartsoft001/angular.
allowed-tools:
  - Agent
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
---

# Angular Components Skill

Create or modify Angular UI components in `packages/shared/angular/` following project conventions.

## Usage

```
/angular-components [component-name] [description]
```

## Parameters

- `component-name` - kebab-case name (e.g., `hero-section`, `feature-section`, `pricing-table`)
- `description` - brief description of the component and its variants

## Component Architecture (3-Layer Pattern)

Components follow a 2-layer pattern (Base + Wrapper). Add the optional Standard layer only when multiple visual variants are needed.

```
packages/shared/angular/src/lib/components/<component-name>/
├── index.ts                          # Barrel exports
├── <component-name>.component.ts     # Wrapper (CreateDynamicComponent)
├── <component-name>.component.spec.ts
├── <component-name>.component.stories.ts
├── base/
│   ├── index.ts
│   ├── base.component.ts             # @Directive() with abstract logic + signals
│   └── base.component.spec.ts
└── standard/                         # OPTIONAL: only for multi-variant components
    ├── index.ts
    ├── standard.component.ts          # Concrete implementation
    ├── standard.component.html        # Template with @if/@for/@switch
    └── standard.component.spec.ts
```

### Layer 1: Base Component (`base/base.component.ts`)

Abstract directive with shared logic and signal-based state.

```typescript
import { Directive, input, InputSignal, signal, viewChild, ViewContainerRef, WritableSignal } from '@angular/core';
import { DynamicComponentType, I<ComponentName>Options } from '../../../models';

@Directive()
export abstract class <ComponentName>BaseComponent {
  static smartType: DynamicComponentType = '<component-name>';

  options: InputSignal<I<ComponentName>Options> = input.required<I<ComponentName>Options>();
  contentTpl = viewChild<ViewContainerRef>('contentTpl');

  // Component-specific logic here
}
```

### Layer 2 (optional): Standard Component (`standard/standard.component.ts`)

Only needed when the component has multiple visual variants (e.g., standard form vs grouped form). If the component has a single variant, keep all logic and template in Base + Wrapper. Every component can be dynamically swapped via `ng-template` and `CreateDynamicComponent`.

```typescript
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { <ComponentName>BaseComponent } from '../base/base.component';

@Component({
  selector: 'lib-<component-name>-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <ComponentName>StandardComponent extends <ComponentName>BaseComponent {}
```

### Layer 3: Wrapper Component (`<component-name>.component.ts`)

Wrapper using `inject(<TOKEN>, { optional: true })` + `*ngComponentOutlet` to render an injected `Type<<ComponentName>BaseComponent>` when provided, or fall back to `<ComponentName>StandardComponent`.

Register the DI token in `packages/shared/angular/src/lib/shared.inectors.ts`:

```typescript
export const <COMPONENT_NAME>_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<<ComponentName>BaseComponent>
>('<COMPONENT_NAME>_STANDARD_COMPONENT');
```

Wrapper:

```typescript
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { I<ComponentName>Options } from '../../models';
import { <COMPONENT_NAME>_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { <ComponentName>StandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-<component-name>',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-<component-name>-standard
        [options]="options()"
        [class]="cssClass()"
      >
        <ng-container [ngTemplateOutlet]="contentRef"></ng-container>
      </smart-<component-name>-standard>
    }
    <ng-template #contentRef>
      <ng-content></ng-content>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [<ComponentName>StandardComponent, NgComponentOutlet, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <ComponentName>Component {
  private injectedComponent = inject(<COMPONENT_NAME>_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input.required<I<ComponentName>Options>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);
  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
```

If the component needs projected content to flow into the injected component, wrap `<ng-content>` in local `<ng-template #headerTpl/#bodyTpl/#footerTpl>`, read them with `viewChild.required<TemplateRef<unknown>>('...')`, and include the refs in `componentInputs()`. See `card/card.component.ts` for that pattern.

## External `class` Input Pattern

Every component MUST accept an external `class` attribute that gets merged onto the main DOM element. Use `input` with `alias: 'class'`:

```typescript
// In base component:
cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

// In wrapper component:
cssClass = input<string>('', { alias: 'class' });
// Pass down to child: [cssClass]="cssClass()"
// In refreshProperties: this.baseInstance.cssClass = this.cssClass;
```

In the shape/variant component's `buttonClasses` (or equivalent) computed, append the external class:

```typescript
buttonClasses = computed(() => {
  const classes = [...this.variantClasses()];
  // ... add size/shape classes ...
  const extra = this.cssClass();
  if (extra) classes.push(extra);
  return classes.join(' ');
});
```

Usage: `<smart-button class="smart:mt-4 custom-class" [options]="opts">Click</smart-button>`

## Interface Pattern

Add the component options interface to `packages/shared/angular/src/lib/models/interfaces.ts`:

```typescript
export interface I<ComponentName>Options {
  // Component-specific properties only.
  // Do NOT put a `variant` field here — visual variants are chosen by DI
  // (via <COMPONENT_NAME>_STANDARD_COMPONENT_TOKEN), not by runtime options.
}
```

## MANDATORY: Plugin Sync

Every time you **create or modify** a component, you MUST update the plugin smart:

1. **Per-component skill** — `packages/shared/claude-plugins/src/plugins/smart/skills/angular-components-<name>/SKILL.md` (consumer-facing API docs)
2. **Agent** — `packages/shared/claude-plugins/src/plugins/smart/agents/angular-components/AGENT.md` (add/update "Available Components" table and "Skills to Use" list)

These files are distributed with `@smartsoft001/angular` and used by end-user projects to consume the components.

## Execution Checklist

Execute each step in order. Use `shared-tdd-developer` agent for all code implementation (RED → GREEN → REFACTOR).

- [ ] **1. Define interface** — `I<ComponentName>Options` + enum in `models/interfaces.ts`
- [ ] **2. Create base component** — `base/base.component.ts` with signals and logic
- [ ] **3. Create standard component** — `standard/standard.component.ts` + `.html` with Tailwind
- [ ] **4. Create wrapper component** — `<component-name>.component.ts` with `CreateDynamicComponent`
- [ ] **5. Write unit tests** — for base, standard, and wrapper components
- [ ] **6. Register exports** — barrel exports in `index.ts` files
- [ ] **7. Update components module** — add to `components.module.ts` declarations/exports
- [ ] **8. Update components index** — add `export * from './<component-name>'` to `components/index.ts`
- [ ] **9. Create Storybook stories** — exactly 2 stories: `Playground` (interactive Controls) and `AllVariants` (static showcase). See [Storybook Requirements](#storybook-requirements)
- [ ] **10. Update README** — add component section to `packages/shared/angular/README.md`
- [ ] **11. Create per-component plugin skill** — `packages/shared/claude-plugins/src/plugins/smart/skills/angular-components-<component-name>/SKILL.md` with component API, variants, usage examples (for **using** the component)
- [ ] **12. Update plugin agent** — add component to "Available Components" table in `packages/shared/claude-plugins/src/plugins/smart/agents/angular-components/AGENT.md`
- [ ] **13. Verify** — run tests (`nx test angular`), lint, build

## Styling Rules

- **Tailwind CSS v4** with `smart:` prefix for all utility classes (e.g., `smart:bg-white`, `smart:text-gray-900`, `smart:mt-4`)
- **Dark mode**: use `smart:dark:` prefix (e.g., `smart:dark:bg-gray-900`, `smart:dark:text-white`)
- **Light mode**: default prefixed classes (e.g., `smart:bg-white`, `smart:text-gray-900`)
- **ViewEncapsulation.None** on all styled components
- **No inline styles** — use Tailwind utility classes only

## Angular Patterns (Mandatory)

- `ChangeDetectionStrategy.OnPush` on all components
- `input()` / `input.required()` for inputs (no `@Input()`)
- `signal()` for internal state
- `computed()` for derived values
- `effect()` for side effects
- `@if` / `@for` / `@switch` control flow (no `*ngIf` / `*ngFor`)
- `inject()` for DI (no constructor injection)
- No explicit `standalone: true` (Angular 19+ default)
- `track` on all `@for` loops

## Testing Requirements

- Jest with AAA pattern (Arrange-Act-Assert)
- Test file naming: `<name>.component.spec.ts` alongside source
- Describe block: `@smartsoft001/angular: <ClassName>`
- Test each variant renders correctly
- Test signal inputs/outputs
- Test user interactions (click handlers, etc.)
- Test dark/light mode class application

## Storybook Requirements

Every component MUST have exactly **2 stories**: `Playground` and `AllVariants`.

### Critical configuration rules

1. **Never render a wrapper that extends `CreateDynamicComponent`** — it uses `toObservable` from `@angular/core/rxjs-interop`, which is not compatible with Storybook webpack. Render its sub-component directly instead (e.g., `ButtonStandardComponent`, or the preset). This applies **only** to `CreateDynamicComponent` descendants — the DI-dispatch wrappers (`<smart-detail>`, `<smart-details>`, `<smart-form>`, `<smart-input>`, `<smart-list>`, `<smart-page>`) use `computed()` + `*ngComponentOutlet` and are safe to render directly. See [DI-dispatch components](#di-dispatch-components).
2. **Provide `TranslateModule.forRoot()` via `applicationConfig`** (not `moduleMetadata`) — using `moduleMetadata` with `ModuleWithProviders` causes `ngModule` errors on navigation between stories. In `packages/shared/angular` use the shared helper `provideStorybookTranslations()` from `.storybook/storybook-translations.ts`; `moduleMetadata.imports` must then use the bare `TranslateModule`.
3. **Import sub-components via `moduleMetadata`** — standalone components go in `moduleMetadata({ imports: [...] })`. Preset components are **not** part of the `COMPONENTS` array in `components.module.ts`, so they must be imported by class.
4. **AllVariants must disable all Controls** — use `parameters: { controls: { disable: true } }` on the story. (Per-arg `argTypes: { propName: { table: { disable: true } } }` also works but has to be repeated for every arg.)
5. **Register the preset on the token in `meta`** — see [Showing the preset skin](#showing-the-preset-skin).
6. **A wrapper that dispatches through `NgComponentOutlet` drops projected content.** If the component takes `<ng-content>` (container, media-object, multi-column-layout, sidebar-layout, stacked-layout), render the preset through its own selector (`<smart-container-preset>`) rather than the wrapper, or the body silently disappears.

### Meta configuration template

```typescript
import { importProvidersFrom, signal, WritableSignal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/<ComponentName>',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(TranslateModule.forRoot())],
    }),
    moduleMetadata({
      imports: [
        // Import sub-components directly (NOT the wrapper)
        <ComponentName>StandardComponent,
        <ComponentName>RoundedComponent,
        // ... other sub-components
      ],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'soft'],
      description: '...',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '...',
    },
    disabled: { control: 'boolean', description: '...' },
    // ... all configurable properties as Controls
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    // ... default values
  },
};
```

### Story 1: `Playground`

- Interactive story — all options configurable via **Controls** tab
- `render` function builds the options object from `args`
- Uses sub-component selectors in template (e.g., `<smart-button-standard>`)

```typescript
export const Playground: Story = {
  name: 'Playground',
  render: (args: any) => {
    const options = { click: () => {}, variant: args.variant, size: args.size, ... };
    return {
      props: { options, isDisabled: args.disabled, label: args.label },
      template: `<smart-<component>-standard [options]="options" [disabled]="isDisabled">{{ label }}</smart-<component>-standard>`,
    };
  },
};
```

### Story 2: `AllVariants`

- Static showcase of **ALL** combinations in one HTML template
- **All Controls disabled** via `parameters: { controls: { disable: true } }`
- Organized into `<section>` blocks with `<h3>` headings
- Sections: each shape × each variant, each shape × all sizes, icons, states
- Layout: `display: flex; flex-direction: column; gap: 32px` for sections, `display: flex; align-items: center; gap: 12px` for items

```typescript
export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      /* all option objects as separate props */
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <section>
          <h3 style="margin-bottom: 12px; font-weight: 600;">Standard</h3>
          <div style="display: flex; align-items: center; gap: 12px;">
            <smart-<component>-standard [options]="primary">Primary</smart-<component>-standard>
            <smart-<component>-standard [options]="secondary">Secondary</smart-<component>-standard>
            <smart-<component>-standard [options]="soft">Soft</smart-<component>-standard>
          </div>
        </section>
        <!-- ... more sections: sizes, icons, states ... -->
      </div>
    `,
  }),
};
```

### Showing the preset skin

Stories showcase the **preset** skin, not the standard one. Register the preset on the component's DI token once, in `meta`, so every usage in both stories picks it up:

```typescript
moduleMetadata({
  imports: [ButtonComponent, ButtonPresetComponent],
  providers: [
    {
      provide: BUTTON_STANDARD_COMPONENT_TOKEN,
      useValue: ButtonPresetComponent,
    },
  ],
});
```

Components with a **map-based** token take the whole preset map instead of a single class:

| Token                           | Preset value                     |
| ------------------------------- | -------------------------------- |
| `DETAIL_FIELD_COMPONENTS_TOKEN` | `DETAIL_PRESET_FIELD_COMPONENTS` |
| `INPUT_FIELD_COMPONENTS_TOKEN`  | `INPUT_PRESET_FIELD_COMPONENTS`  |
| `LIST_MODE_COMPONENTS_TOKEN`    | `LIST_PRESET_MODE_COMPONENTS`    |
| `PAGE_VARIANT_COMPONENTS_TOKEN` | `PAGE_PRESET_VARIANT_COMPONENTS` |

Do **not** add a separate `Preset` or `CustomViaToken` story — that breaks the 2-story rule. DI substitution is covered by the `.spec.ts` files and by the per-component skills in `packages/shared/claude-plugins`.

### DI-dispatch components

`detail`, `details`, `form`, `input`, `list` and `page` resolve their child component from a DI token map rather than from a fixed variant name. Their stories need extra setup:

- Render through the wrapper (`<smart-detail>`, `<smart-input>`, …) so the label / info / loader / error chrome is preserved and `IFieldOptions` is derived from the model decorators for you.
- `moduleMetadata.imports` must spread `...IMPORTS, ...COMPONENTS` from `components.module.ts` — `IMPORTS` is the only source of `AlertService`, `HardwareService`, `ToastService`, `StyleService` and `FileService`.
- `form` and `input` need a root-level `MODEL_VALIDATORS_PROVIDER` stub (`FormFactory` injects it eagerly and there is no library-side default) plus `FORM_COMPONENT_TOKEN` for nested object/array sub-forms.
- `detail` needs `DETAILS_COMPONENT_TOKEN` for its `object`/`array` fields; anything rendering media needs a `FileService` stub.
- Drive the two stories from **one variant table** plus a `buildOptions()` factory. Per-field-type `render` blocks are what grew the old `input` stories to 1024 lines.
- Give every rendered instance its own options object and `FormControl` — the base classes mutate them and subscribe per instance.

### General rules

- File: `<component-name>.component.stories.ts`
- Exactly two exports: `Playground` and `AllVariants` — no more, no less
- All Tailwind classes with `smart:` prefix in templates (Tailwind v4 syntax)
- Angular template expressions have **no object spread** — build option objects in `props`, or pass a factory function that takes the `TemplateRef`s
- Reference: `button/button.component.stories.ts` as the canonical example, `input/input.component.stories.ts` for a DI-dispatch component

## Agent Delegation

| Step                      | Agent                      |
| ------------------------- | -------------------------- |
| Code implementation (TDD) | `shared-tdd-developer`     |
| Unit tests                | `angular-jest-test-writer` |
| Style/lint check          | `shared-style-enforcer`    |
| Build verification        | `shared-build-verifier`    |

## Reference Components

Study these existing components as patterns:

- `button/` — wrapper with InjectionToken (`BUTTON_STANDARD_COMPONENT_TOKEN`) for custom implementations, base + standard + wrapper pattern
- `card/` — wrapper with InjectionToken (`CARD_STANDARD_COMPONENT_TOKEN`) and content projection flowing into the injected component via `headerTpl`/`bodyTpl`/`footerTpl` template inputs
- `icon/` — base + default pattern with `cssClass` alias `class`
- `info/` — minimal Base + Standard + Wrapper with InjectionToken (`INFO_STANDARD_COMPONENT_TOKEN`) and a single-field `IInfoOptions { text: string }` — good reference for the simplest shape of the pattern
- `date-range/` — complex component with `ControlValueAccessor` integration

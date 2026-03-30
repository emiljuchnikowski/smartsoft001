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

Dynamic component wrapper using `CreateDynamicComponent`.

```typescript
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, viewChild, viewChildren, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { DynamicContentDirective } from '../../directives';
import { I<ComponentName>Options } from '../../models';
import { CreateDynamicComponent } from '../base';
import { <ComponentName>BaseComponent } from './base/base.component';
import { <ComponentName>StandardComponent } from './standard/standard.component';

@Component({
  selector: 'lib-<component-name>',
  template: `
    @if (template() === 'default') {
      <lib-<component-name>-standard [options]="options()">
        <ng-container [ngTemplateOutlet]="contentTpl"></ng-container>
      </lib-<component-name>-standard>
    }
    <ng-template #contentTpl>
      <ng-content></ng-content>
    </ng-template>
    <div class="dynamic-content"></div>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [<ComponentName>StandardComponent, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <ComponentName>Component extends CreateDynamicComponent<<ComponentName>BaseComponent>('<component-name>') {
  options = input.required<I<ComponentName>Options>();

  override contentTpl = viewChild<ViewContainerRef>('contentTpl');
  override dynamicContents = viewChildren<DynamicContentDirective>(DynamicContentDirective);

  constructor() {
    super();
    effect(() => {
      this.options();
      this.refreshDynamicInstance();
    });
  }

  override refreshProperties(): void {
    this.baseInstance.options = this.options;
  }
}
```

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

Usage: `<smart-button class="smart-mt-4 custom-class" [options]="opts">Click</smart-button>`

## Interface Pattern

Add the component options interface to `packages/shared/angular/src/lib/models/interfaces.ts`:

```typescript
export enum <ComponentName>Variant {
  // Define variants based on HTML templates
}

export interface I<ComponentName>Options {
  variant: <ComponentName>Variant;
  // Component-specific properties
}
```

Also add the `DynamicComponentType` union member: `'<component-name>'`.

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
- [ ] **9. Create Storybook stories** — one story per variant with interactive controls
- [ ] **10. Update README** — add component section to `packages/shared/angular/README.md`
- [ ] **11. Create per-component skill** — `.claude/skills/angular-components-<component-name>/SKILL.md`
- [ ] **12. Verify** — run tests (`nx test angular`), lint, build

## Styling Rules

- **Tailwind CSS** with `smart-` prefix for all utility classes (e.g., `smart-bg-white`, `smart-text-gray-900`, `smart-mt-4`)
- **Dark mode**: use `dark:smart-` prefix (e.g., `dark:smart-bg-gray-900`, `dark:smart-text-white`)
- **Light mode**: default prefixed classes (e.g., `smart-bg-white`, `smart-text-gray-900`)
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

1. **Use sub-components directly** (e.g., `ButtonStandardComponent`) — NOT the wrapper component (`ButtonComponent`) which extends `CreateDynamicComponent`. The wrapper uses `toObservable` from `@angular/core/rxjs-interop` which is not compatible with Storybook webpack.
2. **Provide `TranslateModule.forRoot()` via `applicationConfig`** (not `moduleMetadata`) — using `moduleMetadata` with `ModuleWithProviders` causes `ngModule` errors on navigation between stories.
3. **Import sub-components via `moduleMetadata`** — standalone components go in `moduleMetadata({ imports: [...] })`.
4. **AllVariants must disable all Controls** — use `argTypes: { propName: { table: { disable: true } } }` for each arg.

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
- **All Controls disabled** via `argTypes: { propName: { table: { disable: true } } }`
- Organized into `<section>` blocks with `<h3>` headings
- Sections: each shape × each variant, each shape × all sizes, icons, states
- Layout: `display: flex; flex-direction: column; gap: 32px` for sections, `display: flex; align-items: center; gap: 12px` for items

```typescript
export const AllVariants: Story = {
  name: 'All Variants',
  argTypes: {
    variant: { table: { disable: true } },
    size: { table: { disable: true } },
    // ... disable ALL args
  },
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

### General rules

- File: `<component-name>.component.stories.ts`
- All Tailwind classes with `smart-` prefix in templates
- Reference: `button/button.component.stories.ts` as the canonical example

## Agent Delegation

| Step                      | Agent                      |
| ------------------------- | -------------------------- |
| Code implementation (TDD) | `shared-tdd-developer`     |
| Unit tests                | `angular-jest-test-writer` |
| Style/lint check          | `shared-style-enforcer`    |
| Build verification        | `shared-build-verifier`    |

## Reference Components

Study these existing components as patterns:

- `button/` — simple component with options interface
- `page/` — component with multiple sections
- `list/` — complex component with multiple modes/variants
- `detail/` — component with many type variants

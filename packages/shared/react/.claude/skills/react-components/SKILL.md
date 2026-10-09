---
name: react-components
description: Create or change a React UI component of @smartsoft001/react or a CRUD screen of @smartsoft001/crud-shell-react — the wrapper, standard and preset files, the SmartProvider registry key, Tailwind classes with the smart prefix and the class-based dark variant, Testing Library specs, the Storybook story and the docs. Use for any component work under packages/shared/react or packages/crud/shell/react.
paths:
  - 'packages/shared/react/**'
  - 'packages/crud/shell/react/**'
  - 'docs/examples/react/**'
  - 'src/**'
  - '.storybook/**'
allowed-tools:
  - Agent
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
---

# React Components Skill

Create or change a UI component in `packages/shared/react/` (`@smartsoft001/react`, Nx project `react`) following the library's conventions. The CRUD screens in `packages/crud/shell/react/` (`@smartsoft001/crud-shell-react`, Nx project `crud-shell-react`) are built from these components; their differences are listed under [CRUD screens](#crud-screens).

Read `react-patterns` (hooks, controlled props, forms, stores, services) and `react-testing` (spec conventions) next to this skill before writing code.

## Usage

```text
/react-components [component-name] [description]
```

## Parameters

- `component-name` — kebab-case name of the folder and the registry key (e.g. `button`, `card-heading`, `media-object`)
- `description` — what the component shows and which options and variations it needs

## Component layout

```text
packages/shared/react/src/lib/components/<name>/
├── index.ts                  # barrel: wrapper, types, hook, standard, preset, preset classes
├── <name>.tsx                # Smart<Name>: resolves the implementation with useSmartComponent
├── <name>.types.ts           # Smart<Name>Props (+ Smart<Name>VariantProps when the wrapper renames props)
├── use-<name>.ts             # use<Name>(props): behaviour every implementation shares
├── <name>.spec.tsx
├── <name>.stories.tsx
├── standard/
│   └── <name>-standard.tsx   # Smart<Name>Standard: the default rendering
└── preset/
    ├── <name>-preset.tsx     # Smart<Name>Preset: the Preline-styled rendering
    └── preset-classes.ts     # the preset's class tables and builders, exported
```

Not every component has every file: `container`, `divider` and `feed` have no hook because their implementations share no behaviour; `alert`, `searchbar` and `select-menu` have no preset; `accordion` and `icon` have no registry key (render `SmartAccordionPreset` / the icon's preset directly). `input`, `detail` and `list` dispatch to field or mode components instead of a single implementation — see [Registry maps](#registry-maps).

### 1. Options and props

The component's configuration object goes in `src/lib/models/interfaces.ts` as `I<Name>Options` (`IButtonOptions`, `IInfoOptions { text: string }`). Props live in `<name>.types.ts`:

```tsx
import type { ReactNode } from 'react';

import { IButtonOptions } from '../../models';

export interface SmartButtonProps {
  options: IButtonOptions;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}
```

- `className` on every component, appended last to the root element's classes.
- Content goes in `children` or named `ReactNode` props (`header`, `footer`).
- A value the user changes is a controlled prop with an uncontrolled fallback and an `on<Prop>Change` callback (`value` / `defaultValue` / `onValueChange`, `open` / `defaultOpen` / `onOpenChange`); see `react-patterns`.
- Document each prop with a one-line JSDoc comment; the Storybook autodocs page shows them.

### 2. Hook (`use-<name>.ts`)

The behaviour both implementations share, so a standard, a preset and an application's own implementation behave the same. It takes the props and returns state, derived classes and handlers:

```ts
export function useInfo() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((value) => !value), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, toggle, open, close };
}
```

`useButton(props)` is the fuller example: colour classes from `COMPONENT_COLORS`, the confirm mode and the click handlers. The hook is exported, so applications build their own implementation on it.

### 3. Standard and preset implementations

Both take the same props, call the hook and render. The standard look lives in `standard/<name>-standard.tsx`; the preset in `preset/<name>-preset.tsx` with its classes in `preset/preset-classes.ts` (class arrays or `get<Name>PresetClasses(...)` builders, exported for custom implementations). A preset may add props of its own (`SmartInfoPresetProps` adds `placement`).

```tsx
/** The default button rendering. */
export function SmartButtonStandard(props: SmartButtonProps) {
  const { options, disabled = false, className, children } = props;
  const t = useTranslate();
  const { loading, variantClasses, invoke } = useButton(props);

  return (
    <button
      type={options?.type ?? 'button'}
      className={cn(variantClasses, 'smart:inline-flex', className)}
      disabled={disabled || loading}
      onClick={invoke}
    >
      {loading ? <SmartIcon name="spinner" /> : children}
    </button>
  );
}
```

Visible text goes through `useTranslate()`; new keys go in `src/lib/i18n/translations-default.ts`, in `ITranslateData` and in both `TRANSLATE_DATA_ENG` and `TRANSLATE_DATA_PL`. Associate labels with `useId()`.

### 4. Wrapper (`<name>.tsx`)

The exported component. It renders whatever `SmartProvider` registers under the component's key, or the standard implementation:

```tsx
import { SmartButtonProps } from './button.types';
import { SmartButtonStandard } from './standard/button-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.button` on
 * `SmartProvider`, `SmartButtonStandard` by default.
 */
export function SmartButton(props: SmartButtonProps) {
  const Component = useSmartComponent('button', SmartButtonStandard);

  return <Component {...props} />;
}
```

When the implementation needs props in another shape, the wrapper maps them and types the implementation with `Smart<Name>VariantProps`: `SmartCard` passes `header` / `children` / `footer` as `headerTpl` / `bodyTpl` / `footerTpl` and resolves `hasHeader` / `hasFooter` with `isCardSectionShown` (`card/card.tsx`, `card/card.types.ts`).

## Registry

`SmartProvider` holds the implementations an application swaps in. Wrappers read them through the hooks in `src/lib/providers/hooks.ts`.

- **Key**: add the kebab-case name to the `DynamicComponentType` union in `src/lib/models/interfaces.ts`. `SmartComponentKey` (`providers/smart-context.ts`) is that union plus any string, so a component may also document a key of its own (`'input-error'`, `'page:preset'`).
- **Preset**: add `'<name>': Smart<Name>Preset` to `SMART_PRESET_COMPONENTS.components` in `src/lib/components/presets/presets.ts`, keeping the keys alphabetical. `<SmartProvider {...SMART_PRESET_COMPONENTS}>` then restyles the whole application.
- **Exports**: `export * from './<name>'` in `src/lib/components/index.ts` (alphabetical); the package entry `src/index.ts` already re-exports the components barrel.

### Registry maps

Components that dispatch by field type or mode read a map, merged over their defaults:

| `SmartProvider` prop         | Keyed by                                                   | Defaults                                                                   | Preset map                                                   |
| ---------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `inputFieldComponents`       | `FieldType`                                                | `getDefaultInputFieldComponents()` (`input/default-field-components.ts`)   | `INPUT_PRESET_FIELD_COMPONENTS` (`input/preset-fields.ts`)   |
| `detailFieldComponents`      | `FieldType`                                                | `getDefaultDetailFieldComponents()` (`detail/default-field-components.ts`) | `DETAIL_PRESET_FIELD_COMPONENTS` (`detail/preset-fields.ts`) |
| `listModeComponents`         | `ListMode`                                                 | `LIST_MODE_COMPONENTS` in `list/list.tsx`                                  | `LIST_PRESET_MODE_COMPONENTS` (`list/preset-modes.ts`)       |
| `components` (page variants) | `getPageVariantKey(variant)`: `'page'`, `'page:<variant>'` | `SmartPageStandard`                                                        | `PAGE_PRESET_VARIANT_COMPONENTS` (`page/preset-variants.ts`) |

A new field component goes in `components/input/<type>/` (or `components/detail/<type>/`) with its own `standard` file, `preset/` folder and spec, then into both maps. The default maps are built on first call, not at module load, because the `object` and `array` fields render a form that renders inputs again; keep it that way.

## Styling Rules

- **Tailwind CSS 4 with the `smart` prefix** — `src/lib/styles.css` imports Tailwind with `prefix(smart)`, so every utility starts with `smart:` and variants follow it: `smart:hover:bg-gray-50`, `smart:sm:px-6`, `smart:focus-visible:outline-2`.
- **Dark mode is class-based** — `@custom-variant dark (&:where(.dark, .dark *))` makes `smart:dark:` apply under a `.dark` class on `<html>` or any ancestor, not under the system preference. Put a `smart:dark:` class next to every colour class.
- **Complete literals only** — write each class as a full string literal, in arrays joined with `cn()` from `src/lib/utils/class-names.ts`. Never build a class from a template string (`` `smart:bg-${color}-600` ``): the scanner only finds literals, so colour variations are tables keyed by `SmartColor` (see `button/preset/preset-classes.ts`, `models/colors.ts`).
- **External classes last** — `cn(classes, className)`.
- **Inline `style` only for runtime values** a class cannot express (a colour or size read from the data).
- The published stylesheet is generated by `nx run react:styles` into `packages/shared/react/styles.css`; do not edit that file.

## Testing

`<name>.spec.tsx` next to the wrapper, `describe('@smartsoft001/react: Smart<Name>', …)`, AAA with blank lines. Cover at least:

- the wrapper renders the standard implementation by default;
- the wrapper renders the implementation registered under its key (`<SmartProvider components={{ '<name>': Custom }}>`);
- `className` reaches the root element;
- the hook's behaviour through `renderHook` + `act` (controlled and uncontrolled);
- each behaviour on both implementations with `it.each([['standard', Smart<Name>Standard], ['preset', Smart<Name>Preset]])('%s: should …')`;
- the preset's class builders where they map options to classes.

The full conventions (queries, events, async form builds, `@jest-environment node`, fake timers) are in the `react-testing` skill.

## Storybook

`<name>.stories.tsx` next to the component, CSF3 with `Meta` / `StoryObj` from `@storybook/react-vite`. Every component story file exports exactly two stories:

1. **`Playground`** — the props as Controls (`argTypes` + `args` on an args interface), rendering the component from `args`. Wrap it in `// #region usage` … `// #endregion` at column 0: the region is the component's usage example.
2. **`AllVariants`** — every variation side by side in `<section>`s with `<h3>` headings, `parameters: { controls: { disable: true } }`.

```tsx
const meta: Meta<ButtonArgs> = {
  title: 'Components/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary', 'soft'] },
  },
  args: { label: 'Button', variant: 'primary' },
};

export default meta;
type Story = StoryObj<ButtonArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <SmartButtonPreset options={{ click: noop, variant: args.variant }}>
      {args.label}
    </SmartButtonPreset>
  ),
};
// #endregion
```

- **Show the preset.** Either render `Smart<Name>Preset` directly (`button.stories.tsx`) or render the wrapper and register the preset through `parameters.smart`, which `.storybook/preview.tsx` spreads into the story's `SmartProvider` (`badge.stories.tsx`): `parameters: { smart: { components: { badge: SmartBadgePreset } } }`. The same parameter supplies maps and services: `inputFieldComponents`, `detailFieldComponents`, `fileService`, `modelLabelProvider`.
- **The frame is fixed**: every story renders inside `SmartProvider language="pl"` with the Storybook model labels (`.storybook/storybook-translations.ts`); the toolbar's theme switch toggles `.dark` on `<html>`. Add a model label used by a story to `STORYBOOK_MODEL_LABELS` in both languages.
- **Titles**: `Components/<Name>` for presentational components, `Smart-<Name>/<Name>` for the model-driven ones (form, input, detail, details, list, page).
- **Model-driven stories**: one variant table plus a `buildOptions()` factory; give every rendered field its own `SmartFormControl` inside a `SmartFormGroup` (the label reads `control.parent.value`) and memoise it per cell. See `input/input.stories.tsx` and `detail/detail.stories.tsx`.
- Inline `style` is fine for the story's own layout; the component itself keeps to `smart:` classes.

## Docs

- `packages/shared/react/README.md` — add the component where the "What is inside" list names its group, when it is a headline component.
- `docs/site/src/app/docs/packages/react/page.md` — add `Smart<Name>` to the alphabetical list under `### Components`, and any new public hook, map or provider prop to the API tables.
- A new usage pattern worth a code sample goes into `docs/examples/react/src/react/<topic>.example.tsx` wrapped in `// #region usage`, with a spec (`describe('docs-examples-react: <Subject>')`), embedded with `{% snippet file="react/src/react/<topic>.example.tsx" region="usage" /%}`. Pages never hand-write code.

## Plugin Sync

The `smart-react` plugin documents each component for applications that use the library. When you create or change a component's public API, update:

1. **Per-component skill** — `packages/shared/claude-plugins/src/plugins/smart-react/skills/react-components-<name>/SKILL.md` (exports, options, registry key, hook)
2. **Agent** — `packages/shared/claude-plugins/src/plugins/smart-react/agents/react-components.md` (the component list and the skills it names)

## CRUD screens

`packages/crud/shell/react/src/lib/` follows the same rules with these differences:

- Components are `SmartCrud<Name>` in `components/<name>/` with `<name>.tsx`, `<name>.types.ts` and a `use-crud-<name>.ts` hook; they read the feature through `useCrud()`, `useCrudConfig()`, `useCrudFacade()` and `useCrudState(selector)` and must render inside `<CrudProvider config={…}>`.
- The pages (`pages/list`, `pages/item`) resolve their body from the registry keys `'crud-list-page'` and `'crud-item-page'`, falling back to `SmartCrudListPageStandard` / `SmartCrudItemPageStandard`.
- Specs use `describe('@smartsoft001/crud-shell-react: …')`; stories use the `Smart-Crud/…` titles and the same `.storybook` frame.

## Execution Checklist

Delegate code to `shared-tdd-developer` (RED → GREEN → REFACTOR) with the React instructions in [Agent Delegation](#agent-delegation).

- [ ] **1. Options** — `I<Name>Options` in `models/interfaces.ts`, the key in `DynamicComponentType`
- [ ] **2. Types** — `<name>.types.ts`
- [ ] **3. Hook** — `use-<name>.ts`, spec first through `renderHook`
- [ ] **4. Standard** — `standard/<name>-standard.tsx`
- [ ] **5. Preset** — `preset/<name>-preset.tsx` + `preset/preset-classes.ts`
- [ ] **6. Wrapper** — `<name>.tsx` with `useSmartComponent('<name>', Smart<Name>Standard)`
- [ ] **7. Specs** — `<name>.spec.tsx` covering the list under [Testing](#testing)
- [ ] **8. Exports** — the component's `index.ts`, `components/index.ts`, `SMART_PRESET_COMPONENTS`
- [ ] **9. Translations** — new keys in `i18n/translations-default.ts` (both languages)
- [ ] **10. Story** — `Playground` (in the `usage` region) and `AllVariants`
- [ ] **11. Docs** — README, package page, example when the usage is new
- [ ] **12. Plugin sync** — `smart-react` per-component skill and agent
- [ ] **13. Verify** — the commands below

## Verification

```bash
npx nx test react                               # or crud-shell-react
npx nx test react --testPathPatterns=<name>     # one component while iterating
npx nx lint react
npx nx build react
npx nx run react:build-storybook -c ci          # = npx storybook build --quiet -c packages/shared/react/.storybook -o dist/storybook/react
npx nx run react:test-storybook                 # renders every built story in headless Chromium (Playwright)
npx prettier --write <changed files>
npx nx format:check
```

When the docs changed, also run `npx nx run-many -t test build lint -p docs-examples-react` and `npx nx run docs:check`. For `crud-shell-react` the same targets exist under that project name.

## Agent Delegation

The repository's agents are framework-neutral; pass them the React specifics:

| Step                | Agent                      | Tell it                                                                                                                                         |
| ------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Code (TDD)          | `shared-tdd-developer`     | React 19 function components and hooks, specs in `<name>.spec.tsx` with Testing Library, run with `npx nx test react --testPathPatterns=<name>` |
| Scaffold the folder | `shared-file-creator`      | the [Component layout](#component-layout) tree and names (`Smart<Name>`, `Smart<Name>Standard`, `Smart<Name>Preset`, `use<Name>`)               |
| Run the suites      | `shared-test-runner`       | `npx nx test react` / `npx nx test crud-shell-react`                                                                                            |
| Lint and format     | `shared-style-enforcer`    | `npx nx lint react`, import order, the `react-hooks` rules                                                                                      |
| Build and Storybook | `shared-build-verifier`    | `npx nx build react`, `npx nx run react:build-storybook -c ci`, `npx nx run react:test-storybook`                                               |
| Coverage            | `shared-coverage-enforcer` | `npx nx test react --coverage`                                                                                                                  |

## Reference Components

- `button/` — options object, hook with confirm mode, standard + preset, colour tables in `preset/preset-classes.ts`; the canonical story
- `info/` — the smallest complete component: `IInfoOptions { text: string }`, `useInfo`, a preset with an extra `placement` prop
- `card/` — content props renamed for the implementation (`Smart<Name>VariantProps`)
- `toggle/`, `textarea/`, `drawer/` — controlled / uncontrolled values with `on…Change`
- `badge/` — wrapper story with the preset registered through `parameters.smart`
- `input/` + `input/text/` — field components dispatched by `FieldType`, bound to a `SmartFormControl` through `useInput`
- `list/` — modes dispatched by `ListMode`

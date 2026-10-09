---
name: react-patterns
description: Conventions of the React code in @smartsoft001/react and @smartsoft001/crud-shell-react — controlled and uncontrolled props, on* callbacks, the SmartFormControl/Group/Array form model with useControlState, useControlBinding, useModelForm and FormFactory, SmartStore + useStore, services from SmartProvider hooks, stable configuration objects, server-safe modules, DOMPurify and trustHtml, the react-hooks lint rules and the React 19 APIs in use. Use when writing or reviewing React code in those packages.
paths:
  - 'packages/shared/react/**'
  - 'packages/crud/shell/react/**'
  - 'docs/examples/react/**'
  - 'src/**'
  - '.storybook/**'
---

# React Patterns

How the code in `packages/shared/react` (`@smartsoft001/react`) and `packages/crud/shell/react` (`@smartsoft001/crud-shell-react`) is written. Component folder layout, registry and styling are in `react-components`; spec conventions in `react-testing`.

## 1. Components and modules

- Function components and hooks only; no class components, no default exports.
- Public names: `Smart<Name>` components, `use<Name>` hooks, `I<Name>Options` option interfaces, `Smart<Name>Props` prop types. The CRUD package prefixes them `SmartCrud<Name>` / `useCrud<Name>`.
- Type-only imports use `import type { ReactNode } from 'react'`.
- Content props are `ReactNode` (`children`, `header`, `footer`); a component a caller swaps in is a `ComponentType<P>`.
- Exported components, hooks, props and option fields carry a JSDoc comment saying what they do.

## 2. Controlled and uncontrolled props

A value the user changes is controlled when its prop is defined, and kept in state otherwise. The change callback fires in both modes:

```ts
export function useToggle({
  value: valueProp,
  defaultValue = false,
  onValueChange,
  disabled = false,
}: SmartToggleProps) {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : innerValue;

  const setValue = useCallback(
    (next: boolean) => {
      if (!controlled) setInnerValue(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  return { value, setValue };
}
```

- Name the trio `<prop>` / `default<Prop>` / `on<Prop>Change`: `value` / `defaultValue` / `onValueChange` (`toggle`, `textarea`), `open` / `defaultOpen` / `onOpenChange` (`drawer`, `command-palette`), `show` / `defaultShow` / `onShowChange` and `text` / `defaultText` / `onTextChange` (`searchbar`), `selectedId` / `defaultSelectedId` (`tabs`).
- Document on the prop that `undefined` means uncontrolled (`searchbar.types.ts`, `toggle.types.ts`).
- When local state must follow a changing prop, store the previous prop in state and adjust during render instead of syncing in an effect: `useControllableValue` in `date-edit/use-date-edit.ts` (`value` / `setValue`) and `useCrudFilterValue` in `crud/shell/react/.../filter/date/use-crud-filter-value.ts`.

## 3. Callbacks

- Events are optional `on<Event>` props called with `?.()`: `onValueChange`, `onInvokeSubmit`, `onValidChange`, `onDismissed`, `onActionClick`, `onClosed`.
- A subscription that outlives renders reads the latest callbacks through a ref updated in an effect, so it is not re-subscribed on every render (`useRegisterChanges` in `form/form.tsx`):

```ts
const latest = useRef(outputs);

useEffect(() => {
  latest.current = outputs;
});

useEffect(() => {
  if (!form) return undefined;

  const subscription = form.valueChanges.subscribe(() => {
    latest.current.onValueChange?.(form.value as T);
  });

  return () => subscription.unsubscribe();
}, [form]);
```

## 4. Forms

The form model in `src/lib/forms/` needs no form library and holds no React state.

- `SmartFormControl`, `SmartFormGroup`, `SmartFormArray` extend `SmartAbstractControl`: `value`, `status` (`VALID` / `INVALID` / `PENDING` / `DISABLED`), `errors`, `touched`, `dirty`, `setValue`, `patchValue`, `reset`, `disable`, `enable`, `markAsTouched`, `markAsDirty`, `get(path)`, `getRawValue()`.
- Status propagates to the parent; async validators run once the sync ones pass and hold the control `PENDING`; a disabled control has no errors and is left out of the parent's `value`.
- `SmartValidators` (`required`, `email`, `min`, `max`, `minLength`, `maxLength`, `pattern`, …) report the error keys the input messages read.
- `valueChanges`, `statusChanges` and `changes` are `SmartEmitter`s; `subscribe()` returns `{ unsubscribe }`. `{ emitEvent: false }` keeps `valueChanges` silent, `changes` still fires so components re-render.

React reads a control through the hooks in `forms/hooks.ts`, all built on `useSyncExternalStore` over `control.changes` and `control.version`:

```tsx
function NameField({ control }: { control: SmartFormControl<string> }) {
  const id = useId();
  const { value, onChange, onBlur, errors, touched } =
    useControlBinding(control);

  return (
    <>
      <label htmlFor={id}>Name</label>
      <input
        id={id}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {touched && errors?.['required'] && <p>required</p>}
    </>
  );
}
```

- `useControlState(control)` — the snapshot (`value`, `status`, `errors`, `valid`, `pending`, `disabled`, `touched`, `dirty`, `required`); `useControlBinding(control)` adds `onChange` (marks dirty, then sets the value) and `onBlur` (marks touched).
- Field components use `useInput(props)` from `components/input/base/use-input.ts` (label, `required`, `setValue`, `markAsTouched`, `autoFocus`).
- `FormFactory` builds a `SmartFormGroup` from the model's `@Field` metadata (modes, permissions, nested objects and arrays, `confirm`, unique checks, `enabled` specifications). Components get the provider's instance with `useFormFactory()`; `useModelForm(model, { mode, uniqueProvider, control })` returns `null` until the first build settles and drops a build that a newer one overtook.
- A control's parent group is required wherever a label is read: the label comes from `control.parent.value`.

## 5. External stores

`SmartStore<T>` (`src/lib/store/store.ts`) holds one immutable value: `get()`, `set(next)`, `update(fn)`, `subscribe(listener)`. React reads it with `useStore(store)` or `useStore(store, selector)` through `useSyncExternalStore`.

- The services keep their UI state in stores (`toastService.toasts`, `alertService.alerts`, `modalService.modals`, `menuService.endContent`); the CRUD feature state is a store read with `useCrudState(selector)`.
- Replace the value immutably; `set` ignores a value that is `Object.is`-equal to the current one.
- A selector returns a slice that already exists in the state. Building a new object or array in a selector gives a new snapshot on every read and loops; derive with `useMemo` after selecting.

## 6. Services and the provider

`SmartProvider` creates the services once (`createSmartServices`) and hands them out through hooks in `src/lib/providers/hooks.ts`:

`useTranslate()`, `useNavigation()`, `useSmartComponent(key, fallback)`, `useAuthService()`, `useStorageService()`, `useHttpClient()`, `useFileService()`, `useDetailsService()`, `useAppService()`, `useMenuService()`, `useToastService()`, `useAlertService()`, `useModalService()`, `useErrorService()`, `useStyleService()`, `useFormFactory()`; `useSmart()` returns the whole context.

- A component never constructs a service; it asks the hook. Tests and applications replace one through the provider prop of the same name (`authService`, `http`, `menuService`, …).
- Outside a `SmartProvider`, `useSmart()` falls back to a default context created on first use, so components render on their own.
- Navigation goes through the `ISmartNavigation` adapter (`navigate`, `back`, `getCurrentUrl`, `subscribe`, optional `linkComponent`); the library imports no router. `createHistoryNavigation()` is the default over `window.history`.
- HTTP goes through `SmartHttpClient` (`fetch` with interceptors; `createAuthInterceptor` adds the bearer token). Pass a `fetch` in its constructor options where a test needs one.
- `CrudProvider` (crud-shell-react) layers a feature on top: service, store, effects, facade and a `FileService` pointed at the feature's API, read with `useCrud()`, `useCrudConfig()`, `useCrudFacade()`, `useCrudService()`.

## 7. Stable configuration objects

The provider memoises its context on the identity of what it is given, and hooks list options objects as dependencies.

- Pass `SmartProvider` module constants or memoised values for `components`, `translations`, the maps and the providers; a literal re-created on every render changes the context every render. `CrudProvider` needs a memoised `config`.
- Library defaults are module constants (`LIST_MODE_COMPONENTS` in `list/list.tsx`) or lazy singletons (`getDefaultInputFieldComponents()`), so the merged maps keep their identity.
- Memoise derived option objects (`useMemo(() => ({ ...options, fields }), [options, fields])` in `SmartList`) and handlers (`useCallback`) that go into dependency lists or down to children.

## 8. Server-safe modules

The packages render on the server (`renderToString`) as well as in the browser.

- No `window`, `document` or `localStorage` access at module level or during render. Guard with `typeof window === 'undefined'` (`createHistoryNavigation`, `StorageService`'s default storage, `sanitizeHtml`) and touch the DOM in effects, with cleanup (`document.addEventListener` in `SmartInfoStandard`).
- Portals mount after an effect has run: `BodyPortal` in `overlays/overlays.tsx` renders nothing until mounted, then `createPortal(children, document.body)`.
- Create defaults lazily (`fallbackContext ??= …`, `defaults ??= …`), which also keeps circular imports between form and input modules safe.

## 9. HTML content

React renders `dangerouslySetInnerHTML` verbatim, so HTML always goes through `toInnerHtml(value)` from `src/lib/utils/html.ts`:

- a plain string is sanitised with DOMPurify (`sanitizeHtml`: no scripts, event handlers, iframes, forms, `style` attributes or `javascript:` URLs); without a DOM the tags are dropped and the text escaped;
- a value wrapped with `trustHtml(html)` by the application is rendered as is.

## 10. Lint rules

`eslint.config.mjs` applies to both React packages:

- `react-hooks/rules-of-hooks` (error) — call every hook unconditionally, before any early `return` (`SmartInput` returns `null` for a hidden field only after its hooks ran);
- `react-hooks/exhaustive-deps` (warn) — list what a hook reads. A deliberate omission gets `// eslint-disable-next-line react-hooks/exhaustive-deps` with a comment saying why (`SmartProvider`, `SmartInput`, `useControlState`);
- `import/order` — external packages, then `@smartsoft001/*`, then relative imports, alphabetical, a blank line between groups.

Run `npx nx lint react` / `npx nx lint crud-shell-react`.

## 11. React 19 in this code

`react` and `react-dom` `^19` are peer dependencies.

- `useId()` associates every label with its control.
- `useSyncExternalStore` is the bridge to external state: form controls (`forms/hooks.ts`) and stores (`store/store.ts`).
- `useRef<T>(null)` always takes an initial value; DOM refs are typed `RefObject<T | null>`.
- No `forwardRef`, no global `JSX` namespace: return types are inferred and slots are `ReactNode`.
- Overlays render through `createPortal` from `react-dom`.

## Reference implementation

- `packages/shared/react/src/lib/components/toggle/use-toggle.ts` — controlled / uncontrolled value
- `packages/shared/react/src/lib/components/searchbar/use-searchbar.ts` — two controlled values and a debounced control subscription
- `packages/shared/react/src/lib/forms/hooks.ts` — `useSyncExternalStore` over a form control
- `packages/shared/react/src/lib/store/store.ts` — `SmartStore` and `useStore`
- `packages/shared/react/src/lib/providers/smart-provider.tsx` — services created once, memoised context
- `packages/shared/react/src/lib/utils/html.ts` — `sanitizeHtml`, `trustHtml`, `toInnerHtml`
- `docs/examples/react/src/react-stack/app-providers.example.tsx` — an application's provider set-up with stable configuration

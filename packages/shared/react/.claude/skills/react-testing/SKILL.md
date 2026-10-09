---
name: react-testing
description: Jest + Testing Library conventions of the React specs in @smartsoft001/react and @smartsoft001/crud-shell-react — AAA, queries by role and label, fireEvent, renderHook and act, rendering inside SmartProvider, form controls and async form builds, fake timers, @jest-environment node for fetch, and how the CRUD specs stub HTTP. Use when writing, fixing or reviewing *.spec.ts(x) files there.
paths:
  - 'packages/shared/react/**'
  - 'packages/crud/shell/react/**'
  - 'docs/examples/react/**'
  - 'src/**'
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
---

# React Testing

Unit tests of `packages/shared/react` and `packages/crud/shell/react`. The repository-wide rules (AAA, naming, commands) are in the shared `test-unit` skill; this skill is what the React specs add.

## Set-up

- Jest 30 through `@nx/jest:jest`, `ts-jest`, `testEnvironment: 'jsdom'` (`jest.config.ts` of each project).
- `src/test-setup.ts` imports `reflect-metadata` (the model decorators need it) and `@testing-library/jest-dom` (the `toBeInTheDocument`, `toHaveClass`, `toBeDisabled`, `toBeChecked`, `toHaveTextContent`, `toHaveAttribute` matchers).
- `@testing-library/react` provides `render`, `screen`, `fireEvent`, `act`, `renderHook`, `waitFor`, `within`. Events are fired with `fireEvent`; `@testing-library/user-event` is not a dependency of the workspace.

## Files and naming

- `<name>.spec.tsx` next to the component (`button/button.spec.tsx`), `.spec.ts` when nothing renders JSX (`forms/forms.spec.ts`, `services/http/http.client.spec.ts`). A wider scenario gets its own file (`form/form.integration.spec.tsx`).
- Top-level describe: `@smartsoft001/react: SmartButton`, `@smartsoft001/crud-shell-react: CrudService`; in `docs/examples/react`, `docs-examples-react: ContactForm`.
- Nested `describe` blocks per hook or implementation: `describe('useToggle')`, `describe('wrapper')`, `describe('standard')`.
- `it('should …')`, Arrange / Act / Assert separated by blank lines, no AAA comments.

## Rendering

A component renders on its own against the default configuration (Polish texts). Wrap it in `SmartProvider` for anything else:

```tsx
render(
  <SmartProvider
    language="eng"
    translations={{ MODEL: { name: 'Name' } }}
    components={{ button: Custom }}
  >
    <SmartButton options={{ click }}>Save</SmartButton>
  </SmartProvider>,
);
```

- `language="eng"` for English labels (`confirm`, `cancel`); without it the button's confirm label is `potwierdź`.
- `translations={{ MODEL: { <field>: '<Label>' } }}` gives a model field a label to query by.
- `components`, `inputFieldComponents`, `detailFieldComponents`, `listModeComponents` swap implementations; services and adapters go in their own props (`authService`, `menuService`, `fileService`, `navigation`, `modelValidatorsProvider`).

## Queries and assertions

- `screen.getByRole('button', { name: 'Save' })` first; `getByLabelText('Name')` for fields; `getByText` for content; `getByTestId` only for a stand-in or custom implementation the spec renders itself (`data-testid="custom"`).
- `queryBy…` with `not.toBeInTheDocument()` for absence.
- Classes: `expect(screen.getByRole('button')).toHaveClass('smart:bg-indigo-600')`; for an element without a role use `const { container } = render(…)` and `container.querySelector(…)`.

```tsx
it('should call click', () => {
  const click = jest.fn();
  render(<SmartButton options={{ click }}>Save</SmartButton>);

  fireEvent.click(screen.getByRole('button', { name: 'Save' }));

  expect(click).toHaveBeenCalledTimes(1);
});
```

## Both implementations

A behaviour shared through the hook is asserted on the standard and the preset with one table:

```tsx
it.each([
  ['standard', SmartButtonStandard],
  ['preset', SmartButtonPreset],
])('%s: should be disabled while loading', (_name, Button) => {
  render(<Button options={{ click: jest.fn(), loading: true }}>Save</Button>);

  expect(screen.getByRole('button')).toBeDisabled();
});
```

Every wrapper also gets "renders the standard implementation by default" and "renders the implementation registered as `components.<key>`" (a small `Custom` component in the spec).

## Hooks

```tsx
it('should report a controlled toggle() through onValueChange', () => {
  const onValueChange = jest.fn();
  const { result } = renderHook(() =>
    useToggle({ value: true, onValueChange }),
  );

  act(() => result.current.toggle());

  expect(onValueChange).toHaveBeenCalledWith(false);
});
```

Test the uncontrolled path (`defaultValue`, the returned value changes) and the controlled one (the callback fires, the value follows the prop) separately.

## Forms

- A field needs a control inside a group, because its label reads `control.parent.value`:

```tsx
const control = new SmartFormControl('');
new SmartFormGroup({ name: control });

render(
  <SmartProvider translations={{ MODEL: { name: 'Name' } }}>
    <SmartInputText
      options={{
        control,
        fieldKey: 'name',
        model: new TextModel(),
        treeLevel: 0,
      }}
      fieldOptions={{ type: FieldType.text }}
    />
  </SmartProvider>,
);
```

- Models are declared in the spec with `@Model({})` and `@Field({ type: FieldType.text, create: true })`.
- `SmartForm` builds its form asynchronously: after `render`, `await act(async () => undefined)` or query with `await screen.findByLabelText(…)`.
- To test the form without the real fields, register stand-ins built on `useInput(props)` through `inputFieldComponents` (`form/form.integration.spec.tsx`). To control the order in which builds settle, `jest.spyOn(FormFactory.prototype, 'create')` with deferred promises (`form/form.spec.tsx`).
- The model specs (`forms/forms.spec.ts`) let async validators settle with `const flush = () => new Promise((resolve) => setTimeout(resolve, 0));`.

## Async and timers

- `await act(async () => …)` around anything that resolves promises; `await waitFor(() => expect(…))` when the result arrives later (file uploads); `findBy…` for elements that appear.
- Debounces and delays use fake timers:

```tsx
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

it('should update the text once the debounce time has passed', () => {
  const onTextChange = jest.fn();
  const { result } = renderHook(() => useSearchbar({ onTextChange }));

  act(() => result.current.control.setValue('query'));
  act(() => jest.advanceTimersByTime(1000));

  expect(onTextChange).toHaveBeenCalledWith('query');
});
```

## `fetch` and the node environment

jsdom has no `fetch`, `Response` or `Headers`. A spec of HTTP code starts with the docblock

```ts
/**
 * @jest-environment node
 */
```

and injects its own `fetch` into the client:

```ts
const fetch = jest.fn(async () => new Response('{"a":1}', { status: 200 }));
const client = new SmartHttpClient({ fetch });

expect(await client.get('/api')).toEqual({ a: 1 });
```

Assert the request through `fetch.mock.calls[0][0]` (URL) and `fetch.mock.calls[0][1]` (`method`, `body`, `headers`). Server rendering is asserted with `renderToString` from `react-dom/server`.

## CRUD specs and HTTP

`crud-shell-react` never reaches a network:

- **Service specs** (`services/crud/crud.service.spec.ts`) run under `@jest-environment node` with a `SmartHttpClient` built on a `jest.fn` `fetch` that returns `new Response(...)`; they assert URLs, query strings, methods and the `Location` header handling.
- **Page and component specs** replace the whole REST client: a plain object of `jest.fn` methods (`getList`, `getById`, `create`, `update`, `updatePartial`, `delete`, `exportList`, …) passed to `<CrudProvider config={config} service={service as unknown as CrudService<any>}>`, inside `<SmartProvider language="eng" navigation={navigation} menuService={menuService}>`. The navigation is a fake `ISmartNavigation` whose `navigate` is a `jest.fn` that updates the current URL and notifies the listeners.
- After rendering they let the feature's reads settle:

```tsx
const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
```

- Child components with specs of their own are replaced with `jest.mock('../../components/filters/filters', () => ({ SmartCrudFilters: function MockFilters() { … } }))`, reading the context through `jest.requireActual('../../crud.context')`.
- See `pages/list/list-page.spec.tsx` (`createConfig`, `createService`, `createNavigation`, `renderPage`) and `pages/item/item-page.spec.tsx`.

## Commands

```bash
npx nx test react
npx nx test react --testPathPatterns=toggle
npx nx test crud-shell-react
npx nx test react --coverage
npx nx test docs-examples-react
```

## Agent Delegation

| Task               | Agent                      | Tell it                                                                                 |
| ------------------ | -------------------------- | --------------------------------------------------------------------------------------- |
| Write a spec first | `shared-tdd-developer`     | Testing Library + jest-dom, `fireEvent`, `SmartProvider` wrapping as above, `.spec.tsx` |
| Run the suites     | `shared-test-runner`       | `npx nx test react` / `npx nx test crud-shell-react`                                    |
| Fix a failing spec | `shared-test-fixer`        | the failure output and this skill's set-up section (jsdom vs node, async form build)    |
| Coverage           | `shared-coverage-enforcer` | `npx nx test react --coverage`                                                          |

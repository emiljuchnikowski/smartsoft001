# @smartsoft001/crud-shell-react

The React CRUD screens (Nx project `crud-shell-react`), built on `@smartsoft001/react`. The React instructions, agents and commands are in `packages/shared/react/CLAUDE.md`.

## Skills

The React skills live in `packages/shared/react/.claude/skills/` and load only once a file there is read. Before changing code here, read the one that applies:

- components, pages, stories: `packages/shared/react/.claude/skills/react-components/SKILL.md` (section "CRUD screens")
- hooks, forms, stores, provider services: `packages/shared/react/.claude/skills/react-patterns/SKILL.md`
- specs, including how they stub the REST client: `packages/shared/react/.claude/skills/react-testing/SKILL.md`

## Specifics

- Everything renders inside `<CrudProvider config={…}>` (memoised `config`) below a `SmartProvider`; read the feature with `useCrud()`, `useCrudConfig()`, `useCrudFacade()` and `useCrudState(selector)`.
- Names are `SmartCrud<Name>` / `useCrud<Name>`; the pages' bodies are swapped through the registry keys `'crud-list-page'` and `'crud-item-page'`.
- Specs describe `@smartsoft001/crud-shell-react: …` and never reach a network: `CrudService` specs inject `fetch` under `@jest-environment node`, page specs pass a `jest.fn` service to `CrudProvider`.

```bash
npx nx test crud-shell-react
npx nx lint crud-shell-react
npx nx build crud-shell-react
npx nx storybook crud-shell-react
npx nx run crud-shell-react:build-storybook -c ci
npx nx run crud-shell-react:test-storybook
```

# React libraries

Instructions for the React code of the monorepo. Claude Code loads this file when it works on files in `packages/shared/react`; `packages/crud/shell/react/CLAUDE.md` points here for the CRUD screens.

## Projects

| Nx project            | Path                        | Package                          |
| --------------------- | --------------------------- | -------------------------------- |
| `react`               | `packages/shared/react`     | `@smartsoft001/react`            |
| `crud-shell-react`    | `packages/crud/shell/react` | `@smartsoft001/crud-shell-react` |
| `react-stack`         | `packages/meta/react-stack` | `@smartsoft001/react-stack`      |
| `docs-examples-react` | `docs/examples/react`       | Executed examples of the docs    |

Stack specifics: React 19 (peer dependency), Tailwind CSS 4 with the `smart:` prefix and a class-based `dark` variant, `@nx/js:tsc` builds, Jest on jsdom with Testing Library 16 and jest-dom, Storybook 10 through `@storybook/react-vite`, DOMPurify for rendered HTML.

## Skills

The React skills live in `packages/shared/react/.claude/skills/`. They load the first time Claude reads or edits a file below `packages/shared/react`; from the CRUD screens, read the `SKILL.md` directly.

| Skill              | Use For                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| `react-components` | Add or change a component: files, registry key, presets, styling, specs, story, docs, plugin sync, checks   |
| `react-patterns`   | Controlled props, callbacks, forms, stores, provider services, stable config, server safety, lint, React 19 |
| `react-testing`    | Jest + Testing Library specs, `SmartProvider` wrapping, async forms, fake timers, HTTP stubs                |

The repository-wide skills (`test-unit`, `nx-conventions`, `docs`, `review`) apply as well.

## Agents

There are no React-specific agents. Delegate to the shared agents and pass them the React instructions from the skills (each skill has an "Agent Delegation" table):

| Agent                      | Use For                                                                    |
| -------------------------- | -------------------------------------------------------------------------- |
| `shared-tdd-developer`     | Components, hooks and services, spec first (`*.spec.tsx`, Testing Library) |
| `shared-file-creator`      | A component folder from the layout in `react-components`                   |
| `shared-test-runner`       | `npx nx test react`, `npx nx test crud-shell-react`                        |
| `shared-test-fixer`        | Failing specs                                                              |
| `shared-style-enforcer`    | `npx nx lint react`, Prettier, the `react-hooks` rules                     |
| `shared-build-verifier`    | `npx nx build react`, the Storybook build                                  |
| `shared-coverage-enforcer` | `npx nx test react --coverage`                                             |

## Commands

```bash
npx nx test react
npx nx test react --testPathPatterns=<name>
npx nx lint react
npx nx build react
npx nx storybook react
npx nx run react:build-storybook -c ci
npx nx run react:test-storybook
```

The same targets exist for `crud-shell-react`. The build publishes `README.md` and the compiled `styles.css`; this file stays in the repository.

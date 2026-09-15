---
title: Conventions
section: Contributing
order: 2
nextjs:
  metadata:
    title: Repository conventions
    description: The Nx layout, project tags, commit message format, git hooks and testing conventions every change to smartsoft001 follows.
---

The repository is an Nx monorepo of publishable libraries. The conventions below are enforced by ESLint, commitlint, husky hooks and the CI pipeline; the `nx-conventions`, `test-unit` and `angular-patterns` skills teach them to Claude Code. {% .lead %}

---

## Layout

Every library lives under `packages/` and is published as `@smartsoft001/<name>`. Feature families are split into a domain and shells:

| Directory                              | Contents                                                                                                                                                                |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/<family>/domain`             | Entities, services and rules of the `auth`, `crud` and `trans` families, framework-free.                                                                                |
| `packages/<family>/shell/dtos`         | Data transfer objects shared by the NestJS and Angular shells.                                                                                                          |
| `packages/<family>/shell/app-services` | Application services that orchestrate the domain for a use case.                                                                                                        |
| `packages/<family>/shell/nestjs`       | NestJS modules, controllers and providers.                                                                                                                              |
| `packages/<family>/shell/angular`      | Angular components, NgRx state and pages (today only `crud`).                                                                                                           |
| `packages/shared/*`                    | Cross-cutting libraries: `angular`, `nestjs`, `models`, `domain-core`, `utils`, `users`, `mongo`, the payment and third-party integrations, and the Claude Code plugin. |
| `docs/site`, `docs/examples/*`         | This documentation site and the example projects its code samples are cut from.                                                                                         |

Path aliases `@smartsoft001/<name>` in `tsconfig.base.json` point at the source of each library, so tests and examples import packages the way consumers do. Projects carry tags (`scope:crud`, `scope:auth`, `scope:trans`, `type:domain`, `type:shell`) that the module boundary lint rule uses to keep domains from depending on shells.

## Commit messages

Commits follow Conventional Commits and are checked by commitlint:

```text
<type>(<scope>): <subject>

<body, wrapped at 100 characters>

Refs: FRA-123
```

- **Types**: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `build`, `ci`, `perf`, `style`.
- **Scopes** come from `commitlint.config.js`: the top-level directories of `packages/` (`auth`, `crud`, `shared`, `trans`) plus `nx`, `github`, `docker` and `release`. There is no `angular` or `docs` scope: a change to `packages/shared/angular` is `feat(shared)`, a change to the documentation site is `docs(nx)`.
- Body lines are limited to 100 characters; the footer references the Linear issue.

## Git hooks

Husky installs two hooks:

- **`commit-msg`** runs commitlint on the message, then `nx run-many -t lint test build postbuild` across every project. It takes a few minutes and is the reason a commit that lands locally also passes CI.
- **`pre-push`** runs `nx format:check` and `nx affected` for `lint`, `test` and `build` against `origin/main`.

The pull request pipeline repeats the affected targets plus `docs:check`, and `Publish` on `main` runs them again before versioning and publishing.

## Testing

Unit tests use Jest (`nx test <project>`), live next to the code as `<name>.spec.ts` and follow the Arrange-Act-Assert pattern. The top-level `describe` names the package and the class under test:

```text
describe('@smartsoft001/angular: DataService', () => { ... })
```

Angular tests run in the zoneless `jest-preset-angular` environment with unknown elements and properties treated as errors, so a component under test must import everything its template uses. Storybook stories double as render tests: the `Docs` workflow opens every story in Chromium and fails when one throws. End-to-end tests use Playwright with page objects.

## Angular code

Components are standalone, use signals (`input()`, `output()`, `computed()`, `model()`), the built-in control flow (`@if`, `@for`) and `inject()` instead of constructor injection; change detection is `OnPush`. UI components in `@smartsoft001/angular` use the `smart` selector prefix and ship a base class, a standard implementation and, where one exists, a preset that can be registered through an injection token; see any page of the [Components](/docs/components) section for the pattern.

## Formatting

Prettier with single quotes and ESLint's flat config (`eslint.config.mjs`) with import ordering. `npm run format` (or [`/smart:format-code`](/docs/skills/format-code)) formats and auto-fixes the whole workspace; `nx format:check` is what CI runs.

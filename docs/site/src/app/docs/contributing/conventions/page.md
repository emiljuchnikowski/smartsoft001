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

## A package has to be loadable

Every suite in this repository compiles the sources. Nothing loads the artefact, so a package can be green everywhere and still be impossible to install. Five of them shipped for months emitting `export` statements from a manifest that declared CommonJS, and neither `require` nor `import` could open them.

Two checks hold the line, and a change to how a package is built has to keep both green.

`tools/scripts/package-module-format.test.mjs` runs with the rest of the Node tooling tests and needs no build. For every package compiled by `@nx/js:tsc` it reads the tsconfig through its `extends` chain and asserts the compiler emits CommonJS, that module resolution is not the bundler algorithm, and that no manifest declares itself an ES module. The Node libraries are CommonJS because a NestJS application is.

`npm run verify:dist` runs after the build, in the pull request workflow and again before the packages reach npm. It copies each built package into a throwaway `node_modules` and loads it the way a consumer would. Angular libraries are resolved rather than executed, because their entry points are bundles meant for a bundler. Meta packages are skipped, because they carry dependencies and no code.

The same script then reads the constructor metadata off a decorated class in the built output. Loading a package proves the module system is satisfied; it does not prove the package is usable. NestJS resolves a class provider's constructor from the `design:paramtypes` that TypeScript emits under `emitDecoratorMetadata`, and typeorm reads `design:type` for a column with no explicit type. Eighteen packages were built by esbuild, which does not implement that option, so every decorated class shipped without it while every suite stayed green. Anything that changes how a package is built has to keep that assertion passing, which in practice means compiling the decorated packages with `@nx/js:tsc`.

A package that genuinely cannot be loaded yet goes in that script's `KNOWN_BROKEN` map with the issue that tracks it. The map is empty today. The check also fails when an entry on the list starts working, so the list cannot go stale.

## Breaking changes ship a migration

A change that makes a consumer's code stop compiling, or stop meaning what it meant, is not finished until the release can perform it. Migrations live in `packages/meta/core`: `migrations.json` lists them, `src/migrations/<name>/` holds each one, and `@smartsoft001/core` is the package that carries them because every stack depends on it.

An entry is one of two kinds:

- **`factory`** points at a TypeScript migration that rewrites the project. Use it whenever the change can be described mechanically: a renamed export, a moved option, a split package. It takes an Nx `Tree`, and its test drives it with `createTreeWithEmptyWorkspace`.
- **`prompt`** points at a markdown file describing the change in prose. `nx migrate --run-migrations --agentic` hands it to a coding agent. Use it when a script cannot express the change, for example when the meaning of an option changed rather than its name. `tools/ai-migrations/MIGRATE_STORYBOOK_10.md` is the shape such a file takes.

Both accept a `documentation` file, shown to whoever reads the migration and given to the agent as context. The `version` of an entry is the release it first applies to, so it must be higher than the version already published.

## The example application is the definition of working

A change to a package is not finished until the example application in `docs/examples/app` builds, tests and migrates on it. The app is the smallest consumer that uses the framework end to end, and it is the first consumer of every release: the `Publish` workflow packs the built packages into tarballs, installs a standalone copy of the app from them and runs its build and its tests, then installs the same copy at the previous release from npm, switches it to the tarballs the way `nx migrate @smartsoft001/core@latest` does and runs the migrations between the two versions before building and testing again. A failure at either step stops the release before anything reaches npm.

`npm run verify:example-app` runs the same two checks locally after `nx run-many -t build`, and `--previous <version>` picks the release to migrate from. The standalone copy comes from `tools/scripts/example-app-standalone.mjs`, which is also how to reproduce a consumer's workspace by hand.

## Formatting

Prettier with single quotes and ESLint's flat config (`eslint.config.mjs`) with import ordering. `npm run format` (or [`/smart:format-code`](/docs/skills/format-code)) formats and auto-fixes the whole workspace; `nx format:check` is what CI runs.

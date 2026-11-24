---
title: Upgrading
section: Getting started
order: 5
nextjs:
  metadata:
    title: Upgrading
    description: How to move a project to a newer version of the framework, what the migrations do for you and what is left to check by hand.
---

Every `@smartsoft001/*` package is released at the same version, so a project moves the whole set at once. Two commands do it: one fetches the new versions, the other runs whatever the release needs done to your code. {% .lead %}

---

## The two commands

```bash
npx nx migrate @smartsoft001/core@latest
npx nx migrate --run-migrations
```

The first rewrites the versions in `package.json`, installs them and writes a `migrations.json` in the project root listing what the release wants to change. The second runs those changes and deletes the file. Review the diff between the two commands, as with any other `nx migrate`.

`@smartsoft001/core` is the package to name because it carries the migrations, and every stack depends on it, so a project that installed a stack already has it. The migrations cover the whole family: they are written against what a project's code looks like, not against one package.

{% callout type="warning" title="A project that installs packages one by one" %}
`nx migrate` can only migrate a package the project depends on. A project that lists the libraries individually has no `@smartsoft001/core`, and the command answers `No packages to migrate` without doing anything. Add it once:

```bash
npm install @smartsoft001/core@latest
```

The first migration then folds those individual entries into the stack that covers them, and every release after that works with the two commands above.
{% /callout %}

{% callout title="A project without Nx" %}
`ng update @smartsoft001/core` reads the same file and runs the same migrations through the Angular CLI. A project with neither reads [what each release changed](https://github.com/emiljuchnikowski/smartsoft001/blob/main/CHANGELOG.md) and applies it by hand; the migrations are plain TypeScript and their source is in the package, under `src/migrations`.
{% /callout %}

## What a migration can do

A release ships two kinds, and `nx migrate` runs both:

- **Mechanical changes** are code: a script that walks the project and rewrites what moved. A renamed export, a changed option name, a package that split in two. These are deterministic and you can read exactly what they did in the diff.
- **Changes that need judgement** are a description rather than a script. Nx hands the description to a coding agent when you run the migrations with `--agentic`, and it works through the project the way a person would. This is for the cases a script cannot express: an option whose meaning changed, a pattern replaced by a different pattern.

Without `--agentic`, the second kind is listed and skipped, so nothing happens behind your back. What it would have changed is in the release notes.

## After the migration

Run the project's own checks. The framework's packages are peer dependencies of your application, so a migration that leaves something behind shows up as a type error or a failing test rather than at runtime:

```bash
npx nx run-many -t lint test build
```

If a migration did something you did not want, the change is in your working tree and nowhere else: `git checkout` the file and the release notes tell you what it was trying to do.

## Moving to NestJS 12

The first release after 2.209.0 raises the backend packages to NestJS 12: every `@nestjs/*` peer dependency of `@smartsoft001/nestjs`, the `*-shell-nestjs` and `*-shell-app-services` packages, the domain packages and the payment and login integrations is now `^12`. Next to NestJS 11 npm reports a peer conflict for them, and refuses the install outright for a package the project names directly, so raise NestJS in the same step as the framework, before the install:

```bash
npm install @nestjs/common@^12 @nestjs/core@^12 @nestjs/platform-express@^12 \
  @nestjs/axios@^12 @nestjs/jwt@^12 @nestjs/passport@^12 @nestjs/typeorm@^12
npm install -D @nestjs/testing@^12
```

List only the `@nestjs/*` packages your project already has, and add `@nestjs/websockets@^12` if it does. The [NestJS migration guide](https://docs.nestjs.com/migration-guide) is the full list of changes; in a project built on this framework four of them need a look:

- **Jest.** NestJS 12 ships ES modules only. Node loads them from CommonJS code on its own, but Jest needs `NODE_OPTIONS=--experimental-vm-modules` for every test project that reaches NestJS. In an Nx workspace set it as an `env` option of the Jest plugin's `test` target, for the backend projects only: an Angular project with the flag loads Angular's `.mjs` files without the `jest-preset-angular` transform and fails.
- **`@Optional()` in a subclass.** A subclass that redeclares its constructor no longer inherits `@Optional()` from the base class, and Nest refuses to start instead of injecting `undefined`. A subclass of `CrudController` that passes the `SharedConfig` on declares it as `@Optional() @Inject(SharedConfig)` itself.
- **Logging.** A plain object passed to `Logger` after the message becomes structured parameters instead of being printed as text. Create the application with `logger: new ConsoleLogger({ structuredParams: false })` to keep the NestJS 11 output.
- **Error responses.** The core and the Express adapter map errors differently. The framework's `AppExceptionFilter` sets the status and body itself, so responses that go through it are unchanged; check the ones that do not.

## Moving to ESLint 10

The framework's packages ship no ESLint configuration and have no peer dependency on ESLint, so a release does not make a project change its linter. A project started from one of the [starters](/docs/example-app) or the `scaffold-nx-workspace` skill owns an `eslint.config.mjs` written against ESLint 9 and `eslint-plugin-import`; the starters and the skill now write it for ESLint 10. To move an existing project the same way:

```bash
npm uninstall eslint-plugin-import
npm install -D eslint@^10 @eslint/js@^10 eslint-plugin-import-x
```

- **The import plugin.** `eslint-plugin-import` supports ESLint up to 9. Import `eslint-plugin-import-x` instead, register it as `'import-x': importX` and rename the rule to `import-x/order`; its options are the same. It sorts a parent import (`../`) before a sibling (`./`), the opposite of `eslint-plugin-import`, so run `npx nx run-many -t lint --fix` once to reorder them.
- **`@eslint/js`.** ESLint 10 no longer installs it, and `@nx/eslint-plugin` loads it, so it is a dev dependency of its own.
- **New recommended rules.** `no-useless-assignment` reports an initial value that every branch overwrites (declare the variable without one) and `preserve-caught-error` reports an error rethrown without its cause (pass `{ cause: error }`).

The [ESLint migration guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0) has the rest; a flat config needs nothing else.

## TypeScript 7

The framework stays on TypeScript 6.0. Angular 22 supports TypeScript `>=6.0.0 <6.1.0` ([Angular version compatibility](https://angular.dev/reference/versions)): `@angular/compiler-cli`, `@angular/build` and `ng-packagr` declare that range and build on the programmatic compiler API, which TypeScript 7.0 does not ship. `typescript-eslint` needs the same API and accepts TypeScript below 6.1. The packages have no peer dependency on TypeScript, so a project picks its own version, but an Angular project cannot build on 7.0.

Nx describes a side-by-side setup, with TypeScript 7.0 as the `tsc` executable and 6.0 behind the `typescript` name for the tools that need the API ([TypeScript 7 in Nx](https://nx.dev/docs/kb/typescript-7)). It speeds up type checking only, and the framework does not use it. The framework moves to TypeScript 7 when Angular supports it.

## Angular 22.3 and Nx 24

The framework runs on Angular 22.3, and its peer dependencies (`^22.1.3`) accept it. The CLI and build tools stay on 22.2: `@angular-devkit/architect` 0.2203, which comes with `@angular/cli`, `@angular/build` and `@angular-devkit/build-angular` 22.3, no longer exports the `node/index` path that Nx 24 loads, so every Nx command that runs an Angular builder fails with "Package subpath './node/index' is not defined by "exports"". In an Nx workspace keep `@angular/cli`, `@angular/build`, `@angular-devkit/*` and `@schematics/angular` on 22.2.7, and pin `@angular-devkit/architect` to `0.2202.7` as a dev dependency if another package (Storybook, for one) would hoist 0.2203. `@angular/core`, the other runtime packages and `@angular/compiler-cli` can move to 22.3.

## Staying on one version

The packages are pinned to each other exactly, so a project cannot end up with two of them on different versions through the stacks. If you install packages individually, keep them in lockstep: [`angular-stack`](/docs/packages/angular-stack) and its siblings exist to make that automatic.

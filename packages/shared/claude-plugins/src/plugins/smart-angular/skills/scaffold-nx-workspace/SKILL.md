---
name: scaffold-nx-workspace
description: Scaffold a generic base Nx + Angular SSR workspace in smartsoft001 style by wrapping create-nx-workspace and patching configs. Use whenever the user wants to bootstrap, scaffold, initialize, or set up a NEW smartsoft Nx monorepo / Angular SSR app workspace, or asks for the "podstawowa konfiguracja nx" / base workspace config. Scaffolds ONLY the generic toolchain plus a base SSR app and a base shared lib — no feature modules and no feature npm packages.
user-invocable: true
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, AskUserQuestion
---

# Scaffold Nx Workspace

Bootstrap a base Nx + Angular SSR monorepo in smartsoft001 style: wrap `create-nx-workspace`,
then patch the generated files to the conventions below. The result is a **buildable empty
shell** — one SSR app (`apps/web`) and one shared lib (`libs/shared/angular`) — ready for the
feature-module skills to extend.

## Conventions (nx build & architecture only)

This skill enforces only the build and architecture conventions.

- **Toolchain:** npm + Nx + an Angular SSR app built with `@angular/build:application` (esbuild),
  `outputMode: server`; Jest (jest-preset-angular, zoneless env) for unit tests, Playwright for e2e.
  **Versions are never hardcoded** — the Angular version is inferred from the installed
  `@smartsoft001/angular` library, confirmed with the user, and Nx / Node / the rest are derived to
  match (see Step 1).
- **Caching / affected:** `targetDefaults` cache `build`; `lint` and `test` are inferred and cached by
  the `@nx/eslint/plugin` and `@nx/jest/plugin` (Nx 24 removed the `@nx/eslint:lint` and `@nx/jest:jest`
  executors); `nx.json` sets `defaultBase` for `nx affected`. No Nx Cloud binding.
- **Lint / format:** ESLint flat config (`eslint.config.mjs`) with `import-x/order` + an `@<prefix>/**`
  pathGroup; Prettier (`singleQuote`); husky + commitlint (conventional commits, scopes from `libs/`).
- **Layout:** monorepo with `apps/` (the SSR `web` app) and `libs/`. Shared lib at `libs/shared/angular`,
  aliased `@<prefix>/angular`. Feature code lives in separate libs (`libs/<feature>/...`) added by the
  module skills — never here.
- **Style:** `scss` everywhere — the app, generated libs, and generated components all default to `scss`.
- **SSR runtime env:** `EnvironmentService` (in the shared lib) + a `/env.js` endpoint + an `env-init.ts`
  imported first in `main.server.ts`.

## Scope

**Scaffolds:** workspace config (nx / tsconfig / eslint / jest / prettier / husky / commitlint / `.nvmrc`),
the `apps/web` SSR shell, the `libs/shared/angular` skeleton, a generic `.claude` baseline, and toolchain
`package.json` deps.

**Hard boundary — does NOT scaffold:** feature modules / domains, feature npm packages, or module-coupled
components. Stop at the buildable shell and defer those to the feature-module skills.

## When to use / not use

- **Use for:** bootstrapping a new smartsoft Nx / Angular-SSR workspace, "podstawowa konfiguracja nx", a no-modules skeleton.
- **Not for:** adding a feature lib/module (→ module skills), adding feature deps, reconfiguring an existing
  workspace's lint/format (→ `/smart-core:format-code`), or component API questions (→ `smart-angular:angular-components-*`).

## Steps

1. **Resolve & confirm versions** — the Angular version anchors everything else (see
   `references/version-resolution.md`):
   - Detect the Angular version `@smartsoft001/angular` targets:
     `npm view @smartsoft001/angular peerDependencies.@angular/core` (fall back to
     `dependencies.@angular/core`; or read its installed `package.json`). Take `<NG_VERSION>` / `<NG_MAJOR>`.
   - Confirm with `AskUserQuestion`: "Use Angular `<NG_VERSION>` (matches @smartsoft001/angular)? — or type another version."
   - Derive the rest: `<NX_LINE>` = `^<NX_MAJOR>`, the latest stable Nx major that supports `<NG_VERSION>` per the Nx Angular/Nx version matrix (https://nx.dev/docs/kb/angular-nx-version-matrix; e.g. Angular 22.2 → Nx ≥ 24.0.0, so `^24` — not "Angular major + 1"; resolve with `npm view nx version` and check `<NG_VERSION>` against `npm view "@nx/angular@^<NX_MAJOR>" peerDependencies.@angular/build`); `<NODE_VERSION>` = an LTS within `@angular/core@<NG_VERSION>` `engines.node`. Everything else is whatever `create-nx-workspace@<NX_LINE>` installs — not pinned.
2. **Prefix** — run `scripts/derive-prefix.sh <folder>`, present the candidate via `AskUserQuestion`,
   require confirm/override. Hold as `<PREFIX>` (threaded into tsconfig paths, eslint, imports, package names).
3. **Base branch** — confirm `<BASE_BRANCH>` for `nx.json` `defaultBase` + husky pre-push (default `origin/development`).
4. **Create** — run:
   ```bash
   env -u CLAUDECODE -u CLAUDE_CODE npx --yes create-nx-workspace@<NX_LINE> <name> \
     --preset=angular-monorepo --appName=web --style=scss --ssr \
     --e2eTestRunner=playwright --unitTestRunner=jest \
     --packageManager=npm --nxCloud=skip --interactive=false
   ```
   Use `--interactive=false` (not `--no-interactive`); `--nxCloud=skip`; no `--bundler` (Angular's builder
   is esbuild by default). Unset `CLAUDECODE` / `CLAUDE_CODE` for this command: when they are set,
   `create-nx-workspace` switches to AI-agent mode and replaces `--preset=angular-monorepo` with the
   `nrwl/angular-template` GitHub template, which ignores `--appName`, `--ssr` and `--unitTestRunner`
   (shop/api apps, Vitest). Then verify the build executor is `@angular/build:application`, that
   `nx.json` registers `@nx/eslint/plugin` and `@nx/jest/plugin`, and if the bundled Angular differs
   from `<NG_VERSION>`, align `@angular/*` in Step 5.
5. **Patch config** — apply `references/patch-delta.md`, threading `<PREFIX>` / `<BASE_BRANCH>` / `<NG_VERSION>` / `<NODE_VERSION>`.
6. **App + lib** — patch `apps/web` per `references/base-app.md`; generate then patch `libs/shared/angular`
   per `references/base-shared-lib.md`.
7. **.claude baseline** — write per `references/base-claude-config.md`.
8. **Install (gated)** — ask before `npm install`; skip during self-validation.
9. **Verify** — run `scripts/verify-scaffold.sh <name> <PREFIX>`; fix and re-run until it passes.

## Notes

- Prerequisites: nvm + npm and an empty target directory. The Node version is derived in Step 1
  (`.nvmrc` ← `<NODE_VERSION>`), not fixed by this skill.
- Bundled `references/` + `scripts/` ship automatically (the whole `src/plugins/**` tree is copied to dist).
  Do NOT hand-edit `plugin.json` version — it is auto-synced at build time.

## Reference implementation

This skill scaffolds an SSR shell, while the example application under `docs/examples/app` is a non-SSR consumer, so it shows the finished shape of a workspace's apps and libs and not the SSR runtime pieces.

- `docs/examples/app/apps/web/project.json`: an Angular application project on `@angular/build:application` with `build` and `serve` targets and `scope` and `type` tags; its `lint` and `test` targets are inferred by `@nx/eslint/plugin` and `@nx/jest/plugin`, with `lint` only narrowing the file pattern.
- `docs/examples/app/apps/api/project.json` with `docs/examples/app/apps/api/webpack.config.js`: the NestJS application beside it. Its `build` target is inferred by `@nx/webpack/plugin` from `webpack.config.js`, which uses `NxAppWebpackPlugin` (`target: 'node'`, `compiler: 'tsc'`, `generatePackageJson`) and writes a CommonJS bundle (`output.library.type: 'commonjs'`) into `dist/`; `project.json` only adds the outputs and the `development` and `production` configurations, and `serve` runs that build with `@nx/js:node`. Nx 24 removed the `@nx/webpack:webpack` executor.
- `docs/examples/app/libs/model/project.json`: a shared library project with a `build` target and inferred `lint` and `test` targets, the role `libs/shared/angular` plays in a scaffolded workspace.
- `docs/examples/app/libs/model/src/index.ts`: the barrel the workspace alias `@app/model` in `tsconfig.base.json` points at, the same mechanism as the `@<prefix>/angular` alias this skill sets up.
- `docs/examples/app/apps/web/eslint.config.mjs`: the flat ESLint config of one app, extending the workspace config and giving the app's own alias the position the `@<prefix>/**` path group takes in a scaffolded workspace.
- `docs/examples/app/apps/web/jest.config.ts`: Jest on `jest-preset-angular` with a `test-setup.ts`, the unit test setup this skill configures.

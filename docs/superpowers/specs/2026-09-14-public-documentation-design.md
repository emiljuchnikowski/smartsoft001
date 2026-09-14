# Public documentation site — design

Date: 2026-09-14
Status: approved (design), implementation tracked in Linear (team Framework)
Linear: parent FRA-354; sub-issues FRA-355 (skeleton), FRA-356 (tooling), FRA-357 (getting started),
FRA-358 (packages + CRUD), FRA-359 (components), FRA-360 (skills + contributing), FRA-361 (docs skill).
Template source: Tailwind Plus "Syntax" zip supplied by the repo owner (licensed, not in git until step 1).

## Goal

A public, English documentation site for the whole `@smartsoft001/*` framework that:

1. documents every publishable package and every UI component available to users,
2. explains installation,
3. explains how to use the Claude Code skills shipped with the framework,
4. contains **no hand-written code samples** — every code block on a package or component
   page is cut from a file that CI compiles and runs,
5. stays current automatically: the push that publishes a package also rebuilds the site,
   and CI fails when a package, component or skill has no page or a snippet reference is stale.

Template: **Tailwind Plus "Syntax"** (Next.js 16 App Router + Markdoc + Tailwind 4 + FlexSearch),
TypeScript variant. Hosting: **GitHub Pages** via a new `docs.yml` workflow.

## 1. Layout in the repo

```
docs/
  site/                  Nx project "docs" — the Syntax template, its own npm workspace
  examples/
    angular/             Nx project "docs-examples-angular" — tsc + Jest (jsdom, jest-preset-angular)
    node/                Nx project "docs-examples-node"    — tsc + Jest (node: NestJS, domain, utils, payments)
    install/             install.sh — run by CI in an empty temp dir (installation smoke test)
  superpowers/specs/     design specs (this file)
tools/scripts/
  docs-check.mjs         parity + snippet validation, fast, no Next build (target "check" on project "docs")
.github/workflows/
  docs.yml               build + deploy to GitHub Pages
```

- Root `package.json` `workspaces` gains `docs/*` so npm installs Next/React for the docs
  workspace without touching Angular/NestJS package configuration.
- Project `docs` uses `nx:run-commands` (`next dev --webpack`, `next build --webpack`), **not**
  `@nx/next`. `nx affected` sees it; nothing else in the workspace changes behaviour.
- Static export: `output: 'export'`, `basePath: '/smartsoft001'`, `images.unoptimized: true`.
  The template's search loader depends on webpack, so builds keep the `--webpack` flag.

Known risk (verify in step 1): the template pins TypeScript ^5.8, the repo has 6.0.3 hoisted.
If `next build` fails on TS 6, `docs/site` gets its own nested TypeScript dependency.

Licence: the Tailwind Plus licence allows open-source end products that are not themselves
templates. A framework documentation site qualifies. The template source will live in a
public repo as part of that end product.

## 2. Executable-code mechanism (the core)

Rules:

- Every code block on a **Packages** or **Components** page comes from a file CI compiles and
  tests. Hand-written fences are allowed only for `bash` and `json`. `docs-check` enforces it.
- Markdoc tag `{% snippet file="angular/button/basic.example.ts" region="usage" /%}`
  (optional `lang="html"` override). Implemented as a webpack loader that runs **before** the
  Markdoc loader, in the same style as the template's `src/markdoc/search.mjs`. It cuts the
  region between `// #region <name>` and `// #endregion` (also `<!-- #region -->` for HTML),
  strips the markers, dedents, and emits a fenced block whose language is derived from the
  file extension. A missing file or region throws and fails the build.
- Example files live in `docs/examples/{angular,node}/src/**/*.example.ts` and are written the
  way a framework user would write them (imports from `@smartsoft001/*` via tsconfig paths).
  Each has a sibling `*.example.spec.ts` that executes it: Angular examples mount the
  component/standalone config with TestBed and assert it renders; NestJS examples boot the
  module with `Test.createTestingModule` and resolve the provider.
- Installation: `docs/examples/install/install.sh` creates an empty project in a temp dir and
  installs every published `@smartsoft001/*` package. The docs workflow runs it before the site
  build. Commands on the Installation page are regions of that script; provider/module wiring
  snippets come from the angular/node examples.
- Storybook: the docs workflow builds both Storybooks (`angular`, `crud-shell-angular`) and
  copies them to `out/storybook/<project>/`. Tag
  `{% storybook project="angular" story="components-button--primary" /%}` renders an iframe
  (`storybook/<project>/iframe.html?id=<story>&viewMode=story`) so each component page shows a
  compiled usage snippet **and** a live rendering on the same host.

## 3. Content and sources

| Section | Pages | Prose source | Code source |
|---|---|---|---|
| Getting started | intro, installation, architecture (domain / shell / app-services) | hand-written, EN | `examples/install`, `examples/angular`, `examples/node` |
| Packages | 23, one per alias in `tsconfig.base.json` | rewritten from package READMEs | `docs/examples/*` |
| Components | 55 | **generated at build time from `SKILL.md`** of `angular-components-*` skills | `usage` region from `*.stories.ts` + Storybook embed |
| CRUD | list/item pages, filters, export, groups, multiselect | skill `smart-crud` + crud-shell-angular README | `examples/angular/crud`, `examples/node/crud` |
| Skills | plugin install, every `user-invocable: true` skill, agent `angular-components`, hooks | SKILL.md frontmatter (name, description) + hand-written usage | command names verified by parity |
| Contributing | commit, plan, impl, push, review, Nx conventions, testing | `.claude/skills/*/SKILL.md` + CONTRIBUTING.md | none |

Components in v1 take their prose from `SKILL.md` (already English API docs with input and
token tables), so skills and docs share one source and cannot drift. Because code in
`SKILL.md` is hand-written, every component page additionally gets a mandatory **Usage**
snippet cut from the component's stories, which CI compiles via `build-storybook`.
Full single-sourcing (snippet tags inside `SKILL.md`, expanded during the plugin build) is
deferred to v2 because it changes the plugin authoring workflow.

Per-page frontmatter (Markdoc): `title`, `section`, `order`, `package` (for parity),
`nextjs.metadata.description`.

## 4. Navigation and search

The template keeps navigation in a hand-written array (`src/lib/navigation.ts`). It is replaced
by a generated file produced from the page tree and frontmatter (`section`, `order`) in a
pre-build step; a new page appears in the menu automatically. Section order is fixed:
Getting started, Packages, Components, CRUD, Skills, Contributing.
FlexSearch indexes at build time and works unchanged after static export.

## 5. Staying current

1. `docs.yml` on push to `main`: `nx affected -t check test build` for the docs projects,
   `install.sh`, `build-storybook` for both projects, `next build` (static export), deploy with
   `actions/upload-pages-artifact` + `actions/deploy-pages`. Concurrency group `pages`.
2. `docs-check` runs in `pull-request.yml` and `publish.yml`:
   - every alias in `tsconfig.base.json` has `docs/site/src/app/docs/packages/<name>/page.md`,
   - every `angular-components-*` skill has a component page,
   - every `user-invocable: true` skill (plugin and `.claude/skills`) has a page,
   - every `{% snippet %}` points at an existing file and region,
   - every `{% storybook %}` story id exists in the built `index.json` (when present),
   - no hand-written `ts`/`html` fences under `packages/` and `components/`,
   - every page appears in generated navigation.
3. Contributor skill `docs` in `.claude/skills`: on adding a package, component or skill it
   scaffolds the page and example file from templates; `docs-check` enforces it was done. The
   existing `angular-components` skill invokes it so creating a component includes its docs.

## 6. Testing the tooling itself

- Snippet loader and navigation generator: Jest tests in project `docs` (region found; missing
  region throws; language from extension; `lang` override; dedent).
- `docs-check`: one test per rule with fixture trees.
- CI smoke test: the static export contains `index.html` for every navigation entry.

## 7. Implementation order (one PR each, green CI, site live from step 1)

1. **Skeleton**: `docs/site` from Syntax, static export config, `docs.yml`, empty intro page.
   Done when the site deploys to GitHub Pages.
2. **Tooling**: snippet loader, `docs/examples/*` projects, `docs-check`, navigation generator,
   tests for all three.
3. **Getting started + Installation** with `install.sh` in CI.
4. **Packages** (23) in order: models, domain-core, utils, angular, crud-*, auth-*, trans-*,
   nestjs, mongo, users, paypal, payu, paynow, revolut, fb, google.
5. **Components** (55): generator from `SKILL.md`, usage regions in stories, Storybook embeds.
6. **Skills + Contributing**.
7. **Contributor skill `docs`** and hook-up to `angular-components`.

## Out of scope (v1)

- TypeDoc/Compodoc API reference.
- Snippet tags inside plugin `SKILL.md` files (v2).
- Versioned documentation (one version: `main`).
- Translations of the site.

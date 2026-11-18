# Version resolution

Versions are **never hardcoded**. The Angular version is the anchor; everything else is derived
from it. Resolve it at run time so a scaffold always matches the smartsoft library it integrates with.

Placeholders produced here and consumed by the other references:

- `<NG_VERSION>` — the confirmed Angular version (e.g. `22.2.2`).
- `<NG_MAJOR>` — its major (e.g. `22`).
- `<NX_LINE>` — the Nx version range to scaffold with (e.g. `^24`).
- `<NODE_VERSION>` — the Node version for `.nvmrc` (e.g. `24.5.0`).

## 1. Detect the Angular version the smartsoft library targets

The scaffolded app consumes `@smartsoft001/angular`, so its Angular peer range is the source of truth.

```bash
# Preferred: the declared Angular peer range
npm view @smartsoft001/angular peerDependencies.@angular/core
# Fallbacks
npm view @smartsoft001/angular dependencies.@angular/core
# If installed locally in the current environment, read it directly:
node -p "(p=>p.peerDependencies?.['@angular/core']||p.dependencies?.['@angular/core'])(require('@smartsoft001/angular/package.json'))"
```

Resolve the range to a concrete version and take its major:

```bash
# highest published Angular matching the detected range, e.g. ^22.1.3 -> 22.2.x
npm view "@angular/core@<detected-range>" version | tail -1
```

→ `<NG_VERSION>`, `<NG_MAJOR>`.

> If `@smartsoft001/angular` cannot be resolved (offline / not published), ask the user for the
> Angular version outright — never fall back to a baked-in number.

## 2. Confirm with the user

Use `AskUserQuestion`:

> "Use Angular `<NG_VERSION>` (matches `@smartsoft001/angular`)? — or type another version."

Whatever the user confirms becomes `<NG_VERSION>` / `<NG_MAJOR>`. If they override to a different
major, all derived values below recompute from the new major.

## 3. Derive the rest from the Angular version

- **Nx line `<NX_LINE>` = `^<NX_MAJOR>`, the latest stable Nx major that supports `<NG_VERSION>`.**
  Source: the Nx documentation's Angular/Nx version matrix,
  <https://nx.dev/docs/kb/angular-nx-version-matrix> (checked 2026-11-18). It states that the latest Nx
  release supports Angular's actively supported versions (current and LTS), recommends the latest Nx
  for them, and gives the minimum Nx per Angular minor:

  | Angular   | Nx (range)          |
  | --------- | ------------------- |
  | `~22.2.0` | `>=24.0.0 <=latest` |
  | `~22.1.0` | `>=23.2.0 <=latest` |
  | `~22.0.0` | `>=23.1.0 <=latest` |
  | `~21.2.0` | `>=22.6.0 <=latest` |

  So the Nx major is **not** "Angular major + 1": Angular 22.2 needs Nx 24, which is what this
  framework uses (Angular 22.2, Nx 24.0.6). Resolve it at run time:

  ```bash
  npm view nx version                                          # latest stable, e.g. 24.0.6 -> <NX_MAJOR> = 24
  npm view "@nx/angular@^<NX_MAJOR>" peerDependencies.@angular/build | tail -1   # e.g. >= 20.0.0 < 23.0.0
  ```

  `<NG_VERSION>` must fall inside that `@angular/build` peer range **and** the matrix row for its
  minor must allow the resolved Nx. If the latest Nx no longer supports `<NG_VERSION>` (an Angular
  older than the current LTS), take the highest Nx major whose matrix range and `@nx/angular` peer
  range both cover it.

  `create-nx-workspace@<NX_LINE>` then scaffolds the matching Angular line and a compatible
  jest / eslint / typescript / playwright / swc / esbuild toolchain. **Do not pin those** — keep
  whatever the generator installs.

- **Node `<NODE_VERSION>`** = a Node LTS within Angular's engine range:

  ```bash
  npm view "@angular/core@<NG_VERSION>" engines.node
  ```

  Pick the highest LTS that satisfies the range (e.g. `^20.19 || ^22.12 || ^24` → `24.5.0`). Write it
  to `.nvmrc`.

- **`@angular/*` alignment.** If the Angular version `create-nx-workspace` installed differs from the
  confirmed `<NG_VERSION>`, set all Angular packages to `<NG_VERSION>` in the patch step:
  `@angular/{core,common,compiler,forms,platform-browser,platform-server,router}`, `@angular/ssr`,
  `@angular/cli`, `@angular/build`, `@angular/compiler-cli`, `@angular/language-service`, and `ng-packagr`
  (resolve `ng-packagr`'s matching version with `npm view "ng-packagr@^<NG_MAJOR>" version | tail -1`).

- **`@smartsoft001/claude-plugins`** devDep (so the `.claude` hooks resolve) = the version of the plugin
  that is currently providing this skill (`npm view @smartsoft001/claude-plugins version`, or the locally
  installed one) — not a fixed number.

## Summary

The only thing this skill decides is the _shape_ (which packages, which conventions). The _numbers_
come from `@smartsoft001/angular` + the Nx documentation's Angular/Nx version matrix + Angular's own engine range, all at
run time.

# Version resolution

Versions are **never hardcoded**. The Angular version is the anchor; everything else is derived
from it. Resolve it at run time so a scaffold always matches the smartsoft library it integrates with.

Placeholders produced here and consumed by the other references:

- `<NG_VERSION>` — the confirmed Angular version (e.g. `21.2.4`).
- `<NG_MAJOR>` — its major (e.g. `21`).
- `<NX_LINE>` — the Nx version range to scaffold with (e.g. `^22`).
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
# highest published Angular matching the detected range, e.g. ^21.0.0 -> 21.2.4
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

## 3. Derive the rest from the Angular major

- **Nx line `<NX_LINE>` = `^<NG_MAJOR + 1>`.** Nx's major tracks Angular's major + 1
  (Angular 21 → Nx 22, Angular 20 → Nx 21, Angular 19 → Nx 20, …). Verify the line resolves:

  ```bash
  npm view "nx@<NX_LINE>" version | tail -1
  ```

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
come from `@smartsoft001/angular` + the Nx/Angular alignment rule + Angular's own engine range, all at
run time.

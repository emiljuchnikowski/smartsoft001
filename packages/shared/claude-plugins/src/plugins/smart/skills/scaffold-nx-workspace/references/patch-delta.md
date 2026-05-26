# Patch delta — workspace config

Apply these after `create-nx-workspace`. Substitute placeholders everywhere:

- `<PREFIX>` — confirmed import-alias prefix.
- `<BASE_BRANCH>` — confirmed base branch (default `origin/development`).
- `<WORKSPACE_NAME>` — the workspace folder/name.
- `<NG_VERSION>` / `<NODE_VERSION>` — resolved in `references/version-resolution.md` (never hardcoded).

All content below is the **generic, feature-stripped** baseline. Version numbers are not pinned here —
they come from the version-resolution step.

---

## `nx.json` (overwrite)

Drop `nxCloudId`. Set `defaultBase` to `<BASE_BRANCH>`.

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "defaultBase": "<BASE_BRANCH>",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/.eslintrc.json",
      "!{projectRoot}/eslint.config.mjs",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json",
      "!{projectRoot}/jest.config.[jt]s",
      "!{projectRoot}/src/test-setup.[jt]s",
      "!{projectRoot}/test-setup.[jt]s",
      "!{projectRoot}/**/*.spec.[jt]s?(x)",
      "!{projectRoot}/playwright.config.[jt]s"
    ],
    "sharedGlobals": ["{workspaceRoot}/.github/workflows/ci.yml"]
  },
  "targetDefaults": {
    "@angular/build:application": {
      "cache": true,
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"]
    },
    "@nx/eslint:lint": {
      "cache": true,
      "inputs": [
        "default",
        "{workspaceRoot}/.eslintrc.json",
        "{workspaceRoot}/.eslintignore",
        "{workspaceRoot}/eslint.config.mjs"
      ]
    },
    "@nx/jest:jest": {
      "cache": true,
      "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"],
      "options": { "passWithNoTests": true },
      "configurations": { "ci": { "ci": true, "codeCoverage": true } }
    }
  },
  "plugins": [
    { "plugin": "@nx/eslint/plugin", "options": { "targetName": "lint" } }
  ],
  "generators": {
    "@nx/angular:application": {
      "e2eTestRunner": "playwright",
      "linter": "eslint",
      "style": "scss",
      "unitTestRunner": "jest"
    },
    "@nx/angular:library": { "linter": "eslint", "unitTestRunner": "jest" },
    "@nx/angular:component": { "style": "scss" }
  }
}
```

> Everything defaults to `scss` — the app, generated libs, and generated components — so styling
> is consistent workspace-wide.

---

## `tsconfig.base.json` (overwrite)

Keep `compilerOptions`; replace `paths` with a **single generic** entry. NO module paths.

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "bundler",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "esModuleInterop": true,
    "importHelpers": true,
    "target": "es2022",
    "module": "es2022",
    "lib": ["es2020", "dom"],
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@<PREFIX>/angular": ["libs/shared/angular/src/index.ts"]
    }
  },
  "exclude": ["node_modules", "tmp"]
}
```

---

## `eslint.config.mjs` (overwrite)

Thread `<PREFIX>` into the `import/order` `pathGroups`. Keep the storybook block (the base
shared lib ships `.storybook`).

```js
// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import nx from '@nx/eslint-plugin';
import importPlugin from 'eslint-plugin-import';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    plugins: {
      import: importPlugin,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['external', 'builtin', 'internal'],
          pathGroups: [
            {
              pattern: '@<PREFIX>/**',
              group: 'external',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: [],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
  ...storybook.configs['flat/recommended'],
];
```

---

## `jest.preset.js` (overwrite)

```js
const nxPreset = require('@nx/jest/preset').default;

module.exports = { ...nxPreset };
```

## `jest.config.ts` (overwrite)

```ts
import { getJestProjectsAsync } from '@nx/jest';

export default async () => ({
  projects: await getJestProjectsAsync(),
});
```

---

## `.prettierrc` (overwrite)

```json
{
  "singleQuote": true
}
```

## `.prettierignore` (overwrite — generic lines only)

```
# Add files here to ignore them from prettier formatting
/dist
/coverage
/.nx/cache
/.nx/workspace-data
/.cache

CHANGELOG.md
CONTRIBUTING.md
README.md

.angular

# index.html may contain meta tags prettier cannot parse
apps/web/src/index.html
```

## `.editorconfig` (overwrite)

```
# Editor configuration, see http://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
max_line_length = off
trim_trailing_whitespace = false
```

## `.eslintignore` (overwrite)

```
node_modules
**/tailwind.config.js
```

## `.nvmrc` (overwrite)

Write the resolved `<NODE_VERSION>` (from `references/version-resolution.md`):

```
<NODE_VERSION>
```

---

## `commitlint.config.js` (create — generic as-is)

Reads `libs/` directory names for `scope-enum`; fully generic.

```js
const fs = require('fs');
const path = require('path');

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': async () => {
      return [
        2,
        'always',
        [
          ...getDirectories(path.join(__dirname, 'libs')).filter(
            (name) => name.indexOf('-e2e') === -1,
          ),
          'nx',
          'github',
          'docker',
          'release',
        ],
      ];
    },
  },
};
```

---

## `.husky/` hooks

Initialize husky (`npx husky install`) then create:

### `.husky/commit-msg`

> Reference runs `... lint test build postbuild`. **Drop `postbuild`** (no such target in a fresh scaffold).

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
npx nx run-many -t lint test build
```

### `.husky/pre-push` (thread `<BASE_BRANCH>`)

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

[ -n "$CI" ] && exit 0

npx nx format:check

npx nx affected --target=lint --base=<BASE_BRANCH> --head=HEAD --parallel=3
npx nx affected --target=test --base=<BASE_BRANCH> --head=HEAD --parallel=3
npx nx affected --target=build --base=<BASE_BRANCH> --head=HEAD --parallel=3
```

### `.husky/post-merge`

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

nvm use 24
npm i
```

---

## `package.json`

### Name + scripts

```json
{
  "name": "@<PREFIX>/source",
  "scripts": {
    "start": "nx serve web",
    "start:prod": "nx serve web --configuration=production",
    "postinstall": "husky install",
    "format": "nx format && nx run-many --target=lint --fix"
  }
}
```

> Omit the reference's `"update"` script (project-specific tooling).

### devDependencies — add the smart plugin + commit tooling

So the seeded `.claude` hooks and commit hooks resolve. Pin none of these to a literal —
resolve each at run time:

- `@smartsoft001/claude-plugins` → the version currently providing this skill (`npm view @smartsoft001/claude-plugins version`, or the locally installed one).
- `husky`, `@commitlint/cli`, `@commitlint/config-conventional` → their current published versions (`npm view <pkg> version`), unless `create-nx-workspace` already added compatible ones.

### Toolchain versions — derive, do not pin

**There is no hardcoded version table.** `create-nx-workspace@<NX_LINE>` (the Nx line resolved in
`references/version-resolution.md`) installs a self-consistent toolchain — Nx packages, jest,
eslint, typescript, playwright, swc, esbuild, prettier, rxjs, zone.js. **Keep whatever it installs.**

Only reconcile two things, both driven by the confirmed `<NG_VERSION>`:

- **`@angular/*` + `ng-packagr`** — if the bundled Angular differs from `<NG_VERSION>`, set
  `@angular/{core,common,compiler,forms,platform-browser,platform-server,router}`, `@angular/ssr`,
  `@angular/cli`, `@angular/build`, `@angular/compiler-cli`, `@angular/language-service` to `<NG_VERSION>`
  and `ng-packagr` to its matching line (`npm view "ng-packagr@^<NG_MAJOR>" version | tail -1`).
- **SSR runtime** — ensure `express` and `dotenv` are present (used by `server.ts`); add via
  `npm view <pkg> version` if the preset did not.

See `references/version-resolution.md` for the resolution commands.

### EXCLUDED — feature deps (never add in the base)

`@smartsoft001*` and `@smartsoft001-mobilems*` **feature** libs (angular, crud-shell-angular,
domain-core, models, utils, objects-_, articles-_, public-collections-_, …) — keep ONLY
`@smartsoft001/claude-plugins` (toolchain). Also exclude: `@ngrx/_`, `@ngx-translate/_`,
`@nestjs/_`, `@thisissoon/angular-masonry`, `masonry-layout`, `leaflet`/`@types/leaflet`,
`openseadragon`/`@types/openseadragon`, `online-3d-viewer`, `swiper`, `ng-dynamic-component`,
`ng-lazyload-image`, `ngx-_`(captcha/color-picker/cookie/editor/pagination),`mongodb`,
`typeorm`, `passport_`, `paypal-rest-sdk`, `xlsx`, `json2csv`, `crypto-js`, `md5`/`@types/md5`,
`moment`/`moment-timezone`, `socket.io`, `busboy`, `class-validator`, `guid-typescript`,
`jwt-decode`, `lodash-decorators`, `tailwindcss`/`autoprefixer`/`postcss`/`postcss-url`,
`reflect-metadata`, `pnpm`.

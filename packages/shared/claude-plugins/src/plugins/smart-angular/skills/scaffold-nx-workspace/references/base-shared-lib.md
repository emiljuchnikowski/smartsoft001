# Base shared lib — `libs/shared/angular`

Generate the library then patch it to the generic skeleton below. Substitute `<PREFIX>`.

```bash
npx nx g @nx/angular:library shared/angular \
  --prefix=smart-<PREFIX> --unitTestRunner=jest --linter=eslint \
  --buildable --interactive=false
```

The base lib exports ONLY the SSR environment infra (`environment` + `EnvironmentService`).
NO feature UI components/services/models/pipes/interceptors/directives — `lib/` folders are
empty placeholders the module skills fill in later.

> The reference's generated `ng-package.json` `dest` and `jest.config.ts` `coverageDirectory`
> point at `packages/shared/angular` (a generator leftover). Normalize both to
> `libs/shared/angular` as shown below.

---

## `libs/shared/angular/src/index.ts` (overwrite — minimal barrel)

```ts
export * from './lib/environments/environment';
export * from './lib/services/environment/environment.service';
```

## `libs/shared/angular/src/lib/environments/environment.ts` (create)

```ts
export const environment = {
  production: false,
  version:
    typeof window !== 'undefined' && (window as any)['env']
      ? (window as any)['env']['version']
      : process.env['APP_VERSION'],
  apiUrl:
    typeof window !== 'undefined' && (window as any)['env']
      ? (window as any)['env']['apiUrl']
      : process.env['API_URL'],
  siteUrl:
    typeof window !== 'undefined' && (window as any)['env']
      ? (window as any)['env']['siteUrl']
      : process.env['SITE_URL'],
};
```

## `libs/shared/angular/src/lib/environments/environment.prod.ts` (create)

```ts
export const environment = {
  production: true,
  version:
    typeof window !== 'undefined' && (window as any)['env']
      ? (window as any)['env']['version']
      : process.env['APP_VERSION'],
  apiUrl:
    typeof window !== 'undefined' && (window as any)['env']
      ? (window as any)['env']['apiUrl']
      : process.env['API_URL'] || 'http://localhost:0/',
  siteUrl:
    typeof window !== 'undefined' && (window as any)['env']
      ? (window as any)['env']['siteUrl']
      : process.env['SITE_URL'],
};
```

## `libs/shared/angular/src/lib/services/environment/environment.service.ts` (create)

```ts
import { isPlatformServer } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  inject,
  TransferState,
  makeStateKey,
} from '@angular/core';

import { environment } from '../../environments/environment';

const ENV_KEY = makeStateKey<any>('environment');

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);

  static initFromProcessEnv(): void {
    if (process.env['API_URL']) {
      environment.apiUrl = process.env['API_URL'];
    }
    if (process.env['APP_VERSION'] || process.env['VERSION']) {
      environment.version =
        process.env['APP_VERSION'] ||
        process.env['VERSION'] ||
        environment.version;
    }
    if (process.env['SITE_URL']) {
      environment.siteUrl = process.env['SITE_URL'];
    }
  }

  init(): void {
    if (isPlatformServer(this.platformId)) {
      EnvironmentService.initFromProcessEnv();
      this.transferState.set(ENV_KEY, environment);
    } else {
      const env = this.transferState.get(ENV_KEY, {} as any);

      if (env?.apiUrl) {
        environment.apiUrl = env.apiUrl;
        environment.version = env.version;
        environment.siteUrl = env.siteUrl;
      } else {
        const windowEnv = (window as unknown as Record<string, any>)['env'];
        if (windowEnv?.apiUrl) {
          environment.apiUrl = windowEnv.apiUrl;
          environment.version = windowEnv.version;
          environment.siteUrl = windowEnv.siteUrl;
        } else {
          throw new Error('Environment variables not set!');
        }
      }
    }
  }
}
```

## Empty `lib/` placeholders

Create empty dirs with a `.gitkeep` each (the module skills populate them):
`src/lib/components`, `src/lib/services` (already has `environment/`), `src/lib/models`,
`src/lib/pipes`, `src/lib/interceptors`, `src/lib/directives`, `src/lib/tools`.

---

## `libs/shared/angular/project.json` (overwrite)

```json
{
  "name": "shared-angular",
  "$schema": "../../../node_modules/nx/schemas/project-schema.json",
  "projectType": "library",
  "sourceRoot": "libs/shared/angular/src",
  "prefix": "smart-<PREFIX>",
  "tags": [],
  "targets": {
    "lint": {
      "executor": "@nx/eslint:lint",
      "options": {
        "lintFilePatterns": [
          "libs/shared/angular/src/**/*.ts",
          "libs/shared/angular/src/**/*.html"
        ]
      }
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/libs/shared/angular"],
      "options": {
        "jestConfig": "libs/shared/angular/jest.config.ts",
        "passWithNoTests": true,
        "tsConfig": "libs/shared/angular/tsconfig.spec.json"
      }
    },
    "build": {
      "executor": "@nx/angular:package",
      "outputs": ["{workspaceRoot}/dist/{projectRoot}"],
      "options": {
        "project": "libs/shared/angular/ng-package.json",
        "tsConfig": "libs/shared/angular/tsconfig.lib.json"
      },
      "configurations": {
        "production": {
          "tsConfig": "libs/shared/angular/tsconfig.lib.prod.json"
        },
        "development": {}
      },
      "defaultConfiguration": "production"
    },
    "storybook": {
      "executor": "@storybook/angular:start-storybook",
      "options": {
        "port": 4400,
        "configDir": "libs/shared/angular/.storybook",
        "browserTarget": "shared-angular:build-storybook",
        "compodoc": false
      }
    },
    "build-storybook": {
      "executor": "@storybook/angular:build-storybook",
      "outputs": ["{options.outputDir}"],
      "options": {
        "outputDir": "dist/storybook/angular",
        "configDir": "libs/shared/angular/.storybook",
        "browserTarget": "shared-angular:build-storybook",
        "compodoc": false
      }
    }
  }
}
```

## `libs/shared/angular/ng-package.json` (overwrite — normalized dest)

```json
{
  "$schema": "../../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../../dist/libs/shared/angular",
  "lib": {
    "entryFile": "src/index.ts"
  }
}
```

## `libs/shared/angular/package.json`

```json
{
  "name": "@<PREFIX>/angular",
  "version": "1.0.0"
}
```

## `libs/shared/angular/jest.config.ts` (overwrite — normalized paths)

```ts
export default {
  displayName: 'angular',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../../coverage/libs/shared/angular',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        diagnostics: false,
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
```

## `libs/shared/angular/src/test-setup.ts`

```ts
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});
```

---

## tsconfig set

`tsconfig.json`, `tsconfig.lib.json`, `tsconfig.lib.prod.json`, `tsconfig.spec.json` —
keep as `nx g @nx/angular:library` generated them (they already extend
`../../../tsconfig.base.json` and enable strict templates). Verify `tsconfig.lib.json` keeps
`"types": ["node"]` (the SSR env code uses `process.env`).

## `.storybook/`

Keep `nx g`-generated `.storybook/main.ts`, `.storybook/preview.ts`, `.storybook/tsconfig.json`.
If absent (generator skipped storybook), add a minimal `.storybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: { name: '@storybook/angular', options: {} },
};

export default config;
```

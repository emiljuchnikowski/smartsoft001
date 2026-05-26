# Base SSR app — `apps/web`

`create-nx-workspace --ssr` emits the SSR skeleton. Patch it to the generic shell below,
stripping all feature/business logic. Substitute `<PREFIX>`.

The base app keeps the SSR Express server, a runtime-env endpoint (`/env.js`), the SSRF
host allow-list, a minimal standalone `App`, and a catch-all server route. It depends on
`EnvironmentService` + `environment` from `@<PREFIX>/angular` (see `base-shared-lib.md`) —
this base-app↔base-lib coupling is intentional generic SSR infra.

---

## `apps/web/project.json` (overwrite)

Drop feature `scripts` (e.g. masonry) and prod `fileReplacements` only if the base lib provides
`environment.prod.ts` (it does — keep the fileReplacement). Keep build/serve/test/lint/serve-static.

```json
{
  "name": "web",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "projectType": "application",
  "prefix": "app",
  "sourceRoot": "apps/web/src",
  "tags": [],
  "targets": {
    "build": {
      "executor": "@angular/build:application",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/apps/web",
        "browser": "apps/web/src/main.ts",
        "polyfills": [],
        "tsConfig": "apps/web/tsconfig.app.json",
        "assets": [
          { "glob": "**/*", "input": "apps/web/public", "output": "/" }
        ],
        "styles": ["apps/web/src/styles.scss"],
        "server": "apps/web/src/main.server.ts",
        "ssr": { "entry": "apps/web/src/server.ts" },
        "outputMode": "server"
      },
      "configurations": {
        "production": {
          "fileReplacements": [
            {
              "replace": "libs/shared/angular/src/lib/environments/environment.ts",
              "with": "libs/shared/angular/src/lib/environments/environment.prod.ts"
            }
          ],
          "budgets": [
            {
              "type": "initial",
              "maximumWarning": "2mb",
              "maximumError": "4mb"
            },
            {
              "type": "anyComponentStyle",
              "maximumWarning": "4kb",
              "maximumError": "16kb"
            }
          ],
          "outputHashing": "all",
          "optimization": true
        },
        "development": {
          "optimization": false,
          "extractLicenses": false,
          "sourceMap": true
        }
      },
      "defaultConfiguration": "production"
    },
    "serve": {
      "continuous": true,
      "executor": "@angular/build:dev-server",
      "options": { "port": 4210 },
      "configurations": {
        "production": { "buildTarget": "web:build:production" },
        "development": { "buildTarget": "web:build:development" }
      },
      "defaultConfiguration": "development"
    },
    "extract-i18n": {
      "executor": "@angular/build:extract-i18n",
      "options": { "buildTarget": "web:build" }
    },
    "lint": { "executor": "@nx/eslint:lint" },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "apps/web/jest.config.ts",
        "tsConfig": "apps/web/tsconfig.spec.json"
      }
    },
    "serve-static": {
      "continuous": true,
      "executor": "@nx/web:file-server",
      "options": {
        "buildTarget": "web:build",
        "port": 4210,
        "staticFilePath": "dist/apps/web/browser",
        "spa": true
      }
    }
  }
}
```

---

## `apps/web/src/env-init.ts` (create)

```ts
/**
 * Environment initialization for server-side rendering.
 *
 * This file MUST be imported FIRST in main.server.ts to ensure
 * environment variables are loaded from process.env BEFORE any
 * modules that depend on them are evaluated.
 */
import { EnvironmentService } from '@<PREFIX>/angular';

EnvironmentService.initFromProcessEnv();
```

## `apps/web/src/main.server.ts` (overwrite)

```ts
/**
 * CRITICAL: './env-init' MUST be the first import!
 * It initializes environment variables from process.env BEFORE
 * any modules that depend on them are evaluated.
 */
import './env-init';

import {
  BootstrapContext,
  bootstrapApplication,
} from '@angular/platform-browser';

import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(App, config, context);

export default bootstrap;
```

## `apps/web/src/main.ts` (keep create-nx-workspace default)

```ts
import { bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

---

## `apps/web/src/server.ts` (overwrite — generic)

Generic Express + `AngularNodeAppEngine` with SSRF host allow-list and the `/env.js`
runtime-env endpoint. **Drop** any feature endpoints (e.g. a `/api/translations` handler) and
extra env keys beyond `API_URL` / `SITE_URL` / `APP_VERSION`.

```ts
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { config } from 'dotenv';
import express from 'express';

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

config({ path: resolve(process.cwd(), '.env') });

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();

// Build allowed hosts from SITE_URL and API_URL for SSR SSRF protection
const allowedHosts: string[] = [];
const siteUrl = process.env['SITE_URL'];
if (siteUrl) {
  try {
    const host = new URL(
      siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`,
    ).hostname;
    allowedHosts.push(host);
    if (host.startsWith('www.')) {
      allowedHosts.push(host.slice(4));
    } else {
      allowedHosts.push(`www.${host}`);
    }
  } catch {
    // ignore invalid URL
  }
}
const apiUrl = process.env['API_URL'];
if (apiUrl) {
  try {
    allowedHosts.push(
      new URL(apiUrl.startsWith('http') ? apiUrl : `https://${apiUrl}`)
        .hostname,
    );
  } catch {
    // ignore invalid URL
  }
}

// In development/CI, allow localhost for SSR rendering
if (allowedHosts.length === 0 || process.env['NODE_ENV'] !== 'production') {
  allowedHosts.push('localhost');
}

const angularApp = new AngularNodeAppEngine({ allowedHosts });

app.get('/env.js', (req, res) => {
  const envTemplate = `(function (window) {
  window['env'] = window['env'] || {};

  // Environment variables
  window['env']['apiUrl'] = '\${API_URL}';
  window['env']['siteUrl'] = '\${SITE_URL}';
  window['env']['version'] = '\${APP_VERSION}';
})(this);`;

  const envConfig = envTemplate
    .replace(/\$\{API_URL\}/g, process.env['API_URL'] || '')
    .replace(/\$\{SITE_URL\}/g, process.env['SITE_URL'] || '')
    .replace(/\$\{APP_VERSION\}/g, process.env['APP_VERSION'] || '');

  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(envConfig);
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
```

---

## `apps/web/src/app/app.config.ts` (overwrite — minimal)

Strip ngrx / translate / masonry / feature modules. Keep zoneless + hydration + router +
http + the `EnvironmentService` initializer.

```ts
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { EnvironmentService } from '@<PREFIX>/angular';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideEnvironmentInitializer(() => {
      const envService = inject(EnvironmentService);
      envService.init();
    }),
  ],
};
```

## `apps/web/src/app/app.config.server.ts` (keep create-nx-workspace default)

```ts
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes))],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
```

## `apps/web/src/app/app.routes.server.ts` (overwrite — catch-all only)

```ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
```

## `apps/web/src/app/app.routes.ts` (overwrite — empty)

```ts
import { Route } from '@angular/router';

export const appRoutes: Route[] = [];
```

## `apps/web/src/app/app.ts` (overwrite — minimal shell)

```ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
```

## `apps/web/src/app/app.html` (overwrite — minimal)

```html
<router-outlet></router-outlet>
```

---

## Files to keep as create-nx-workspace emitted them

`apps/web/src/styles.scss`, `apps/web/src/index.html`, `apps/web/src/test-setup.ts`,
`apps/web/src/app/app.scss`, `apps/web/tsconfig.app.json`, `apps/web/tsconfig.spec.json`,
`apps/web/tsconfig.json`, `apps/web/eslint.config.mjs`, `apps/web/jest.config.ts`,
`apps/web/public/**`.

> If `apps/web/jest.config.ts` carries a feature `moduleNameMapper` or a feature-scoped
> `transformIgnorePatterns` entry, strip it to a generic
> `transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)']`.

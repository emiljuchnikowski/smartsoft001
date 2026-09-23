import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

import {
  IModelValidatorsOptions,
  MODEL_VALIDATORS_PROVIDER,
  NgrxSharedModule,
  SharedModule,
} from '@smartsoft001/angular';

import { appRoutes } from './app.routes';
import { AUTH_INTERCEPTOR_PROVIDER } from './auth/auth.interceptor';
import { registerAppTranslations } from './translations';

// #region providers
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    // Every request to the API carries the JWT from the login. The interceptor
    // is a DI provider on purpose; see auth.interceptor.ts for why a functional
    // one would not reach the CRUD routes.
    provideHttpClient(withInterceptorsFromDi()),
    AUTH_INTERCEPTOR_PROVIDER,

    // The CRUD feature registers its own reducer and effects at runtime, so
    // NgRx must exist at the root before `CrudModule.forFeature` runs.
    provideStore({}),
    provideEffects([]),

    // `SharedModule` registers the framework's built-in translations and
    // `NgrxSharedModule` connects the store the CRUD reducers are added to.
    provideTranslateService(),
    importProvidersFrom(SharedModule, NgrxSharedModule),

    // The form factory asks this provider for extra validators per field and
    // has no default, so an app without custom rules still registers it and
    // hands back the validators the `@Field` metadata already implies.
    {
      provide: MODEL_VALIDATORS_PROVIDER,
      useValue: {
        get: (options: IModelValidatorsOptions) =>
          Promise.resolve(options.base ?? {}),
      },
    },

    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      registerAppTranslations(translate);
      translate.use('eng');
    }),
  ],
};
// #endregion

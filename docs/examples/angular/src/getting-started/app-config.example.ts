// #region usage
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { provideSmartPresets, SharedModule } from '@smartsoft001/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    provideHttpClient(),
    provideTranslateService(),
    importProvidersFrom(SharedModule),
    // The styled (Preline) implementation of every component; without it
    // each component renders its unstyled standard implementation.
    provideSmartPresets(),
  ],
};
// #endregion

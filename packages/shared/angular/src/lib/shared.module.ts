import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { SharedComponentsModule } from './components/components.module';
import { SharedDirectivesModule } from './directives';
import { SharedFactoriesModule } from './factories';
import { SharedPagesModule } from './pages';
import { SharedPipesModule } from './pipes';
import { SharedServicesModule } from './services/services.module';
import { setDefaultTranslationsAndLang } from './translations-default';

@NgModule({
  imports: [TranslateModule],
  exports: [
    TranslateModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicModule,
    CommonModule,
    SharedFactoriesModule,
    SharedServicesModule,
    SharedPipesModule,
    SharedComponentsModule,
    SharedPagesModule,
    SharedDirectivesModule,
  ],
})
export class SharedModule {
  constructor(translateService: TranslateService) {
    setDefaultTranslationsAndLang(translateService);
  }
}

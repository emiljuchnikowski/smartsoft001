import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { HttpClientModule } from "@angular/common/http";

import { setDefaultTranslationsAndLang } from "./translations-default";
import { SharedFactoriesModule } from "./factories/factories.module";
import { SharedServicesModule } from "./services/services.module";
import { SharedPipesModule } from "./pipes/pipes.module";
import { SharedPagesModule } from "./pages/pages.module";
import { SharedDirectivesModule } from "./directives/directives.module";
import { SharedComponentsModule } from "./components/components.module";
import {StorageService} from "./services/storage/storage.service";

@NgModule({
  imports: [
    TranslateModule
  ],
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
    SharedDirectivesModule
  ]
})
export class SharedModule {
  constructor(translateService: TranslateService, storageService: StorageService) {
    setDefaultTranslationsAndLang(translateService);
    storageService.init();
  }
}

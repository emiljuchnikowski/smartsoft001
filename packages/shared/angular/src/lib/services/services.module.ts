import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import {
  HardwareService,
  UIService,
  DynamicComponentLoader,
  PopoverService,
  StorageService,
  DetailsService,
} from '@smartsoft001/angular';
import { CookieModule } from 'ngx-cookie';

import { AlertService } from './alert/alert.service';
import { AuthService } from './auth/auth.service';
import { FileService } from './file/file.service';
import { ModalService } from './modal/modal.service';
import { StyleService } from './style/style.service';
import { ToastService } from './toast/toast.service';

@NgModule({
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    CookieModule.withOptions(),
  ],
  providers: [
    ToastService,
    HardwareService,
    ModalService,
    DynamicComponentLoader,
    PopoverService,
    StorageService,
    StyleService,
    AuthService,
    FileService,
    AlertService,
    DetailsService,
    UIService,
  ],
})
export class SharedServicesModule {}

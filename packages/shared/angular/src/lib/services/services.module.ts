import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CookieModule } from 'ngx-cookie';

import { AlertService } from './alert/alert.service';
import { AuthService } from './auth/auth.service';
import { DetailsService } from './details/details.service';
import { DynamicComponentLoader } from './dynamic-component-loader/dynamic-component-loader.service';
import { FileService } from './file/file.service';
import { HardwareService } from './hardware/hardware.service';
import { ModalService } from './modal/modal.service';
import { PopoverService } from './popover/popover.service';
import { StorageService } from './storage/storage.service';
import { StyleService } from './style/style.service';
import { ToastService } from './toast/toast.service';
import { UIService } from './ui/ui.service';

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

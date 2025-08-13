import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { CookieModule } from "ngx-cookie";

import { HardwareService, UIService } from '@smartsoft001/angular';
import { DynamicComponentLoader } from '@smartsoft001/angular';
import { PopoverService } from '@smartsoft001/angular';
import { StorageService } from '@smartsoft001/angular';
import {DetailsService} from '@smartsoft001/angular';

import { ToastService } from "./toast/toast.service";
import { ModalService } from "./modal/modal.service";
import { StyleService } from "./style/style.service";
import { AuthService } from "./auth/auth.service";
import {FileService} from "./file/file.service";
import {AlertService} from "./alert/alert.service";

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
    UIService
  ],
})
export class SharedServicesModule {}

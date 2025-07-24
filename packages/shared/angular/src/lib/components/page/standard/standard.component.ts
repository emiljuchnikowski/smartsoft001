import {ChangeDetectionStrategy, Component, ElementRef, Renderer2} from '@angular/core';
import { Location } from '@angular/common';
import {PopoverController} from "@ionic/angular";

import {PageBaseComponent} from "../base/base.component";
import {AppService} from "../../../services/app/app.service";
import {HardwareService} from "../../../services/hardware/hardware.service";

@Component({
  selector: 'smart-page-standard',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageStandardComponent extends PageBaseComponent {
  constructor(
      el: ElementRef,
      renderer: Renderer2,
      location: Location,
      popover: PopoverController,
      appService: AppService,
      hardwareService: HardwareService
  ) {
    super(el, renderer, location, popover, appService, hardwareService);
  }
}

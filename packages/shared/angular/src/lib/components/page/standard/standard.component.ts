import {ChangeDetectionStrategy, Component, ElementRef, Renderer2} from '@angular/core';
import { AsyncPipe, Location, NgTemplateOutlet } from '@angular/common';
import {PopoverController} from "@ionic/angular";
import {
  IonBadge,
  IonButton,
  IonButtons, IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

import {PageBaseComponent} from "../base/base.component";
import { AppService, HardwareService } from '../../../services';
import { SearchbarComponent } from '../../searchbar';

@Component({
  selector: 'smart-page-standard',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonIcon,
    IonTitle,
    TranslatePipe,
    SearchbarComponent,
    AsyncPipe,
    IonContent,
    IonBadge,
    NgTemplateOutlet
  ],
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

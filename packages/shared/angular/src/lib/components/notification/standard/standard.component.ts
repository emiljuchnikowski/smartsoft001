import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { NotificationBaseComponent } from '../base';

@Component({
  selector: 'smart-notification-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationStandardComponent extends NotificationBaseComponent {}

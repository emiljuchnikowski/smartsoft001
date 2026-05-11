import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { BadgeBaseComponent } from '../base';

@Component({
  selector: 'smart-badge-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeStandardComponent extends BadgeBaseComponent {}

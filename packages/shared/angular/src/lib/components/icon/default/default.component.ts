import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { IconBaseComponent } from '../base';

@Component({
  selector: 'smart-icon',
  templateUrl: '../icon.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconDefaultComponent extends IconBaseComponent {}

import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { DividerBaseComponent } from '../base';

@Component({
  selector: 'smart-divider-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerStandardComponent extends DividerBaseComponent {}

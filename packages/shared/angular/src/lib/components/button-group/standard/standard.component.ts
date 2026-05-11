import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { ButtonGroupBaseComponent } from '../base';

@Component({
  selector: 'smart-button-group-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupStandardComponent extends ButtonGroupBaseComponent {}

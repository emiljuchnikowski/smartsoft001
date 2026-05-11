import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { DropdownBaseComponent } from '../base';

@Component({
  selector: 'smart-dropdown-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownStandardComponent extends DropdownBaseComponent {}

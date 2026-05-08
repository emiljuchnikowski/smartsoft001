import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { DrawerBaseComponent } from '../base';

@Component({
  selector: 'smart-drawer-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerStandardComponent extends DrawerBaseComponent {}

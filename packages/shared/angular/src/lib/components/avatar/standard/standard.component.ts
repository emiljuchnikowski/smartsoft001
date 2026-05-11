import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { AvatarBaseComponent } from '../base';

@Component({
  selector: 'smart-avatar-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarStandardComponent extends AvatarBaseComponent {}

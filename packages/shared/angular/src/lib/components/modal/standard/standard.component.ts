import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { ModalBaseComponent } from '../base';

@Component({
  selector: 'smart-modal-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalStandardComponent extends ModalBaseComponent {}

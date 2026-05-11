import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { ListContainerBaseComponent } from '../base';

@Component({
  selector: 'smart-list-container-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListContainerStandardComponent extends ListContainerBaseComponent {}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { LoaderBaseComponent } from '../base';

@Component({
  selector: 'smart-loader-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderStandardComponent extends LoaderBaseComponent {
  svgClass = computed(() => this.spinnerClasses().join(' '));
}

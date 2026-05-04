import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { ToggleBaseComponent } from '../base';

@Component({
  selector: 'smart-toggle-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleStandardComponent extends ToggleBaseComponent {
  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.checked);
  }
}

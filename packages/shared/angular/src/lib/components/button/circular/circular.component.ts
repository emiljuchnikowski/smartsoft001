import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { IconComponent } from '../../icon/icon.component';
import { ButtonBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-button-circular',
  templateUrl: './circular.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonCircularComponent extends ButtonBaseComponent {
  buttonClasses = computed(() => {
    const size = this.options()?.size ?? 'md';
    const classes = [...this.variantClasses(), 'smart:rounded-full'];

    if (size === 'xs' || size === 'sm') classes.push('smart:p-1');
    else if (size === 'md') classes.push('smart:p-1.5');
    else classes.push('smart:p-2');

    const extra = this.cssClass();
    if (extra) classes.push(extra);

    return classes.join(' ');
  });
}

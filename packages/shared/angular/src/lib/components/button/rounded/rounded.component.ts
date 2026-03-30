import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { IconComponent } from '../../icon/icon.component';
import { ButtonBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-button-rounded',
  templateUrl: './rounded.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [TranslatePipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonRoundedComponent extends ButtonBaseComponent {
  buttonClasses = computed(() => {
    const size = this.options()?.size ?? 'md';
    const classes = [
      ...this.variantClasses(),
      'smart:rounded-full',
      'smart:inline-flex',
      'smart:items-center',
      'smart:justify-center',
    ];

    if (size === 'xs')
      classes.push('smart:px-2.5', 'smart:py-1', 'smart:text-xs');
    else if (size === 'sm')
      classes.push('smart:px-2.5', 'smart:py-1', 'smart:text-sm');
    else if (size === 'md')
      classes.push('smart:px-3', 'smart:py-1.5', 'smart:text-sm');
    else if (size === 'lg')
      classes.push('smart:px-3.5', 'smart:py-2', 'smart:text-sm');
    else classes.push('smart:px-4', 'smart:py-2.5', 'smart:text-sm');

    const extra = this.cssClass();
    if (extra) classes.push(extra);

    return classes.join(' ');
  });
}

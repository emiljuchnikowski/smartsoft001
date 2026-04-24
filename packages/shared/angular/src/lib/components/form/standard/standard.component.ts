import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { InputComponent } from '../../input';
import { FormBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-form-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [InputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStandardComponent<T> extends FormBaseComponent<T> {
  containerClasses = computed(() => {
    const classes: string[] = [
      'smart:space-y-4',
      'smart:divide-y',
      'smart:divide-gray-100',
      'smart:dark:divide-white/10',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  get__smartDisabled(field: string) {
    return (this.form().controls[field] as any)['__smartDisabled'];
  }
}

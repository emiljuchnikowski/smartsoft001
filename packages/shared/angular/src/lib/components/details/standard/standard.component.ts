import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { IEntity } from '@smartsoft001/domain-core';

import { DetailComponent } from '../../detail';
import { DetailsBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-details-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [DetailComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsStandardComponent<
  T extends IEntity<string>,
> extends DetailsBaseComponent<T> {
  containerClasses = computed(() => {
    const classes: string[] = [
      'smart:border-t',
      'smart:border-gray-100',
      'dark:smart:border-white/10',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { CardBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-card-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardStandardComponent extends CardBaseComponent {
  containerClasses = computed(() => {
    const classes = [
      ...this.sharedContainerClasses(),
      'smart:rounded-lg',
      'smart:bg-white',
      'smart:shadow-sm',
      'smart:dark:bg-gray-800/50',
      'smart:dark:shadow-none',
      'smart:dark:outline',
      'smart:dark:-outline-offset-1',
      'smart:dark:outline-white/10',
    ];

    const extra = this.cssClass();
    if (extra) classes.push(extra);

    return classes.join(' ');
  });
}

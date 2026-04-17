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
      'dark:smart:bg-gray-800/50',
      'dark:smart:shadow-none',
      'dark:smart:outline',
      'dark:smart:-outline-offset-1',
      'dark:smart:outline-white/10',
    ];

    const extra = this.cssClass();
    if (extra) classes.push(extra);

    return classes.join(' ');
  });
}

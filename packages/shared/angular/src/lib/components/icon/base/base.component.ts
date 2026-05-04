import { Directive, input } from '@angular/core';

export type IconName = 'spinner' | 'chevron-down' | 'chevron-up';

@Directive()
export abstract class IconBaseComponent {
  cssClass = input<string>('', { alias: 'class' });
}

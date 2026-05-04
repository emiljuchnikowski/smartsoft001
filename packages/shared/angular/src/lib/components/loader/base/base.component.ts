import { computed, Directive, input, InputSignal, Signal } from '@angular/core';

import { DynamicComponentType, SmartColor, SmartSize } from '../../../models';

const SIZE_CLASS_MAP: Record<SmartSize, string> = {
  xs: 'smart:size-4',
  sm: 'smart:size-5',
  md: 'smart:size-6',
  lg: 'smart:size-8',
  xl: 'smart:size-10',
};

@Directive()
export abstract class LoaderBaseComponent {
  static smartType: DynamicComponentType = 'loader';

  show: InputSignal<boolean> = input<boolean>(false);
  size: InputSignal<SmartSize> = input<SmartSize>('md');
  color: InputSignal<SmartColor> = input<SmartColor>('indigo');
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  spinnerClasses: Signal<string[]> = computed(() => {
    const classes: string[] = [
      'smart:animate-spin',
      SIZE_CLASS_MAP[this.size()],
      `smart:text-${this.color()}-600`,
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes;
  });
}

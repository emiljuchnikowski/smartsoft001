import {
  Directive,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import {
  DynamicComponentType,
  IBadgeOptions,
  SmartBadgeColor,
} from '../../../models';

@Directive()
export abstract class BadgeBaseComponent {
  static smartType: DynamicComponentType = 'badge';

  text: InputSignal<string> = input.required<string>();
  color: InputSignal<SmartBadgeColor> = input<SmartBadgeColor>('gray');
  size: InputSignal<'sm' | 'md'> = input<'sm' | 'md'>('md');
  options: InputSignal<IBadgeOptions | undefined> = input<IBadgeOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  removed: OutputEmitterRef<void> = output<void>();

  remove(): void {
    this.removed.emit();
  }
}

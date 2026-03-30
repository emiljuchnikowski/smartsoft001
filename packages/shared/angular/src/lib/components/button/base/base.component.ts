import {
  computed,
  Directive,
  input,
  InputSignal,
  signal,
  viewChild,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';

import {
  SmartVariant,
  COMPONENT_COLORS,
  DynamicComponentType,
  IButtonOptions,
} from '../../../models';

@Directive()
export abstract class ButtonBaseComponent {
  static smartType: DynamicComponentType = 'button';

  mode: WritableSignal<'default' | 'confirm'> = signal('default');

  options: InputSignal<IButtonOptions> = input.required<IButtonOptions>();
  disabled: InputSignal<boolean> = input<boolean>(false);
  cssClass: InputSignal<string> = input<string>('');

  contentTpl = viewChild<ViewContainerRef>('contentTpl');

  variantClasses = computed(() => {
    const opts = this.options();
    const variant: SmartVariant = opts?.variant ?? 'primary';
    const color = opts?.color ?? 'indigo';
    const classes: string[] = ['smart:font-semibold', 'smart:shadow-xs'];

    const colorEntry = COMPONENT_COLORS[color] ?? COMPONENT_COLORS['indigo'];
    classes.push(...colorEntry[variant]);

    if (this.disabled()) {
      classes.push('smart:opacity-50', 'smart:cursor-not-allowed');
    }

    return classes;
  });

  invoke(): void {
    if (!this.options()) return;

    if (this.options().confirm) {
      this.mode.set('confirm');
    } else {
      this.options().click();
    }
  }

  confirmInvoke(): void {
    if (!this.options()) return;
    this.options().click();
    this.mode.set('default');
  }

  confirmCancel(): void {
    if (!this.options()) return;
    this.mode.set('default');
  }
}

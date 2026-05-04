import {
  computed,
  Directive,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';

import {
  DynamicComponentType,
  IVerticalNavGroup,
  IVerticalNavOptions,
} from '../../../models';

export interface IVerticalNavItemClick {
  itemId: string;
}

@Directive()
export abstract class VerticalNavigationBaseComponent {
  static smartType: DynamicComponentType = 'vertical-navigation';

  options: InputSignal<IVerticalNavOptions | undefined> =
    input<IVerticalNavOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  itemClick: OutputEmitterRef<IVerticalNavItemClick> =
    output<IVerticalNavItemClick>();

  // Normalizes options.items into a single-group structure (alongside any explicit groups).
  protected resolvedGroups: Signal<IVerticalNavGroup[]> = computed(() => {
    const opts = this.options();
    const groups: IVerticalNavGroup[] = [];
    if (opts?.items?.length) {
      groups.push({ items: opts.items });
    }
    if (opts?.groups?.length) {
      groups.push(...opts.groups);
    }
    return groups;
  });
}

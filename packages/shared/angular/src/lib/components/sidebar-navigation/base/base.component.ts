import {
  computed,
  Directive,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';

import {
  DynamicComponentType,
  ISidebarNavGroup,
  ISidebarNavItem,
  ISidebarNavOptions,
} from '../../../models';

export interface ISidebarNavItemClick {
  itemId: string;
}

export interface ISidebarNavItemToggle {
  itemId: string;
  expanded: boolean;
}

@Directive()
export abstract class SidebarNavigationBaseComponent {
  static smartType: DynamicComponentType = 'sidebar-navigation';

  options: InputSignal<ISidebarNavOptions | undefined> =
    input<ISidebarNavOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  itemClick: OutputEmitterRef<ISidebarNavItemClick> =
    output<ISidebarNavItemClick>();
  itemToggle: OutputEmitterRef<ISidebarNavItemToggle> =
    output<ISidebarNavItemToggle>();

  protected resolvedGroups: Signal<ISidebarNavGroup[]> = computed(() => {
    const opts = this.options();
    const groups: ISidebarNavGroup[] = [];
    if (opts?.items?.length) {
      groups.push({ items: opts.items });
    }
    if (opts?.groups?.length) {
      groups.push(...opts.groups);
    }
    return groups;
  });

  protected expandedOverrides: WritableSignal<Record<string, boolean>> = signal(
    {},
  );

  protected isExpanded(item: ISidebarNavItem): boolean {
    const overrides = this.expandedOverrides();
    if (item.id in overrides) {
      return overrides[item.id];
    }
    return item.expanded ?? false;
  }

  protected toggleExpanded(item: ISidebarNavItem): void {
    const next = !this.isExpanded(item);
    this.expandedOverrides.update((map) => ({ ...map, [item.id]: next }));
    this.itemToggle.emit({ itemId: item.id, expanded: next });
  }
}

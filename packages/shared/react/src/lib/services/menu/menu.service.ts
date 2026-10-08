import type { ComponentType } from 'react';

import { IMenuItem } from '../../models';
import { SmartStore } from '../../store';

export interface IMenuEndContent {
  component: ComponentType<any>;
  props?: Record<string, unknown>;
}

/**
 * The application menu: its items, whether it is enabled, and the panel on
 * the right ("end") side a page can open with a component of its own.
 */
export class MenuService {
  readonly menuItems = new SmartStore<IMenuItem[]>([]);
  readonly disabled = new SmartStore<boolean>(false);
  readonly endContent = new SmartStore<IMenuEndContent | null>(null);

  /** True while the end menu is open. */
  get openedEnd(): boolean {
    return !!this.endContent.get();
  }

  enable(): void {
    this.disabled.set(false);
  }

  disable(): void {
    this.disabled.set(true);
  }

  changeMenuItemByRoute(route: string, changes: Partial<IMenuItem>): void {
    this.menuItems.update((items) =>
      items.map((i) => (i.route === route ? { ...i, ...changes } : i)),
    );
  }

  setMenuItems(items: IMenuItem[]): void {
    this.menuItems.set(items);
  }

  /** Opens the end menu with `options.component`. */
  async openEnd(options: IMenuEndContent): Promise<void> {
    this.endContent.set({ ...options });
  }

  async closeStart(): Promise<void> {
    // The start menu belongs to the layout component, which closes itself.
  }

  async closeEnd(): Promise<void> {
    this.endContent.set(null);
  }
}

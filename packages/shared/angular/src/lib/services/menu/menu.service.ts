import { ComponentFactoryResolver, inject, Injectable, Injector, signal, ViewContainerRef } from '@angular/core';

import { IMenuItem } from '../../models';

/**
 * Only to use in smart-page
 * @requires PageComponent
 */
@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly resolver = inject(ComponentFactoryResolver);
  // private readonly menuCtrl: MenuController, //TODO: to be injected

  private _endContainer!: ViewContainerRef;
  private _openedEnd = false;

  menuItems = signal<IMenuItem[]>([]);
  disabled = signal(false);

  /**
   * @desc checking if the menu is open (menu on the right side of the screen)
   */
  get openedEnd(): boolean {
    return this._openedEnd;
  }

  enable(): void {
    this.disabled.set(false);
  }

  disable(): void {
    this.disabled.set(true);
  }

  changeMenuItemByRoute(route: string, changes: Partial<IMenuItem>): void {
    this.menuItems.update((menuItems) => {
      return menuItems.map((i) => {
        if (i.route === route)
          return {
            ...i,
            ...changes,
          };

        return i;
      });
    });
  }

  setMenuItems(items: IMenuItem[]): void {
    this.menuItems.set(items);
  }

  /**
   * @private
   */
  async init(endContainer: ViewContainerRef): Promise<void> {
    this._endContainer = endContainer;

    // await this.menuCtrl.close('end');
  }

  /**
   * @desc open menu (menu on the right side of the screen)
   * @param {object} options - use options
   * @param {class} options.component - angular component to render
   * @param {class} options.injector - angular injector to use in component
   */
  async openEnd(options: {
    component: any;
    injector: Injector;
  }): Promise<void> {
    this._openedEnd = true;

    if (this._endContainer) {
      const resolver = options.injector.get(ComponentFactoryResolver);

      this._endContainer.clear();
      const factory = resolver.resolveComponentFactory(options.component);
      this._endContainer.createComponent(factory, 0, options.injector);
    }

    // await this.menuCtrl.enable(true, 'end');
    // await this.menuCtrl.open('end');
  }

  /**
   * @desc close menu (menu on the left side of the screen)
   */
  async closeStart(): Promise<void> {
    this._openedEnd = false;

    // await this.menuCtrl.close('start');
    // await this.menuCtrl.enable(false, 'start');
  }

  /**
   * @desc close menu (menu on the right side of the screen)
   */
  async closeEnd(): Promise<void> {
    this._openedEnd = false;

    // await this.menuCtrl.close('end');
    // await this.menuCtrl.enable(false, 'end');

    this._endContainer?.clear();
  }
}

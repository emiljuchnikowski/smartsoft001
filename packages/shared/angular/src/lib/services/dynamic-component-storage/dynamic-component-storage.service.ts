import {
  ApplicationRef,
  InjectionToken,
  NgModuleRef,
  Type,
} from '@angular/core';

import { DynamicComponentType } from '../../models';

export const DYNAMIC_COMPONENTS_STORE = new InjectionToken<[Type<any>]>(
  'DYNAMIC_COMPONENTS_STORE',
);

export class DynamicComponentStorageService {
  static get(
    key: DynamicComponentType,
    moduleRef: NgModuleRef<any>,
  ): Type<any>[] {
    const getComponents = (
      k: DynamicComponentType,
      m: NgModuleRef<any>,
    ): Type<any>[] => {
      if (!m) return [];

      const fromStore = m.injector.get(DYNAMIC_COMPONENTS_STORE, null);

      return (
        fromStore ? fromStore : m.instance.constructor['ɵmod'].declarations
      ).filter((c: any) => c['smartType'] === k);
    };

    let components = getComponents(key, moduleRef);

    if (!components.length && moduleRef) {
      const applicationRef = moduleRef.injector.get(ApplicationRef);
      let appComponentInjector = applicationRef.components.find(
        (t) => t.componentType.name === 'AppComponent',
      )?.injector;

      if (!appComponentInjector) {
        appComponentInjector = applicationRef.components[0]?.injector;
      }

      if (!appComponentInjector) {
        return [];
      }

      const appModuleRef = appComponentInjector.get(NgModuleRef);

      components = getComponents(key, appModuleRef);
    }

    return components;
  }
}

import { Injectable, Type } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DynamicComponentLoader<T> {
  // Generic T is unused in original
  static declaredComponents: any[] = [];

  /**
   * @desc Resolves components to the values accepted by `ViewContainerRef.createComponent`.
   * Since Ivy there are no component factories - the component type is its own factory -
   * so `factory` mirrors `component` unless a previously declared entry provides one.
   */
  async getComponentsWithFactories<C>(options: {
    // Generic C is unused in original
    components: Array<any>;
  }): Promise<
    {
      component: any;
      factory: Type<any>;
    }[]
  > {
    const result = options.components.map((c) => {
      const declared: any = DynamicComponentLoader.declaredComponents.find(
        (x) => x.component === c,
      );

      const factory: Type<any> | undefined = declared?.factory ?? c;

      if (!factory) {
        // This case should ideally not happen if components are correctly provided
        // or have been processed by this service before.
        console.warn(
          `Component factory not found for component: ${c?.name || c}`,
        );
        return {
          component: c,
          factory: undefined as any,
        };
      }

      return {
        component: c,
        factory,
      };
    });

    // Filter out components for which factories could not be created
    const validResults = result.filter((r) => r.factory);

    // Update declaredComponents only with valid component-factory pairs
    // and avoid duplicates
    validResults.forEach((vr) => {
      if (
        !DynamicComponentLoader.declaredComponents.some(
          (dc: any) => dc.component === vr.component,
        )
      ) {
        DynamicComponentLoader.declaredComponents.push(vr as any);
      }
    });

    return validResults;
  }
}

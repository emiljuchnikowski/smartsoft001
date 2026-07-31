import { Injectable, Type } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DynamicComponentLoader<T> {
  // Generic T is unused in original
  static declaredComponents: any[] = [];

  async getComponentsWithFactories<C>(options: {
    // Generic C is unused in original
    components: Array<any>;
  }): Promise<
    {
      component: any;
      factory: Type<any>;
    }[]
  > {
    let components: Array<any> = [];

    components =
      options.components.filter(
        (comp) =>
          !DynamicComponentLoader.declaredComponents.some(
            (dec) => dec.component === comp,
          ),
      ) || [];

    const result = options.components.map((c) => {
      // Since Angular 13 (Ivy) a component type is created directly through
      // ViewContainerRef.createComponent, so the type itself is the "factory".
      let factory: Type<any> | undefined = c;

      if (!factory) {
        const declared: any = DynamicComponentLoader.declaredComponents.find(
          (x) => x.component === c,
        );
        if (declared) {
          factory = declared.factory;
        }
      }

      if (!factory) {
        // This case should ideally not happen if components are correctly provided
        // or have been processed by this service before.
        // Consider logging a warning or throwing a more specific error.
        console.warn(
          `Component factory not found for component: ${c?.name || c}`,
        );
        // Returning a structure that indicates failure or an empty factory
        return {
          component: c,
          factory: undefined as any, // Or handle as an error
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

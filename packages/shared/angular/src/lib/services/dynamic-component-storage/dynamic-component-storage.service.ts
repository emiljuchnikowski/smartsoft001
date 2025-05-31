import {ApplicationRef, InjectionToken, NgModuleRef, Type} from "@angular/core";

// import {DynamicComponentType} from "../../models"; // This path will need adjustment - Type not found, using string as placeholder
type DynamicComponentType = string; // Placeholder

export const DYNAMIC_COMPONENTS_STORE = new InjectionToken<[Type<any>]>("DYNAMIC_COMPONENTS_STORE");

export class DynamicComponentStorageService {
    static get(key: string, moduleRef: NgModuleRef<any>): Type<any>[] { // Changed DynamicComponentType to string
        const getComponents = (k: string, m: NgModuleRef<any>): Type<any>[] => { // Changed DynamicComponentType to string
            if (!m) return [];

            // Attempt to get components from the DYNAMIC_COMPONENTS_STORE first
            const fromStore = m.injector.get(DYNAMIC_COMPONENTS_STORE, null);

            let declarations: Type<any>[] = [];
            if (fromStore) {
                declarations = fromStore;
            } else if (m.instance && m.instance.constructor && (m.instance.constructor as any)['ɵmod']) {
                // Fallback to internal Angular API if DYNAMIC_COMPONENTS_STORE is not provided
                // This is fragile and might break in future Angular versions.
                declarations = (m.instance.constructor as any)['ɵmod'].declarations || [];
            } else {
                console.warn('DynamicComponentStorageService: Could not retrieve declarations from moduleRef.');
            }

            return declarations.filter(c => (c as any)['smartType'] === k);
        }

        let components = getComponents(key, moduleRef);

        // Attempt to look in the root AppModule if not found in the current moduleRef
        if (!components.length && moduleRef) {
            const applicationRef = moduleRef.injector.get(ApplicationRef, null);
            if (applicationRef && applicationRef.components.length > 0) {
                // Try to find AppComponent, otherwise use the first available component's injector
                let appComponentInjector = applicationRef.components
                    .find(t => t.componentType.name === "AppComponent")?.injector;

                if (!appComponentInjector) {
                    appComponentInjector = applicationRef.components[0]?.injector;
                }

                if (appComponentInjector) {
                    const appModuleRef = appComponentInjector.get(NgModuleRef, null);
                    if (appModuleRef && appModuleRef !== moduleRef) { // Avoid infinite loop if already root
                       components = getComponents(key, appModuleRef);
                    }
                }
            }
        }

        if (!components || components.length === 0) {
            console.warn(`DynamicComponentStorageService: No components found for key '${key}'`);
        }

        return components;
    }
}

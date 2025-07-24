import {InjectionToken, Type} from "@angular/core";

export abstract class IModelExportProvider {
    abstract execute(type: Type<any>, value: any): void;
}

export const MODEL_EXPORT_PROVIDER =
    new InjectionToken<IModelExportProvider>("MODEL_EXPORT_PROVIDER");
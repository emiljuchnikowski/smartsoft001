import {InjectionToken, Type} from "@angular/core";

export abstract class IModelImportProvider {
    abstract getAccept(type: Type<any>): Promise<string>;
    abstract convert(type: Type<any>, file: File): Promise<any>;
}

export const MODEL_IMPORT_PROVIDER =
    new InjectionToken<IModelImportProvider>("MODEL_IMPORT_PROVIDER");
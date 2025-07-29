import {InjectionToken, Type} from "@angular/core";
import {Observable} from "rxjs";

export abstract class IModelLabelProvider {
    abstract get(options: IModelLabelOptions): Observable<string>;
}

export interface IModelLabelOptions {
    key: string;
    instance?: any;
    type?: Type<any>;
}

export const MODEL_LABEL_PROVIDER =
    new InjectionToken<IModelLabelOptions>("MODEL_LABEL_PROVIDER");
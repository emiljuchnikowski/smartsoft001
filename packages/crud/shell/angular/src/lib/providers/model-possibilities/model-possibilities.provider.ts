import { InjectionToken } from "@angular/core";
import {Observable} from "rxjs";

/**
 * @deprecated - please, use IModelPossibilitiesProvider from @smartsoft001/angular
 */
export abstract class ICrudModelPossibilitiesProvider {
  abstract get<T>(type: any): { [key: string]: Observable<{ id: any; text: string }[]> };
}

/**
 * @deprecated - please, use MODEL_POSSIBILITIES_PROVIDER from @smartsoft001/angular
 */
export const CRUD_MODEL_POSSIBILITIES_PROVIDER = new InjectionToken<
  ICrudModelPossibilitiesProvider
>("CRUD_MODEL_POSSIBILITIES_PROVIDER");

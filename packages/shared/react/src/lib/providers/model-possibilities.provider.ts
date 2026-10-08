import { SmartPossibility } from '../models/interfaces';

export interface IModelPossibilitiesOptions {
  key: string;
  instance: any;
  type?: any;
}

/**
 * Supplies the options of an `enum`, `radio`, `check` or `strings` field,
 * e.g. loaded from the API. It is asked again whenever the form's value
 * changes, so the options can depend on other fields. Return nothing to keep
 * the field's own `possibilities`.
 */
export abstract class IModelPossibilitiesProvider {
  abstract get(
    options: IModelPossibilitiesOptions,
  ):
    | SmartPossibility[]
    | null
    | undefined
    | Promise<SmartPossibility[] | null | undefined>;
}

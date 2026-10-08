import type {
  SmartAsyncValidatorFn,
  SmartValidatorFn,
} from '../forms/abstract-control';

export interface IModelValidators {
  validators?: SmartValidatorFn | SmartValidatorFn[] | null;
  asyncValidators?: SmartAsyncValidatorFn | SmartAsyncValidatorFn[] | null;
}

export interface IModelValidatorsOptions {
  key: string;
  instance: any;
  type?: any;
  /** The validators the form factory derived from the field options. */
  base?: IModelValidators;
}

/**
 * Replaces the validators of a model field. The form factory asks it for
 * every field and uses what it returns instead of the derived ones, so return
 * `options.base` to keep them:
 *
 * ```ts
 * class ModelValidatorsProvider extends IModelValidatorsProvider {
 *   async get(options: IModelValidatorsOptions) {
 *     if (options.type === Todo && options.key === 'number') {
 *       return { validators: [SmartValidators.required] };
 *     }
 *     return options.base ?? {};
 *   }
 * }
 * ```
 */
export abstract class IModelValidatorsProvider {
  abstract get(options: IModelValidatorsOptions): Promise<IModelValidators>;
}

import { InjectionToken, Type } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';

/**
 * @example
 *
 * in module:
 @NgModule({
  providers: [
    ...
    {
      provide: MODEL_VALIDATORS_PROVIDER,
      useClass: ModelValidatorsProvider
    }
  ],
 *
 * provider:
 * @Injectable()
 export class ModelValidatorsProvider extends IModelValidatorsProvider {
  async get(options: IModelValidatorsOptions): Promise<IModelValidators> {
    if (options.type === Todo && options.key === 'test') {
      return {
        validators: null,
        asyncValidators: null
      }
    }

    if (options.type === Todo && options.key === 'number') {
      return {
        validators: [ Validators.required ],
        asyncValidators: null
      }
    }

    return Promise.resolve(options.base);
  }
}
 */
export abstract class IModelValidatorsProvider {
  abstract get(options: IModelValidatorsOptions): Promise<IModelValidators>;
}

export interface IModelValidatorsOptions {
  key: string;
  instance: any;
  type?: Type<any> | (() => void);
  base?: IModelValidators;
}

export interface IModelValidators {
  validators?: ValidatorFn | ValidatorFn[];
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[];
}

export const MODEL_VALIDATORS_PROVIDER =
  new InjectionToken<IModelValidatorsProvider>('MODEL_VALIDATORS_PROVIDER');

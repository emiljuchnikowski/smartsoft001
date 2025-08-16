import { InjectionToken, Signal, Type } from '@angular/core';

export abstract class IModelPossibilitiesProvider {
  abstract get(
    options: IModelPossibilitiesOptions,
  ): Signal<{ id: any; text: string }[]>;
}

export interface IModelPossibilitiesOptions {
  key: string;
  instance: any;
  type?: Type<any>;
}

export const MODEL_POSSIBILITIES_PROVIDER =
  new InjectionToken<IModelPossibilitiesProvider>(
    'MODEL_POSSIBILITIES_PROVIDER',
  );

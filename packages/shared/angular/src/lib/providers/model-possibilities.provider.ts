import { InjectionToken, Signal, Type, WritableSignal } from '@angular/core';

export abstract class IModelPossibilitiesProvider {
  abstract get(
    options: IModelPossibilitiesOptions,
  ): WritableSignal<{ id: any; text: string; checked: boolean }[]>;
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

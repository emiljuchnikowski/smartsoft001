import { InjectionToken, Signal, Type } from '@angular/core';

export abstract class IModelLabelProvider {
  abstract get(options: IModelLabelOptions): Signal<string>;
}

export interface IModelLabelOptions {
  key: string;
  instance?: any;
  type?: Type<any>;
}

export const MODEL_LABEL_PROVIDER = new InjectionToken<IModelLabelOptions>(
  'MODEL_LABEL_PROVIDER',
);

import 'reflect-metadata';

import { IModelOptions } from '../../interfaces';
import * as symbols from '../../symbols';

export const Model = ModelDecorator;
export function ModelDecorator(options?: IModelOptions) {
  return function <T>(target: any) {
    options = options ? { ...options } : {};

    Reflect.defineMetadata(symbols.SYMBOL_MODEL, options, target);

    target.prototype.toJSON = function () {
      const result = { ...this };

      if (this.constructor['__properties']) {
        Object.keys(this.constructor['__properties']).forEach((protoKey) => {
          result[protoKey] = this['_' + protoKey];
        });
      }

      return result;
    };
  };
}

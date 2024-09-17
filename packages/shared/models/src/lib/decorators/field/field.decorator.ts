import 'reflect-metadata';

import { ObjectService } from '@smartsoft001/utils';

import { FieldType, IFieldOptions } from '../../interfaces';
import * as symbols from '../../symbols';

export const Field = FieldDecorator;
export function FieldDecorator(options?: IFieldOptions) {
  return <T>(target: T, key: string) => {
    options = options ? { ...options } : {};

    if (!(target as any).constructor['__fields']) {
      (target as any).constructor['__fields'] = {};
    }

    (target as any).constructor['__fields'][key] = true;

    if (!options.type && key === 'password') {
      options.type = FieldType.password;
    } else if (!options.type) {
      options.type = FieldType.text;
    }

    if (options.classType) {
      (target as any)['_' + key] = (target as any)[key];
      delete (target as any)[key];

      Object.defineProperty(target, key, {
        get: function () {
          if (!this['_' + key] && options?.type === FieldType.array) {
            this['_' + key] = [];
          }
          return this['_' + key];
        },
        set: function (v: any) {
          this['_' + key] =
            options?.type === FieldType.array && v
              ? v.map((i: any) =>
                  ObjectService.createByType(i, options?.classType),
                )
              : ObjectService.createByType(v, options?.classType);
        },
        enumerable: true,
        configurable: true,
      });

      if (!(target as any).constructor['__properties']) {
        (target as any).constructor['__properties'] = {};
      }

      (target as any).constructor['__properties'][key] = true;
    }

    Reflect.defineMetadata(symbols.SYMBOL_FIELD, options, target as any, key);
  };
}

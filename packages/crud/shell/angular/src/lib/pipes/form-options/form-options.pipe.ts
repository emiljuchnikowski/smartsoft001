import { inject, Pipe, PipeTransform, Type } from '@angular/core';

import { IFormOptions, InputBaseComponent } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { CRUD_MODEL_POSSIBILITIES_PROVIDER } from '../../providers/model-possibilities/model-possibilities.provider';

@Pipe({
  name: 'smartFormOptions',
})
export class FormOptionsPipe<T extends IEntity<string>>
  implements PipeTransform
{
  private modelPossibilitiesProvider = inject(
    CRUD_MODEL_POSSIBILITIES_PROVIDER,
  );

  transform(
    item: T,
    mode: string,
    type: any,
    uniqueProvider?: (values: Record<keyof T, any>) => Promise<boolean>,
    inputComponents?: { [key: string]: Type<InputBaseComponent<any>> },
  ): IFormOptions<T> {
    if (!mode || !type) return null as any;

    let possibilities = {};

    if (type && this.modelPossibilitiesProvider) {
      possibilities = this.modelPossibilitiesProvider.get(type);
    }

    if (mode === 'create') {
      return {
        mode: 'create',
        possibilities,
        inputComponents,
        uniqueProvider,
        model: new type(),
        show: true,
      };
    } else {
      const model = new type();

      if (item) {
        Object.keys(item).forEach((key) => {
          (model as any)[key] = (item as any)[key];
        });
      }

      return {
        mode: mode,
        uniqueProvider,
        possibilities: possibilities,
        inputComponents,
        model: model,
        show: true,
      };
    }
  }
}

import {
  Inject,
  Optional,
  Pipe,
  PipeTransform,
  Type,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

import {
  IModelLabelProvider,
  MODEL_LABEL_PROVIDER,
} from '../../providers';

@Pipe({
  name: 'smartModelLabel',
})
export class ModelLabelPipe<T> implements PipeTransform {
  constructor(
    private translateService: TranslateService,
    @Optional()
    @Inject(MODEL_LABEL_PROVIDER)
    private modelLabelProvider: IModelLabelProvider,
  ) {}

  transform(instance: T, key: string, type?: Type<any> | (() => void)): string {
    if (this.modelLabelProvider) {
      const result = this.modelLabelProvider.get({
        instance: instance,
        key: key,
        type: type as Type<any>,
      });

      if (result()) return result() as string;
    }

    return toSignal(this.translateService.instant('MODEL.' + key))() as string;
  }
}
